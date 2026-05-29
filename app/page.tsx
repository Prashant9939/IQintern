"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Award,
  ShieldCheck,
  Zap,
  Users,
  GraduationCap,
  ChevronRight,
  Check,
  Search,
  MessageSquare,
  Building,
  TrendingUp,
  BarChart2,
  ChevronDown,
  ChevronUp,
  Briefcase,
  HelpCircle,
  Clock,
  ArrowRight,
  Sparkles,
  BookOpen,
  FileText,
  Mail,
  CreditCard,
  Calendar,
  Clipboard,
  FolderOpen
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { verifyCertificate } from "@/lib/supabase/db";

export default function Home() {
  // 1. FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // 2. Tabbed Preview state
  const [activeTab, setActiveTab] = useState("dashboard");

  // 3. Certificate Search state
  const [certId, setCertId] = useState("");
  const [verificationResult, setVerificationResult] = useState<any | null>(null);
  const [verifying, setVerifying] = useState(false);

  const stats = [
    { label: "Active Students Enrolled", value: "24,000+", icon: Users, color: "text-indigo-600 bg-indigo-50 border-indigo-100" },
    { label: "Partner Institutions", value: "48+", icon: GraduationCap, color: "text-violet-600 bg-violet-50 border-violet-100" },
    { label: "SaaS Career Tracks", value: "25+", icon: Briefcase, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
    { label: "Platform Assessment Bank", value: "500+", icon: Zap, color: "text-amber-600 bg-amber-50 border-amber-100" },
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
    { num: "03", title: "Internship Selection", desc: "Browse and choose from our 25+ industry-aligned career tracks spanning multiple domains." },
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

  const faqs = [
    { q: "What is the typical internship duration on SkillIntern?", a: "Most of our standard career tracks are designed to span between 6 to 16 weeks (typically 3 months), requiring approximately 120 hours of curriculum work and project validation." },
    { q: "How are the certificates verified?", a: "Every certificate issued contains a unique secure Verification ID. Employers can enter this ID on our homepage verification widget, or scan the embedded QR code to retrieve digital verification directly from our secure database." },
    { q: "What is the assessment process?", a: "Assessments consist of timed 5-minute MCQ tests covering core engineering, business, and design concepts. You must score 70% or higher to pass. If you fail, you can review the guidelines and retake the test." },
    { q: "Can academic institutions partner with SkillIntern?", a: "Yes. Colleges can establish partnership hubs to access bulk student uploads, group metrics, attendance tracking, and consolidated certificate verification templates. Use the 'Contact Team' form to get started." },
    { q: "What is your refund policy?", a: "Since all certifications and downloadable scorecards are delivered digitally upon passing assessments, please refer to our general terms or contact support for billing clarifications." },
    { q: "Are the credentials recognized by employers?", a: "Yes. SkillIntern provides tamper-proof, verified digital credentials that detail the student's actual test score and project validations, providing concrete proof of competence that recruiters appreciate." }
  ];

  const documentItems = [
    {
      title: "Consent Form",
      description: "Print consent form and sign it before submitting to your college.",
      icon: FileText,
      fileType: "PDF Template",
      iconColor: "text-indigo-600",
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

  return (
    <div className="relative min-h-screen flex flex-col bg-slate-50 text-zinc-800 overflow-x-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-grid-pattern opacity-100 pointer-events-none" />
      <div className="absolute inset-0 radial-fade pointer-events-none" />

      {/* Ambient Glowing Orbs */}
      <div className="absolute top-[5%] left-[10%] -z-10 h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="absolute top-[40%] right-[5%] -z-10 h-[600px] w-[600px] rounded-full bg-violet-500/5 blur-[140px] pointer-events-none animate-pulse-glow" style={{ animationDelay: "-3s" }} />

      <Navbar />

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8 min-h-[75vh]">

            {/* Left Column: Heading & CTAs */}
            <div className="flex-grow lg:w-1/2 text-left space-y-6">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50/50 px-4 py-1.5 text-xs font-bold text-indigo-700 shadow-sm animate-float">
                <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                <span>Enterprise Certification Hub</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-900 leading-[1.1]">
                Accelerate Career Paths With <span className="text-indigo-600">Verified Internships</span>
              </h1>

              <p className="text-base sm:text-lg text-zinc-550 font-light leading-relaxed max-w-xl">
                Bridge the academic-industry gap. Attempt conceptual MCQ evaluations, validate your domain skills, and generate tamper-proof credentials trusted by recruiters.
              </p>

              {/* Core Hero Trust Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-zinc-200/60 max-w-lg">
                <div>
                  <p className="text-xl font-extrabold text-zinc-900">24,000+</p>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Students</p>
                </div>
                <div>
                  <p className="text-xl font-extrabold text-indigo-650">48+</p>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Colleges</p>
                </div>
                <div>
                  <p className="text-xl font-extrabold text-violet-600">25+</p>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Tracks</p>
                </div>
                <div>
                  <p className="text-xl font-extrabold text-emerald-600">94.2%</p>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Pass Rate</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-2">
                <Link
                  href="/auth/register"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 px-7 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-500/10 transition-all active:scale-95 cursor-pointer"
                >
                  Start Internship Track
                  <ArrowRight className="h-4.5 w-4.5" />
                </Link>
                <Link
                  href="/contact"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-zinc-205 bg-white hover:bg-zinc-50 px-7 py-4 text-sm font-bold text-zinc-650 hover:text-zinc-800 transition-all active:scale-95 shadow-sm cursor-pointer"
                >
                  Contact Advisor
                </Link>
              </div>
            </div>

            {/* Right Column: Floating Dashboard Preview Animation */}
            <div className="w-full lg:w-1/2 flex justify-center">
              <div className="relative w-full max-w-lg aspect-[4/3] glass-panel bg-white border border-zinc-200/80 rounded-3xl shadow-xl overflow-hidden animate-float">
                {/* Header of mockup */}
                <div className="flex h-12 items-center justify-between px-5 border-b border-zinc-150 bg-zinc-50/50">
                  <div className="flex gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-red-400" />
                    <span className="h-3 w-3 rounded-full bg-amber-400" />
                    <span className="h-3 w-3 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">SkillIntern Dashboard</span>
                  <span className="h-5 w-16 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[9px] text-indigo-600 font-bold uppercase">Mock View</span>
                </div>

                {/* Dashboard body grid */}
                <div className="p-4 sm:p-6 grid grid-cols-3 gap-4 h-[calc(100%-3rem)]">
                  {/* Left mini sidebar */}
                  <div className="col-span-1 border-r border-zinc-100 pr-3 space-y-2 text-[10px] font-bold text-zinc-500">
                    <div className="p-2 rounded-lg bg-indigo-600 text-white flex items-center gap-1.5">
                      <BarChart2 className="h-3.5 w-3.5" />
                      <span>Overview</span>
                    </div>
                    <div className="p-2 rounded-lg hover:bg-zinc-50 flex items-center gap-1.5 transition-all">
                      <Briefcase className="h-3.5 w-3.5" />
                      <span>Tracks</span>
                    </div>
                    <div className="p-2 rounded-lg hover:bg-zinc-50 flex items-center gap-1.5 transition-all">
                      <Award className="h-3.5 w-3.5" />
                      <span>Certificates</span>
                    </div>
                  </div>

                  {/* Right core area */}
                  <div className="col-span-2 space-y-4">
                    {/* Welcome card */}
                    <div className="p-3 bg-indigo-50/40 border border-indigo-100/50 rounded-xl space-y-1">
                      <p className="text-[9px] font-bold text-indigo-600 uppercase">Welcome Back</p>
                      <p className="text-xs font-extrabold text-zinc-900">Rahul Sharma</p>
                    </div>

                    {/* Progress tracking */}
                    <div className="p-3 bg-zinc-50 border border-zinc-200/60 rounded-xl space-y-2">
                      <div className="flex justify-between text-[9px] font-bold">
                        <span className="text-zinc-500">Active: React Developer</span>
                        <span className="text-indigo-600">78% Done</span>
                      </div>
                      <div className="w-full h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600 w-[78%] rounded-full" />
                      </div>
                    </div>

                    {/* Glowing Credential Badge */}
                    <div className="p-3 border border-emerald-200 bg-emerald-50/30 rounded-xl flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="text-[8px] font-bold text-emerald-600 uppercase">Verification Status</p>
                        <p className="text-[10px] font-extrabold text-zinc-900">SI-2026-REACT</p>
                      </div>
                      <span className="h-6 px-2 rounded bg-emerald-100 text-emerald-700 text-[8px] font-bold flex items-center justify-center shrink-0">✓ Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* COMPARISON: TRADITIONAL VS SKILLINTERN */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 relative z-10 border-t border-zinc-200/60 mt-12">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs text-indigo-600 font-bold uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full">Methodology comparison</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
              A Shift Toward Practical Competence
            </h2>
            <p className="text-zinc-500 text-sm sm:text-base font-light">
              Traditional certificates verify attendance; SkillIntern certifies actual skill validation and performance scores.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Traditional learning card */}
            <div className="glass-panel border border-red-200/80 bg-red-50/10 rounded-3xl p-6 sm:p-8 space-y-6">
              <h3 className="text-lg font-bold text-red-700 uppercase tracking-wider flex items-center gap-2">
                Traditional Certificates
              </h3>
              <ul className="space-y-4">
                {[
                  "Focus on theoretical learning and textbook concepts",
                  "Minimal hands-on project experience or industrial checks",
                  "Assessments are easily bypassed or plagiarized",
                  "Generic credentials that recruiters cannot instantly verify",
                  "No pathway for continuous mentorship or scorecards"
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-2.5 items-start text-xs sm:text-sm text-zinc-550 leading-relaxed font-light">
                    <span className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center shrink-0 text-red-600 font-bold">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* SkillIntern learning card */}
            <div className="glass-panel border border-emerald-300 bg-emerald-50/10 rounded-3xl p-6 sm:p-8 space-y-6">
              <h3 className="text-lg font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-2">
                The SkillIntern Standard
              </h3>
              <ul className="space-y-4">
                {[
                  "Strict focus on functional code implementation and design outputs",
                  "Mandatory validation checks using real build specifications",
                  "Timed MCQ evaluations with tab-switching lock protections",
                  "100% tamper-proof certificates verifiable instantly by QR/ID",
                  "Detailed downloadable scorecards showing breakdown of marks"
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-2.5 items-start text-xs sm:text-sm text-zinc-800 leading-relaxed font-semibold">
                    <span className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-600 font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* EMOTIONAL CAREER CONVERSION SECTION */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 relative z-10 border-t border-zinc-200/60 mt-12">
          <div className="glass-panel bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-10 relative overflow-hidden flex flex-col lg:flex-row items-center gap-10">
            <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-indigo-500/[0.02] blur-3xl pointer-events-none" />

            <div className="lg:w-7/12 space-y-5 text-left">
              <span className="text-xs text-indigo-650 font-bold uppercase tracking-wider block">Career realities</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight leading-snug">
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

            <div className="lg:w-5/12 w-full bg-zinc-50 border border-zinc-200/80 p-5 rounded-2xl space-y-4">
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
        </section>

        {/* HOW IT WORKS: TIMELINE UI */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 relative z-10 border-t border-zinc-200/60 mt-12">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs text-indigo-650 font-bold uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full">Interactive Journey</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
              The Path to Verified Credentials
            </h2>
            <p className="text-zinc-500 text-sm font-light">
              Follow our step-by-step verified curriculum pipeline to qualify and build your industry authority.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {timelineSteps.map((step, idx) => (
              <div
                key={idx}
                className="glass-card bg-white border border-zinc-200/80 rounded-2xl p-5 space-y-4 relative group"
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
        </section>

        {/* SAAS INTERNSHIP TRACKS GRID */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 relative z-10 border-t border-zinc-200/60 mt-12">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs text-indigo-650 font-bold uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full">Domain certification programs</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
              Internship Tracks & Pathways
            </h2>
            <p className="text-zinc-500 text-sm font-light">
              Enroll in a structured pathway. Pass conceptual requirements to instantly unlock your credentials.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {tracks.map((track, idx) => (
              <div
                key={idx}
                className="glass-card bg-white border border-zinc-200/85 rounded-2xl p-5 flex flex-col justify-between hover:border-indigo-500/20 hover:scale-101 transition-all"
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
                  <Link
                    href="/auth/register"
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    Enroll Now
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PLATFORM FEATURES SECTION */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 relative z-10 border-t border-zinc-200/60 mt-12">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs text-indigo-650 font-bold uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full">Platform Architecture</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
              Enterprise SaaS Infrastructure
            </h2>
            <p className="text-zinc-500 text-sm font-light">
              Highly secure, reliable, and compliant certification workflow tools.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="glass-card bg-white border border-zinc-200/80 rounded-2xl p-6 space-y-3 hover:shadow-sm transition-shadow">
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4 className="text-base font-bold text-zinc-900">{f.title}</h4>
                  <p className="text-xs text-zinc-550 leading-relaxed font-light">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* LIVE PLATFORM PREVIEW TABS */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 relative z-10 border-t border-zinc-200/60 mt-12">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="text-xs text-indigo-650 font-bold uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full">Interface sneak peek</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
              Live Platform Previews
            </h2>
            <p className="text-zinc-500 text-sm font-light">
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
          <div className="max-w-4xl mx-auto glass-panel bg-white border border-zinc-200/80 rounded-3xl p-4 sm:p-8 min-h-[300px] shadow-sm flex flex-col justify-center">
            {activeTab === "dashboard" && (
              <div className="space-y-4 text-left">
                <span className="text-[10px] font-bold text-indigo-600 uppercase">Interactive Preview</span>
                <h3 className="text-xl font-extrabold text-zinc-900">Student Dashboard Overview</h3>
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
              <div className="space-y-4 text-left">
                <span className="text-[10px] font-bold text-violet-600 uppercase">Interactive Preview</span>
                <h3 className="text-xl font-extrabold text-zinc-900">Concept Assessment Portal</h3>
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
              <div className="space-y-4 text-left">
                <span className="text-[10px] font-bold text-emerald-600 uppercase">Interactive Preview</span>
                <h3 className="text-xl font-extrabold text-zinc-900">Verified Credentials Page</h3>
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
              <div className="space-y-4 text-left">
                <span className="text-[10px] font-bold text-amber-600 uppercase">Interactive Preview</span>
                <h3 className="text-xl font-extrabold text-zinc-900">Platform Analytics Console</h3>
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
        </section>

        {/* CERTIFICATE VERIFICATION SHOWCASE (REAL-TIME INPUT MOCKUP) */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 relative z-10 border-t border-zinc-200/60 mt-12">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs text-indigo-650 font-bold uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full">Secure trust verification</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
              Instant Certificate Verification
            </h2>
            <p className="text-zinc-500 text-sm font-light">
              Employers and institutions can enter a certificate credential ID below to instantly verify candidates.
            </p>
          </div>

          <div className="max-w-2xl mx-auto glass-panel bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md relative overflow-hidden">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-emerald-500/[0.01] blur-2xl pointer-events-none" />

            <form onSubmit={handleVerifySearch} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-grow">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Enter Certificate Verification ID (e.g. SI-2026-REACT)"
                  value={certId}
                  onChange={(e) => setCertId(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 text-sm bg-white border border-zinc-205 focus:border-indigo-500/50 rounded-xl outline-none text-zinc-800 transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={verifying}
                className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-6 py-3.5 transition-all cursor-pointer shadow-sm shadow-indigo-650/10 shrink-0"
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
        </section>

        {/* INTERNSHIP DOCUMENTS LIBRARY SECTION */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 relative z-10 border-t border-zinc-200/60 mt-12">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs text-indigo-650 font-bold uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full">Academic Compliance</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight flex items-center justify-center gap-2">
              <FolderOpen className="h-7 w-7 text-indigo-650" /> Internship Documents
            </h2>
            <p className="text-zinc-500 text-sm font-light">
              Download all important forms, reports and certificates required for your college internship validation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {documentItems.map((doc, idx) => {
              const Icon = doc.icon;
              return (
                <div
                  key={idx}
                  className="group relative glass-panel bg-white border border-zinc-200/80 rounded-3xl p-6 hover:border-indigo-200 hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  <div className={`absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-10 group-hover:scale-150 transition-all duration-500 ${doc.bgColor}`} />

                  <div className="space-y-4 relative z-10 text-left">
                    <div className={`h-11 w-11 rounded-2xl flex items-center justify-center border transition-all duration-300 group-hover:scale-110 ${doc.iconColor} ${doc.borderColor} ${doc.bgColor}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-sm font-bold text-zinc-900 group-hover:text-indigo-650 transition-colors flex items-center gap-1.5">
                        {doc.title}
                      </h3>
                      <p className="text-xs text-zinc-500 font-light leading-relaxed min-h-[36px]">
                        {doc.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-zinc-100 mt-4 flex items-center justify-between relative z-10">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{doc.fileType}</span>
                    <Link
                      href="/auth/login"
                      className="text-xs text-indigo-650 hover:text-indigo-700 font-bold flex items-center gap-1 group/btn transition-colors cursor-pointer"
                    >
                      <span>Get Document</span>
                      <ArrowRight className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>



        {/* TESTIMONIALS SECTION */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 relative z-10 border-t border-zinc-200/60 mt-12">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs text-indigo-650 font-bold uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full">Stakeholder feedback</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
              Trusted by Students & Faculty
            </h2>
            <p className="text-zinc-500 text-sm font-light">
              Read how candidates and administrators utilize verified SkillIntern credentials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Student review */}
            <div className="glass-card bg-white border border-zinc-200/80 rounded-2xl p-6 flex flex-col justify-between hover:shadow-xs transition-shadow">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">P</div>
                  <div>
                    <h5 className="text-xs font-bold text-zinc-900">Priya Patel</h5>
                    <p className="text-[9px] text-zinc-400 font-medium">Student, Computer Science</p>
                  </div>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed font-light italic">
                  &ldquo;SkillIntern solved my internship mandate. The Web Development track guidelines were clear, and passing the timed assessment generated my verified certificate instantly. Employers verified it without delays!&rdquo;
                </p>
              </div>
              <span className="text-[10px] font-bold text-indigo-600 block mt-4 uppercase tracking-wider">✓ Verified Student</span>
            </div>

            {/* Faculty review */}
            <div className="glass-card bg-white border border-zinc-200/80 rounded-2xl p-6 flex flex-col justify-between hover:shadow-xs transition-shadow">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600 font-bold text-xs">R</div>
                  <div>
                    <h5 className="text-xs font-bold text-zinc-900">Prof. Rajesh Kumar</h5>
                    <p className="text-[9px] text-zinc-400 font-medium">Head of Placement, Engineering</p>
                  </div>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed font-light italic">
                  &ldquo;We uploaded student indices in bulk and monitored evaluations. Using SkillIntern ensures students complete their assessments fairly, and gives our placements team concrete validation of student readiness.&rdquo;
                </p>
              </div>
              <span className="text-[10px] font-bold text-violet-600 block mt-4 uppercase tracking-wider">✓ Verified Faculty</span>
            </div>

            {/* Recruiter review */}
            <div className="glass-card bg-white border border-zinc-200/80 rounded-2xl p-6 flex flex-col justify-between hover:shadow-xs transition-shadow">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs">M</div>
                  <div>
                    <h5 className="text-xs font-bold text-zinc-900">Meera Sen</h5>
                    <p className="text-[9px] text-zinc-400 font-medium">Senior Talent Acquisition Partner</p>
                  </div>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed font-light italic">
                  &ldquo;Credential fraud is a massive challenge in volume hiring. SkillIntern's QR-code and unique ID lookup portals allow my onboarding team to verify candidate scorecards instantly, reducing check times from weeks to seconds.&rdquo;
                </p>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 block mt-4 uppercase tracking-wider">✓ Verified Recruiter</span>
            </div>
          </div>
        </section>

        {/* ACCORDION FAQ SECTION */}
        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 relative z-10 border-t border-zinc-200/60 mt-12">
          <div className="text-center mb-12 space-y-3">
            <span className="text-xs text-indigo-650 font-bold uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full">Got questions?</span>
            <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-zinc-500 text-sm font-light">
              Everything you need to know about the SkillIntern platform and credential standards.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white border border-zinc-200/80 rounded-2xl overflow-hidden shadow-xs hover:border-zinc-300 transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex justify-between items-center p-5 text-left text-xs sm:text-sm font-bold text-zinc-800 cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="h-4 w-4 text-indigo-600 shrink-0" /> : <ChevronDown className="h-4 w-4 text-zinc-400 shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-zinc-550 leading-relaxed font-light border-t border-zinc-100/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* FINAL HERO CTA CARD */}
        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 relative z-10">
          <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-650 p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-xl shadow-indigo-600/10">
            <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-white/[0.03] blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-white/[0.03] blur-3xl pointer-events-none" />

            <div className="max-w-2xl mx-auto space-y-6 relative z-10">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Ready To Build Your Career?</h2>
              <p className="text-sm sm:text-base text-indigo-50 leading-relaxed font-light">
                Join SkillIntern today, take your vocational assessments, and obtain practical experience credentials that employers actually value.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
                <Link
                  href="/auth/register"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-zinc-50 px-8 py-3.5 text-xs font-bold text-indigo-600 transition-all active:scale-95 cursor-pointer"
                >
                  Start Internship Track
                </Link>
                <Link
                  href="/contact"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 px-8 py-3.5 text-xs font-bold text-white transition-all active:scale-95 cursor-pointer"
                >
                  Contact Team
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
