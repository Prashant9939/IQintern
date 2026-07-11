import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { loadTemplate, getSlugFromTitle } from '@/lib/templates/template-loader';
import { renderTemplate } from '@/lib/templates/template-renderer';

const TEMPLATE_VERSION = '1.0';

export interface DocumentMetadata {
  id?: string;
  student_id: string;
  document_type: string;
  internship_id: string;
  version: number;
  storage_url?: string;
  file_size?: number;
  generated_at?: string;
  last_downloaded_at?: string;
  last_accessed_at?: string;
  expiry_date?: string;
  generation_status: 'pending' | 'generating' | 'completed' | 'failed';
  hash?: string;
  template_version: string;
}

// Local mock metadata storage helper for server environment
function getLocalMockMetadata(): DocumentMetadata[] {
  const cacheDir = path.join(process.cwd(), 'pdf_cache');
  const metadataPath = path.join(cacheDir, 'metadata.json');
  try {
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }
    if (fs.existsSync(metadataPath)) {
      const content = fs.readFileSync(metadataPath, 'utf8');
      return JSON.parse(content) || [];
    }
  } catch (e) {
    console.error('Failed to read local mock metadata:', e);
  }
  return [];
}

function saveLocalMockMetadata(list: DocumentMetadata[]) {
  const cacheDir = path.join(process.cwd(), 'pdf_cache');
  const metadataPath = path.join(cacheDir, 'metadata.json');
  try {
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }
    fs.writeFileSync(metadataPath, JSON.stringify(list, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed to write local mock metadata:', e);
  }
}

function getLocalMockMetadataMatch(studentId: string, internshipId: string, cleanType: string): DocumentMetadata | null {
  const list = getLocalMockMetadata();
  const match = list.find(
    (doc) =>
      doc.student_id === studentId &&
      doc.internship_id === internshipId &&
      doc.document_type === cleanType
  );
  return match || null;
}

function saveLocalMockMetadataUpsert(meta: DocumentMetadata): DocumentMetadata {
  const list = getLocalMockMetadata();
  const cleanType = meta.document_type.trim().toLowerCase();
  const idx = list.findIndex(
    (doc) =>
      doc.student_id === meta.student_id &&
      doc.internship_id === meta.internship_id &&
      doc.document_type === cleanType
  );
  
  const updated = {
    ...meta,
    document_type: cleanType,
    last_accessed_at: new Date().toISOString(),
    id: idx >= 0 ? list[idx].id : `doc-${Math.random().toString(36).substr(2, 9)}`,
    generated_at: meta.generated_at || new Date().toISOString(),
  };
  
  if (idx >= 0) {
    list[idx] = updated;
  } else {
    list.push(updated);
  }
  saveLocalMockMetadata(list);
  return updated;
}

// Fetch document metadata record
export async function getDocumentMetadata(
  studentId: string,
  internshipId: string,
  documentType: string
): Promise<DocumentMetadata | null> {
  const cleanType = documentType.trim().toLowerCase();
  
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('student_documents')
        .select('*')
        .eq('student_id', studentId)
        .eq('internship_id', internshipId)
        .eq('document_type', cleanType)
        .maybeSingle();
        
      if (error) {
        if (error.code === 'PGRST205' || error.message?.includes('student_documents')) {
          console.warn('student_documents table missing in Supabase. Falling back to local file metadata.');
          return getLocalMockMetadataMatch(studentId, internshipId, cleanType);
        }
        console.error('Failed to fetch document metadata from Supabase:', error);
        return null;
      }
      return data;
    } catch (e: any) {
      console.warn('Supabase metadata fetch exception, falling back to local file:', e);
      return getLocalMockMetadataMatch(studentId, internshipId, cleanType);
    }
  } else {
    return getLocalMockMetadataMatch(studentId, internshipId, cleanType);
  }
}

// Save or update document metadata record
export async function saveDocumentMetadata(meta: DocumentMetadata): Promise<DocumentMetadata> {
  const client = supabaseAdmin || supabase;
  const cleanType = meta.document_type.trim().toLowerCase();
  const upsertData = {
    ...meta,
    document_type: cleanType,
    last_accessed_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured() && client) {
    try {
      // Check if record exists
      const existing = await getDocumentMetadata(meta.student_id, meta.internship_id, cleanType);
      
      let result;
      if (existing && existing.id && !existing.id.startsWith('doc-')) {
        const { data, error } = await client
          .from('student_documents')
          .update(upsertData)
          .eq('id', existing.id)
          .select()
          .single();
          
        if (error) {
          if (error.code === 'PGRST205' || error.message?.includes('student_documents')) {
            console.warn('student_documents table missing on update. Saving locally.');
            return saveLocalMockMetadataUpsert(meta);
          }
          throw error;
        }
        result = data;
      } else {
        const { data, error } = await client
          .from('student_documents')
          .insert(upsertData)
          .select()
          .single();
          
        if (error) {
          if (error.code === 'PGRST205' || error.message?.includes('student_documents')) {
            console.warn('student_documents table missing on insert. Saving locally.');
            return saveLocalMockMetadataUpsert(meta);
          }
          throw error;
        }
        result = data;
      }
      return result;
    } catch (err: any) {
      console.warn('Supabase metadata save exception, falling back to local file:', err);
      return saveLocalMockMetadataUpsert(meta);
    }
  } else {
    return saveLocalMockMetadataUpsert(meta);
  }
}

// Main generation function
export async function generateDocument(
  studentId: string,
  internshipId: string,
  documentType: string,
  force: boolean = false,
  origin: string = ''
): Promise<{ success: boolean; metadata: DocumentMetadata; fromCache: boolean; error?: string }> {
  const cleanType = documentType.trim().toLowerCase();
  
  try {
    // 1. Fetch Student, Internship, Test Result, and Payments data
    let profile: any = null;
    let internship: any = null;
    let testResult: any = null;
    let payments: any[] = [];

    if (isSupabaseConfigured() && supabase) {
      const { data: pData } = await supabase.from('profiles').select('*').eq('id', studentId).single();
      profile = pData;

      const isValidUuid = (val: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);

      if (isValidUuid(internshipId)) {
        const { data: iData } = await supabase.from('internships').select('*').eq('id', internshipId).single();
        internship = iData;

        const { data: tData } = await supabase
          .from('test_results')
          .select('*')
          .eq('student_id', studentId)
          .eq('internship_id', internshipId)
          .order('completed_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        testResult = tData;
      } else if (internshipId === 'general_credit_unused') {
        internship = {
          id: 'general_credit_unused',
          title: 'General Internship Credit',
          duration: 'N/A'
        };
      }

      const { data: payData } = await supabase
        .from('payments')
        .select('*')
        .eq('student_id', studentId)
        .eq('status', 'completed');
      payments = payData || [];
    } else {
      // Fallback Mock Data
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
    }

    if (!profile) throw new Error('Student profile not found');
    if (!internship) throw new Error('Internship details not found');

    // 2. Gating Authorization Checks
    const isPaid = payments.some(
      (p: any) => p.internship_id === internshipId && p.status === 'completed'
    );
    const isPassed = testResult?.passed === true || (testResult?.percentage && testResult.percentage >= 40);

    if (['offer_letter', 'receipt', 'payment_receipt'].includes(cleanType)) {
      if (!isPaid) throw new Error('Unauthorized: Complete payment to unlock this document');
    } else if (
      ['certificate', 'internship_certificate', 'appreciation_certificate', 'marksheet', 'assessment_marksheet', 'project_report', 'internship_report', 'attendance_sheet', 'attendance_record'].includes(cleanType)
    ) {
      if (!isPassed) throw new Error('Unauthorized: Pass the assessment to unlock this document');
    } else {
      throw new Error('Invalid template type');
    }

    // 3. Format Data variables for templates
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
    const verificationId = testResult?.reference_number || testResult?.id || 'IQ-VER-2026-8294';

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
      collegeName: profile.college_name || 'N/A',
      universityName: profile.university_name || 'N/A',
      course: profile.department_stream || profile.degree || 'N/A',
      semester: profile.semester || 'N/A',
      rollNumber: profile.roll_number || 'N/A',
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
      duration: internship.duration || '120 Hrs',
      issueDate: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
      currentYear: new Date().getFullYear().toString(),
      stipendStatus: 'Unpaid',
      isUnpaid: true,
      acceptanceDeadline,
      jurisdiction: 'Delhi',
    };

    // 4. Load Template & Render HTML
    const slug = getSlugFromTitle(internshipTitle);
    const templateHtml = await loadTemplate(cleanType, slug, internshipId);
    let finalHtml = renderTemplate(templateHtml, renderData);

    // Inject base origin so Puppeteer relative paths load correctly
    if (origin) {
      if (finalHtml.includes('<head>')) {
        finalHtml = finalHtml.replace('<head>', `<head><base href="${origin}/" />`);
      } else {
        finalHtml = `<base href="${origin}/" />` + finalHtml;
      }
    }

    // 5. Generate content Hash to check if data changed
    const contentHash = crypto.createHash('md5').update(finalHtml).digest('hex');

    // 6. Check cache metadata first
    const cacheMeta = await getDocumentMetadata(studentId, internshipId, cleanType);
    if (!force && cacheMeta && cacheMeta.generation_status === 'completed' && cacheMeta.hash === contentHash && cacheMeta.template_version === TEMPLATE_VERSION) {
      // Extend expiry date automatically on retrieval
      const newExpiry = new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString();
      const updatedMeta = await saveDocumentMetadata({
        ...cacheMeta,
        expiry_date: newExpiry,
      });
      return { success: true, metadata: updatedMeta, fromCache: true };
    }

    // 7. Enqueue state to 'generating'
    const pendingMeta = await saveDocumentMetadata({
      student_id: studentId,
      internship_id: internshipId,
      document_type: cleanType,
      version: cacheMeta ? cacheMeta.version + 1 : 1,
      generation_status: 'generating',
      template_version: TEMPLATE_VERSION,
      hash: contentHash,
      expiry_date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    });

    // 8. Launch headless browser compilation
    let browser = null;
    let pdfBuffer: Buffer;
    try {
      if (process.env.NODE_ENV === 'production') {
        const chromium = require('@sparticuz/chromium');
        const puppeteerCore = require('puppeteer-core');
        browser = await puppeteerCore.launch({
          args: chromium.args,
          defaultViewport: chromium.defaultViewport,
          executablePath: await chromium.executablePath(),
          headless: chromium.headless,
        });
      } else {
        const puppeteerLocal = require('puppeteer');
        browser = await puppeteerLocal.launch({
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
          headless: true,
        });
      }
      const page = await browser.newPage();
      await page.setContent(finalHtml, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      
      const generated = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' },
      });
      pdfBuffer = Buffer.from(generated);
    } catch (e: any) {
      console.error('Puppeteer generation error:', e);
      await saveDocumentMetadata({
        ...pendingMeta,
        generation_status: 'failed',
      });
      throw new Error(`PDF generation failed: ${e.message}`);
    } finally {
      if (browser) {
        await browser.close();
      }
    }

    // 9. Save PDF to Cloud Storage or Fallback Local Disk
    let storageUrl = '';
    const version = pendingMeta.version;
    const fileName = `${cleanType}-v${version}.pdf`;

    if (isSupabaseConfigured() && supabaseAdmin) {
      const storagePath = `${studentId}/${fileName}`;
      
      let uploadSuccess = false;
      try {
        // Upload to student-documents bucket
        const { error: uploadError } = await supabaseAdmin.storage
          .from('student-documents')
          .upload(storagePath, pdfBuffer, {
            contentType: 'application/pdf',
            upsert: true,
          });

        if (!uploadError) {
          uploadSuccess = true;
          storageUrl = storagePath;
        } else {
          console.warn('Supabase Storage upload failed, falling back to local file storage:', uploadError);
        }
      } catch (storageErr) {
        console.warn('Supabase Storage connection failed, falling back to local file storage:', storageErr);
      }

      if (!uploadSuccess) {
        // Local fallback: Write to local folder pdf_cache/
        const cacheDir = path.join(process.cwd(), 'pdf_cache');
        const localFilePath = path.join(cacheDir, `${cleanType}_${studentId}_${internshipId}.pdf`);
        try {
          if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
          }
          fs.writeFileSync(localFilePath, pdfBuffer);
          storageUrl = localFilePath;
        } catch (err: any) {
          console.error('Local storage fallback write failed:', err);
          throw new Error(`Storage save failed: ${err.message}`);
        }
      }
    } else {
      // Mock Storage: Write to local folder pdf_cache/
      const cacheDir = path.join(process.cwd(), 'pdf_cache');
      const localFilePath = path.join(cacheDir, `${cleanType}_${studentId}_${internshipId}.pdf`);
      
      try {
        if (!fs.existsSync(cacheDir)) {
          fs.mkdirSync(cacheDir, { recursive: true });
        }
        fs.writeFileSync(localFilePath, pdfBuffer);
        storageUrl = localFilePath;
      } catch (err: any) {
        console.error('Mock storage write failed:', err);
        throw new Error(`Mock storage write failed: ${err.message}`);
      }
    }

    // 10. Update state to 'completed'
    const completedMeta = await saveDocumentMetadata({
      ...pendingMeta,
      generation_status: 'completed',
      storage_url: storageUrl,
      file_size: pdfBuffer.length,
      generated_at: new Date().toISOString(),
    });

    return { success: true, metadata: completedMeta, fromCache: false };
  } catch (error: any) {
    console.error('Document generation service fatal error:', error);
    return {
      success: false,
      metadata: {
        student_id: studentId,
        internship_id: internshipId,
        document_type: cleanType,
        version: 1,
        generation_status: 'failed',
        template_version: TEMPLATE_VERSION,
      },
      fromCache: false,
      error: error.message || 'Internal document generation error',
    };
  }
}
