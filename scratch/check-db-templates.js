const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qjvwawajsieisgkslkuj.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseKey) {
  console.error("No supabase key found!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log("Connecting to Supabase...");
  const { data, error } = await supabase
    .from('document_templates')
    .select('id, code, name, internship_id, is_visible, html_content')
    .order('code');

  if (error) {
    console.error("Error fetching templates:", error);
    return;
  }

  console.log(`Found ${data.length} templates in database:`);
  for (const t of data) {
    const size = t.html_content ? t.html_content.length : 0;
    console.log(`ID: ${t.id} | Code: ${t.code} | Name: ${t.name} | Size: ${size} chars | Internship ID: ${t.internship_id}`);
  }
}

check();
