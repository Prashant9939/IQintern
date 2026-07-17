const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. Load env variables from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('Error: .env.local file not found!');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1);
    } else if (value.startsWith("'") && value.endsWith("'")) {
      value = value.substring(1, value.length - 1);
    }
    env[key] = value.trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL or keys not configured in .env.local');
  process.exit(1);
}

console.log('Connecting to Supabase...');
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function clearCache() {
  console.log('Clearing local pdf_cache directory...');
  const localCacheDir = path.join(__dirname, '..', 'pdf_cache');
  if (fs.existsSync(localCacheDir)) {
    try {
      const files = fs.readdirSync(localCacheDir);
      for (const file of files) {
        fs.unlinkSync(path.join(localCacheDir, file));
      }
      console.log('Local pdf_cache directory cleared successfully!');
    } catch (e) {
      console.error('Error clearing local cache directory:', e);
    }
  }

  // Determine active document metadata table
  let activeTable = 'student_documents';
  try {
    const { error } = await supabase.from('student_documents').select('id').limit(1);
    if (error && (error.code === 'PGRST205' || error.message?.includes('student_documents'))) {
      activeTable = 'documents';
    }
  } catch (e) {
    activeTable = 'documents';
  }

  console.log(`Clearing document metadata cache from DB table: ${activeTable}...`);
  const { data, error } = await supabase.from(activeTable).delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  if (error) {
    console.error(`Error deleting from ${activeTable}:`, error);
  } else {
    console.log(`Successfully cleared all document metadata entries from ${activeTable}!`);
  }

  console.log('All caches cleared! Documents will be regenerated with the new dynamic details and titles upon request.');
}

clearCache();
