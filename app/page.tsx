/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/set-state-in-effect */
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
  FolderOpen,
  Lock,
  Eye,
  Download
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const iconsPool = [GraduationCap, BookOpen, Award, ShieldCheck, FileText];
const floatingIcons = Array.from({ length: 400 }, (_, idx) => {
  const Icon = iconsPool[idx % iconsPool.length];
  const top = `${(idx * 0.24) + 2}%`; // Vertically dispersed across page height
  const left = `${((idx * 17) % 94) + 3}%`; // Distributed across full screen width
  const size = ((idx * 3) % 12) + 16; // Subtle sizes (16px to 28px)
  const delay = `${((idx * 0.15) % 8).toFixed(2)}s`; // Staggered delays
  const duration = `${(((idx * 1.3) % 6) + 8).toFixed(2)}s`; // Diverse speeds
  return {
    icon: Icon,
    top,
    left,
    size,
    delay,
    duration
  };
});

export default function Home() {
  // 1. FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(null);



  // 4. Internship Tracks Expand/Collapse state
  const [isExpanded, setIsExpanded] = useState(false);

  // 5. Notion/Drive-style collapsed categories state
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({
    Forms: false,
    Letters: false,
    Records: false,
    Reports: false
  });

  // 6. Active track category state
  const [activeTrackCategory, setActiveTrackCategory] = useState("Engineering");

  const stats = [
    { label: "Active Students Enrolled", value: "24,000+", icon: Users, color: "text-indigo-600 bg-indigo-50 border-indigo-100" },
    { label: "Partner Institutions", value: "48+", icon: GraduationCap, color: "text-violet-600 bg-violet-50 border-violet-100" },
    { label: "SaaS Career Tracks", value: "25+", icon: Briefcase, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
    { label: "Platform Assessment Bank", value: "500+", icon: Zap, color: "text-amber-600 bg-amber-50 border-amber-100" },
  ];

  const tracks = [
    { title: "Web Development", duration: "120 Hrs", level: "Beginner to Advanced", projects: "8 Real-world Projects", category: "Engineering" },
    { title: "Python Programming", duration: "120 Hrs", level: "Beginner to Intermediate", projects: "5 Scripting Projects", category: "Development" },
    { title: "Artificial Intelligence", duration: "120 Hrs", level: "Advanced", projects: "4 ML/Deep Learning Models", category: "Data & AI" },
    { title: "Cyber Security", duration: "120 Hrs", level: "Intermediate", projects: "6 Penetration Testing Audits", category: "Security" },
    { title: "Data Science", duration: "120 Hrs", level: "Intermediate to Advanced", projects: "5 Data Analysis Pipelines", category: "Data & AI" },
    { title: "Digital Marketing", duration: "120 Hrs", level: "Beginner", projects: "3 SEO & Ad Campaign Audits", category: "Business" },
    { title: "UI/UX Product Design", duration: "120 Hrs", level: "Beginner to Intermediate", projects: "4 High-Fidelity Prototypes", category: "Design" },
    { title: "Cloud Computing", duration: "120 Hrs", level: "Intermediate", projects: "5 Cloud Deployment Architectures", category: "Engineering" },
    { title: "Finance & Accounting", duration: "120 Hrs", level: "Beginner to Intermediate", projects: "3 Portfolio Valuation Reports", category: "Business" },
    { title: "Human Resources (HR)", duration: "120 Hrs", level: "Beginner", projects: "4 Corporate Hiring Pipelines", category: "Business" },
    { title: "Entrepreneurship", duration: "120 Hrs", level: "Intermediate", projects: "2 Business Model Canvas Plans", category: "Management" }
  ];

  const timelineSteps = [
    { num: "01", title: "Registration", desc: "Create your secure candidate profile on the IQ Intern platform in under 2 minutes." },
    { num: "02", title: "Profile Completion", desc: "Provide your institutional records, college stream, roll number, and credentials." },
    { num: "03", title: "Internship Selection", desc: "Browse and choose from our 25+ industry-aligned career tracks spanning multiple domains." },
    { num: "04", title: "Learning Access", desc: "Unlock curriculum guidelines, project requirements, and industry-oriented reference checklists." },
    { num: "05", title: "Assessments", desc: "Attempt the rigorous timed MCQ assessments to test and validate your engineering concepts." },
    { num: "06", title: "Evaluation & Grading", desc: "Pass with a score of 40% or higher to successfully clear the track evaluation." },
    { num: "07", title: "Career Opportunities", desc: "Share your verified performance scorecards and academic documents with recruiters to accelerate your placement path." }
  ];

  const faqs = [
    { q: "What is the typical internship duration on IQ Intern?", a: "Most of our standard career tracks are designed to span between 6 to 16 weeks (typically 3 months), requiring approximately 120 hours of curriculum work and project validation." },
    { q: "What is the assessment process?", a: "Assessments consist of timed 5-minute MCQ tests covering core engineering, business, and design concepts. You must score 40% or higher to pass. If you fail, you can review the guidelines and retake the test." },
    { q: "Can academic institutions partner with IQ Intern?", a: "Yes. Colleges can establish partnership hubs to access bulk student uploads, group metrics, attendance tracking, and consolidated student reports. Use the 'Contact Team' form to get started." },
    { q: "What is your refund policy?", a: "Since all downloadable scorecards and forms are delivered digitally upon passing assessments, please refer to our general terms or contact support for billing clarifications." },
    { q: "Are the evaluation scorecards recognized by employers?", a: "Yes. IQ Intern provides detailed performance scorecards that detail the student's actual test score and project validations, providing concrete proof of competence that recruiters appreciate." }
  ];

  const documentItems = [
    {
      title: "Consent Form",
      description: "Print consent form and sign it before submitting to your college.",
      icon: FileText,
      fileType: "PDF Template",
      category: "Forms",
      status: "Available"
    },
    {
      title: "Feedback Form",
      description: "Share your internship experience and rate the curriculum.",
      icon: MessageSquare,
      fileType: "Online Form",
      category: "Forms",
      status: "Pending"
    },
    {
      title: "Acceptance Letter",
      description: "Official internship acceptance letter by IQIntern for your college.",
      icon: Mail,
      fileType: "Official Letter",
      category: "Letters",
      status: "Available"
    },
    {
      title: "Fee Receipt",
      description: "Download and print internship fee payment receipt.",
      icon: CreditCard,
      fileType: "Invoice Receipt",
      category: "Letters",
      status: "Available"
    },
    {
      title: "Daily Log",
      description: "Internship activity logbook for daily tasks and learnings.",
      icon: BookOpen,
      fileType: "Logbook Template",
      category: "Records",
      status: "Available"
    },
    {
      title: "Attendance Sheet",
      description: "Download attendance record signed by the mentor.",
      icon: Calendar,
      fileType: "Attendance Log",
      category: "Records",
      status: "Available"
    },
    {
      title: "Report Format",
      description: "Standard guidelines and structure for internship report submission.",
      icon: Clipboard,
      fileType: "DOCX Format",
      category: "Reports",
      status: "Available"
    }
  ];


  const renderRelatedTrackRow = (track: any, rIdx: number) => {
    return (
      <div
        key={track.title}
        className="flex flex-col sm:flex-row sm:items-center justify-between py-3 px-4 hover:bg-zinc-50/80 rounded-xl transition-all duration-200 group border-b border-zinc-100/50 last:border-0 gap-3"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="h-8 w-8 rounded-lg bg-zinc-100 text-zinc-500 flex items-center justify-center shrink-0 group-hover:bg-indigo-50 group-hover:text-indigo-650 transition-colors duration-200">
            <Briefcase className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <span className="text-sm font-semibold text-zinc-750 truncate group-hover:text-zinc-950 transition-colors duration-200">
              {track.title}
            </span>
            <p className="text-[11px] text-zinc-450 truncate hidden md:block mt-0.5 font-light">
              {track.duration} • {track.level} • {track.projects}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
          <span className="text-[10px] font-bold text-emerald-650 bg-emerald-50 border border-emerald-150 px-2 py-0.5 rounded-full">
            Certified
          </span>
          <Link
            href="/auth/register"
            className="text-xs text-indigo-650 hover:text-indigo-750 font-bold px-3 py-1 hover:bg-indigo-50/50 rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-1"
          >
            <span>Enroll Now</span>
            <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col text-zinc-800 overflow-x-hidden pt-12">
      {/* Floating Ambient Trust/Education Symbols */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-20">
        {floatingIcons.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="absolute text-indigo-700/18 float-bg-icon"
              style={{
                top: item.top,
                left: item.left,
                // @ts-ignore
                "--delay": item.delay,
                // @ts-ignore
                "--duration": item.duration,
              }}
            >
              <Icon size={item.size} strokeWidth={1.6} />
            </div>
          );
        })}
      </div>
      <Navbar />

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="mx-auto max-w-7xl px-4 pt-28 pb-16 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8 min-h-[70vh]">

            {/* Left Column: Heading & CTAs */}
            <div className="flex-grow lg:w-1/2 text-left space-y-6 animate-slide-up">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200/80 bg-indigo-50/50 px-4 py-1.5 text-xs font-bold text-indigo-700 shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                <span>Enterprise Evaluation Hub</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-900 leading-[1.1]">
                Accelerate Career Paths With <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-500 bg-clip-text text-transparent">Verified Internships</span>
              </h1>

              <p className="text-base sm:text-lg text-zinc-500 font-light leading-relaxed max-w-xl">
                Bridge the academic-industry gap. Attempt conceptual MCQ evaluations, validate your domain skills, and download verified evaluation scorecards.
              </p>

              {/* Core Hero Trust Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-zinc-200/60 max-w-lg">
                <div>
                  <p className="text-2xl font-black text-zinc-900">24,000+</p>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Students</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-indigo-600">48+</p>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Colleges</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-violet-600">25+</p>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Tracks</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-emerald-500">94.2%</p>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Pass Rate</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <Link
                  href="/auth/register"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-500 hover:from-indigo-700 hover:to-violet-600 px-7 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-all cursor-pointer hover:shadow-indigo-500/35"
                >
                  Start Internship Track
                  <ArrowRight className="h-4.5 w-4.5" />
                </Link>
                <Link
                  href="/contact"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 px-7 py-4 text-sm font-bold text-zinc-650 hover:text-zinc-800 transition-all shadow-xs cursor-pointer"
                >
                  Contact Advisor
                </Link>
              </div>
            </div>

            {/* Right Column: Floating Dashboard Preview Animation */}
            <div className="w-full lg:w-1/2 flex justify-center animate-slide-up" style={{ animationDelay: "150ms" }}>
              <div className="relative w-full max-w-lg aspect-[4/3] glass-panel bg-white/90 border border-zinc-200/80 rounded-3xl shadow-2xl overflow-hidden animate-float">
                {/* Header of mockup */}
                <div className="flex h-12 items-center justify-between px-5 border-b border-zinc-150 bg-zinc-50/50">
                  <div className="flex gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-red-400" />
                    <span className="h-3 w-3 rounded-full bg-amber-400" />
                    <span className="h-3 w-3 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">IQ Intern Dashboard</span>
                  <span className="h-5 w-16 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[9px] text-indigo-650 font-bold uppercase">Mock View</span>
                </div>

                {/* Dashboard body grid */}
                <div className="p-4 sm:p-6 grid grid-cols-3 gap-4 h-[calc(100%-3rem)]">
                  {/* Left mini sidebar */}
                  <div className="col-span-1 border-r border-zinc-100 pr-3 space-y-2 text-[10px] font-bold text-zinc-550">
                    <div className="p-2.5 rounded-xl bg-indigo-600 text-white flex items-center gap-1.5 shadow-sm shadow-indigo-600/25">
                      <BarChart2 className="h-3.5 w-3.5" />
                      <span>Overview</span>
                    </div>
                    <div className="p-2.5 rounded-xl hover:bg-zinc-50 flex items-center gap-1.5 transition-all cursor-pointer">
                      <Briefcase className="h-3.5 w-3.5 text-zinc-400" />
                      <span>Tracks</span>
                    </div>
                    <div className="p-2.5 rounded-xl hover:bg-zinc-50 flex items-center gap-1.5 transition-all cursor-pointer">
                      <FileText className="h-3.5 w-3.5 text-zinc-400" />
                      <span>Documents</span>
                    </div>
                  </div>

                  {/* Right core area */}
                  <div className="col-span-2 space-y-4">
                    {/* Welcome card */}
                    <div className="p-3.5 bg-indigo-50/40 border border-indigo-100/50 rounded-2xl space-y-1">
                      <p className="text-[9px] font-bold text-indigo-600 uppercase tracking-wider">Welcome Back</p>
                      <p className="text-xs font-extrabold text-zinc-900">Rahul Sharma</p>
                    </div>

                    {/* Progress tracking */}
                    <div className="p-3.5 bg-zinc-50 border border-zinc-200/60 rounded-2xl space-y-2">
                      <div className="flex justify-between text-[9px] font-bold">
                        <span className="text-zinc-500">Active: React Developer</span>
                        <span className="text-indigo-650 font-extrabold">78% Done</span>
                      </div>
                      <div className="w-full h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600 w-[78%] rounded-full" />
                      </div>
                    </div>

                    {/* Glowing Enrollment Badge */}
                    <div className="p-3 border border-indigo-200 bg-indigo-50/50 rounded-2xl flex items-center justify-between shadow-xs">
                      <div className="space-y-0.5">
                        <p className="text-[8px] font-bold text-indigo-650 uppercase">Enrolled Track</p>
                        <p className="text-[10px] font-extrabold text-zinc-850 font-mono">SI-2026-REACT</p>
                      </div>
                      <span className="h-6 px-2.5 rounded-lg bg-indigo-100 text-indigo-750 text-[8px] font-bold flex items-center justify-center shrink-0 uppercase">Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* COMPARISON: TRADITIONAL VS IQINTERN */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 relative z-10 border-t border-zinc-200/60 mt-12">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs text-indigo-650 font-bold uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">Methodology comparison</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
              A Shift Toward Practical Competence
            </h2>
            <p className="text-zinc-500 text-sm sm:text-base font-light">
              Traditional certificates verify attendance; IQ Intern certifies actual skill validation and performance scores.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Traditional learning card */}
            <div className="glass-panel border border-red-200 bg-red-50/5 rounded-3xl p-6 sm:p-8 space-y-6">
              <h3 className="text-base font-bold text-red-650 uppercase tracking-wider flex items-center gap-2">
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
                  <li key={idx} className="flex gap-3 items-start text-xs sm:text-sm text-zinc-500 leading-relaxed font-light">
                    <span className="h-5 w-5 rounded-full bg-red-50 border border-red-100 flex items-center justify-center shrink-0 text-red-500 font-bold text-xs">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* IQ Intern learning card */}
            <div className="glass-panel border border-emerald-250 bg-emerald-50/5 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md shadow-emerald-500/5">
              <h3 className="text-base font-bold text-emerald-650 uppercase tracking-wider flex items-center gap-2">
                The IQ Intern Standard
              </h3>
              <ul className="space-y-4">
                {[
                  "Strict focus on functional code implementation and design outputs",
                  "Mandatory validation checks using real build specifications",
                  "Timed MCQ evaluations with tab-switching lock protections",
                  "100% tamper-proof certificates verifiable instantly by QR/ID",
                  "Detailed downloadable scorecards showing breakdown of marks"
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-3 items-start text-xs sm:text-sm text-zinc-700 leading-relaxed font-semibold">
                    <span className="h-5 w-5 rounded-full bg-emerald-50 border border-emerald-150 flex items-center justify-center shrink-0 text-emerald-650 font-bold text-xs">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* EMOTIONAL CAREER CONVERSION SECTION */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 relative z-10 border-t border-zinc-200/60 mt-12">
          <div className="glass-panel bg-white/95 border border-zinc-200/80 rounded-3xl p-6 sm:p-10 relative overflow-hidden flex flex-col lg:flex-row items-center gap-10">
            <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-indigo-500/[0.02] blur-3xl pointer-events-none" />

            <div className="lg:w-7/12 space-y-5 text-left">
              <span className="text-xs text-indigo-650 font-bold uppercase tracking-wider block">Career realities</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight leading-snug">
                Why Verified Practical Internships are No Longer Optional
              </h2>
              <p className="text-zinc-550 text-xs sm:text-sm leading-relaxed font-light">
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

            <div className="lg:w-5/12 w-full bg-slate-50 border border-zinc-200/80 p-6 rounded-2xl space-y-4">
              <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Employment Gap Solutions</h4>
              <div className="space-y-3 text-xs text-zinc-500 font-light leading-relaxed">
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
        <section className="relative z-10 mt-12" style={{ background: '#264367' }}>
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs text-yellow-300 font-bold uppercase tracking-wider bg-yellow-400/20 px-3 py-1 rounded-full border border-yellow-400/40">Interactive Journey</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              The Path to Verified Credentials
            </h2>
            <p className="text-white/70 text-base font-light">
              Follow our step-by-step verified curriculum pipeline to qualify and build your industry authority.
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto space-y-8 lg:space-y-12">
            {/* Central Timeline Vertical Line */}
            <div className="absolute left-[20px] lg:left-1/2 -translate-x-1/2 top-4 bottom-4 w-0.5 bg-gradient-to-b from-yellow-400 via-white to-yellow-400 rounded-full z-0 opacity-60" />

            {timelineSteps.map((step, idx) => {
              const isRight = idx % 2 === 1;
              return (
                <div
                  key={idx}
                  className={`relative flex flex-col lg:flex-row items-start lg:items-center justify-between w-full ${isRight ? "lg:flex-row-reverse" : ""
                    }`}
                >
                  {/* Timeline Connector Node (Middle) */}
                  <div className="absolute left-[20px] lg:left-1/2 -translate-x-1/2 top-5 lg:top-auto z-10 flex items-center justify-center">
                    <span className="relative flex h-5 w-5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-5 w-5 bg-yellow-400 border-4 border-white shadow-md"></span>
                    </span>
                  </div>

                  {/* Timeline Card Container */}
                  <div className="w-full lg:w-[calc(50%-2rem)] pl-12 lg:pl-0">
                    <div className="rounded-2xl p-5 space-y-3 relative group hover:-translate-y-1 transition-all duration-300 border border-white/20 hover:border-yellow-400/60 hover:shadow-lg hover:shadow-yellow-400/10" style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)' }}>
                      {/* Card Header */}
                      <div className="flex justify-between items-center">
                        <span className="text-base font-black text-yellow-300 bg-yellow-400/20 rounded-xl px-2.5 py-0.5 font-mono border border-yellow-400/30 shadow-sm">{step.num}</span>
                        <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Phase {idx + 1}</span>
                      </div>

                      {/* Card Content */}
                      <div>
                        <h4 className="text-sm font-bold text-white mb-1 group-hover:text-yellow-300 transition-colors">{step.title}</h4>
                        <p className="text-xs text-white/60 leading-relaxed font-light">{step.desc}</p>
                      </div>
                    </div>
                  </div>

                  {/* Spacer for desktop layout (to keep alternating cards aligned) */}
                  <div className="hidden lg:block w-[calc(50%-2rem)]" />
                </div>
              );
            })}
          </div>
          </div>
        </section>

        {/* SAAS INTERNSHIP TRACKS GRID */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 relative z-10 border-t border-zinc-200/60 mt-12">
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
            <span className="text-xs text-indigo-650 font-bold uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">Domain certification programs</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
              Internship Tracks & Pathways
            </h2>
            <p className="text-zinc-500 text-base font-light">
              Enroll in a structured pathway. Pass conceptual requirements to instantly unlock your credentials.
            </p>
          </div>

          {/* Category Tabs/Pills */}
          <div className="flex justify-center mb-10">
            <div className="flex items-center gap-1.5 bg-zinc-100/80 backdrop-blur-sm border border-zinc-200/50 p-1.5 rounded-2xl max-w-full overflow-x-auto scrollbar-none shadow-sm">
              {["Engineering", "Development", "Data & AI", "Security", "Business", "Design"].map((cat) => {
                const isActive = activeTrackCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveTrackCategory(cat);
                      setIsExpanded(false); // Reset collapse when changing tabs
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer whitespace-nowrap border ${isActive
                        ? "bg-white text-indigo-750 shadow-sm border-zinc-200/50"
                        : "text-zinc-500 hover:text-zinc-850 hover:bg-white/55 border-transparent"
                      }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Featured and Related Tracks Wrapper */}
          {(() => {
            const activeCategoryTracks = tracks.filter(track => {
              if (activeTrackCategory === "Business") {
                return track.category === "Business" || track.category === "Management";
              }
              return track.category === activeTrackCategory;
            });
            const featuredTrack = activeCategoryTracks[0];
            const relatedTracks = activeCategoryTracks.slice(1);

            return (
              <div className="space-y-8">
                {/* Featured Internship Card */}
                {featuredTrack && (
                  <div className="max-w-4xl mx-auto">
                    <div className="group relative rounded-3xl border border-zinc-200 bg-white/70 backdrop-blur-md p-6 sm:p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-indigo-300 hover:-translate-y-1 overflow-hidden">
                      {/* Visual Glassmorphism gradient glow */}
                      <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                        {/* Left content: Title & specs */}
                        <div className="space-y-4 text-left flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-emerald-650 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-0.5 uppercase tracking-wider flex items-center gap-1 shadow-xs">
                              <Check className="h-3 w-3 stroke-[3]" />
                              Certified
                            </span>
                            <span className="text-[10px] font-bold text-indigo-650 bg-indigo-50 border border-indigo-100 rounded-full px-2.5 py-0.5 uppercase tracking-wider">
                              Featured Track
                            </span>
                          </div>

                          <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-900 group-hover:text-indigo-655 transition-colors">
                            {featuredTrack.title}
                          </h3>

                          {/* Metadata specs */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-zinc-100 pt-4 text-xs font-light text-zinc-500">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-lg bg-zinc-50 border border-zinc-150 flex items-center justify-center text-zinc-500 shrink-0">
                                <Clock className="h-4 w-4 text-indigo-500" />
                              </div>
                              <div className="text-left">
                                <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider block">Duration</span>
                                <strong className="text-zinc-700 font-bold">{featuredTrack.duration}</strong>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-lg bg-zinc-50 border border-zinc-150 flex items-center justify-center text-zinc-500 shrink-0">
                                <GraduationCap className="h-4 w-4 text-violet-500" />
                              </div>
                              <div className="text-left">
                                <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider block">Difficulty</span>
                                <strong className="text-zinc-700 font-bold">{featuredTrack.level}</strong>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-lg bg-zinc-50 border border-zinc-150 flex items-center justify-center text-zinc-500 shrink-0">
                                <Sparkles className="h-4 w-4 text-amber-500" />
                              </div>
                              <div className="text-left">
                                <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider block">Curriculum</span>
                                <strong className="text-zinc-700 font-bold">{featuredTrack.projects}</strong>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right side CTA */}
                        <div className="flex flex-col justify-center items-stretch md:items-end gap-3 shrink-0 w-full md:w-auto">
                          <Link
                            href="/auth/register"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-755 px-6 py-3.5 text-xs font-bold text-white shadow-md shadow-indigo-500/10 hover:shadow-lg hover:shadow-indigo-500/25 transition-all cursor-pointer text-center whitespace-nowrap"
                          >
                            Enroll Now
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Related Tracks List */}
                {relatedTracks.length > 0 && (
                  <div className="max-w-4xl mx-auto mt-6">
                    <h4 className="text-xs font-bold text-zinc-450 uppercase tracking-widest text-left mb-3 px-2">
                      Related {activeTrackCategory} Tracks
                    </h4>

                    {/* Related List Container */}
                    <div className="bg-white/40 backdrop-blur-sm border border-zinc-200/50 rounded-2xl p-2.5 shadow-xs space-y-1 text-left">
                      {/* Always show the first related track, and collapse the rest if relatedTracks.length > 1 */}
                      {relatedTracks.slice(0, 1).map((track, rIdx) => renderRelatedTrackRow(track, rIdx))}

                      {/* Collapsible section for other related tracks */}
                      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
                        }`}>
                        <div className="space-y-1 pt-1 border-t border-zinc-150/40 mt-1">
                          {relatedTracks.slice(1).map((track, rIdx) => renderRelatedTrackRow(track, rIdx + 1))}
                        </div>
                      </div>
                    </div>

                    {/* Explore More Toggle Button */}
                    {relatedTracks.length > 1 && (
                      <div className="flex justify-center mt-6">
                        <button
                          onClick={() => setIsExpanded(!isExpanded)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 active:scale-95 text-zinc-500 hover:text-zinc-800 text-xs font-bold shadow-xs transition-all cursor-pointer"
                        >
                          <span>{isExpanded ? "Show Less" : `Explore ${relatedTracks.length - 1} More Track${relatedTracks.length > 2 ? "s" : ""}`}</span>
                          <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })()}
        </section>



        {/* INTERNSHIP DOCUMENTS LIBRARY SECTION */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 relative z-10 border-t border-zinc-200/60 mt-12">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs text-indigo-650 font-bold uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">Academic Compliance</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight flex items-center justify-center gap-2">
              <FolderOpen className="h-7 w-7 text-indigo-650" /> Internship Documents
            </h2>
            <p className="text-zinc-500 text-sm font-light">
              Download all important forms, reports and certificates required for your college internship validation.
            </p>
          </div>

          {/* Progress Timeline Stepper */}
          <div className="mx-auto max-w-5xl mb-12 bg-white/40 backdrop-blur-md border border-zinc-200/50 rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest text-center mb-6">Internship Progress Journey</h3>

            <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-4">
              {/* Desktop Connecting Line */}
              <div className="absolute top-[18px] left-[10%] right-[10%] h-[2px] bg-zinc-200 hidden md:block z-0" />
              <div className="absolute top-[18px] left-[10%] w-[40%] h-[2px] bg-indigo-600 hidden md:block z-0" />

              {/* Mobile Connecting Line */}
              <div className="absolute left-[18px] top-4 bottom-4 w-[2px] bg-zinc-200 md:hidden z-0" />
              <div className="absolute left-[18px] top-4 h-[50%] w-[2px] bg-indigo-600 md:hidden z-0" />

              {[
                { label: "Registration", status: "completed", desc: "Profile setup done" },
                { label: "Payment", status: "completed", desc: "Assessment fee paid" },
                { label: "Internship", status: "active", desc: "Learning & tasks" },
                { label: "Assessment", status: "locked", desc: "Unlock post learning" },
                { label: "Certificate", status: "locked", desc: "Generate post validation" }
              ].map((step, sIdx) => {
                return (
                  <div key={sIdx} className="relative z-10 flex flex-row md:flex-col items-center gap-4 md:gap-2.5 w-full md:w-1/5 text-left md:text-center">
                    {/* Node Icon */}
                    <div className="flex items-center justify-center shrink-0">
                      {step.status === "completed" ? (
                        <div className="h-9 w-9 rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 shadow-sm shadow-emerald-100 transition-all duration-300">
                          <Check className="h-4 w-4 stroke-[3]" />
                        </div>
                      ) : step.status === "active" ? (
                        <div className="h-9 w-9 rounded-full bg-indigo-50 border-2 border-indigo-600 flex items-center justify-center text-indigo-600 shadow-md shadow-indigo-100 relative transition-all duration-300">
                          <span className="absolute -inset-1 rounded-full bg-indigo-500/20 animate-ping" />
                          <Clock className="h-4 w-4" />
                        </div>
                      ) : (
                        <div className="h-9 w-9 rounded-full bg-zinc-50 border-2 border-zinc-250 flex items-center justify-center text-zinc-400 transition-all duration-300">
                          <Lock className="h-3.5 w-3.5" />
                        </div>
                      )}
                    </div>
                    {/* Labels */}
                    <div className="space-y-0.5">
                      <p className={`text-sm font-bold tracking-tight ${step.status === "locked" ? "text-zinc-400" : "text-zinc-800"}`}>
                        {step.label}
                      </p>
                      <p className="text-[11px] text-zinc-400 font-light leading-none">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notion/Drive collapsible document list */}
          <div className="mx-auto max-w-5xl bg-white/60 backdrop-blur-md border border-zinc-200/50 rounded-2xl p-4 md:p-6 shadow-sm">
            {["Forms", "Letters", "Records", "Reports"].map((category) => {
              const isCollapsed = collapsedCategories[category];
              const items = documentItems.filter(d => d.category === category);

              return (
                <div key={category} className="border-b border-zinc-150/60 last:border-0 pb-2 mb-2 last:pb-0 last:mb-0">
                  {/* Category Header */}
                  <button
                    onClick={() => {
                      setCollapsedCategories(prev => ({
                        ...prev,
                        [category]: !prev[category]
                      }));
                    }}
                    className="w-full flex items-center justify-between py-3 hover:bg-zinc-50/70 px-3 rounded-xl transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-400 group-hover:text-zinc-650 transition-colors">
                        {isCollapsed ? (
                          <ChevronRight className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-600 group-hover:text-zinc-900 transition-colors">
                        {category}
                      </span>
                      <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-zinc-150 text-zinc-600 border border-zinc-200">
                        {items.length}
                      </span>
                    </div>
                  </button>

                  {/* Rows Container */}
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isCollapsed ? "max-h-0 opacity-0" : "max-h-[500px] opacity-100"
                    }`}>
                    <div className="space-y-1.5 pl-0 md:pl-6 pr-2 py-2">
                      {items.map((doc) => {
                        const Icon = doc.icon;
                        const isLocked = doc.status === "Locked";
                        const isPending = doc.status === "Pending";

                        return (
                          <div
                            key={doc.title}
                            className="flex items-center justify-between py-3 px-3 hover:bg-zinc-50/50 rounded-xl transition-all duration-200 group border-b border-zinc-100/50 last:border-0 gap-3"
                          >
                            {/* Icon & Document Title */}
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200 ${isLocked
                                  ? "bg-zinc-100 text-zinc-450"
                                  : isPending
                                    ? "bg-amber-50 text-amber-600 group-hover:bg-amber-100"
                                    : "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100"
                                }`}>
                                <Icon className="h-4.5 w-4.5" />
                              </div>
                              <div className="min-w-0">
                                <span className="text-sm font-semibold text-zinc-750 truncate group-hover:text-zinc-950 transition-colors duration-200">
                                  {doc.title}
                                </span>
                                <p className="text-[11px] text-zinc-450 truncate hidden md:block mt-0.5 font-light">
                                  {doc.description}
                                </p>
                              </div>
                            </div>

                            {/* Status Badge (Only for Pending or Locked) */}
                            <div className="flex items-center gap-4 shrink-0">
                              {isLocked ? (
                                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold bg-zinc-100 text-zinc-500 border border-zinc-200/85 px-2.5 py-0.5 rounded-full">
                                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
                                  Locked
                                </span>
                              ) : isPending ? (
                                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-150 px-2.5 py-0.5 rounded-full animate-pulse">
                                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                  Pending
                                </span>
                              ) : null}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 relative z-10 border-t border-zinc-200/60 mt-12">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs text-indigo-650 font-bold uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">Stakeholder feedback</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
              Trusted by Students & Faculty
            </h2>
            <p className="text-zinc-500 text-sm font-light">
              Read how candidates and administrators utilize verified IQ Intern credentials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Student review */}
            <div className="glass-card bg-white border border-zinc-200/80 rounded-2xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">P</div>
                  <div>
                    <h5 className="text-xs font-bold text-zinc-900">Priya Patel</h5>
                    <p className="text-[9px] text-zinc-400 font-medium">Student, Computer Science</p>
                  </div>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed font-light italic">
                  &ldquo;IQ Intern solved my internship mandate. The Web Development track guidelines were clear, and passing the timed assessment generated my verified certificate instantly. Employers verified it without delays!&rdquo;
                </p>
              </div>
              <span className="text-[10px] font-bold text-indigo-600 block mt-4 uppercase tracking-wider text-left">✓ Verified Student</span>
            </div>

            {/* Faculty review */}
            <div className="glass-card bg-white border border-zinc-200/80 rounded-2xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600 font-bold text-xs">R</div>
                  <div>
                    <h5 className="text-xs font-bold text-zinc-900">Prof. Rajesh Kumar</h5>
                    <p className="text-[9px] text-zinc-400 font-medium">Head of Placement, Engineering</p>
                  </div>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed font-light italic">
                  &ldquo;We uploaded student indices in bulk and monitored evaluations. Using IQ Intern ensures students complete their assessments fairly, and gives our placements team concrete validation of student readiness.&rdquo;
                </p>
              </div>
              <span className="text-[10px] font-bold text-violet-600 block mt-4 uppercase tracking-wider text-left">✓ Verified Faculty</span>
            </div>

            {/* Recruiter review */}
            <div className="glass-card bg-white border border-zinc-200/80 rounded-2xl p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs">M</div>
                  <div>
                    <h5 className="text-xs font-bold text-zinc-900">Meera Sen</h5>
                    <p className="text-[9px] text-zinc-400 font-medium">Senior Talent Acquisition Partner</p>
                  </div>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed font-light italic">
                  &ldquo;Credential fraud is a massive challenge in volume hiring. IQ Intern's QR-code and unique ID lookup portals allow my onboarding team to verify candidate scorecards instantly, reducing check times from weeks to seconds.&rdquo;
                </p>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 block mt-4 uppercase tracking-wider text-left">✓ Verified Recruiter</span>
            </div>
          </div>
        </section>

        {/* ACCORDION FAQ SECTION */}
        <section id="faqs" className="relative z-10 mt-12" style={{ background: '#264367' }}>
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-3">
            <span className="text-xs text-yellow-300 font-bold uppercase tracking-wider bg-yellow-400/20 px-3 py-1 rounded-full border border-yellow-400/40">Got questions?</span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-white/70 text-sm font-light">
              Everything you need to know about the IQ Intern platform and credential standards.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl overflow-hidden border transition-colors"
                  style={{
                    background: 'rgba(255,255,255,0.07)',
                    backdropFilter: 'blur(12px)',
                    borderColor: isOpen ? 'rgba(250,204,21,0.5)' : 'rgba(255,255,255,0.15)',
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex justify-between items-center p-5 text-left text-xs sm:text-sm font-bold text-white cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="h-4 w-4 text-yellow-300 shrink-0" /> : <ChevronDown className="h-4 w-4 text-white/40 shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-white/60 leading-relaxed font-light border-t text-left" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          </div>
        </section>

        {/* FINAL HERO CTA CARD */}
        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 relative z-10">
          <div className="rounded-3xl final-cta-bg p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-xl shadow-zinc-950/15">
            <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-white/[0.03] blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-white/[0.03] blur-3xl pointer-events-none" />

            <div className="max-w-2xl mx-auto space-y-6 relative z-10">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Ready To Build Your Career?</h2>
              <p className="text-sm sm:text-base text-indigo-50 leading-relaxed font-light">
                Join IQ Intern today, take your vocational assessments, and obtain practical experience credentials that employers actually value.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
                <Link
                  href="/auth/register"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-zinc-50 px-8 py-3.5 text-xs font-bold text-zinc-900 transition-all active:scale-95 cursor-pointer shadow-md"
                >
                  Start Internship Track
                </Link>
                <Link
                  href="/contact"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-zinc-500 bg-white/10 hover:bg-white/20 px-8 py-3.5 text-xs font-bold text-white transition-all active:scale-95 cursor-pointer"
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
