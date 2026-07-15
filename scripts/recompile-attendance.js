const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
// Manually load environment variables from .env and .env.local
const envFiles = ['.env.local', '.env'];
for (const file of envFiles) {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    const lines = fs.readFileSync(filePath, 'utf8').split('\n');
    for (const line of lines) {
      const match = line.match(/^\s*([^#=]+)\s*=\s*(.*)$/);
      if (match) {
        const key = match[1].trim();
        let val = match[2].trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.substring(1, val.length - 1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

async function run() {
  console.log('[Recompile] Starting attendance sheet cache recompilation...');

  // 1. Wipe local mock cache
  const cacheDir = path.join(process.cwd(), 'pdf_cache');
  const metadataPath = path.join(cacheDir, 'metadata.json');

  if (fs.existsSync(metadataPath)) {
    try {
      const content = fs.readFileSync(metadataPath, 'utf8');
      const list = JSON.parse(content) || [];
      const updatedList = [];
      let clearedLocalCount = 0;

      for (const entry of list) {
        const type = (entry.document_type || '').trim().toLowerCase();
        if (type === 'attendance_sheet' || type === 'attendance_record') {
          // Delete physical file if it exists
          if (entry.storage_url && fs.existsSync(entry.storage_url)) {
            try {
              fs.unlinkSync(entry.storage_url);
              console.log(`[Local Cache] Deleted PDF file: ${entry.storage_url}`);
            } catch (fileErr) {
              console.warn(`[Local Cache] Failed to delete file ${entry.storage_url}:`, fileErr.message);
            }
          }
          clearedLocalCount++;
          // Filtered out to delete the record completely from cache metadata
        } else {
          updatedList.push(entry);
        }
      }

      fs.writeFileSync(metadataPath, JSON.stringify(updatedList, null, 2), 'utf8');
      console.log(`[Local Cache] Cleared ${clearedLocalCount} attendance metadata records from metadata.json.`);
    } catch (e) {
      console.error('[Local Cache] Failed to update local metadata.json:', e);
    }
  }

  // Scan cache dir for any attendance_sheet_*.pdf files just in case
  if (fs.existsSync(cacheDir)) {
    try {
      const files = fs.readdirSync(cacheDir);
      for (const file of files) {
        if (file.startsWith('attendance_sheet_') && file.endsWith('.pdf')) {
          const filePath = path.join(cacheDir, file);
          fs.unlinkSync(filePath);
          console.log(`[Local Cache] Cleaned stray attendance PDF: ${file}`);
        }
      }
    } catch (dirErr) {
      console.warn('[Local Cache] Failed to scan cache dir:', dirErr.message);
    }
  }

  // 2. Wipe Supabase DB cache if configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && serviceRoleKey && !supabaseUrl.includes('your-project-id')) {
    try {
      console.log(`[Database] Connecting to Supabase at ${supabaseUrl}...`);
      const supabase = createClient(supabaseUrl, serviceRoleKey);

      // Determine correct table name
      let tableName = 'student_documents';
      try {
        const { error } = await supabase.from('student_documents').select('id').limit(1);
        if (error && (error.code === 'PGRST205' || error.message?.includes('student_documents'))) {
          tableName = 'documents';
        }
      } catch (checkErr) {
        tableName = 'documents';
      }

      console.log(`[Database] Using table: ${tableName}`);

      // Delete cached attendance sheets from the database
      const { data, error } = await supabase
        .from(tableName)
        .delete()
        .or('document_type.eq.attendance_sheet,document_type.eq.attendance_record');

      if (error) {
        throw error;
      }

      console.log(`[Database] Successfully cleared attendance records from ${tableName}.`);
    } catch (dbErr) {
      console.error('[Database] Failed to clear DB cache:', dbErr.message);
    }
  } else {
    console.log('[Database] Supabase is not configured or lacks credentials. Skipped DB clean.');
  }

  console.log('[Recompile] Attendance recompilation complete. All sheets will regenerate automatically on next request.');
}

run().catch(err => {
  console.error('[Recompile] Failed:', err);
});
