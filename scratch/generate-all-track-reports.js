const fs = require('fs');
const path = require('path');

const workspaceDir = 'c:/Users/shiwa/OneDrive/Documents/GitHub/skillintern';
const templatesDir = path.join(workspaceDir, 'public', 'templates', 'default');
const dbTemplatePath = path.join(workspaceDir, 'scratch', 'db_project_report.html');

if (!fs.existsSync(dbTemplatePath)) {
  console.error("Database template copy not found at:", dbTemplatePath);
  process.exit(1);
}

const templateContent = fs.readFileSync(dbTemplatePath, 'utf8');

const trackMapping = {
  'internship_data_science.html': 'Data Science',
  'internship_python.html': 'Python Programming',
  'internship_web_development.html': 'Web Development',
  'internship_java.html': 'Java Development',
  'internship_artificial_intelligence.html': 'Artificial Intelligence',
  'internship_machine_learning.html': 'Machine Learning',
  'internship_cyber_security.html': 'Cyber Security',
  'internship_cloud_computing.html': 'Cloud Computing',
  'internship_ui_ux.html': 'UI/UX Design',
  'internship_digital_marketing.html': 'Digital Marketing',
  'internship_hr.html': 'Human Resources (HR)',
  'internship_human_resources_hr.html': 'Human Resources (HR)',
  'internship_business_analytics.html': 'Business Analytics',
  'internship_political_and_governance.html': 'Political and Governance',
  'internship_tourism.html': 'Tourism & Hospitality',
  'internship_tourism__hospitality.html': 'Tourism & Hospitality',
  'internship_skill_development.html': 'Entrepreneurship Skill Development',
  'internship_teacher_trainning.html': 'Teacher Training',
  'internship_finance__accounting.html': 'Finance & Accounting',
  'internship_entrepreneurship.html': 'Entrepreneurship',
  'internship_uiux_product_design.html': 'UI/UX Product Design'
};

console.log("Generating 22-page report templates for each track...");

let generatedCount = 0;
for (const [filename, trackName] of Object.entries(trackMapping)) {
  const filePath = path.join(templatesDir, filename);
  
  let trackHtml = templateContent;
  
  // Customize the title tag
  trackHtml = trackHtml.replace(/<title>Internship Report<\/title>/g, `<title>${trackName} Internship Report - IQ Intern</title>`);
  
  // Customize dynamic placeholders with track-specific text if helpful, but keep Handlebars tags supported
  trackHtml = trackHtml.replace(/\{\{\s*INTERNSHIP_TITLE\s*\}\}/g, trackName);
  trackHtml = trackHtml.replace(/\{\{\s*internshipTitle\s*\}\}/g, trackName);
  trackHtml = trackHtml.replace(/\{\{\s*internshipName\s*\}\}/g, trackName);
  
  fs.writeFileSync(filePath, trackHtml, 'utf8');
  console.log(`Generated: ${filename} for "${trackName}"`);
  generatedCount++;
}

console.log(`\nGeneration complete! Created ${generatedCount} track-specific report templates.`);
