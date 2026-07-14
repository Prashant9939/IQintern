import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase/admin';
import { getSlugFromTitle, loadTemplate } from '@/lib/templates/template-loader';
import { renderTemplate } from '@/lib/templates/template-renderer';
import { getDocumentMetadata, saveDocumentMetadata, generateDocument, DocumentMetadata, generateUniqueVerificationId, getDocumentsTableName, getCacheDir, getDocumentRegistryEntry, saveDocumentRegistryEntry, generateNextSequentialId, getStudentExistingIds } from '@/lib/documents/generator';
import fs from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const templateType = searchParams.get('templateType');
    const studentId = searchParams.get('studentId');
    const internshipId = searchParams.get('internshipId');
    const bypassCache = searchParams.get('bypassCache') === 'true' || searchParams.get('force') === 'true';
    const format = searchParams.get('format') || 'pdf';
    const disposition = searchParams.get('disposition') === 'inline' ? 'inline' : 'attachment';

    if (!templateType || !studentId || !internshipId) {
      return NextResponse.json({ success: false, error: 'Missing required parameters' }, { status: 400 });
    }

    const cleanType = templateType.trim().toLowerCase();

    // 1. Fetch profile and credentials to perform authorization gating
    let profile: any = null;
    let internship: any = null;
    let testResult: any = null;
    let payments: any[] = [];
    let metadata: DocumentMetadata | null = null;

    const dbClient = (isSupabaseAdminConfigured() && supabaseAdmin) ? supabaseAdmin : (isSupabaseConfigured() && supabase ? supabase : null);

    if (dbClient) {
      const isValidUuid = (val: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
      const isUuid = isValidUuid(internshipId);

      const [profileRes, internshipRes, testResultRes, paymentsRes, dbMetadata] = await Promise.all([
        dbClient.from('profiles').select('*').eq('id', studentId).single(),
        isUuid 
          ? dbClient.from('internships').select('*').eq('id', internshipId).single()
          : Promise.resolve({ data: null }),
        isUuid
          ? dbClient
              .from('test_results')
              .select('*')
              .eq('student_id', studentId)
              .eq('internship_id', internshipId)
              .order('completed_at', { ascending: false })
              .limit(1)
              .maybeSingle()
          : Promise.resolve({ data: null }),
        dbClient
          .from('payments')
          .select('*')
          .eq('student_id', studentId)
          .eq('status', 'completed'),
        getDocumentMetadata(studentId, internshipId, cleanType)
      ]);

      profile = profileRes.data;

      if (isUuid) {
        internship = internshipRes.data;
        testResult = testResultRes.data;
      } else if (internshipId === 'general_credit_unused') {
        internship = {
          id: 'general_credit_unused',
          title: 'General Internship Credit',
          duration: 'N/A'
        };
      }

      payments = paymentsRes.data || [];
      metadata = dbMetadata;
    } else {
      // Mock mode data
      profile = {
        full_name: 'John Doe',
        roll_number: 'SI-10023',
        college_name: 'Tech University',
        university_name: 'State University',
        degree: 'Bachelor of Technology',
        department_stream: 'Computer Science',
        semester: '6th Semester',
      };
      internship = {
        id: internshipId,
        title: internshipId.includes('python') ? 'Python Programming' : internshipId.includes('data') ? 'Data Science' : 'Web Development',
        duration: '4 Weeks',
      };
      testResult = {
        score: 8,
        total_questions: 10,
        percentage: 80,
        passed: true,
        reference_number: 'SI-MOCK-VERIFY-1234',
        completed_at: new Date().toISOString(),
      };
      payments = [
        {
          internship_id: internshipId,
          status: 'completed',
          created_at: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
        }
      ];
      metadata = await getDocumentMetadata(studentId, internshipId, cleanType);
    }

    if (!profile) {
      return NextResponse.json({ success: false, error: 'Student profile not found' }, { status: 404 });
    }
    if (!internship) {
      return NextResponse.json({ success: false, error: 'Internship not found' }, { status: 404 });
    }

    // Gating authorization checks
    const isPaid = payments.some(
      (p: any) => p.internship_id === internshipId && p.status === 'completed'
    );
    const isPassed = testResult?.passed === true || (testResult?.percentage && testResult.percentage >= 40);

    if (['offer_letter', 'receipt', 'payment_receipt'].includes(cleanType)) {
      if (!isPaid) {
        return NextResponse.json({ success: false, error: 'Unauthorized: Complete payment to unlock this document' }, { status: 403 });
      }
    } else if (
      ['certificate', 'internship_certificate', 'appreciation_certificate', 'marksheet', 'assessment_marksheet', 'project_report', 'internship_report', 'attendance_sheet', 'attendance_record'].includes(cleanType)
    ) {
      if (!isPassed) {
        return NextResponse.json({ success: false, error: 'Unauthorized: Pass the assessment to unlock this document' }, { status: 403 });
      }
    } else {
      return NextResponse.json({ success: false, error: 'Invalid document template type' }, { status: 400 });
    }

    const { origin } = new URL(req.url);

    // 2. Format Variables for Preview/Rendering
    const internshipTitle = internship.title || 'Internship';
    const pct = testResult?.percentage || (testResult?.score && testResult?.total_questions ? Math.round((testResult.score / testResult.total_questions) * 100) : 0) || 0;
    
    let grade = 'F';
    if (pct >= 90) grade = 'A+';
    else if (pct >= 80) grade = 'A';
    else if (pct >= 70) grade = 'B+';
    else if (pct >= 60) grade = 'B';
    else if (pct >= 50) grade = 'C';
    else if (pct >= 40) grade = 'D';

    const scoreFormatted = `${pct}%`;
    
    // Fetch or create registry entry first
    let registryEntry = await getDocumentRegistryEntry(studentId, internshipId, cleanType);
    if (!registryEntry) {
      const isCert = cleanType === 'certificate' || cleanType === 'internship_certificate';
      
      // Look up if user already has a certificate_number or reference_id assigned
      const existingIds = await getStudentExistingIds(studentId);
      let newId;
      if (isCert) {
        newId = existingIds.certificate_number || await generateNextSequentialId(cleanType);
      } else {
        newId = existingIds.reference_id || await generateNextSequentialId(cleanType);
      }

      const verificationUrl = isCert 
        ? `https://iqintern.in/verify?certificate=${newId}` 
        : `https://iqintern.in/verify?reference=${newId}`;
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(verificationUrl)}`;
      
      registryEntry = {
        student_id: studentId,
        student_name: profile.full_name,
        registration_id: profile.registration_number || null,
        internship_id: internshipId,
        internship_name: internshipTitle,
        document_type: cleanType,
        certificate_number: isCert ? newId : null,
        reference_id: isCert ? null : newId,
        qr_code_url: qrCodeUrl,
        verification_status: 'Valid',
        document_version: 1,
        document_status: 'Active'
      };
      registryEntry = await saveDocumentRegistryEntry(registryEntry);
    }
    
    const verificationId = registryEntry.certificate_number || registryEntry.reference_id || '';
    const qrCodeUrl = registryEntry.qr_code_url;

    const payment = payments.find(
      (p: any) => p.internship_id === internshipId && p.status === 'completed'
    );

    let joiningDate = new Date();
    if (payment) {
      joiningDate = new Date(payment.created_at);
    } else if (testResult?.completed_at) {
      joiningDate = new Date(testResult.completed_at);
      joiningDate.setDate(joiningDate.getDate() - 28);
    } else {
      joiningDate.setDate(joiningDate.getDate() - 28);
    }

    const completionDate = new Date(joiningDate.getTime() + 28 * 24 * 60 * 60 * 1000);
    const formattedJoiningDate = joiningDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    const formattedCompletionDate = completionDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    const acceptanceDeadline = new Date(joiningDate.getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

    const renderData = {
      studentName: profile.full_name,
      fullName: profile.full_name,
      full_name: profile.full_name,
      collegeName: profile.college_name || 'N/A',
      college_name: profile.college_name || 'N/A',
      universityName: profile.university_name || 'N/A',
      university_name: profile.university_name || 'N/A',
      course: profile.department_stream || profile.degree || 'N/A',
      department_stream: profile.department_stream || 'N/A',
      degree: profile.degree || 'N/A',
      semester: profile.semester || 'N/A',
      rollNumber: profile.roll_number || 'N/A',
      roll_number: profile.roll_number || 'N/A',
      internshipName: internshipTitle,
      internshipTitle: internshipTitle,
      score: scoreFormatted,
      grade: grade,
      startDate: formattedJoiningDate,
      joiningDate: formattedJoiningDate,
      endDate: formattedCompletionDate,
      completionDate: formattedCompletionDate,
      certificateId: verificationId,
      verificationId: verificationId,
      qrCodeUrl: qrCodeUrl,
      duration: internship.duration || '120 Hrs',
      issueDate: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
      currentYear: new Date().getFullYear().toString(),
      stipendStatus: 'Unpaid',
      isUnpaid: true,
      acceptanceDeadline,
      jurisdiction: 'Delhi',
    };

    // --- PIPELINE 1: HTML Preview ---
    if (format === 'html') {
      // If metadata doesn't exist, pre-create the metadata record as pending so the verification ID is registered
      if (!metadata) {
        metadata = await saveDocumentMetadata({
          student_id: studentId,
          internship_id: internshipId,
          document_type: cleanType,
          version: 1,
          generation_status: 'pending',
          template_version: '1.0',
          verification_id: verificationId,
        });
      }

      const slug = getSlugFromTitle(internshipTitle);
      const templateHtml = await loadTemplate(cleanType, slug, internshipId);
      let finalHtml = renderTemplate(templateHtml, renderData);

      // Inject base tag for relative images to load through host origin
      if (finalHtml.includes('<head>')) {
        finalHtml = finalHtml.replace('<head>', `<head><base href="${origin}/" />`);
      } else {
        finalHtml = `<base href="${origin}/" />` + finalHtml;
      }

      // Return HTML directly WITHOUT Content-Disposition to prevent browser downloading
      return new Response(finalHtml, {
        headers: { 
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
      });
    }

    // --- PIPELINE 3: PDF Download / Stream ---
    // Check if the metadata table has a completed, cached document
    let pdfBuffer: Buffer | null = null;
    let hitCache = false;

    // Load template and render HTML to generate the content hash to verify if user details or template changed
    const slug = getSlugFromTitle(internshipTitle);
    const templateHtml = await loadTemplate(cleanType, slug, internshipId);
    let finalHtml = renderTemplate(templateHtml, renderData);

    // Inject base tag for relative images to match generator.ts hashing
    if (origin) {
      if (finalHtml.includes('<head>')) {
        finalHtml = finalHtml.replace('<head>', `<head><base href="${origin}/" />`);
      } else {
        finalHtml = `<base href="${origin}/" />` + finalHtml;
      }
    }
    const contentHash = crypto.createHash('md5').update(finalHtml).digest('hex');

    if (!bypassCache && metadata && metadata.generation_status === 'completed' && metadata.storage_url && metadata.hash === contentHash && metadata.template_version === '1.0') {
      try {
        if (isSupabaseConfigured() && supabaseAdmin) {
          // Stream from Supabase Storage bucket
          const { data: fileData, error: downloadError } = await supabaseAdmin.storage
            .from('student-documents')
            .download(metadata.storage_url);

          if (!downloadError && fileData) {
            pdfBuffer = Buffer.from(await fileData.arrayBuffer());
            hitCache = true;
            console.log(`[Cache Hit] Serving document from Supabase Storage: ${metadata.storage_url}`);
          } else {
            console.warn(`[Cache Miss] Storage file missing or unreadable, will regenerate:`, downloadError);
          }
        } else {
          // Mock Mode: Read from local disk cache
          if (fs.existsSync(metadata.storage_url)) {
            pdfBuffer = fs.readFileSync(metadata.storage_url);
            hitCache = true;
            console.log(`[Cache Hit] Serving document from local cache: ${metadata.storage_url}`);
          }
        }

        // Update stats and extend metadata expiry
        if (hitCache) {
          const client = supabaseAdmin || supabase;
          const newExpiry = new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString();
          const updateData = {
            last_downloaded_at: new Date().toISOString(),
            last_accessed_at: new Date().toISOString(),
            expiry_date: newExpiry,
          };

          // Update registry entry downloaded date
          if (registryEntry) {
            registryEntry.last_downloaded_date = new Date().toISOString();
            await saveDocumentRegistryEntry(registryEntry);
          }

          const updateLocalMockStats = (id: string | undefined) => {
            if (!id) return;
            const localDir = getCacheDir();
            const localMetaPath = path.join(localDir, 'metadata.json');
            if (fs.existsSync(localMetaPath)) {
              try {
                const list: DocumentMetadata[] = JSON.parse(fs.readFileSync(localMetaPath, 'utf8')) || [];
                const idx = list.findIndex((doc) => doc.id === id);
                if (idx >= 0) {
                   list[idx] = { ...list[idx], ...updateData };
                   fs.writeFileSync(localMetaPath, JSON.stringify(list, null, 2), 'utf8');
                }
              } catch (_) {}
            }
          };

          if (metadata && metadata.id) {
            if (isSupabaseConfigured() && client) {
              try {
                const tableName = await getDocumentsTableName(client);
                const { error: updateErr } = await client.from(tableName).update(updateData).eq('id', metadata.id);
                if (updateErr && (updateErr.code === 'PGRST205' || updateErr.message?.includes(tableName))) {
                  updateLocalMockStats(metadata.id);
                }
              } catch (_) {
                updateLocalMockStats(metadata.id);
              }
            } else {
              updateLocalMockStats(metadata.id);
            }
          }
        }
      } catch (cacheFetchError) {
        console.error('Failed to retrieve cached PDF, falling back to compile:', cacheFetchError);
      }
    }

    // Cache miss: Generate on-the-fly
    if (!pdfBuffer) {
      console.log(`[Cache Miss] Generating PDF on the fly: studentId=${studentId}, type=${cleanType}`);
      const genResult = await generateDocument(studentId, internshipId, cleanType, true, origin);
      
      if (genResult.success && genResult.metadata.storage_url) {
        let downloadSuccess = false;
        if (isSupabaseConfigured() && supabaseAdmin && !genResult.metadata.storage_url.includes('pdf_cache')) {
          try {
            const { data: fileData, error: dlErr } = await supabaseAdmin.storage
              .from('student-documents')
              .download(genResult.metadata.storage_url);
            if (!dlErr && fileData) {
              pdfBuffer = Buffer.from(await fileData.arrayBuffer());
              downloadSuccess = true;
            }
          } catch (_) {}
        }
        
        if (!downloadSuccess) {
          const fallbackPath = genResult.metadata.storage_url.includes('pdf_cache')
            ? genResult.metadata.storage_url
            : path.join(getCacheDir(), `${cleanType}_${studentId}_${internshipId}.pdf`);
            
          if (fs.existsSync(fallbackPath)) {
            pdfBuffer = fs.readFileSync(fallbackPath);
          }
        }
      } else {
        throw new Error(genResult.error || 'Failed to generate document');
      }
    }

    if (!pdfBuffer) {
      throw new Error('Could not compile or load PDF file.');
    }

    // Return compiled/cached PDF
    return new Response(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `${disposition}; filename="${cleanType}_${studentId}.pdf"`,
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
    });

  } catch (error: any) {
    console.error('Document download route fatal error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
