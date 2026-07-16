const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Manually parse .env.local
const envLocalPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envLocalPath)) {
  const content = fs.readFileSync(envLocalPath, 'utf8');
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const parts = trimmed.split('=');
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
      process.env[key] = val;
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qjvwawajsieisgkslkuj.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseKey) {
  console.error("No Supabase key found!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function getSlugFromTitle(title) {
  if (!title) return 'default';
  const clean = title.toLowerCase().trim();
  if (clean.includes('python')) return 'python';
  if (clean.includes('data science') || clean.includes('datasci')) return 'data-science';
  if (clean.includes('web dev') || clean.includes('web-dev') || clean.includes('web development')) return 'web-development';
  return clean.replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

const REPORT_TEMPLATE_MAPPING = {
  "int-datasci": "internship_data_science.html",
  "data science": "internship_data_science.html",
  "data-science": "internship_data_science.html",
  "int-python": "internship_python.html",
  "python programming": "internship_python.html",
  "python development": "internship_python.html",
  "int-web-dev": "internship_web_development.html",
  "web development": "internship_web_development.html",
  "web dev": "internship_web_development.html",
  "web-development": "internship_web_development.html",
  "int-java": "internship_java.html",
  "java development": "internship_java.html",
  "java-development": "internship_java.html",
  "int-ai": "internship_artificial_intelligence.html",
  "artificial intelligence": "internship_artificial_intelligence.html",
  "artificial-intelligence": "internship_artificial_intelligence.html",
  "int-ml": "internship_machine_learning.html",
  "machine learning": "internship_machine_learning.html",
  "machine-learning": "internship_machine_learning.html",
  "int-cybersec": "internship_cyber_security.html",
  "cyber security": "internship_cyber_security.html",
  "cyber-security": "internship_cyber_security.html",
  "int-cloud": "internship_cloud_computing.html",
  "cloud computing": "internship_cloud_computing.html",
  "cloud-computing": "internship_cloud_computing.html",
  "int-uiux": "internship_ui_ux.html",
  "ui/ux design": "internship_ui_ux.html",
  "ui/ux product design": "internship_ui_ux.html",
  "ui-ux": "internship_ui_ux.html",
  "int-digimark": "internship_digital_marketing.html",
  "digital marketing": "internship_digital_marketing.html",
  "digital-marketing": "internship_digital_marketing.html",
  "int-hr": "internship_hr.html",
  "human resources (hr)": "internship_hr.html",
  "human resources": "internship_hr.html",
  "int-bizanalytics": "internship_business_analytics.html",
  "business analytics": "internship_business_analytics.html",
  "business-analytics": "internship_business_analytics.html",
  "int-political": "internship_political_and_governance.html",
  "political and governance": "internship_political_and_governance.html",
  "political-and-governance": "internship_political_and_governance.html",
  "int-tourism": "internship_tourism.html",
  "tourism": "internship_tourism.html",
  "tourism & hospitality": "internship_tourism.html",
  "tourism-and-hospitality": "internship_tourism.html",
  "int-skill-dev": "internship_skill_development.html",
  "entrepreneurship skill development": "internship_skill_development.html",
  "entrepreneurship-skill-development": "internship_skill_development.html",
  "int-teacher-training": "internship_teacher_trainning.html",
  "teacher training": "internship_teacher_trainning.html",
  "teacher-training": "internship_teacher_trainning.html"
};

async function removeUnused() {
  console.log("Fetching active internships from database...");
  const { data: internships, error } = await supabase
    .from('internships')
    .select('id, title');

  if (error) {
    console.error("Error fetching internships:", error);
    return;
  }

  // Calculate expected files
  const expectedFiles = new Set(['internship_default.html']);
  
  for (const track of internships) {
    const title = track.title;
    const id = track.id;
    const slug = getSlugFromTitle(title);
    
    const key = id.toLowerCase().trim();
    const slugKey = slug.toLowerCase().replace(/-/g, ' ');
    let mappedFile = REPORT_TEMPLATE_MAPPING[key] || REPORT_TEMPLATE_MAPPING[slugKey] || REPORT_TEMPLATE_MAPPING[slug.toLowerCase()];

    if (!mappedFile) {
      const cleanSlug = slug.toLowerCase().trim().replace(/-/g, '_');
      mappedFile = `internship_${cleanSlug}.html`;
    }
    
    expectedFiles.add(mappedFile);
  }

  const templatesDir = path.join(__dirname, '..', 'public', 'templates', 'default');
  const files = fs.readdirSync(templatesDir);
  const trackFiles = files.filter(f => f.startsWith('internship_') && f.endsWith('.html'));

  console.log(`\nChecking template files in ${templatesDir}...`);
  console.log(`Expected Files:`, Array.from(expectedFiles));

  let removedCount = 0;
  for (const file of trackFiles) {
    if (!expectedFiles.has(file)) {
      const filePath = path.join(templatesDir, file);
      fs.unlinkSync(filePath);
      console.log(`🗑️ Deleted unused template: ${file}`);
      removedCount++;
    }
  }

  console.log(`\nCleanup complete! Removed ${removedCount} unused report templates.`);
}

removeUnused();
