/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Navbar from "@/components/Navbar";
import dynamic from "next/dynamic";
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });
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
  Download,
  User,
  SlidersHorizontal,
  Bookmark
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Subtle ambient icon backgrounds for a modern premium feel
const iconsPool = [GraduationCap, BookOpen, Award, ShieldCheck, FileText];
const floatingIcons = Array.from({ length: 20 }, (_, idx) => {
  const Icon = iconsPool[idx % iconsPool.length];
  const top = `${(idx * 4.8) + 2}%`;
  const left = `${((idx * 23) % 94) + 3}%`;
  const size = ((idx * 3) % 8) + 16;
  const delay = `${((idx * 0.2) % 6).toFixed(2)}s`;
  const duration = `${(((idx * 1.5) % 8) + 10).toFixed(2)}s`;
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
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTrackCategory, setActiveTrackCategory] = useState("Engineering");

  const stats = [
    { label: "Alumni Certified", value: "24,000+", icon: Users, color: "text-[#F9B300]" },
    { label: "University Partners", value: "48+", icon: GraduationCap, color: "text-[#FF7A00]" },
    { label: "Training Tracks", value: "25+", icon: Briefcase, color: "text-[#F9B300]" },
    { label: "Average Placement Rate", value: "94.2%", icon: TrendingUp, color: "text-[#FF7A00]" },
  ];

  const tracks = [
    { title: "Web Development Pathway", duration: "120 Hrs", level: "Beginner to Advanced", projects: "8 Live Builds", category: "Engineering" },
    { title: "Python Software Engineering", duration: "120 Hrs", level: "Beginner to Intermediate", projects: "5 Scripting Labs", category: "Development" },
    { title: "Machine Learning & AI Architectures", duration: "120 Hrs", level: "Advanced", projects: "4 Core ML Models", category: "Data & AI" },
    { title: "Cyber Security & Pentesting Audits", duration: "120 Hrs", level: "Intermediate", projects: "6 Compliance Audits", category: "Security" },
    { title: "Data Science & Analytical Pipelines", duration: "120 Hrs", level: "Intermediate to Advanced", projects: "5 Analytical Pipelines", category: "Data & AI" },
    { title: "Strategic Digital Branding & Growth", duration: "120 Hrs", level: "Beginner", projects: "3 Marketing Campaigns", category: "Business" },
    { title: "UI/UX Systems & Product Design", duration: "120 Hrs", level: "Beginner to Intermediate", projects: "4 High-Fidelity Mockups", category: "Design" },
    { title: "Cloud Systems & DevOps Architectures", duration: "120 Hrs", level: "Intermediate", projects: "5 Infrastructure Deployments", category: "Engineering" },
    { title: "Corporate Finance & Capital Management", duration: "120 Hrs", level: "Beginner to Intermediate", projects: "3 Financial Valuations", category: "Business" },
    { title: "Strategic Human Resource Operations", duration: "120 Hrs", level: "Beginner", projects: "4 Operational Case Studies", category: "Business" },
    { title: "Enterprise Leadership & Entrepreneurship", duration: "120 Hrs", level: "Intermediate", projects: "2 Complete Business Models", category: "Business" }
  ];

  const journeySteps = [
    {
      num: "01",
      badge: "< 2 Mins",
      badgeColor: "bg-blue-500/20 text-blue-300",
      title: "Easy Registration",
      desc: "Establish your profile stream and verify credentials in under 2 minutes.",
      icon: User
    },
    {
      num: "02",
      badge: "Tracks",
      badgeColor: "bg-blue-500/20 text-blue-300",
      title: "Secure Payment",
      desc: "Pay securely via RazorPay with multiple payment options and instant confirmation.",
      icon: SlidersHorizontal
    },
    {
      num: "03",
      badge: "120 Hours",
      badgeColor: "bg-blue-500/20 text-blue-300",
      title: "Structured Curriculum Study",
      desc: "Secure registration pipeline setup through integrated gateway payment structures.",
      icon: CreditCard
    },
    {
      num: "04",
      badge: "Training",
      badgeColor: "bg-blue-500/20 text-blue-300",
      title: "Hands-on Project Builds",
      desc: "Dive into rigorous training modules, framework templates, and benchmark modules.",
      icon: Bookmark
    },
    {
      num: "05",
      badge: "60 Mins",
      badgeColor: "bg-blue-500/20 text-blue-300",
      title: "Secure Timed Evaluations",
      desc: "Take standard timed MCQ assessments protected by tab-switching check algorithms.",
      icon: FileText
    },
    {
      num: "06",
      badge: "Instant",
      badgeColor: "bg-emerald-500/20 text-emerald-350",
      title: "Instant Certification",
      desc: "Pass with 40% or higher to generate secure, verifiable PDF certificates instantly.",
      icon: Award
    }
  ];

  const caseStudies = [
    {
      student: "Priya Patel",
      before: "A computer science student applying with generic course certificates. Her resume was continuously filtered out by automated screening bots.",
      after: "Completed the Web Development Pathway, scored 85% on evaluations, and shared her verified dashboard link. Secured an engineering role in 3 weeks.",
      tag: "Software Engineering"
    },
    {
      student: "Kunal Verma",
      before: "A mechanical engineer looking to switch fields. Had theoretical knowledge but lacked verifiable proof of actual coding skills.",
      after: "Completed the Python Software Engineering track, passed all builds, and sent his scorecard directly to recruiters. Hired as a Backend Dev in 18 days.",
      tag: "Python Development"
    }
  ];

  const faqs = [
    { q: "What is the typical program duration?", a: "Most professional training tracks require approximately 120 hours of curriculum study and project validation, typically completed in 6 to 16 weeks depending on your pace." },
    { q: "How does the evaluation process work?", a: "Assessments consist of timed MCQ tests designed to validate core engineering, design, or business concepts. You must score 40% or higher to qualify for your verified credentials." },
    { q: "How do recruiters verify student scorecards?", a: "Each certificate has a unique ID and QR code. Recruiters scan or search these credentials directly on our platform to view actual test score summaries instantly." },
    { q: "What policies apply to course withdrawals?", a: "Since all downloadable training blueprints are digital materials delivered instantly upon enrollment, general terms apply. Please consult support for billing clarifications." },
    { q: "Are these credentials recognized?", a: "Yes. IQIntern certifications detail the candidate's actual score breakdown and live build approvals, offering concrete competence proofs preferred by volume hiring partners." }
  ];

  const renderTrackRow = (track: any, rIdx: number) => {
    return (
      <div
        key={track.title}
        className="flex flex-col sm:flex-row sm:items-center justify-between py-4 px-5 hover:bg-zinc-50/70 rounded-xl transition-all duration-200 group border-b border-zinc-100 last:border-0 gap-3"
      >
        <div className="flex items-center gap-3.5 min-w-0 flex-1">
          <div className="h-9 w-9 rounded-lg bg-[#FFF9ED] text-[#F9B300] flex items-center justify-center shrink-0 border border-[#E9D8B4] group-hover:bg-[#FF7A00] group-hover:text-white group-hover:border-transparent transition-all duration-300">
            <Briefcase className="h-4.5 w-4.5" />
          </div>
          <div className="min-w-0">
            <span className="text-sm font-bold text-zinc-800 truncate group-hover:text-zinc-950 transition-colors">
              {track.title}
            </span>
            <p className="text-[11px] text-zinc-500 truncate hidden md:block mt-0.5 font-light">
              {track.duration} • {track.level} • {track.projects}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
          <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            Verified Outcome
          </span>
          <Link
            href="/auth/register"
            className="text-xs text-[#FF7A00] hover:text-[#E66E00] font-bold px-3 py-1.5 hover:bg-[#FFF3EB] rounded-lg transition-all cursor-pointer flex items-center gap-1"
          >
            <span>Enroll Now</span>
            <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen flex flex-col text-zinc-800 overflow-x-hidden pt-12 bg-white">
      {/* Subtle Floating Ambient Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0 opacity-30">
        {floatingIcons.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="absolute text-zinc-300 float-bg-icon"
              style={{
                top: item.top,
                left: item.left,
                "--delay": item.delay,
                "--duration": item.duration,
              } as React.CSSProperties}
            >
              <Icon size={item.size} strokeWidth={1.2} />
            </div>
          );
        })}
      </div>

      <Navbar />

      <main className="flex-grow relative z-10">
        {/* 1. HERO SECTION */}
        <section className="mx-auto max-w-7xl px-4 pt-14 pb-8 sm:px-6 sm:pt-16 sm:pb-10 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-8 min-h-[50vh]">
            <div className="flex-grow lg:w-1/2 text-center justify-center space-y-4 animate-slide-up">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#FFE699] bg-[#FFF9ED] px-3.5 py-1 text-xs font-bold text-[#F9B300] shadow-xs">
                <Sparkles className="h-3.5 w-3.5 text-[#F9B300]" />
                <span>Professional Training & Evaluation Hub</span>
              </div>

              <h1 className="text-hero-display text-zinc-900">
                Acquire Verified Skills. <br />
                <span className="text-[#FF7A00]">Accelerate Your Career.</span>
              </h1>

              <p className="mx-auto max-w-xl text-center text-sm sm:text-base text-zinc-500 font-light leading-relaxed">
                Ditch basic attendance certificates. Enroll in industry-aligned professional training paths, validate your domain skills through timed assessments, and build verifiable credentials.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
                <Link
                  href="/auth/register"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-[#F9B300] hover:bg-[#E6A500] px-7 py-3 text-xs sm:text-sm font-bold text-zinc-900 transition-all cursor-pointer shadow-sm active:scale-98"
                >
                  Explore Programs
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 px-7 py-3 text-xs sm:text-sm font-bold text-zinc-700 transition-all shadow-xs cursor-pointer active:scale-98"
                >
                  Speak With Advisor
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 2. TRUST METRICS SECTION */}
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 relative z-10 border-y border-zinc-200 bg-[#FFF9ED]/30">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="flex flex-col items-center justify-center text-center p-3 space-y-1.5">
                  <div className="h-9 w-9 rounded-full bg-white border border-zinc-200 flex items-center justify-center shadow-xs">
                    <Icon className={`h-4.5 w-4.5 ${stat.color}`} />
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">{stat.value}</h3>
                    <p className="text-xs text-zinc-500 font-light mt-0.5">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. TRAINING JOURNEY SECTION */}
        <section className="bg-[#122244] text-white py-10 sm:py-12 border-y border-blue-900/40 relative z-10 selection:bg-blue-500 selection:text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                The Professional <span className="text-amber-400">Training Journey</span>
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto text-xs md:text-sm opacity-80">
                Follow our step-by-step vocational pipeline to qualify, validate your skills, and earn your verified credentials.
              </p>
            </div>

            <div className="relative wrap overflow-hidden p-0 md:py-6 h-full">
              <div className="absolute top-6 bottom-6 border-l border-blue-400/30 left-[22px] md:left-1/2 -translate-x-1/2"></div>

              {journeySteps.map((step, idx) => {
                const isLeft = idx % 2 === 1;
                const Icon = step.icon;
                return (
                  <div
                    key={idx}
                    className={`mb-8 flex justify-between items-center w-full group relative ${isLeft ? "md:flex-row-reverse" : ""}`}
                  >
                    <div className="order-1 w-5/12 hidden md:block"></div>
                    <div className="z-20 flex items-center order-1 bg-[#1a2d54] border-2 border-blue-400/60 shadow-[0_0_12px_rgba(96,165,250,0.3)] w-10 h-10 rounded-xl justify-center text-amber-400 absolute left-0 md:left-1/2 md:-translate-x-1/2">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="order-1 bg-[#1a2d54]/60 border border-blue-900/50 rounded-xl shadow-xl w-full md:w-[45%] px-5 py-5 ml-12 md:ml-0 hover:border-blue-400/40 transition-all duration-300 text-left">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs text-amber-400/80 font-medium tracking-wider uppercase">Phase {idx + 1}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${step.badgeColor}`}>{step.badge}</span>
                      </div>
                      <h3 className="font-bold text-white text-lg mb-1">{step.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-light">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 bg-[#1a2d54] border border-blue-900/60 rounded-2xl p-6 md:p-8 text-center shadow-2xl relative overflow-hidden">
              <h3 className="text-2xl md:text-3xl font-bold mb-3 text-white">Start Your Internship Journey Today</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mb-6">
                <div className="bg-[#122244]/60 p-2.5 rounded-xl text-xs text-gray-300"><strong>UGC-aligned</strong><br />Certificate</div>
                <div className="bg-[#122244]/60 p-2.5 rounded-xl text-xs text-gray-300"><strong>Flexible</strong><br />Duration</div>
                <div className="bg-[#122244]/60 p-2.5 rounded-xl text-xs text-gray-300"><strong>10+ Subjects</strong><br />Curriculum</div>
                <div className="bg-[#122244]/60 p-2.5 rounded-xl text-xs text-gray-300"><strong>Anywhere</strong><br />Access</div>
              </div>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-4">
                <Link href="/auth/register" className="w-full sm:w-auto px-7 py-3 bg-white text-[#122244] font-bold rounded-xl shadow-lg hover:bg-gray-100 transition-colors inline-flex justify-center items-center gap-2 text-xs sm:text-sm">
                  Register Now <ArrowRight className="h-4 w-4 text-[#122244]" />
                </Link>
                <Link href="/auth/register" className="w-full sm:w-auto px-7 py-3 bg-transparent border border-gray-500 text-white font-bold rounded-xl hover:bg-white/5 transition-colors text-xs sm:text-sm">
                  View Membership Plans
                </Link>
              </div>
              <div className="flex flex-wrap justify-center gap-x-5 gap-y-1.5 text-xs text-gray-400">
                <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5 text-emerald-400" /> Instant Offer Letter</span>
                <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5 text-emerald-400" /> Automated Certificate</span>
                <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5 text-emerald-400" /> Digital Signature</span>
              </div>
            </div>
          </div>
        </section>

        {/* 5. LEARNING OUTCOMES SECTION */}
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 relative z-10 border-b border-zinc-200 bg-[#FFF9ED]/20">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 space-y-2">
            <span className="text-xs text-[#FF7A00] font-bold uppercase tracking-wider bg-[#FFF3EB] px-3 py-1 rounded-full border border-[#FFE0CC]">Vetted Outcomes</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-zinc-900 tracking-tight">
              Verified Learning Outcomes
            </h2>
            <p className="text-zinc-500 text-xs sm:text-sm font-light">
              Compare conventional course certificates with IQIntern's metric-driven skill verification values.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <div className="bg-white border border-zinc-200 rounded-2xl p-5 sm:p-6 space-y-4 text-left">
              <h3 className="text-xs sm:text-sm font-black text-red-500 uppercase tracking-wider flex items-center gap-2">
                Conventional Course Attendance
              </h3>
              <ul className="space-y-3">
                {["Theory-heavy lessons without strict project code requirements.", "Zero validation testing — certificates sent for purely watching video lists.", "Assessments are simple, non-proctored, and vulnerable to plagiarised submissions.", "Generic files without details on grades, project structures, or scores.", "Requires manual verification emails causing long onboarding placement delays."].map((item, idx) => (
                  <li key={idx} className="flex gap-2.5 items-start text-xs sm:text-sm text-zinc-500 leading-relaxed font-light">
                    <span className="h-4.5 w-4.5 rounded-full bg-red-50 border border-red-100 flex items-center justify-center shrink-0 text-red-500 font-bold text-[9px] mt-0.5">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white border border-[#E9D8B4] rounded-2xl p-5 sm:p-6 space-y-4 text-left shadow-xs">
              <h3 className="text-xs sm:text-sm font-black text-emerald-600 uppercase tracking-wider flex items-center gap-2">
                The IQIntern Evaluation Standard
              </h3>
              <ul className="space-y-3">
                {["Mandatory hands-on projects showing actual functional deployments.", "Curriculum designed on practical parameters vetted by tech leaders.", "Secure timed evaluations utilizing protection controls against tab-switching.", "Immutable online certificates verified instantly via ID lookup databases.", "Comprehensive performance scorecards displaying detailed grading metrics."].map((item, idx) => (
                  <li key={idx} className="flex gap-2.5 items-start text-xs sm:text-sm text-zinc-800 leading-relaxed font-semibold">
                    <span className="h-4.5 w-4.5 rounded-full bg-emerald-50 border border-emerald-150 flex items-center justify-center shrink-0 text-emerald-600 font-bold text-[10px] mt-0.5">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 6. WHY CHOOSE IQINTERN SECTION */}
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 relative z-10 border-b border-zinc-200">
          <div className="flex flex-col lg:flex-row items-center gap-8 bg-white border border-zinc-200 rounded-3xl p-5 sm:p-8">
            <div className="lg:w-7/12 space-y-4 text-left">
              <span className="text-xs text-[#FF7A00] font-bold uppercase tracking-wider block">Skill Validation</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight leading-snug">
                Why Professional Verification is Essential
              </h2>
              <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed font-light">
                Generic training listings fail to convince modern recruiters. IQIntern shifts the placement search by delivering proctored, metric-driven verification scores that detail actual technical achievements, building trust instantly.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold pt-1">
                <div className="flex items-center gap-2 text-zinc-700"><span className="h-2 w-2 rounded-full bg-[#FF7A00]" />Proctored Assessment Protections</div>
                <div className="flex items-center gap-2 text-zinc-700"><span className="h-2 w-2 rounded-full bg-[#FF7A00]" />Live Verification Lookup Portals</div>
                <div className="flex items-center gap-2 text-zinc-700"><span className="h-2 w-2 rounded-full bg-[#F9B300]" />Deep Grade Analytics Breakdown</div>
                <div className="flex items-center gap-2 text-zinc-700"><span className="h-2 w-2 rounded-full bg-[#F9B300]" />Structured Practical Blueprints</div>
              </div>
            </div>
            <div className="lg:w-5/12 w-full bg-[#FFF9ED] border border-[#E9D8B4] p-5 rounded-2xl space-y-3 text-left">
              <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Placement Acceleration Solutions</h4>
              <div className="space-y-2 text-xs text-zinc-500 font-light leading-relaxed">
                <p><strong>Curriculum Rigor:</strong> Unlike generic portals, we focus exclusively on live deployment builds, code review rules, and proctored timed testing.</p>
                <p><strong>Trust Factor:</strong> Scorecards allow recruiters to verify candidates directly, reducing background review back-and-forth processes.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 7. EVERYTHING YOU'LL UNLOCK SECTION (REPLACED MENTORS) */}
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 relative z-10 border-b border-zinc-200 bg-[#FFF9ED]/10">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 space-y-2">
            <span className="text-xs text-[#F9B300] font-bold uppercase tracking-wider bg-[#FFF9ED] px-3 py-1 rounded-full border border-[#FFE699]">Premium Badge</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-zinc-900 tracking-tight">
              Everything You'll <span className="text-[#FF7A00]">Unlock</span> at IQIntern
            </h2>
            <p className="text-zinc-500 text-xs sm:text-sm font-light leading-relaxed">
              Build industry-ready skills, complete assessments, and receive professionally generated internship documents designed for academic and career growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {[
              { icon: FileText, title: "Internship Offer Letter", desc: "Instant generation after enrollment with premium digital verification." },
              { icon: GraduationCap, title: "Industry-Aligned Training", desc: "Learn through structured internship programs designed for real-world skills." },
              { icon: Sparkles, title: "AI-Based Skill Assessment", desc: "Get evaluated through automated assessments and detailed performance reports." },
              { icon: ShieldCheck, title: "Premium Certification", desc: "Verifiable certificates with QR codes and unique certificate IDs." },
              { icon: FolderOpen, title: "Internship Documentation", desc: "Attendance sheet, marksheet, internship report, and completion documents." },
              { icon: Eye, title: "Lifetime Certificate Verification", desc: "Public certificate verification portal for colleges, recruiters, and employers." }
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="bg-white border border-zinc-200 rounded-2xl p-5 space-y-3 text-left hover:border-[#F9B300]/30 hover:shadow-xs transition-all duration-300 group">
                  <div className="h-10 w-10 rounded-xl bg-[#FFF9ED] border border-[#E9D8B4] text-[#F9B300] flex items-center justify-center shrink-0 group-hover:bg-[#F9B300] group-hover:text-white group-hover:border-transparent transition-all duration-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-zinc-900">{feature.title}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed font-light">{feature.desc}</p>
                </div>
              );
            })}
          </div>

          <p className="text-center mt-8 text-xs text-zinc-400 font-light">
            Trusted by <span className="text-zinc-900 font-bold">students across India.</span>
          </p>
        </section>

        {/* 8. STUDENT TRANSFORMATION TIMELINE SECTION */}
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 relative z-10 border-b border-zinc-200 bg-[#FFF9ED]/10">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 space-y-2">
            <span className="text-xs text-[#F9B300] font-bold uppercase tracking-wider bg-[#FFF9ED] px-3 py-1 rounded-full border border-[#FFE699]">Transformation Maps</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-zinc-900 tracking-tight">
              Student Career Transformations
            </h2>
            <p className="text-zinc-500 text-xs sm:text-sm font-light">
              Real cases showing candidate placement acceleration before and after completing their evaluations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 max-w-5xl mx-auto text-left">
            {caseStudies.map((study, idx) => (
              <div key={idx} className="bg-white border border-zinc-200 rounded-2xl p-5 sm:p-6 space-y-4 hover:border-[#FF7A00]/25 transition-all">
                <div className="flex justify-between items-center border-b border-zinc-100 pb-2.5">
                  <h3 className="text-sm sm:text-base font-black text-zinc-900">{study.student}</h3>
                  <span className="text-[10px] font-extrabold text-[#FF7A00] bg-[#FFF3EB] border border-[#FFE0CC] px-2.5 py-0.5 rounded-full uppercase">
                    {study.tag}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed">
                  <div className="p-3.5 bg-red-50/20 border border-red-100 rounded-xl space-y-1">
                    <p className="font-extrabold text-red-600 uppercase tracking-widest text-[9px]">Struggle / Before</p>
                    <p className="text-zinc-500 font-light">{study.before}</p>
                  </div>
                  <div className="p-3.5 bg-emerald-50/20 border border-emerald-150 rounded-xl space-y-1">
                    <p className="font-extrabold text-emerald-700 uppercase tracking-widest text-[9px]">Placement / After</p>
                    <p className="text-zinc-800 font-semibold">{study.after}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 9. TESTIMONIALS SECTION */}
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 relative z-10 border-b border-zinc-200">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 space-y-2">
            <span className="text-xs text-[#FF7A00] font-bold uppercase tracking-wider bg-[#FFF3EB] px-3 py-1 rounded-full border border-[#FFE0CC]">Stakeholder Reviews</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-zinc-900 tracking-tight">
              Trusted by Candidates & Administrators
            </h2>
            <p className="text-zinc-500 text-xs sm:text-sm font-light">
              Read how candidates and placement offices leverage our metric-driven vocational certifications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl mx-auto">
            <div className="bg-white border-l-4 border-[#F9B300] border-y border-r border-zinc-200 rounded-r-2xl rounded-l-md p-5 flex flex-col justify-between hover:shadow-xs transition-shadow bg-zinc-50/10">
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-[#FFF9ED] border border-[#E9D8B4] flex items-center justify-center text-[#F9B300] font-bold text-xs">P</div>
                  <div>
                    <h5 className="text-xs font-bold text-zinc-900">Priya Patel</h5>
                    <p className="text-[9px] text-zinc-400 font-medium">Software Engineer</p>
                  </div>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed font-light italic">
                  &ldquo;The curriculum blueprints were incredibly thorough. Completing the projects and passing the tab-protected timed evaluations gave me a verified scorecard that got my application approved without delay.&rdquo;
                </p>
              </div>
              <span className="text-[10px] font-bold text-[#F9B300] block mt-3 uppercase tracking-wider text-left">✓ Verified Alumna</span>
            </div>

            <div className="bg-white border-l-4 border-[#FF7A00] border-y border-r border-zinc-200 rounded-r-2xl rounded-l-md p-5 flex flex-col justify-between hover:shadow-xs transition-shadow bg-zinc-50/10">
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-[#FFF3EB] border border-[#FFE0CC] flex items-center justify-center text-[#FF7A00] font-bold text-xs">R</div>
                  <div>
                    <h5 className="text-xs font-bold text-zinc-900">Prof. Rajesh Kumar</h5>
                    <p className="text-[9px] text-zinc-400 font-medium">Placement Hub Coordinator</p>
                  </div>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed font-light italic">
                  &ldquo;Monitoring candidate learning assessments has never been simpler. The proctored scoring dashboards protect our compliance logs while giving placements team clear, verifiable details of student competence.&rdquo;
                </p>
              </div>
              <span className="text-[10px] font-bold text-[#FF7A00] block mt-3 uppercase tracking-wider text-left">✓ Verified Coordinator</span>
            </div>

            <div className="bg-[#fff] border-l-4 border-emerald-500 border-y border-r border-zinc-200 rounded-r-2xl rounded-l-md p-5 flex flex-col justify-between hover:shadow-xs transition-shadow bg-zinc-50/10">
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-emerald-50 border border-emerald-250 flex items-center justify-center text-emerald-600 font-bold text-xs">M</div>
                  <div>
                    <h5 className="text-xs font-bold text-zinc-900">Meera Sen</h5>
                    <p className="text-[9px] text-zinc-400 font-medium">Director, Talent Acquisition</p>
                  </div>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed font-light italic">
                  &ldquo;Credential fraud is a primary concern in volume sourcing. Scannable verification dashboard links solve verification delays instantly. Excellent standard that details score outcomes.&rdquo;
                </p>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 block mt-3 uppercase tracking-wider text-left">✓ Verified Partner</span>
            </div>
          </div>
        </section>

        {/* 10. CTA SECTION */}
        <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 relative z-10">
          <div className="rounded-3xl border border-[#E9D8B4] bg-[#FFF9ED] p-6 sm:p-10 text-center relative overflow-hidden shadow-xs">
            <div className="max-w-2xl mx-auto space-y-4 relative z-10">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-zinc-900">Accelerate Your Technical Readiness</h2>
              <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed font-light">
                Join IQIntern today, attempt proctored evaluations, and download verified performance credentials to accelerate your corporate recruitment journey.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
                <Link href="/auth/register" className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-[#F9B300] hover:bg-[#E6A500] px-7 py-3 text-xs font-bold text-zinc-900 transition-all cursor-pointer shadow-sm active:scale-95">
                  Create Account
                </Link>
                <Link href="/contact" className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 px-7 py-3 text-xs font-bold text-zinc-700 transition-all cursor-pointer active:scale-95">
                  Contact Advisors
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