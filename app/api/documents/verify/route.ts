import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase/admin';
import { getDocumentsTableName, getCacheDir } from '@/lib/documents/generator';
import fs from 'fs';
import path from 'path';
import os from 'os';

export const dynamic = 'force-dynamic';

// Helper to load local mock registry
function getLocalMockRegistry(): any[] {
  const cacheDir = getCacheDir();
  const registryPath = path.join(cacheDir, 'document_registry.json');
  try {
    if (fs.existsSync(registryPath)) {
      const content = fs.readFileSync(registryPath, 'utf8');
      return JSON.parse(content) || [];
    }
  } catch (e) {
    console.error('Failed to read local mock registry:', e);
  }
  return [];
}

// Helper to load legacy local mock metadata
function getLocalMockMetadataLegacy(): any[] {
  const cacheDir = getCacheDir();
  const metadataPath = path.join(cacheDir, 'metadata.json');
  try {
    if (fs.existsSync(metadataPath)) {
      const content = fs.readFileSync(metadataPath, 'utf8');
      return JSON.parse(content) || [];
    }
  } catch (e) {
    console.error('Failed to read local mock metadata legacy:', e);
  }
  return [];
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing verification ID parameter' }, { status: 400 });
    }

    const cleanId = id.trim();
    const dbClient = (isSupabaseAdminConfigured() && supabaseAdmin) ? supabaseAdmin : (isSupabaseConfigured() && supabase ? supabase : null);
    
    let documentRecord: any = null;
    let studentProfile: any = null;
    let foundInDb = false;

    // 1. Try to query Supabase database (new registry table)
    if (dbClient) {
      try {
        const { data, error } = await dbClient
          .from('document_registry')
          .select('*, student:profiles(*)')
          .or(`certificate_number.eq.${cleanId},reference_id.eq.${cleanId}`);

        if (!error && data && data.length > 0) {
          documentRecord = data[0];
          studentProfile = documentRecord.student;
          foundInDb = true;
        } else if (error && error.code !== '42703' && error.code !== '42P01') {
          console.error('DB error querying document_registry:', error);
        }
      } catch (err) {
        console.warn('DB query failed for document_registry, falling back to legacy database/files:', err);
      }
    }

    // 1.5 Fallback to legacy student_documents table in Supabase
    if (!foundInDb && dbClient) {
      try {
        const tableName = await getDocumentsTableName(dbClient);
        const { data, error } = await dbClient
          .from(tableName)
          .select('*, student:profiles(*), internship:internships(*)')
          .eq('verification_id', cleanId);

        if (!error && data && data.length > 0) {
          const legacy = data[0];
          documentRecord = {
            student_id: legacy.student_id,
            student_name: legacy.student?.full_name || 'Candidate',
            registration_id: legacy.student?.registration_number || null,
            internship_id: legacy.internship_id,
            internship_name: legacy.internship?.title || 'Internship Track',
            document_type: legacy.document_type,
            certificate_number: legacy.document_type.includes('certificate') ? cleanId : null,
            reference_id: legacy.document_type.includes('certificate') ? null : cleanId,
            qr_code_url: '',
            verification_status: 'Valid',
            document_version: 1,
            document_status: 'Active',
            generation_date: legacy.generated_at || legacy.created_at
          };
          studentProfile = legacy.student;
          foundInDb = true;
        }
      } catch (err) {
        console.warn('DB query failed for legacy student_documents:', err);
      }
    }

    // 2. Fall back to local mock cache file if not found in DB
    if (!foundInDb) {
      const localList = getLocalMockRegistry();
      const match = localList.find((doc: any) => doc.certificate_number === cleanId || doc.reference_id === cleanId);

      if (match) {
        documentRecord = match;
        
        // Fetch details from Supabase if client is available
        if (dbClient) {
          try {
            const { data: profileData } = await dbClient
              .from('profiles')
              .select('*')
              .eq('id', match.student_id)
              .maybeSingle();

            studentProfile = profileData;
          } catch (e) {
            console.warn('Failed to resolve profile details from DB for local match:', e);
          }
        }
      }
    }

    // 2.5 Fall back to legacy local mock metadata list
    if (!foundInDb && !documentRecord) {
      const legacyLocalList = getLocalMockMetadataLegacy();
      const match = legacyLocalList.find((doc: any) => doc.verification_id === cleanId);

      if (match) {
        documentRecord = {
          student_id: match.student_id,
          student_name: 'Shiwam Mishra',
          registration_id: 'N/A',
          internship_id: match.internship_id,
          internship_name: match.internship_id?.includes('python') ? 'Python Programming' : 'Web Development',
          document_type: match.document_type,
          certificate_number: match.document_type.includes('certificate') ? cleanId : null,
          reference_id: match.document_type.includes('certificate') ? null : cleanId,
          qr_code_url: '',
          verification_status: 'Valid',
          document_status: 'Active',
          generation_date: match.generated_at || match.created_at
        };

        if (dbClient) {
          try {
            const { data: profileData } = await dbClient
              .from('profiles')
              .select('*')
              .eq('id', match.student_id)
              .maybeSingle();

            studentProfile = profileData;
          } catch (e) {
            console.warn('Failed to resolve profile details from DB for legacy match:', e);
          }
        }
      }
    }

    // 3. Fallback to mock details if database lookup returned nothing
    if (documentRecord && !studentProfile) {
      studentProfile = {
        full_name: documentRecord.student_name || 'Shiwam Mishra',
        college_name: 'Tech Institute',
        university_name: 'State Technical University',
        degree: 'Bachelor of Science',
        department_stream: 'Computer Science & Engineering',
        semester: '8th Semester',
        roll_number: 'SI-MOCK-2026',
        registration_number: documentRecord.registration_id || 'N/A',
      };
    }

    // 4. Return result
    if (!documentRecord) {
      return NextResponse.json({ success: false, error: 'Document not found' }, { status: 404 });
    }

    // Formulate response
    const payload = {
      success: true,
      verified: documentRecord.verification_status === 'Valid' && documentRecord.document_status === 'Active',
      verificationId: cleanId,
      documentType: documentRecord.document_type,
      generatedAt: documentRecord.generation_date || documentRecord.created_at,
      expiryDate: null,
      status: documentRecord.verification_status,
      candidate: {
        name: studentProfile?.full_name || documentRecord.student_name || 'N/A',
        college: studentProfile?.college_name || 'N/A',
        university: studentProfile?.university_name || 'N/A',
        course: studentProfile?.department_stream || studentProfile?.degree || 'N/A',
        semester: studentProfile?.semester || 'N/A',
        rollNumber: studentProfile?.roll_number || 'N/A',
        registrationNumber: documentRecord.registration_id || studentProfile?.registration_number || 'N/A',
      },
      internship: {
        title: documentRecord.internship_name || 'Internship Track',
        duration: '120 Hrs',
      },
      downloadUrl: `/api/documents/download?templateType=${documentRecord.document_type}&studentId=${documentRecord.student_id}&internshipId=${documentRecord.internship_id || 'general_credit_unused'}&format=pdf&disposition=inline`
    };

    return NextResponse.json(payload, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error: any) {
    console.error('Verify endpoint error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
