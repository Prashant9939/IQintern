const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

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

async function check() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.log('No supabase config found.');
    return;
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const studentId = 'dec479d2-0dbc-4ce4-9410-650742b597b7';
  const internshipId = '75403542-1ef7-464c-bd14-f88fd5fe2a16';

  console.log(`Checking test results for student ${studentId} and internship ${internshipId}...`);

  const { data: results, error } = await supabase
    .from('test_results')
    .select('*')
    .eq('student_id', studentId);

  if (error) {
    console.error('Error fetching test results:', error);
    return;
  }

  console.log('Test results found for student:', JSON.stringify(results, null, 2));
}

check();
