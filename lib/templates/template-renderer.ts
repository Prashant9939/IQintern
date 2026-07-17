/* eslint-disable @typescript-eslint/no-explicit-any */
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

  // 3. Inject intelligent QR Code block based on layout analysis
  if (rendered.includes('class="footer-meta"') || rendered.includes("class='footer-meta'")) {
    rendered = rendered.replace(
      /<div class="footer-meta">([\s\S]*?)<\/div>/,
      `<div class="footer-meta" style="display: flex; justify-content: space-between; align-items: center; margin-top: 50px; border-top: 1px solid #e2e8f0; padding-top: 12px;">
        <div style="text-align: left; font-size: 11px; color: #64748b; line-height: 1.5;">
          <strong>Date of Issue:</strong> {{issueDate}}<br/>
          <strong>Certificate No:</strong> {{certificateId}}
        </div>
        <div class="qr-code-section" style="display: flex; flex-direction: column; align-items: center; gap: 4px; border: 1px solid #e2e8f0; padding: 6px; border-radius: 8px; background: #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
          <img src="{{qrCodeUrl}}" style="width: 75px; height: 75px; display: block; image-rendering: -webkit-optimize-contrast;" alt="QR Code" />
          <div style="font-size: 8px; font-weight: bold; color: #4f46e5; font-family: monospace; text-align: center; line-height: 1.2;">
            Certificate No: {{certificateId}}<br/>
            Scan to Verify
          </div>
        </div>
        <div class="sig-line" style="width: 180px; text-align: center; font-weight: bold; color: #0f172a; border-top: none; margin-top: 0; padding-top: 0;">
          IQ Intern Coordinator
        </div>
      </div>`
    );
  } else if (rendered.includes('class="signature-grid"') || rendered.includes("class='signature-grid'")) {
    rendered = rendered.replace(
      /<div class="signature-grid">[\s\S]*?For (IQ Intern Vocational Training Pvt\. Ltd\.|AVADS Private Limited)<\/div>\s*<div class="sig-sublabel">Date: \{\{issueDate\}\}<\/div>\s*<\/div>\s*<\/div>/,
      `<div class="signature-grid" style="grid-template-columns: 1fr 1fr 1fr; align-items: center; justify-items: center; text-align: center;">
        <div class="sig-block">
          <div class="sig-line" style="margin: 25px auto 12px; width: 140px;"></div>
          <div class="sig-label">Intern's Signature</div>
          <div class="sig-sublabel">{{studentName}}</div>
          <div class="sig-sublabel">Date: _______________</div>
        </div>
        <div class="sig-block" style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; border: 1px solid #e2e8f0; padding: 6px; border-radius: 8px; background: #fff;">
          <img src="{{qrCodeUrl}}" style="width: 75px; height: 75px; display: block; image-rendering: -webkit-optimize-contrast;" alt="Verification QR Code" />
          <div style="font-size: 8px; font-weight: bold; color: #4f46e5; font-family: monospace; text-align: center; line-height: 1.2;">
            Reference ID: {{verificationId}}<br/>Scan to Verify
          </div>
        </div>
        <div class="sig-block">
          <div class="sig-label">Authorized Signatory</div>
          <div style="margin: 5px 0;"><img src="/stamp.png" height="75px" width="75px"></div>
          <div class="sig-sublabel">For AVADS Private Limited</div>
          <div class="sig-sublabel">Date: {{issueDate}}</div>
        </div>
      </div>`
    );
  } else if (rendered.includes('class="verification-badge"') || rendered.includes("class='verification-badge'")) {
    rendered = rendered.replace(
      /<span class="verification-badge">/,
      `<div style="display: flex; flex-direction: column; align-items: center; gap: 8px; margin-top: 30px;">
        <div class="qr-code-block" style="display: flex; align-items: center; gap: 15px; background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px 20px; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
          <img src="{{qrCodeUrl}}" style="width: 70px; height: 70px; display: block; image-rendering: -webkit-optimize-contrast;" alt="QR Code" />
          <div style="text-align: left; font-size: 11px; line-height: 1.4; color: #1e293b; font-weight: bold; font-family: monospace;">
            Reference ID: {{verificationId}}<br/>
            <span style="color: #4f46e5;">Scan to Verify</span>
          </div>
        </div>
        <span class="verification-badge" style="margin-top: 5px;">`
    );
  } else if (rendered.includes('Reference ID: {{verificationId}}') || rendered.includes('Reference ID: {{VERIFICATION_ID}}')) {
    rendered = rendered.replace(
      /<div class="footer">([\s\S]*?)<\/div>/,
      `<div class="footer" style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #e2e8f0; padding-top: 15px; margin-top: 40px; font-size: 11px; color: #94a3b8; text-align: left;">
        <div style="text-align: left;">
          <p style="margin: 0; font-weight: bold; color: #475569;">Issued by IQ Intern Board</p>
          <p style="margin: 4px 0 0 0;">Reference ID: {{verificationId}}</p>
        </div>
        <div style="display: flex; align-items: center; gap: 10px; background: #fff; padding: 4px; border-radius: 6px; border: 1px solid #e2e8f0;">
          <img src="{{qrCodeUrl}}" style="width: 55px; height: 55px; display: block; image-rendering: -webkit-optimize-contrast;" alt="QR Code" />
          <div style="text-align: left; font-size: 8px; line-height: 1.3; font-weight: bold; font-family: monospace; color: #64748b;">
            Reference ID: {{verificationId}}<br/>
            Scan to Verify
          </div>
        </div>
      </div>`
    );
  } else {
    rendered = rendered.replace(
      '</body>',
      `<div class="qr-code-fallback" style="display: flex; justify-content: center; align-items: center; gap: 15px; margin: 30px auto; max-width: 300px; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; background: #f8fafc; font-family: monospace; font-size: 10px; font-weight: bold; text-align: left;">
        <img src="{{qrCodeUrl}}" style="width: 60px; height: 60px; display: block; image-rendering: -webkit-optimize-contrast;" alt="QR Code" />
        <div>
          Reference ID: {{verificationId}}<br/>
          Scan to Verify
        </div>
      </div>
      </body>`
    );
  }

  // 4. Prepare and sync template data (CamelCase vs UPPER_SNAKE_CASE synonyms)
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
    ['qrCodeUrl', 'QR_CODE_URL'],
    ['rollNumber', 'ROLL_NUMBER'],
    ['stipendStatus', 'STIPEND_STATUS'],
    ['issueDate', 'ISSUE_DATE'],
    ['currentYear', 'CURRENT_YEAR'],
    ['acceptanceDeadline', 'ACCEPTANCE_DEADLINE'],
    ['duration', 'DURATION'],
    ['amount', 'AMOUNT'],
    ['razorpayPaymentId', 'RAZORPAY_PAYMENT_ID'],
    ['score', 'SCORE'],
    ['grade', 'GRADE'],
    ['percentage', 'PERCENTAGE']
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

  // Inject branding and certificate details mapping for premium certificate.html
  const companyName = "AVADS Private Limited";
  const companyTagline = "Empowering Students, Building Careers";
  const domain = "iqintern.in";
  const websiteUrl = "https://iqintern.in";
  const address = "Sector 154, Noida, Uttar Pradesh, India";

  const track = templateData.internshipTitle || templateData.internshipName || "Vocational Internship";
  
  // Track-specific mentors and departments
  let mentorName = "Dr. Anand K. Verma";
  let mentorSig = "Anand K. Verma";
  let department = "Technology & Engineering";
  
  const trackLower = track.toLowerCase();
  if (trackLower.includes("data science") || trackLower.includes("datasci")) {
    mentorName = "Dr. Amit Verma";
    mentorSig = "Amit Verma";
    department = "Data & AI Department";
  } else if (trackLower.includes("web") || trackLower.includes("python") || trackLower.includes("java") || trackLower.includes("programming") || trackLower.includes("development")) {
    mentorName = "Er. Shiwam Pandey";
    mentorSig = "Shiwam Pandey";
    department = "Engineering & Development";
  } else if (trackLower.includes("marketing") || trackLower.includes("business") || trackLower.includes("finance") || trackLower.includes("account")) {
    mentorName = "Prof. Sneha Kapoor";
    mentorSig = "Sneha Kapoor";
    department = "Business & Commerce Studies";
  } else if (trackLower.includes("security") || trackLower.includes("cyber")) {
    mentorName = "Er. Rohan Joshi";
    mentorSig = "Rohan Joshi";
    department = "Information Security Dept.";
  } else if (trackLower.includes("ui") || trackLower.includes("ux") || trackLower.includes("design")) {
    mentorName = "Er. Neha Gupta";
    mentorSig = "Neha Gupta";
    department = "Product & UI/UX Design";
  } else if (trackLower.includes("cloud") || trackLower.includes("devops")) {
    mentorName = "Er. Vikram Malhotra";
    mentorSig = "Vikram Malhotra";
    department = "Cloud Architecture Dept.";
  }

  const verId = templateData.verificationId || templateData.certificateId || "IQ-VER-2026";
  const verificationUrl = `https://iqintern.in/verify?certificate=${verId}`;

  const customFields: Record<string, string> = {
    INTERN_NAME: templateData.studentName || templateData.fullName || "Intern Candidate",
    COMPANY_NAME: companyName,
    COMPANY_TAGLINE: companyTagline,
    DEPARTMENT: department,
    ROLE_TITLE: `${track} Intern`,
    START_DATE: templateData.startDate || templateData.joiningDate || "N/A",
    END_DATE: templateData.endDate || templateData.completionDate || "N/A",
    MENTOR_NAME: mentorName,
    LOCATION: "Delhi NCR, India (Virtual)",
    ENGAGEMENT_TYPE: "Vocational Simulated Internship",
    MENTOR_SIGNATURE_NAME: mentorSig,
    DIRECTOR_SIGNATURE_NAME: "Prashant Kumar",
    DIRECTOR_NAME: "Mr. Prashant Kumar",
    DIRECTOR_TITLE: "Program Director",
    CERTIFICATE_NUMBER: verId,
    ISSUE_DATE: templateData.issueDate || new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
    VERIFICATION_CODE: verId,
    VERIFICATION_URL: verificationUrl,
    VERIFICATION_DOMAIN: domain,
    COMPANY_ADDRESS: address,
    COMPANY_WEBSITE: websiteUrl
  };

  Object.entries(customFields).forEach(([key, val]) => {
    if (templateData[key] === undefined) {
      templateData[key] = val;
    }
  });

  // 4. Compile template with Handlebars
  let compiledHtml: string;
  try {
    const template = Handlebars.compile(rendered);
    compiledHtml = template(templateData);
  } catch (error) {
    console.error('Handlebars compilation error:', error);
    compiledHtml = rendered;
  }

  // 5. Inject descriptive <title> so Save/Print dialog shows "{Name} - {Doc} | AVADS"
  const DOC_TITLE_LABELS: Record<string, string> = {
    certificate:              'Certificate',
    internship_certificate:   'Certificate',
    appreciation_certificate: 'Appreciation Certificate',
    offer_letter:             'Offer Letter',
    marksheet:                'Marksheet',
    assessment_marksheet:     'Marksheet',
    attendance_sheet:         'Attendance Sheet',
    attendance_record:        'Attendance Sheet',
    project_report:           'Project Report',
    internship_report:        'Internship Report',
    receipt:                  'Payment Receipt',
    payment_receipt:          'Payment Receipt',
  };
  const templateTypeKey = (templateData.templateType || templateData.cleanType || '').toLowerCase();
  const docTitleLabel = DOC_TITLE_LABELS[templateTypeKey] || 'Document';
  const studentDisplayName = templateData.studentName || templateData.INTERN_NAME || templateData.fullName || 'Student';
  const descriptiveTitle = `${studentDisplayName} - ${docTitleLabel} | AVADS Private Limited`;
  compiledHtml = compiledHtml.replace(
    /<title>[^<]*<\/title>/i,
    `<title>${descriptiveTitle}</title>`
  );

  return compiledHtml;
}
