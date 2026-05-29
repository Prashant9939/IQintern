"use client";

import { useEffect, useState } from "react";
import { getCurrentUser, UserSession } from "@/lib/supabase/auth";
import {
  getInternships,
  getTestResults,
  getStudentProfile,
  getDocumentTemplates,
  verifyCertificate,
  Internship,
  TestResult,
  DocumentTemplate
} from "@/lib/supabase/db";
import {
  Award,
  Briefcase,
  FileSpreadsheet,
  FileText,
  CheckCircle,
  XCircle,
  ShieldCheck,
  Mail,
  CreditCard,
  Calendar,
  Clipboard,
  FolderOpen,
  MessageSquare,
  BookOpen,
  ArrowRight,
  BarChart2,
  Building,
  Zap,
  TrendingUp,
  Users,
  Clock,
  Sparkles,
  GraduationCap,
  Check,
  Search
} from "lucide-react";
import Link from "next/link";

// Helper function to render documents with placeholders dynamically replaced
function renderDocument(templateHtml: string, profile: any, internshipTitle: string, result: TestResult) {
  if (!templateHtml) return "";

  // Calculate Grade based on percentage
  const pct = result?.percentage || 0;
  let grade = "B";
  if (pct >= 90) grade = "A+";
  else if (pct >= 80) grade = "A";

  // Calculate score formatted
  const scoreFormatted = `${result?.score || 0}/${result?.total_questions || 5}`;

  // Date formatting (e.g. 28 June 2026)
  const compDate = result?.completed_at ? new Date(result.completed_at) : new Date();
  const formattedDate = compDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  // Calculate Joining Date (e.g. 3 months before completion)
  const joinDate = new Date(compDate);
  joinDate.setMonth(joinDate.getMonth() - 3);
  const formattedJoiningDate = joinDate.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });

  // Verification ID (use result.reference_number)
  const verificationId = result?.reference_number || "SI-MOCK-ID";

  // Clean values, fallback to empty string if undefined
  const values: Record<string, string> = {
    "{{STUDENT_NAME}}": profile?.full_name || "",
    "{{NAME}}": profile?.full_name || "", // keep index.html compatibility
    "{{ROLL_NUMBER}}": profile?.roll_number || "N/A",
    "{{COLLEGE_NAME}}": profile?.college_name || "N/A",
    "{{DEPARTMENT}}": profile?.department_stream || "N/A",
    "{{SEMESTER}}": profile?.semester || "N/A",
    "{{COURSE}}": profile?.department_stream || "N/A",
    "{{INTERNSHIP_TITLE}}": internshipTitle || "",
    "{{SCORE}}": scoreFormatted,
    "{{GRADE}}": grade,
    "{{COMPLETION_DATE}}": formattedDate,
    "{{JOINING_DATE}}": formattedJoiningDate,
    "{{VERIFICATION_ID}}": verificationId,
    "{{DURATION}}": "120 Hours" // default duration placeholder
  };

  let output = templateHtml;
  for (const [placeholder, val] of Object.entries(values)) {
    const regex = new RegExp(placeholder, "g");
    output = output.replace(regex, val);
  }

  return output;
}

const documentItems = [
  {
    title: "Consent Form",
    description: "Print consent form and sign it before submitting to your college.",
    icon: FileText,
    fileType: "PDF Template",
    iconColor: "text-indigo-650",
    borderColor: "border-indigo-150",
    bgColor: "bg-indigo-50/50"
  },
  {
    title: "Acceptance Letter",
    description: "Official internship acceptance letter by optimark for your college.",
    icon: Mail,
    fileType: "Official Letter",
    iconColor: "text-emerald-600",
    borderColor: "border-emerald-150",
    bgColor: "bg-emerald-50/50"
  },
  {
    title: "Fee Receipt",
    description: "Download and print internship fee payment receipt.",
    icon: CreditCard,
    fileType: "Invoice Receipt",
    iconColor: "text-amber-600",
    borderColor: "border-amber-150",
    bgColor: "bg-amber-50/50"
  },
  {
    title: "Daily Log",
    description: "Internship activity logbook for daily tasks and learnings.",
    icon: BookOpen,
    fileType: "Logbook Template",
    iconColor: "text-violet-600",
    borderColor: "border-violet-150",
    bgColor: "bg-violet-50/50"
  },
  {
    title: "Feedback Form",
    description: "Share your internship experience.",
    icon: MessageSquare,
    fileType: "Online Form",
    iconColor: "text-rose-600",
    borderColor: "border-rose-150",
    bgColor: "bg-rose-50/50"
  },
  {
    title: "Attendance Sheet",
    description: "Download attendance record.",
    icon: Calendar,
    fileType: "Attendance Log",
    iconColor: "text-sky-600",
    borderColor: "border-sky-150",
    bgColor: "bg-sky-50/50"
  },
  {
    title: "Report Format",
    description: "Internship report template.",
    icon: Clipboard,
    fileType: "DOCX Format",
    iconColor: "text-teal-600",
    borderColor: "border-teal-150",
    bgColor: "bg-teal-50/50"
  },
  {
    title: "Marksheet",
    description: "Assessment result.",
    icon: BarChart2,
    fileType: "Performance Card",
    iconColor: "text-purple-600",
    borderColor: "border-purple-150",
    bgColor: "bg-purple-50/50"
  },
  {
    title: "Certificate",
    description: "Download certificate.",
    icon: Award,
    fileType: "Verified Award",
    iconColor: "text-amber-600",
    borderColor: "border-amber-150",
    bgColor: "bg-amber-50/50"
  }
];

const tracks = [
  { title: "Web Development", duration: "12 Weeks", level: "Beginner to Advanced", projects: "8 Real-world Projects", category: "Engineering" },
  { title: "Python Programming", duration: "8 Weeks", level: "Beginner to Intermediate", projects: "5 Scripting Projects", category: "Development" },
  { title: "Artificial Intelligence", duration: "16 Weeks", level: "Advanced", projects: "4 ML/Deep Learning Models", category: "Data & AI" },
  { title: "Cyber Security", duration: "10 Weeks", level: "Intermediate", projects: "6 Penetration Testing Audits", category: "Security" },
  { title: "Data Science", duration: "12 Weeks", level: "Intermediate to Advanced", projects: "5 Data Analysis Pipelines", category: "Data & AI" },
  { title: "Digital Marketing", duration: "6 Weeks", level: "Beginner", projects: "3 SEO & Ad Campaign Audits", category: "Business" },
  { title: "UI/UX Product Design", duration: "8 Weeks", level: "Beginner to Intermediate", projects: "4 High-Fidelity Prototypes", category: "Design" },
  { title: "Cloud Computing", duration: "12 Weeks", level: "Intermediate", projects: "5 Cloud Deployment Architectures", category: "Engineering" },
  { title: "Finance & Accounting", duration: "8 Weeks", level: "Beginner to Intermediate", projects: "3 Portfolio Valuation Reports", category: "Business" },
  { title: "Human Resources (HR)", duration: "6 Weeks", level: "Beginner", projects: "4 Corporate Hiring Pipelines", category: "Business" },
  { title: "Entrepreneurship", duration: "10 Weeks", level: "Intermediate", projects: "2 Business Model Canvas Plans", category: "Management" }
];

const timelineSteps = [
  { num: "01", title: "Registration", desc: "Create your secure candidate profile on the SkillIntern platform in under 2 minutes." },
  { num: "02", title: "Profile Completion", desc: "Provide your institutional records, college stream, roll number, and credentials." },
  { num: "03", title: "Internship Selection", desc: "Browse and choose from our 11+ industry-aligned career tracks spanning multiple domains." },
  { num: "04", title: "Learning Access", desc: "Unlock curriculum guidelines, project requirements, and industry-oriented reference checklists." },
  { num: "05", title: "Assessments", desc: "Attempt the rigorous timed MCQ assessments to test and validate your engineering concepts." },
  { num: "06", title: "Certification", desc: "Pass with a score of 70% or higher to instantly generate your verified digital credentials." },
  { num: "07", title: "Resume Building", desc: "Integrate your verification ID and performance scorecards directly into your professional CV." },
  { num: "08", title: "Career Opportunities", desc: "Share your tamper-proof credentials with recruiters to accelerate your placement path." }
];

const features = [
  { title: "Student Dashboard", desc: "A personalized command center to track active tracks, test records, and certification downloads.", icon: Users },
  { title: "Admin Registry Control", desc: "Allows full control over student database lists, document template builders, and question seeds.", icon: ShieldCheck },
  { title: "College Dashboard", desc: "Enterprise metrics panel designed for faculty members to monitor cohort progress and verify attendance.", icon: Building },
  { title: "Timed MCQ Assessments", desc: "Rigorous timed assessment engine designed to test engineering concepts with tab-change protection.", icon: Zap },
  { title: "Automatic Certificate Generator", desc: "Custom HTML template parsing engine that auto-formats credentials with student data.", icon: Award },
  { title: "Real-time Progress Tracker", desc: "Clean timeline analytics reflecting test history pass rates, attempt dates, and scorecard metrics.", icon: TrendingUp }
];

export default function StudentDashboard() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any | null>(null);
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);

  // Document Preview Modal State
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [previewTitle, setPreviewTitle] = useState<string>("");
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Tabbed Preview state
  const [activeTab, setActiveTab] = useState("dashboard");

  // Certificate Search state
  const [certId, setCertId] = useState("");
  const [verificationResult, setVerificationResult] = useState<any | null>(null);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const u = await getCurrentUser();
        setUser(u);
        if (u) {
          const [ints, res, prof, tpls] = await Promise.all([
            getInternships(),
            getTestResults(u.id),
            getStudentProfile(u.id),
            getDocumentTemplates()
          ]);
          setInternships(ints);
          setResults(res);
          setProfile(prof);
          setTemplates(tpls);
        }
      } catch (err) {
        console.error("Error loading dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const handleViewDocument = (tplCode: string, result: TestResult) => {
    const tpl = templates.find((t) => t.code === tplCode);
    if (!tpl) {
      alert("Document template not found.");
      return;
    }

    const rendered = renderDocument(tpl.html_content, profile, result.internship_title || "Internship Program", result);
    setPreviewHtml(rendered);
    setPreviewTitle(tpl.name);
    setShowPreviewModal(true);
  };

  const handleGetDashboardDocument = (title: string) => {
    // Find the latest passed test result (if any)
    const passedRes = results.filter((r) => r.passed);
    const latestPassed = passedRes.length > 0 ? passedRes[0] : null;

    // Define common variables for replacement
    const replacementValues = {
      STUDENT_NAME: profile?.full_name || user?.full_name || "Rahul Sharma",
      COLLEGE_NAME: profile?.college_name || "University Institute of Technology",
      ROLL_NUMBER: profile?.roll_number || "N/A",
      DEPARTMENT: profile?.department_stream || "Computer Science Engineering",
      INTERNSHIP_TITLE: latestPassed?.internship_title || "Web Development",
      COMPLETION_DATE: latestPassed
        ? new Date(latestPassed.completed_at).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })
        : new Date().toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" }),
      VERIFICATION_ID: latestPassed?.reference_number || "SI-MOCK-VERIFY",
      EMAIL: user?.email || "student@skillintern.com",
      SCORE: latestPassed ? `${latestPassed.score}/${latestPassed.total_questions}` : "N/A",
      GRADE: latestPassed ? (latestPassed.percentage >= 90 ? "A+" : latestPassed.percentage >= 80 ? "A" : "B") : "N/A",
      PERCENTAGE: latestPassed ? String(latestPassed.percentage) : "N/A"
    };

    const replacePlaceholders = (html: string) => {
      let output = html;
      for (const [key, val] of Object.entries(replacementValues)) {
        const regex = new RegExp(`{{${key}}}`, "g");
        output = output.replace(regex, val);
      }
      return output;
    };

    if (title === "Acceptance Letter" || title === "Report Format" || title === "Certificate" || title === "Marksheet") {
      if (!latestPassed) {
        alert(`You must pass at least one internship assessment to unlock your official verified ${title}.`);
        return;
      }

      if (title === "Acceptance Letter") {
        handleViewDocument("offer_letter", latestPassed);
      } else if (title === "Report Format") {
        handleViewDocument("project_report", latestPassed);
      } else if (title === "Certificate") {
        handleViewDocument("certificate", latestPassed);
      } else if (title === "Marksheet") {
        const marksheetHtml = replacePlaceholders(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Evaluation Marksheet</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #333; line-height: 1.6; background-color: #f9f9f9; margin: 0; }
    .card { background: white; padding: 40px; max-width: 700px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
    h1 { color: #7c3aed; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; font-size: 24px; text-align: center; }
    .meta { display: grid; grid-template-cols: 1fr 1fr; gap: 16px; margin: 20px 0; padding: 16px; background: #f5f3ff; border-radius: 8px; border: 1px solid #ddd6fe; }
    .meta div { font-size: 13px; }
    .score-box { text-align: center; margin: 30px 0; padding: 20px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; }
    .score { font-size: 48px; font-weight: 800; color: #7c3aed; }
    .print-btn { display: block; margin: 20px auto 0 auto; padding: 10px 20px; background: #7c3aed; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; }
    @media print { .print-btn { display: none; } }
  </style>
</head>
<body>
  <div class="card">
    <h1>EVALUATION MARKSHEET</h1>
    <div class="meta">
      <div><strong>Student Name:</strong> {{STUDENT_NAME}}</div>
      <div><strong>College Name:</strong> {{COLLEGE_NAME}}</div>
      <div><strong>Internship Track:</strong> {{INTERNSHIP_TITLE}}</div>
      <div><strong>Verification ID:</strong> {{VERIFICATION_ID}}</div>
    </div>
    <div class="score-box">
      <div class="score">{{SCORE}}</div>
      <div style="font-size: 14px; font-weight: bold; color: #475569; margin-top: 8px;">Final Grade: {{GRADE}} ({{PERCENTAGE}}%)</div>
      <div style="font-size: 12px; color: #059669; font-weight: bold; margin-top: 4px;">Assessment Result: PASSED</div>
    </div>
    <p style="font-size: 13px; text-align: center; color: #64748b;">This marksheet details the candidate's core competency score on the SkillIntern MCQ Assessment Engine.</p>
    <button class="print-btn" onclick="window.print()">Print Marksheet</button>
  </div>
</body>
</html>
        `);
        setPreviewHtml(marksheetHtml);
        setPreviewTitle("Marksheet");
        setShowPreviewModal(true);
      }
    } else {
      // General Printable templates
      let htmlTpl = "";
      if (title === "Consent Form") {
        htmlTpl = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Consent Form</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #333; line-height: 1.6; background-color: #f9f9f9; margin: 0; }
    .card { background: white; padding: 40px; max-width: 800px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
    h1 { color: #1e3a8a; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; font-size: 24px; text-align: center; }
    .meta { display: grid; grid-template-cols: 1fr 1fr; gap: 16px; margin: 24px 0; padding: 16px; background: #f8fafc; border-radius: 8px; border: 1px solid #f1f5f9; }
    .meta div { font-size: 13px; }
    .content { margin-top: 24px; font-size: 14px; }
    .signature-area { display: flex; justify-content: space-between; margin-top: 60px; }
    .sig-box { border-top: 1px dashed #94a3b8; width: 200px; text-align: center; padding-top: 8px; font-size: 12px; color: #64748b; }
    .print-btn { display: block; margin: 20px auto 0 auto; padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; }
    @media print { .print-btn { display: none; } }
  </style>
</head>
<body>
  <div class="card">
    <h1>INTERNSHIP CONSENT FORM</h1>
    <div class="meta">
      <div><strong>Student Name:</strong> {{STUDENT_NAME}}</div>
      <div><strong>College Name:</strong> {{COLLEGE_NAME}}</div>
      <div><strong>Roll Number:</strong> {{ROLL_NUMBER}}</div>
      <div><strong>Department/Stream:</strong> {{DEPARTMENT}}</div>
    </div>
    <div class="content">
      <p>I hereby express my consent to participate in the SkillIntern Vocational Training and Internship program. I agree to abide by the guidelines, schedules, and code of conduct set forth by the platform and the project coordinators.</p>
      <p>I confirm that the details provided in my candidate profile are accurate. I understand that my certification is subject to completing the requirements and achieving a passing grade of 70% or above in the assessment portal.</p>
      <p style="margin-top: 16px;">Date: ________________________</p>
    </div>
    <div class="signature-area">
      <div class="sig-box">Candidate Signature</div>
      <div class="sig-box">College Coordinator / Dean</div>
    </div>
    <button class="print-btn" onclick="window.print()">Print Document</button>
  </div>
</body>
</html>
        `;
      } else if (title === "Fee Receipt") {
        htmlTpl = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Fee Receipt</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #333; line-height: 1.6; background-color: #f9f9f9; margin: 0; }
    .card { background: white; padding: 40px; max-width: 800px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
    h1 { color: #059669; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; font-size: 24px; text-align: center; }
    .meta { display: grid; grid-template-cols: 1fr 1fr; gap: 16px; margin: 24px 0; padding: 16px; background: #f0fdf4; border-radius: 8px; border: 1px solid #d1fae5; }
    .meta div { font-size: 13px; }
    .content { margin-top: 24px; font-size: 14px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th { background: #f8fafc; border-bottom: 2px solid #cbd5e1; text-align: left; padding: 8px; font-size: 12px; color: #475569; }
    td { border-bottom: 1px solid #f1f5f9; padding: 12px 8px; font-size: 13px; }
    .total-row { font-weight: bold; background: #f8fafc; }
    .print-btn { display: block; margin: 20px auto 0 auto; padding: 10px 20px; background: #059669; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; }
    @media print { .print-btn { display: none; } }
  </style>
</head>
<body>
  <div class="card">
    <h1>FEES PAYMENT RECEIPT</h1>
    <div class="meta">
      <div><strong>Receipt No:</strong> REC-{{VERIFICATION_ID}}</div>
      <div><strong>Date:</strong> {{COMPLETION_DATE}}</div>
      <div><strong>Candidate:</strong> {{STUDENT_NAME}}</div>
      <div><strong>Email:</strong> {{EMAIL}}</div>
    </div>
    <div class="content">
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Qty</th>
            <th>Rate</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>SkillIntern Vocational Training & Assessment Tier (Free Academic License)</td>
            <td>1</td>
            <td>₹0.00</td>
            <td>₹0.00</td>
          </tr>
          <tr class="total-row">
            <td colspan="3" style="text-align: right;">Total Paid:</td>
            <td>₹0.00</td>
          </tr>
        </tbody>
      </table>
      <p style="margin-top: 24px; font-size: 12px; color: #64748b; text-align: center;">This is a computer-generated receipt. No physical signature is required. Status: PAID (PAST TIER).</p>
    </div>
    <button class="print-btn" onclick="window.print()">Print Receipt</button>
  </div>
</body>
</html>
        `;
      } else if (title === "Daily Log") {
        htmlTpl = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Daily Log</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #333; line-height: 1.6; background-color: #f9f9f9; margin: 0; }
    .card { background: white; padding: 40px; max-width: 900px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
    h1 { color: #4f46e5; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; font-size: 24px; text-align: center; }
    .meta { display: grid; grid-template-cols: 1fr 1fr; gap: 16px; margin: 20px 0; padding: 16px; background: #faf5ff; border-radius: 8px; border: 1px solid #f3e8ff; }
    .meta div { font-size: 13px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th { background: #f8fafc; border: 1px solid #cbd5e1; text-align: center; padding: 10px; font-size: 11px; color: #475569; }
    td { border: 1px solid #cbd5e1; padding: 16px 10px; font-size: 12px; }
    .print-btn { display: block; margin: 20px auto 0 auto; padding: 10px 20px; background: #4f46e5; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; }
    @media print { .print-btn { display: none; } }
  </style>
</head>
<body>
  <div class="card">
    <h1>DAILY ACTIVITY LOGBOOK</h1>
    <div class="meta">
      <div><strong>Student Name:</strong> {{STUDENT_NAME}}</div>
      <div><strong>Department:</strong> {{DEPARTMENT}}</div>
      <div><strong>College Name:</strong> {{COLLEGE_NAME}}</div>
      <div><strong>Internship Track:</strong> {{INTERNSHIP_TITLE}}</div>
    </div>
    <p style="font-size: 13px; margin-bottom: 12px;">Please log your daily tasks, learning notes, and project work below:</p>
    <table>
      <thead>
        <tr>
          <th style="width: 80px;">Day</th>
          <th style="width: 120px;">Date</th>
          <th>Learning Outcomes &amp; Activities Performed</th>
          <th style="width: 100px;">Hours Logged</th>
          <th style="width: 120px;">Supervisor Init</th>
        </tr>
      </thead>
      <tbody>
        <tr><td style="text-align:center;">1</td><td></td><td>Setting up environment, configuring development workspace.</td><td>8</td><td></td></tr>
        <tr><td style="text-align:center;">2</td><td></td><td>Studying core project framework architectures and guidelines.</td><td>8</td><td></td></tr>
        <tr><td style="text-align:center;">3</td><td></td><td>Implementing database schemas, relationships, and queries.</td><td>8</td><td></td></tr>
        <tr><td style="text-align:center;">4</td><td></td><td>Creating responsive frontend pages, forms, and grid layouts.</td><td>8</td><td></td></tr>
        <tr><td style="text-align:center;">5</td><td></td><td>Integrating APIs and testing conceptual workflows.</td><td>8</td><td></td></tr>
      </tbody>
    </table>
    <button class="print-btn" onclick="window.print()">Print Logbook</button>
  </div>
</body>
</html>
        `;
      } else if (title === "Feedback Form") {
        htmlTpl = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Feedback Form</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #333; line-height: 1.6; background-color: #f9f9f9; margin: 0; }
    .card { background: white; padding: 40px; max-width: 800px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
    h1 { color: #e11d48; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; font-size: 24px; text-align: center; }
    .meta { display: grid; grid-template-cols: 1fr 1fr; gap: 16px; margin: 20px 0; padding: 16px; background: #fff1f2; border-radius: 8px; border: 1px solid #ffe4e6; }
    .meta div { font-size: 13px; }
    .section-title { font-weight: bold; margin-top: 20px; font-size: 14px; color: #e11d48; border-bottom: 1px solid #ffe4e6; padding-bottom: 4px; }
    .q-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
    .ratings { display: flex; gap: 8px; }
    .rating-bubble { border: 1px solid #cbd5e1; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-size: 11px; cursor: pointer; }
    .comment-box { border: 1px solid #cbd5e1; width: 100%; min-height: 80px; margin-top: 8px; border-radius: 6px; }
    .print-btn { display: block; margin: 20px auto 0 auto; padding: 10px 20px; background: #e11d48; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; }
    @media print { .print-btn { display: none; } }
  </style>
</head>
<body>
  <div class="card">
    <h1>INTERNSHIP EXPERIENCE FEEDBACK</h1>
    <div class="meta">
      <div><strong>Student Name:</strong> {{STUDENT_NAME}}</div>
      <div><strong>College Name:</strong> {{COLLEGE_NAME}}</div>
      <div><strong>Internship Track:</strong> {{INTERNSHIP_TITLE}}</div>
    </div>
    <div class="section-title">Program Evaluation</div>
    <div class="q-row">
      <span>1. How relevant was the learning checklist/curriculum to your stream?</span>
      <div class="ratings"><div class="rating-bubble">1</div><div class="rating-bubble">2</div><div class="rating-bubble">3</div><div class="rating-bubble">4</div><div class="rating-bubble">5</div></div>
    </div>
    <div class="q-row">
      <span>2. How would you rate the assessment difficulty and integrity?</span>
      <div class="ratings"><div class="rating-bubble">1</div><div class="rating-bubble">2</div><div class="rating-bubble">3</div><div class="rating-bubble">4</div><div class="rating-bubble">5</div></div>
    </div>
    <div class="q-row">
      <span>3. Overall support and utility of the digital dashboards?</span>
      <div class="ratings"><div class="rating-bubble">1</div><div class="rating-bubble">2</div><div class="rating-bubble">3</div><div class="rating-bubble">4</div><div class="rating-bubble">5</div></div>
    </div>
    <div style="margin-top: 15px;">
      <span style="font-size: 13px; font-weight: bold;">General Comments / Recommendations:</span>
      <div class="comment-box"></div>
    </div>
    <button class="print-btn" onclick="window.print()">Print Feedback</button>
  </div>
</body>
</html>
        `;
      } else if (title === "Attendance Sheet") {
        htmlTpl = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Attendance Sheet</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #333; line-height: 1.6; background-color: #f9f9f9; margin: 0; }
    .card { background: white; padding: 40px; max-width: 800px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
    h1 { color: #0284c7; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; font-size: 24px; text-align: center; }
    .meta { display: grid; grid-template-cols: 1fr 1fr; gap: 16px; margin: 20px 0; padding: 16px; background: #e0f2fe; border-radius: 8px; border: 1px solid #bae6fd; }
    .meta div { font-size: 13px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th { background: #f8fafc; border: 1px solid #cbd5e1; text-align: center; padding: 10px; font-size: 11px; color: #475569; }
    td { border: 1px solid #cbd5e1; padding: 12px 10px; font-size: 12px; text-align: center; }
    .print-btn { display: block; margin: 20px auto 0 auto; padding: 10px 20px; background: #0284c7; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; }
    @media print { .print-btn { display: none; } }
  </style>
</head>
<body>
  <div class="card">
    <h1>INTERNSHIP ATTENDANCE RECORD</h1>
    <div class="meta">
      <div><strong>Student Name:</strong> {{STUDENT_NAME}}</div>
      <div><strong>College Name:</strong> {{COLLEGE_NAME}}</div>
      <div><strong>Internship Track:</strong> {{INTERNSHIP_TITLE}}</div>
      <div><strong>Attendance Status:</strong> 100% Present</div>
    </div>
    <table>
      <thead>
        <tr>
          <th>Week</th>
          <th>Start Date</th>
          <th>End Date</th>
          <th>Days Scheduled</th>
          <th>Days Present</th>
          <th>Approval Status</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>1</td><td>__/__/____</td><td>__/__/____</td><td>5</td><td>5</td><td>Approved</td></tr>
        <tr><td>2</td><td>__/__/____</td><td>__/__/____</td><td>5</td><td>5</td><td>Approved</td></tr>
        <tr><td>3</td><td>__/__/____</td><td>__/__/____</td><td>5</td><td>5</td><td>Approved</td></tr>
        <tr><td>4</td><td>__/__/____</td><td>__/__/____</td><td>5</td><td>5</td><td>Approved</td></tr>
      </tbody>
    </table>
    <button class="print-btn" onclick="window.print()">Print Record</button>
  </div>
</body>
</html>
        `;
      }

      const renderedHtml = replacePlaceholders(htmlTpl);
      setPreviewHtml(renderedHtml);
      setPreviewTitle(title);
      setShowPreviewModal(true);
    }
  };

  const handleVerifySearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certId) return;
    setVerifying(true);
    setVerificationResult(null);
    try {
      const result = await verifyCertificate(certId);
      setVerifying(false);
      if (result) {
        setVerificationResult({
          success: true,
          id: result.reference_number || result.id,
          name: result.student_name || "Rahul Sharma",
          track: result.internship_title || "Frontend React Developer",
          date: result.completed_at
            ? new Date(result.completed_at).toLocaleDateString("en-US", { year: "numeric", month: "long" })
            : "May 2026",
          score: `${result.score}/${result.total_questions} (${result.percentage}%)`,
          status: result.passed ? "VERIFIED ACTIVE" : "FAILED"
        });
      } else {
        setVerificationResult({
          success: false,
          message: `No credential records match this ID "${certId}".`
        });
      }
    } catch (err) {
      setVerifying(false);
      setVerificationResult({
        success: false,
        message: "Error verifying credential. Please try again."
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  const passedTests = results.filter((r) => r.passed).length;

  return (
    <div className="space-y-8 relative z-10">
      {/* Welcome Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-indigo-500/5 blur-2xl pointer-events-none" />
        <div>
          <span className="text-indigo-600 text-xs font-bold uppercase tracking-wider">Welcome back</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 mt-1 tracking-tight">{user?.full_name}</h1>
          <p className="text-zinc-505 text-xs sm:text-sm mt-1 font-light">
            Department: <span className="text-zinc-800 font-semibold">{profile?.department_stream || "N/A"}</span> • Phone: <span className="text-zinc-800">{user?.phone_number}</span>
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-2 text-xs shadow-sm">
          <Award className="h-4 w-4 text-amber-500" />
          <span className="text-zinc-700 font-semibold">{passedTests} Assessments Passed</span>
        </div>
      </div>

      {/* Internship Documents Section (Visible only if student passed at least one test) */}
      {results.some((r) => r.passed) && (
        <div className="glass-panel bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-sm">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-indigo-500/[0.02] blur-2xl pointer-events-none" />
          <div className="mb-6">
            <span className="text-indigo-650 text-xs font-bold uppercase tracking-wider">Academic Credentials</span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-950 tracking-tight mt-1">My Internship Documents</h2>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1 font-light leading-relaxed">
              Congratulations on passing your assessments! You can now view and print your verified internship documents.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {results
              .filter((r) => r.passed)
              .map((res) => {
                // Find if templates are visible
                const certVisible = templates.find((t) => t.code === "certificate")?.is_visible !== false;
                const offerVisible = templates.find((t) => t.code === "offer_letter")?.is_visible !== false;
                const reportVisible = templates.find((t) => t.code === "project_report")?.is_visible !== false;

                // Show row if at least one document template is visible
                if (!certVisible && !offerVisible && !reportVisible) return null;

                return (
                  <div
                    key={res.id}
                    className="border border-zinc-100 bg-zinc-50/30 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-zinc-50/70 transition-all border-l-4 border-l-indigo-600"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-zinc-900">{res.internship_title}</h3>
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 border border-emerald-150 px-2 py-0.5 text-[10px] font-bold text-emerald-600 font-mono shrink-0">
                          Passed ({res.percentage}%)
                        </span>
                      </div>
                      <p className="text-zinc-400 text-xs mt-1.5 font-light">
                        Issued on {new Date(res.completed_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} • Credential ID: <span className="font-mono text-zinc-800 font-semibold">{res.reference_number}</span>
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2.5">
                      {offerVisible && (
                        <button
                          type="button"
                          onClick={() => handleViewDocument("offer_letter", res)}
                          className="flex items-center gap-1.5 rounded-xl border border-zinc-250 bg-white hover:bg-indigo-50/60 hover:text-indigo-755 hover:border-indigo-200 active:bg-indigo-100 active:scale-95 px-4 py-2.5 text-xs font-bold transition-all shadow-sm cursor-pointer"
                        >
                          <FileText className="h-4 w-4 text-indigo-500" />
                          View Offer Letter
                        </button>
                      )}
                      {certVisible && (
                        <button
                          type="button"
                          onClick={() => handleViewDocument("certificate", res)}
                          className="flex items-center gap-1.5 rounded-xl border border-zinc-250 bg-white hover:bg-indigo-50/60 hover:text-indigo-755 hover:border-indigo-200 active:bg-indigo-100 active:scale-95 px-4 py-2.5 text-xs font-bold transition-all shadow-sm cursor-pointer"
                        >
                          <Award className="h-4 w-4 text-amber-500" />
                          View Certificate
                        </button>
                      )}
                      {reportVisible && (
                        <button
                          type="button"
                          onClick={() => handleViewDocument("project_report", res)}
                          className="flex items-center gap-1.5 rounded-xl border border-zinc-250 bg-white hover:bg-indigo-50/60 hover:text-indigo-755 hover:border-indigo-200 active:bg-indigo-100 active:scale-95 px-4 py-2.5 text-xs font-bold transition-all shadow-sm cursor-pointer"
                        >
                          <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
                          View Project Report
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* GENERAL DOCUMENTS LIBRARY GRID */}


      {/* COMPARISON: TRADITIONAL VS SKILLINTERN */}
      <div className="border-t border-zinc-200/60 pt-12">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs text-indigo-650 font-bold uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full">Methodology comparison</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
            A Shift Toward Practical Competence
          </h2>
          <p className="text-zinc-555 text-xs sm:text-sm font-light">
            Traditional certificates verify attendance; SkillIntern certifies actual skill validation and performance scores.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Traditional learning card */}
          <div className="glass-panel border border-red-200/85 bg-red-50/10 rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="text-base font-bold text-red-750 uppercase tracking-wider flex items-center gap-2">
              Traditional Certificates
            </h3>
            <ul className="space-y-4 text-left">
              {[
                "Focus on theoretical learning and textbook concepts",
                "Minimal hands-on project experience or industrial checks",
                "Assessments are easily bypassed or plagiarized",
                "Generic credentials that recruiters cannot instantly verify",
                "No pathway for continuous mentorship or scorecards"
              ].map((item, idx) => (
                <li key={idx} className="flex gap-2.5 items-start text-xs sm:text-sm text-zinc-555 leading-relaxed font-light font-sans">
                  <span className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center shrink-0 text-red-650 font-bold font-sans">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* SkillIntern learning card */}
          <div className="glass-panel border border-emerald-300 bg-emerald-50/10 rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="text-base font-bold text-emerald-755 uppercase tracking-wider flex items-center gap-2">
              The SkillIntern Standard
            </h3>
            <ul className="space-y-4 text-left">
              {[
                "Strict focus on functional code implementation and design outputs",
                "Mandatory validation checks using real build specifications",
                "Timed MCQ evaluations with tab-switching lock protections",
                "100% tamper-proof certificates verifiable instantly by QR/ID",
                "Detailed downloadable scorecards showing breakdown of marks"
              ].map((item, idx) => (
                <li key={idx} className="flex gap-2.5 items-start text-xs sm:text-sm text-zinc-800 leading-relaxed font-semibold font-sans">
                  <span className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-600 font-bold font-sans">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* EMOTIONAL CAREER CONVERSION SECTION */}
      <div className="border-t border-zinc-200/60 pt-12">
        <div className="glass-panel bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-10 relative overflow-hidden flex flex-col lg:flex-row items-center gap-10 shadow-sm">
          <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-indigo-500/[0.02] blur-3xl pointer-events-none" />

          <div className="lg:w-7/12 space-y-5 text-left">
            <span className="text-xs text-indigo-650 font-bold uppercase tracking-wider block">Career realities</span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-950 tracking-tight leading-snug">
              Why Verified Practical Internships are No Longer Optional
            </h2>
            <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed font-light">
              Recruiters scan resumes in less than 7 seconds. A certificate that merely states you finished a course is ignored. They look for proven competence—scores that stand out, templates that show actual project structures, and credentials that can be verified instantly without back-and-forth emails.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold pt-2">
              <div className="flex items-center gap-2 text-zinc-700">
                <span className="h-2 w-2 rounded-full bg-indigo-500" />
                <span>Mandatory Academic Credits Check</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-700">
                <span className="h-2 w-2 rounded-full bg-indigo-500" />
                <span>Verifiable Industrial Proofs</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-700">
                <span className="h-2 w-2 rounded-full bg-indigo-500" />
                <span>Verified Scorecards for Recruiters</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-700">
                <span className="h-2 w-2 rounded-full bg-indigo-500" />
                <span>Protects Resumes Against Fraud</span>
              </div>
            </div>
          </div>

          <div className="lg:w-5/12 w-full bg-zinc-50 border border-zinc-200/80 p-5 rounded-2xl space-y-4 text-left">
            <h4 className="text-xs font-bold text-zinc-900 uppercase">Employment Gap Solutions</h4>
            <div className="space-y-3 text-xs text-zinc-505 font-light">
              <p>
                <strong>AICTE Mandate:</strong> Academic rules now require verified vocational credentials. Students without certified project credentials face graduation obstacles.
              </p>
              <p>
                <strong>Skill Validation:</strong> Passing our assessments validates that you actually know core domain constructs, setting your application apart instantly.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS: TIMELINE UI */}
      <div className="border-t border-zinc-200/60 pt-12">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs text-indigo-650 font-bold uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full">Interactive Journey</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
            The Path to Verified Credentials
          </h2>
          <p className="text-zinc-500 text-xs sm:text-sm font-light">
            Follow our step-by-step verified curriculum pipeline to qualify and build your industry authority.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative text-left">
          {timelineSteps.map((step, idx) => (
            <div
              key={idx}
              className="glass-panel bg-white border border-zinc-200/80 rounded-2xl p-5 space-y-4 relative group"
            >
              <div className="flex justify-between items-center">
                <span className="text-2xl font-black text-indigo-600 bg-indigo-50 rounded-xl px-3 py-1 font-mono">{step.num}</span>
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Phase {idx + 1}</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-900 mb-1">{step.title}</h4>
                <p className="text-[11px] sm:text-xs text-zinc-500 leading-relaxed font-light">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SAAS INTERNSHIP TRACKS GRID */}
      <div className="border-t border-zinc-200/60 pt-12">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs text-indigo-650 font-bold uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full">Domain certification programs</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
            Internship Tracks & Pathways
          </h2>
          <p className="text-zinc-500 text-xs sm:text-sm font-light">
            Enroll in a structured pathway. Pass conceptual requirements to instantly unlock your credentials.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 text-left">
          {tracks.map((track, idx) => (
            <div
              key={idx}
              className="glass-panel bg-white border border-zinc-200/85 rounded-2xl p-5 flex flex-col justify-between hover:border-indigo-500/20 hover:scale-[1.01] transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[8px] font-bold uppercase tracking-widest text-zinc-400">
                  <span>{track.category}</span>
                  <span className="text-indigo-650">{track.duration}</span>
                </div>
                <h4 className="text-sm font-bold text-zinc-900 line-clamp-1">{track.title}</h4>

                <div className="space-y-1.5 text-[10px] text-zinc-500 border-t border-zinc-100 pt-2.5">
                  <p className="flex items-center gap-1.5 font-light">
                    <Clock className="h-3 w-3 text-indigo-500" />
                    Level: <span className="font-semibold text-zinc-700">{track.level}</span>
                  </p>
                  <p className="flex items-center gap-1.5 font-light">
                    <Sparkles className="h-3 w-3 text-violet-500" />
                    <span>{track.projects}</span>
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100 mt-4 flex items-center justify-between">
                <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded px-1.5 py-0.5 uppercase">Certified</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600">
                  Available in Tracks Tab
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PLATFORM FEATURES SECTION */}
      <div className="border-t border-zinc-200/60 pt-12">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs text-indigo-650 font-bold uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full">Platform Architecture</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
            Enterprise SaaS Infrastructure
          </h2>
          <p className="text-zinc-500 text-xs sm:text-sm font-light">
            Highly secure, reliable, and compliant certification workflow tools.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="glass-panel bg-white border border-zinc-200/80 rounded-2xl p-6 space-y-3 hover:shadow-xs transition-shadow">
                <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <Icon className="h-5 w-5" />
                </div>
                <h4 className="text-base font-bold text-zinc-900">{f.title}</h4>
                <p className="text-xs text-zinc-550 leading-relaxed font-light">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* LIVE PLATFORM PREVIEW TABS */}
      <div className="border-t border-zinc-200/60 pt-12">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs text-indigo-650 font-bold uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full">Interface sneak peek</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
            Live Platform Previews
          </h2>
          <p className="text-zinc-500 text-xs sm:text-sm font-light">
            Explore the premium, unified dashboards designed for optimal vocational workflow metrics.
          </p>
        </div>

        {/* Interactive tabs controller */}
        <div className="max-w-lg mx-auto flex gap-2 border-b border-zinc-200 mb-8 overflow-x-auto pb-2 justify-center">
          {[
            { id: "dashboard", name: "Student Panel" },
            { id: "assessment", name: "MCQ Portal" },
            { id: "certificate", name: "Document Verification" },
            { id: "admin", name: "Admin Console" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-xs font-bold transition-all border-b-2 shrink-0 cursor-pointer ${activeTab === tab.id
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-zinc-400 hover:text-zinc-700"
                }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Tab contents preview panels */}
        <div className="max-w-4xl mx-auto glass-panel bg-white border border-zinc-200/80 rounded-3xl p-4 sm:p-8 min-h-[220px] shadow-sm flex flex-col justify-center text-left">
          {activeTab === "dashboard" && (
            <div className="space-y-4">
              <span className="text-[10px] font-bold text-indigo-600 uppercase">Interactive Preview</span>
              <h3 className="text-lg font-extrabold text-zinc-900">Student Dashboard Overview</h3>
              <p className="text-xs text-zinc-500 font-light leading-relaxed">
                The central student dashboard tracks active internships, exam scorecards, and certificates. It provides a real-time progress layout with complete checklist breakdowns, ensuring students understand exactly what requirements are needed to unlock credentials.
              </p>
              <div className="p-3 bg-zinc-50 border border-zinc-200/80 rounded-xl max-w-md font-mono text-[10px] text-zinc-500">
                <p>✓ Track Status: React Developer (In-Progress)</p>
                <p>✓ Current Progress: 4 out of 5 Assessments Passed</p>
              </div>
            </div>
          )}

          {activeTab === "assessment" && (
            <div className="space-y-4">
              <span className="text-[10px] font-bold text-violet-600 uppercase">Interactive Preview</span>
              <h3 className="text-lg font-extrabold text-zinc-900">Concept Assessment Portal</h3>
              <p className="text-xs text-zinc-500 font-light leading-relaxed">
                The assessment portal hosts timed exam formats with integrated tab protection algorithms to ensure evaluation integrity. Candidates answer multiple-choice questions curated by industry mentors, getting instant feedback scorecard metrics.
              </p>
              <div className="p-3 bg-violet-50/50 border border-violet-100 rounded-xl max-w-md font-mono text-[10px] text-violet-700">
                <p>⌛ Timer: 04:59 Minutes Remaining</p>
                <p>⚡ Question 1: What hooks should you use for state persistence?</p>
              </div>
            </div>
          )}

          {activeTab === "certificate" && (
            <div className="space-y-4">
              <span className="text-[10px] font-bold text-emerald-600 uppercase">Interactive Preview</span>
              <h3 className="text-lg font-extrabold text-zinc-900">Verified Credentials Page</h3>
              <p className="text-xs text-zinc-500 font-light leading-relaxed">
                Every successful candidate qualifies for unified document packages including an **Offer Letter**, **Verified Certificate**, and **Project Report**. Credentials can be digitally parsed by employer HR systems using unique hash tags.
              </p>
              <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl max-w-md font-mono text-[10px] text-emerald-700">
                <p>✓ Credential Seal: VERIFIED BY SKILLINTERN ENGINE</p>
                <p>✓ Reference Hash: SI-2026-REACT-A893F</p>
              </div>
            </div>
          )}

          {activeTab === "admin" && (
            <div className="space-y-4">
              <span className="text-[10px] font-bold text-amber-600 uppercase">Interactive Preview</span>
              <h3 className="text-lg font-extrabold text-zinc-900">Platform Analytics Console</h3>
              <p className="text-xs text-zinc-500 font-light leading-relaxed">
                The administrator dashboard displays registered student statistics, global passing rate percentages, mock roll indices, and documents visibility settings. Admins can update template HTML code blocks and questions repository dynamically.
              </p>
              <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl max-w-md font-mono text-[10px] text-amber-700">
                <p>📊 Global Student Index: 24,000+ Profiles Active</p>
                <p>⚙ Database: Connected Supabase Client</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CERTIFICATE VERIFICATION SHOWCASE (REAL-TIME INPUT MOCKUP) */}
      <div className="border-t border-zinc-200/60 pt-12">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs text-indigo-650 font-bold uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full">Secure trust verification</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
            Instant Certificate Verification
          </h2>
          <p className="text-zinc-550 text-xs sm:text-sm font-light">
            Employers and institutions can enter a certificate credential ID below to instantly verify candidates.
          </p>
        </div>

        <div className="max-w-2xl mx-auto glass-panel bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-emerald-500/[0.01] blur-2xl pointer-events-none" />

          <form onSubmit={handleVerifySearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Enter Certificate Verification ID (e.g. SI-2026-REACT)"
                value={certId}
                onChange={(e) => setCertId(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-zinc-200 focus:border-indigo-500/50 rounded-xl outline-none text-zinc-800 transition-colors text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={verifying}
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-6 py-3 transition-all cursor-pointer shadow-sm shadow-indigo-650/10 shrink-0"
            >
              {verifying ? "Searching..." : "Verify Credentials"}
            </button>
          </form>

          {/* Results output box */}
          {verificationResult && (
            <div className={`p-5 rounded-2xl border transition-all animate-fade-in text-left text-xs ${verificationResult.success
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-red-200 bg-red-50 text-red-800"
              }`}>
              {verificationResult.success ? (
                <div className="space-y-2">
                  <div className="flex justify-between items-center border-b border-emerald-100 pb-2">
                    <span className="font-extrabold text-sm uppercase">✓ Verified secure record</span>
                    <span className="font-mono text-[10px] font-bold bg-emerald-100 text-emerald-700 rounded px-2 py-0.5">ACTIVE</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <p>Candidate ID: <strong className="font-mono">{verificationResult.id}</strong></p>
                    <p>Name: <strong>{verificationResult.name}</strong></p>
                    <p>Internship Track: <strong>{verificationResult.track}</strong></p>
                    <p>Issue Date: <strong>{verificationResult.date}</strong></p>
                    <p>Evaluation Score: <strong>{verificationResult.score}</strong></p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-500 shrink-0" />
                  <p className="font-semibold">{verificationResult.message}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* COLLEGE PARTNERSHIP HUB SECTION */}
      <div className="border-t border-zinc-200/60 pt-12">
        <div className="glass-panel bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-10 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-10 shadow-sm">
          <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

          <div className="lg:w-7/12 text-left space-y-4">
            <span className="text-xs text-indigo-650 font-bold uppercase tracking-wider block">Academic Hubs</span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-950 tracking-tight leading-snug">
              SkillIntern Academic College Partnerships
            </h2>
            <p className="text-zinc-555 text-xs sm:text-sm leading-relaxed font-light">
              Provide your students with instant access to mandatory vocational assessments. With the College Partnership Hub, academic administrators can upload student lists in bulk, track progress metrics, verify attendance logs, and consolidate compliance reporting sheets.
            </p>

            <div className="flex flex-wrap gap-2.5 pt-2">
              {["Bulk List Uploads", "Progress Monitoring", "Cohort Analytics", "Attendance Verification"].map((item, idx) => (
                <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-50 border border-zinc-200/60 text-[10px] font-bold text-zinc-650 shadow-xs">
                  <Check className="h-3.5 w-3.5 text-indigo-600" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:w-4/12 w-full flex flex-col items-center">
            <div className="w-full bg-zinc-50 border border-zinc-200/80 p-6 rounded-2xl text-center space-y-4 shadow-xs">
              <GraduationCap className="h-10 w-10 text-indigo-600 mx-auto" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-zinc-900">Establish Partner Status</h4>
                <p className="text-xs text-zinc-400 font-light">Enable group testing & batch reports for your institution.</p>
              </div>
              <span className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-white font-bold text-xs py-3 px-4 shadow-sm shadow-indigo-650/10">
                Partner College Program
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* TESTIMONIALS SECTION */}
      <div className="border-t border-zinc-200/60 pt-12">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs text-indigo-650 font-bold uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full">Stakeholder feedback</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
            Trusted by Students & Faculty
          </h2>
          <p className="text-zinc-505 text-xs sm:text-sm font-light">
            Read how candidates and administrators utilize verified SkillIntern credentials.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto text-left text-zinc-800">
          {/* Student review */}
          <div className="glass-panel bg-white border border-zinc-200/80 rounded-2xl p-6 flex flex-col justify-between hover:shadow-xs transition-shadow">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">P</div>
                <div>
                  <h5 className="text-xs font-bold text-zinc-900">Priya Patel</h5>
                  <p className="text-[9px] text-zinc-405 font-medium">Student, Computer Science</p>
                </div>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed font-light italic">
                &ldquo;SkillIntern solved my internship mandate. The Web Development track guidelines were clear, and passing the timed assessment generated my verified certificate instantly. Employers verified it without delays!&rdquo;
              </p>
            </div>
            <span className="text-[10px] font-bold text-indigo-650 block mt-4 uppercase tracking-wider">✓ Verified Student</span>
          </div>

          {/* Faculty review */}
          <div className="glass-panel bg-white border border-zinc-200/80 rounded-2xl p-6 flex flex-col justify-between hover:shadow-xs transition-shadow">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600 font-bold text-xs">R</div>
                <div>
                  <h5 className="text-xs font-bold text-zinc-900">Prof. Rajesh Kumar</h5>
                  <p className="text-[9px] text-zinc-405 font-medium">Head of Placement, Engineering</p>
                </div>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed font-light italic">
                &ldquo;We uploaded student indices in bulk and monitored evaluations. Using SkillIntern ensures students complete their assessments fairly, and gives our placements team concrete validation of student readiness.&rdquo;
              </p>
            </div>
            <span className="text-[10px] font-bold text-violet-600 block mt-4 uppercase tracking-wider">✓ Verified Faculty</span>
          </div>

          {/* Recruiter review */}
          <div className="glass-panel bg-white border border-zinc-200/80 rounded-2xl p-6 flex flex-col justify-between hover:shadow-xs transition-shadow">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs">M</div>
                <div>
                  <h5 className="text-xs font-bold text-zinc-900">Meera Sen</h5>
                  <p className="text-[9px] text-zinc-405 font-medium">Senior Talent Acquisition Partner</p>
                </div>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed font-light italic">
                &ldquo;Credential fraud is a massive challenge in volume hiring. SkillIntern's QR-code and unique ID lookup portals allow my onboarding team to verify candidate scorecards instantly, reducing check times from weeks to seconds.&rdquo;
              </p>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 block mt-4 uppercase tracking-wider">✓ Verified Recruiter</span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel rounded-2xl p-5 flex items-center gap-4">
          <div className="h-10 w-10 shrink-0 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider block">Available Tracks</span>
            <span className="text-xl font-bold text-zinc-900 tracking-tight">{internships.length}</span>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 flex items-center gap-4">
          <div className="h-10 w-10 shrink-0 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 border border-violet-100">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
          <div>
            <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider block">Tests Attempted</span>
            <span className="text-xl font-bold text-zinc-900 tracking-tight">{results.length}</span>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 flex items-center gap-4">
          <div className="h-10 w-10 shrink-0 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider block">Pass Rate</span>
            <span className="text-xl font-bold text-zinc-900 tracking-tight">
              {results.length > 0 ? `${Math.round((passedTests / results.length) * 100)}%` : "0%"}
            </span>
          </div>
        </div>
      </div>

      {/* Certification Logs Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-zinc-900 tracking-tight flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-indigo-600" />
          Test History
        </h2>

        {results.length === 0 ? (
          <div className="text-center py-16 border border-zinc-205 rounded-3xl bg-white shadow-sm">
            <FileText className="h-10 w-10 mx-auto text-zinc-400 mb-3" />
            <p className="text-sm text-zinc-555 font-bold">No test attempts logged yet.</p>
            <p className="text-xs text-zinc-400 font-light mt-1">Navigate to the Available Internships tab to take your first test.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((res) => (
              <div
                key={res.id}
                className="glass-panel bg-white border border-zinc-200/80 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-zinc-900 line-clamp-1">{res.internship_title}</h4>
                      <span className="text-[10px] text-zinc-400 font-light block mt-0.5">{new Date(res.completed_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
                    </div>
                    {res.passed ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 text-[10px] font-bold text-emerald-600 shrink-0">
                        <CheckCircle className="h-3.5 w-3.5 shrink-0" /> Pass
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 border border-red-100 px-3 py-1 text-[10px] font-bold text-red-600 border border-red-100 shrink-0">
                        <XCircle className="h-3.5 w-3.5 shrink-0" /> Fail
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-zinc-505 border-t border-zinc-100 pt-3 font-light">
                    <span>Score: <span className="text-zinc-800 font-semibold">{res.score}/{res.total_questions}</span> ({res.percentage}%)</span>
                    <Link
                      href={`/student/results/${res.id}`}
                      className="text-xs text-indigo-650 hover:text-indigo-755 font-bold transition-all"
                    >
                      View Report &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DOCUMENT PREVIEW MODAL */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-5xl h-[85vh] bg-white rounded-3xl flex flex-col overflow-hidden shadow-2xl border border-zinc-200">
            {/* Modal Header */}
            <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-zinc-200 bg-zinc-50">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-indigo-600 animate-pulse" />
                <h3 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wider">{previewTitle} Preview</h3>
              </div>
              <button
                onClick={() => {
                  setShowPreviewModal(false);
                  setPreviewHtml("");
                }}
                className="rounded-xl border border-zinc-250 bg-white hover:bg-zinc-100 active:bg-zinc-200 active:scale-95 text-xs font-bold text-zinc-600 hover:text-zinc-800 px-4 py-2 transition-all cursor-pointer"
              >
                Close Preview
              </button>
            </div>

            {/* Modal Body: iframe to isolate styles */}
            <div className="flex-grow bg-zinc-100 p-4 flex items-center justify-center overflow-hidden">
              <iframe
                title="Document Preview"
                srcDoc={previewHtml}
                className="w-full h-full border border-zinc-200 bg-white rounded-2xl shadow-inner"
                sandbox="allow-modals allow-scripts allow-same-origin allow-downloads"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
