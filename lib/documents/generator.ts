/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import os from 'os';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase/admin';
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
  verification_id?: string;
  template_version: string;
}

// Helper to get local cache directory path, persistently inside process.cwd() for local dev
export function getCacheDir(): string {
  // Use os.tmpdir() only when deployed on Vercel or in standard production build environments
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    return path.join(os.tmpdir(), 'pdf_cache');
  }
  return path.join(process.cwd(), 'pdf_cache');
}

// Local mock metadata storage helper for server environment
function getLocalMockMetadata(): DocumentMetadata[] {
  const cacheDir = getCacheDir();
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
  const cacheDir = getCacheDir();
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

let cachedTableName: 'student_documents' | 'documents' | null = null;

export async function getDocumentsTableName(client: any): Promise<'student_documents' | 'documents'> {
  if (cachedTableName) return cachedTableName;
  if (!client) return 'student_documents';
  
  try {
    const { error } = await client.from('student_documents').select('id').limit(1);
    if (error && (error.code === 'PGRST205' || error.message?.includes('student_documents'))) {
      console.warn('student_documents table missing in schema cache. Using documents table.');
      cachedTableName = 'documents';
    } else {
      cachedTableName = 'student_documents';
    }
  } catch (e) {
    cachedTableName = 'documents';
  }
  return cachedTableName;
}

// Fetch document metadata record
export async function getDocumentMetadata(
  studentId: string,
  internshipId: string,
  documentType: string
): Promise<DocumentMetadata | null> {
  const cleanType = documentType.trim().toLowerCase();
  const client = supabaseAdmin || supabase;
  
  if (isSupabaseConfigured() && client) {
    try {
      const tableName = await getDocumentsTableName(client);
      const { data, error } = await client
        .from(tableName)
        .select('*')
        .eq('student_id', studentId)
        .eq('internship_id', internshipId)
        .eq('document_type', cleanType)
        .maybeSingle();
        
      if (error) {
        if (error.code === 'PGRST205' || error.message?.includes(tableName)) {
          console.warn(`${tableName} table missing in Supabase. Falling back to local file metadata.`);
          return getLocalMockMetadataMatch(studentId, internshipId, cleanType);
        }
        console.error(`Failed to fetch document metadata from Supabase (${tableName}):`, error);
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

export interface DocumentRegistryEntry {
  id?: string;
  student_id: string;
  student_name: string;
  registration_id?: string | null;
  internship_id?: string | null;
  internship_name: string;
  document_type: string;
  certificate_number?: string | null;
  reference_id?: string | null;
  qr_code_url: string;
  generated_pdf_path?: string | null;
  generated_html_path?: string | null;
  generation_date?: string;
  last_downloaded_date?: string | null;
  verification_status: 'Valid' | 'Invalid' | 'Revoked';
  document_version: number;
  document_status: 'Active' | 'Revoked';
}

// Local mock registry storage helper
function getLocalRegistry(): DocumentRegistryEntry[] {
  const cacheDir = getCacheDir();
  const registryPath = path.join(cacheDir, 'document_registry.json');
  try {
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }
    if (fs.existsSync(registryPath)) {
      const content = fs.readFileSync(registryPath, 'utf8');
      return JSON.parse(content) || [];
    }
  } catch (e) {
    console.error('Failed to read local mock registry:', e);
  }
  return [];
}

function saveLocalRegistry(list: DocumentRegistryEntry[]) {
  const cacheDir = getCacheDir();
  const registryPath = path.join(cacheDir, 'document_registry.json');
  try {
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }
    fs.writeFileSync(registryPath, JSON.stringify(list, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed to write local mock registry:', e);
  }
}

// Fetch registry entry from DB or local fallback
export async function getDocumentRegistryEntry(
  studentId: string,
  internshipId: string,
  documentType: string
): Promise<DocumentRegistryEntry | null> {
  const cleanType = documentType.trim().toLowerCase();
  const client = supabaseAdmin || supabase;
  
  if (isSupabaseConfigured() && client) {
    try {
      const { data, error } = await client
        .from('document_registry')
        .select('*')
        .eq('student_id', studentId)
        .eq('internship_id', internshipId)
        .eq('document_type', cleanType)
        .maybeSingle();
        
      if (error) {
        if (error.code === 'PGRST200' || error.code === 'PGRST205' || error.message?.includes('document_registry')) {
          return getLocalRegistryMatch(studentId, internshipId, cleanType);
        }
        console.error('Failed to fetch registry entry from Supabase:', error);
        return null;
      }
      return data;
    } catch (e: any) {
      console.warn('Supabase registry fetch exception, falling back to local file:', e);
      return getLocalRegistryMatch(studentId, internshipId, cleanType);
    }
  } else {
    return getLocalRegistryMatch(studentId, internshipId, cleanType);
  }
}

function getLocalRegistryMatch(studentId: string, internshipId: string, cleanType: string): DocumentRegistryEntry | null {
  const list = getLocalRegistry();
  const match = list.find(
    (doc) =>
      doc.student_id === studentId &&
      doc.internship_id === internshipId &&
      doc.document_type === cleanType
  );
  return match || null;
}

// Find any existing certificate number or reference ID for the student
export async function getStudentExistingIds(studentId: string): Promise<{ certificate_number: string | null; reference_id: string | null }> {
  const client = supabaseAdmin || supabase;
  let certificate_number: string | null = null;
  let reference_id: string | null = null;

  if (isSupabaseConfigured() && client) {
    try {
      const { data, error } = await client
        .from('document_registry')
        .select('certificate_number, reference_id')
        .eq('student_id', studentId);

      if (!error && data && data.length > 0) {
        for (const row of data) {
          if (row.certificate_number && !certificate_number) certificate_number = row.certificate_number;
          if (row.reference_id && !reference_id) reference_id = row.reference_id;
        }
      }
    } catch (_) {}
  }

  // Fallback check in local registry
  const localList = getLocalRegistry();
  for (const doc of localList) {
    if (doc.student_id === studentId) {
      if (doc.certificate_number && !certificate_number) certificate_number = doc.certificate_number;
      if (doc.reference_id && !reference_id) reference_id = doc.reference_id;
    }
  }

  return { certificate_number, reference_id };
}

// Save or update registry entry in DB or local fallback
export async function saveDocumentRegistryEntry(
  entry: DocumentRegistryEntry
): Promise<DocumentRegistryEntry> {
  const client = supabaseAdmin || supabase;
  const cleanType = entry.document_type.trim().toLowerCase();
  
  const upsertData = {
    ...entry,
    document_type: cleanType,
  };
  
  if (isSupabaseConfigured() && client) {
    try {
      const existing = await getDocumentRegistryEntry(entry.student_id, entry.internship_id || '', cleanType);
      
      let result;
      if (existing && existing.id) {
        const { data, error } = await client
          .from('document_registry')
          .update(upsertData)
          .eq('id', existing.id)
          .select()
          .single();
          
        if (error) throw error;
        result = data;
      } else {
        const { data, error } = await client
          .from('document_registry')
          .insert(upsertData)
          .select()
          .single();
          
        if (error) throw error;
        result = data;
      }
      return result;
    } catch (err: any) {
      console.warn('Supabase registry save exception, falling back to local file:', err);
      return saveLocalRegistryUpsert(entry);
    }
  } else {
    return saveLocalRegistryUpsert(entry);
  }
}

function saveLocalRegistryUpsert(entry: DocumentRegistryEntry): DocumentRegistryEntry {
  const list = getLocalRegistry();
  const cleanType = entry.document_type.trim().toLowerCase();
  const idx = list.findIndex(
    (doc) =>
      doc.student_id === entry.student_id &&
      doc.internship_id === entry.internship_id &&
      doc.document_type === cleanType
  );
  
  const updated = {
    ...entry,
    document_type: cleanType,
    id: idx >= 0 ? list[idx].id : `reg-${Math.random().toString(36).substr(2, 9)}`,
    generation_date: entry.generation_date || new Date().toISOString(),
  };
  
  if (idx >= 0) {
    list[idx] = updated;
  } else {
    list.push(updated);
  }
  saveLocalRegistry(list);
  return updated;
}

// Generate a unique alphanumeric ID (e.g. IQ-2026-X8Y9A2F or IQ-REF-M7B2K9P)
export async function generateNextSequentialId(documentType: string): Promise<string> {
  const cleanType = documentType.trim().toLowerCase();
  const isCert = cleanType === 'certificate' || cleanType === 'internship_certificate';
  const prefix = isCert ? 'IQ-2026-' : 'IQ-REF-';
  const client = supabaseAdmin || supabase;
  
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let attempts = 0;
  
  while (attempts < 100) {
    let rand = '';
    for (let i = 0; i < 7; i++) {
      rand += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const candidateId = `${prefix}${rand}`;
    
    // Check local registry first
    const localList = getLocalRegistry();
    const isLocalDuplicate = localList.some(
      (doc) => doc.certificate_number === candidateId || doc.reference_id === candidateId
    );
    
    if (isLocalDuplicate) {
      attempts++;
      continue;
    }
    
    // Check Supabase database
    if (isSupabaseConfigured() && client) {
      try {
        const { count, error } = await client
          .from('document_registry')
          .select('*', { count: 'exact', head: true })
          .or(`certificate_number.eq.${candidateId},reference_id.eq.${candidateId}`);
          
        if (!error && (count === null || count === 0)) {
          return candidateId;
        }
      } catch (e) {
        console.warn('Error checking unique ID in DB, fallback to candidate:', e);
        return candidateId;
      }
    } else {
      return candidateId;
    }
    attempts++;
  }
  
  // Safe fallback if loop hits limit
  const fallbackRand = Array.from({ length: 7 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `${prefix}${fallbackRand}`;
}

// Generate a unique structured verification/reference ID (Async)
export async function generateUniqueVerificationId(documentType: string): Promise<string> {
  return generateNextSequentialId(documentType);
}

// Save or update document metadata record (Legacy compatibility)
export async function saveDocumentMetadata(meta: DocumentMetadata): Promise<DocumentMetadata> {
  const client = supabaseAdmin || supabase;
  const cleanType = meta.document_type.trim().toLowerCase();
  
  if (!meta.verification_id) {
    meta.verification_id = await generateUniqueVerificationId(cleanType);
  }

  const upsertData = {
    ...meta,
    document_type: cleanType,
    last_accessed_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured() && client) {
    try {
      const tableName = await getDocumentsTableName(client);
      const existing = await getDocumentMetadata(meta.student_id, meta.internship_id, cleanType);
      
      let result;
      if (existing && existing.id && !existing.id.startsWith('doc-')) {
        if (existing.verification_id) {
          upsertData.verification_id = existing.verification_id;
        }

        try {
          const { data, error } = await client
            .from(tableName)
            .update(upsertData)
            .eq('id', existing.id)
            .select()
            .single();
            
          if (error) throw error;
          result = data;
        } catch (err: any) {
          if (err.code === '42703' || err.message?.includes('verification_id')) {
            const { verification_id, ...fallbackUpsert } = upsertData;
            const { data, error } = await client
              .from(tableName)
              .update(fallbackUpsert)
              .eq('id', existing.id)
              .select()
              .single();
            if (error) throw error;
            result = data;
          } else {
            throw err;
          }
        }
      } else {
        try {
          const { data, error } = await client
            .from(tableName)
            .insert(upsertData)
            .select()
            .single();
            
          if (error) throw error;
          result = data;
        } catch (err: any) {
          if (err.code === '42703' || err.message?.includes('verification_id')) {
            const { verification_id, ...fallbackUpsert } = upsertData;
            const { data, error } = await client
              .from(tableName)
              .insert(fallbackUpsert)
              .select()
              .single();
            if (error) throw error;
            result = data;
          } else {
            throw err;
          }
        }
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

    const dbClient = (isSupabaseAdminConfigured() && supabaseAdmin) ? supabaseAdmin : (isSupabaseConfigured() && supabase ? supabase : null);

    if (dbClient) {
      const isValidUuid = (val: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
      const isUuid = isValidUuid(internshipId);

      const [profileRes, internshipRes, testResultRes, paymentsRes] = await Promise.all([
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
          .eq('status', 'completed')
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

    // Fetch cache metadata first to retrieve or generate the unique verification ID
    const cacheMeta = await getDocumentMetadata(studentId, internshipId, cleanType);
    
    // Fetch or create registry entry first
    const internshipTitle = internship.title || 'Internship';
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

    // 3. Format Data variables for templates
    const pct = testResult?.percentage || (testResult?.score && testResult?.total_questions ? Math.round((testResult.score / testResult.total_questions) * 100) : 0) || 0;
    
    let grade = 'F';
    if (pct >= 90) grade = 'A+';
    else if (pct >= 80) grade = 'A';
    else if (pct >= 70) grade = 'B+';
    else if (pct >= 60) grade = 'B';
    else if (pct >= 50) grade = 'C';
    else if (pct >= 40) grade = 'D';

    const scoreFormatted = `${pct}%`;

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
    if (!force && cacheMeta && cacheMeta.generation_status === 'completed' && cacheMeta.hash === contentHash && cacheMeta.template_version === TEMPLATE_VERSION) {
      // Extend expiry date automatically on retrieval
      const newExpiry = new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString();
      const updatedMeta = await saveDocumentMetadata({
        ...cacheMeta,
        expiry_date: newExpiry,
        verification_id: verificationId,
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
      verification_id: verificationId,
      expiry_date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    });

    // 8. Launch headless browser compilation
    let browser: any = null;
    let pdfBuffer: Buffer;
    try {
      if (process.env.NODE_ENV === 'production') {
        const chromium = (await import('@sparticuz/chromium')) as any;
        const puppeteerCore = (await import('puppeteer-core')) as any;
        browser = await puppeteerCore.launch({
          args: chromium.args,
          defaultViewport: chromium.defaultViewport,
          executablePath: await chromium.executablePath(),
          headless: chromium.headless,
        });
      } else {
        const puppeteerLocal = (await import('puppeteer')) as any;
        browser = await puppeteerLocal.launch({
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
          headless: true,
        });
      }
      const page: any = await browser.newPage();
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
        const cacheDir = getCacheDir();
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
      const cacheDir = getCacheDir();
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

    if (registryEntry) {
      registryEntry.generated_pdf_path = storageUrl;
      registryEntry.document_version = completedMeta.version;
      registryEntry.generation_date = completedMeta.generated_at || new Date().toISOString();
      await saveDocumentRegistryEntry(registryEntry);
    }

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
