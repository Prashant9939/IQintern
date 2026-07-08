import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';

/**
 * Renders a document template by injecting shared layout elements (header, footer, styles)
 * and compiling using Handlebars to resolve variables, conditions, and helper blocks.
 */
export function renderTemplate(htmlContent: string, data: Record<string, any>): string {
  let rendered = htmlContent;

  // 1. Load shared elements from disk
  const rootDir = process.cwd();
  const sharedDir = path.join(rootDir, 'public', 'templates', 'shared');
  
  let styles = '';
  let header = '';
  let footer = '';

  try {
    const stylesPath = path.join(sharedDir, 'styles.css');
    if (fs.existsSync(stylesPath)) {
      styles = fs.readFileSync(stylesPath, 'utf8');
    }
  } catch (e) {
    console.warn('Failed to read shared styles.css:', e);
  }

  try {
    const headerPath = path.join(sharedDir, 'header.html');
    if (fs.existsSync(headerPath)) {
      header = fs.readFileSync(headerPath, 'utf8');
    }
  } catch (e) {
    console.warn('Failed to read shared header.html:', e);
  }

  try {
    const footerPath = path.join(sharedDir, 'footer.html');
    if (fs.existsSync(footerPath)) {
      footer = fs.readFileSync(footerPath, 'utf8');
    }
  } catch (e) {
    console.warn('Failed to read shared footer.html:', e);
  }

  // 2. Inject shared elements
  rendered = rendered.replace(/\{\{\s*header\s*\}\}/g, header);
  rendered = rendered.replace(/\{\{\s*footer\s*\}\}/g, footer);

  const styleTag = `<style>\n${styles}\n</style>`;
  if (rendered.includes('{{styles}}')) {
    rendered = rendered.replace(/\{\{\s*styles\s*\}\}/g, styleTag);
  } else if (rendered.includes('</head>')) {
    rendered = rendered.replace('</head>', `${styleTag}\n</head>`);
  } else {
    rendered = styleTag + '\n' + rendered;
  }

  // 3. Prepare and sync template data (CamelCase vs UPPER_SNAKE_CASE synonyms)
  const templateData = { ...data };

  const keysToSync: [string, string][] = [
    ['studentName', 'STUDENT_NAME'],
    ['collegeName', 'COLLEGE_NAME'],
    ['universityName', 'UNIVERSITY_NAME'],
    ['internshipName', 'INTERNSHIP_NAME'],
    ['internshipTitle', 'INTERNSHIP_TITLE'],
    ['startDate', 'START_DATE'],
    ['joiningDate', 'JOINING_DATE'],
    ['endDate', 'END_DATE'],
    ['completionDate', 'COMPLETION_DATE'],
    ['certificateId', 'CERTIFICATE_ID'],
    ['verificationId', 'VERIFICATION_ID'],
    ['rollNumber', 'ROLL_NUMBER'],
    ['stipendStatus', 'STIPEND_STATUS'],
    ['issueDate', 'ISSUE_DATE'],
    ['currentYear', 'CURRENT_YEAR'],
    ['acceptanceDeadline', 'ACCEPTANCE_DEADLINE'],
    ['duration', 'DURATION']
  ];

  keysToSync.forEach(([camel, snake]) => {
    if (templateData[snake] !== undefined && templateData[camel] === undefined) {
      templateData[camel] = templateData[snake];
    }
    if (templateData[camel] !== undefined && templateData[snake] === undefined) {
      templateData[snake] = templateData[camel];
    }
  });

  // Provide fallback fields
  if (templateData.currentYear === undefined) {
    templateData.currentYear = new Date().getFullYear().toString();
    templateData.CURRENT_YEAR = templateData.currentYear;
  }

  if (templateData.isUnpaid === undefined) {
    const status = String(templateData.stipendStatus || templateData.STIPEND_STATUS || '').toLowerCase();
    templateData.isUnpaid = !status || status.includes('unpaid') || status.includes('non') || status.includes('no');
  }

  // 4. Compile template with Handlebars
  try {
    const template = Handlebars.compile(rendered);
    return template(templateData);
  } catch (error) {
    console.error('Handlebars compilation error:', error);
    return rendered;
  }
}
