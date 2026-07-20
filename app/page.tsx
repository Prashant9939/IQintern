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
      badge: "120 hr",
      badgeColor: "bg-blue-500/20 text-blue-300",
      title: "Structured Curriculum Study",
      desc: "Secure registration pipeline setup through integrated gateway payment structures.",
      icon: CreditCard
    },
    {
      num: "04",
      badge: "120 Hours",
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

  const mentors = [
    { name: "Srinivas Chary", role: "Principal Cloud Engineer", company: "ex-AWS", initial: "SC" },
    { name: "Arjun Mehta", role: "Senior ML Research Lead", company: "ex-Google", initial: "AM" },
    { name: "Dr. Neha Sen", role: "Head of Systems Curriculum", company: "ex-Microsoft", initial: "NS" },
    { name: "Rohan Das", role: "Product Director", company: "ex-Meta", initial: "RD" }
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
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-20 opacity-30">
        {floatingIcons.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="absolute text-zinc-300 float-bg-icon"
              style={{
                top: item.top,
                left: item.left,
                // @ts-ignore
                "--delay": item.delay,
                // @ts-ignore
                "--duration": item.duration,
              }}
            >
              <Icon size={item.size} strokeWidth={1.2} />
            </div>
          );
        })}
      </div>

      <Navbar />

      <main className="flex-grow">
        {/* 1. HERO SECTION */}
        <section className="mx-auto max-w-7xl px-4 pt-32 pb-20 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 min-h-[70vh]">
            
            {/* Left Column: Rebranded Heading & CTAs */}
            <div className="flex-grow lg:w-1/2 text-left space-y-7 animate-slide-up">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#FFE699] bg-[#FFF9ED] px-4 py-1.5 text-xs font-bold text-[#F9B300] shadow-xs">
                <Sparkles className="h-3.5 w-3.5 text-[#F9B300]" />
                <span>Professional Training & Evaluation Hub</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-900 leading-[1.08]">
                Acquire Verified Skills. <br />
                <span className="text-[#FF7A00]">Accelerate Your Career.</span>
              </h1>

              <p className="text-base sm:text-lg text-zinc-500 font-light leading-relaxed max-w-xl">
                Ditch basic attendance certificates. Enroll in industry-aligned professional training paths, validate your domain skills through timed assessments, and build verifiable credentials.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <Link
                  href="/auth/register"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-[#F9B300] hover:bg-[#E6A500] px-8 py-4 text-sm font-bold text-zinc-900 transition-all cursor-pointer shadow-sm active:scale-98"
                >
                  Explore Programs
                  <ArrowRight className="h-4.5 w-4.5" />
                </Link>
                <Link
                  href="/contact"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 px-8 py-4 text-sm font-bold text-zinc-700 transition-all shadow-xs cursor-pointer active:scale-98"
                >
                  Speak With Advisor
                </Link>
              </div>
            </div>

            {/* Right Column: Flat Mockup Preview */}
            <div className="w-full lg:w-1/2 flex justify-center animate-slide-up" style={{ animationDelay: "150ms" }}>
              <div className="relative w-full max-w-lg aspect-[4/3] bg-white border border-zinc-200 rounded-3xl shadow-xl overflow-hidden animate-float">
                {/* Header of Mockup */}
                <div className="flex h-12 items-center justify-between px-5 border-b border-zinc-200 bg-[#FFF9ED]">
                  <div className="flex gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-zinc-200" />
                    <span className="h-3 w-3 rounded-full bg-zinc-200" />
                    <span className="h-3 w-3 rounded-full bg-zinc-200" />
                  </div>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">IQIntern Console</span>
                  <span className="h-5 px-3 rounded-full bg-white border border-[#E9D8B4] flex items-center justify-center text-[9px] text-[#FF7A00] font-extrabold uppercase">Verified View</span>
                </div>

                {/* Dashboard grid */}
                <div className="p-6 grid grid-cols-3 gap-5 h-[calc(100%-3rem)] bg-white text-left">
                  {/* Left Mini Sidebar */}
                  <div className="col-span-1 border-r border-zinc-100 pr-4 space-y-3.5 text-[10px] font-bold text-zinc-500">
                    <div className="p-2.5 rounded-xl bg-[#F9B300] text-zinc-900 flex items-center gap-1.5 shadow-xs">
                      <BarChart2 className="h-3.5 w-3.5" />
                      <span>Overview</span>
                    </div>
                    <div className="p-2.5 rounded-xl hover:bg-[#FFF9ED] flex items-center gap-1.5 transition-all cursor-pointer hover:text-zinc-800">
                      <Briefcase className="h-3.5 w-3.5 text-[#FF7A00]" />
                      <span>Programs</span>
                    </div>
                    <div className="p-2.5 rounded-xl hover:bg-[#FFF9ED] flex items-center gap-1.5 transition-all cursor-pointer hover:text-zinc-800">
                      <Award className="h-3.5 w-3.5 text-[#FF7A00]" />
                      <span>Credentials</span>
                    </div>
                  </div>

                  {/* Right Core Data */}
                  <div className="col-span-2 space-y-4">
                    <div className="p-4 bg-[#FFF9ED] border border-[#F3E8D1] rounded-2xl space-y-1">
                      <p className="text-[8px] font-extrabold text-[#FF7A00] uppercase tracking-wider">Candidate Progress</p>
                      <p className="text-xs font-black text-zinc-900">Rahul Sharma</p>
                    </div>

                    <div className="p-4 border border-zinc-200 rounded-2xl space-y-2.5 bg-white">
                      <div className="flex justify-between text-[9px] font-extrabold">
                        <span className="text-zinc-500">Full Stack Track</span>
                        <span className="text-[#F9B305] font-black">78% Complete</span>
                      </div>
                      <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#FF7A00] w-[78%] rounded-full" />
                      </div>
                    </div>

                    <div className="p-3 border border-[#E9D8B4] bg-[#FFF9ED] rounded-2xl flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="text-[8px] font-extrabold text-zinc-500 uppercase">Assessment ID</p>
                        <p className="text-[10px] font-black text-zinc-800 font-mono">TR-2026-REACT</p>
                      </div>
                      <span className="h-5.5 px-2.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-250 text-[8px] font-bold flex items-center justify-center shrink-0 uppercase">Passed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 2. TRUST METRICS SECTION */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 relative z-10 border-y border-zinc-200 bg-[#FFF9ED]/30">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="flex flex-col items-center justify-center text-center p-4 space-y-2">
                  <div className="h-10 w-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center shadow-xs">
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-zinc-900 tracking-tight">{stat.value}</h3>
                    <p className="text-xs text-zinc-500 font-light mt-0.5">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>        {/* 3. TRAINING JOURNEY SECTION */}
        <section className="bg-[#122244] text-white py-20 border-y border-blue-900/40 relative z-10 selection:bg-blue-500 selection:text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Heading */}
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                The Professional <span className="text-amber-400">Training Journey</span>
              </h2>
              <p className="text-gray-300 mt-3 max-w-2xl mx-auto text-sm md:text-base opacity-80">
                Follow our step-by-step vocational pipeline to qualify, validate your skills, and earn your verified credentials.
              </p>
            </div>

            {/* Interactive Vertical Timeline */}
            <div className="relative wrap overflow-hidden p-0 md:py-10 h-full">
              {/* Center Line */}
              <div className="absolute border-opacity-30 border-blue-400 h-[calc(100%-120px)] border left-[22px] md:left-1/2 -translate-x-1/2"></div>

              {journeySteps.map((step, idx) => {
                const isLeft = idx % 2 === 1;
                const Icon = step.icon;
                return (
                  <div
                    key={idx}
                    className={`mb-12 flex justify-between items-center w-full group relative ${
                      isLeft ? "md:flex-row-reverse" : ""
                    }`}
                  >
                    {/* Spacer for desktop layout */}
                    <div className="order-1 w-5/12 hidden md:block"></div>

                    {/* Step Icon Node */}
                    <div className="z-20 flex items-center order-1 bg-[#1a2d54] border-2 border-blue-400/60 shadow-[0_0_12px_rgba(96,165,250,0.3)] w-11 h-11 rounded-xl justify-center text-amber-400 absolute left-0 md:left-1/2 md:-translate-x-1/2">
                      <Icon className="h-4.5 w-4.5" />
                    </div>

                    {/* Timeline Card */}
                    <div className="order-1 bg-[#1a2d54]/60 border border-blue-900/50 rounded-xl shadow-xl w-full md:w-[44%] px-6 py-6 ml-14 md:ml-0 hover:border-blue-400/40 transition-all duration-300 text-left">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-amber-400/80 font-medium tracking-wider uppercase">
                          Phase {idx + 1}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${step.badgeColor}`}>
                          {step.badge}
                        </span>
                      </div>
                      <h3 className="font-bold text-white text-xl mb-1">{step.title}</h3>
                      <p className="text-base text-gray-400 leading-relaxed font-light">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer CTA Box */}
            <div className="mt-16 bg-[#1a2d54] border border-blue-900/60 rounded-2xl p-8 md:p-12 text-center shadow-2xl relative overflow-hidden">
              <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">Start Your Internship Journey Today</h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
                <div className="bg-[#122244]/60 p-3 rounded-xl text-xs sm:text-sm text-gray-300">
                  <strong>UGC-aligned</strong>
                  <br />
                  Certificate
                </div>
                <div className="bg-[#122244]/60 p-3 rounded-xl text-xs sm:text-sm text-gray-300">
                  <strong>Flexible</strong>
                  <br />
                  Duration
                </div>
                <div className="bg-[#122244]/60 p-3 rounded-xl text-xs sm:text-sm text-gray-300">
                  <strong>10+ Subjects</strong>
                  <br />
                  Curriculum
                </div>
                <div className="bg-[#122244]/60 p-3 rounded-xl text-xs sm:text-sm text-gray-300">
                  <strong>Anywhere</strong>
                  <br />
                  Access
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
                <Link
                  href="/auth/register"
                  className="w-full sm:w-auto px-8 py-3.5 bg-white text-[#122244] font-bold rounded-xl shadow-lg hover:bg-gray-100 transition-colors inline-flex justify-center items-center gap-2 text-sm"
                >
                  Register Now <ArrowRight className="h-4 w-4 text-[#122244]" />
                </Link>
                <Link
                  href="/auth/register"
                  className="w-full sm:w-auto px-8 py-3.5 bg-transparent border border-gray-500 text-white font-bold rounded-xl hover:bg-white/5 transition-colors text-sm"
                >
                  View Membership Plans
                </Link>
              </div>

              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Check className="h-4 w-4 text-emerald-400" /> Instant Offer Letter
                </span>
                <span className="flex items-center gap-1">
                  <Check className="h-4 w-4 text-emerald-400" /> Automated Certificate
                </span>
                <span className="flex items-center gap-1">
                  <Check className="h-4 w-4 text-emerald-400" /> Digital Signature
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* 4. PROFESSIONAL TRAINING PROGRAMS SECTION */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 relative z-10 border-b border-zinc-200">
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
            <span className="text-xs text-[#F9B300] font-bold uppercase tracking-wider bg-[#FFF9ED] px-3 py-1 rounded-full border border-[#FFE699]">Domain Certifications</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
              Professional Training Programs
            </h2>
            <p className="text-zinc-500 text-sm font-light">
              Choose your career track. Complete conceptual builds and pass verified requirements to unlock credentials.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex justify-center mb-10">
            <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 p-1.5 rounded-2xl max-w-full overflow-x-auto shadow-xs">
              {["Engineering", "Development", "Data & AI", "Security", "Business", "Design"].map((cat) => {
                const isActive = activeTrackCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveTrackCategory(cat);
                      setIsExpanded(false);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer whitespace-nowrap border ${isActive
                        ? "bg-white text-[#FF7A00] shadow-xs border-zinc-200/80"
                        : "text-zinc-500 hover:text-zinc-800 hover:bg-white border-transparent"
                      }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Featured & List Programs */}
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
                {featuredTrack && (
                  <div className="max-w-4xl mx-auto">
                    <div className="group relative rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-xs transition-all duration-300 hover:shadow-md hover:border-[#FF7A00]/30 text-left">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                        <div className="space-y-4 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-150 rounded-full px-2.5 py-0.5 uppercase tracking-wider flex items-center gap-1 shadow-xs">
                              <Check className="h-3 w-3 stroke-[3]" />
                              Vetted Curriculum
                            </span>
                            <span className="text-[10px] font-extrabold text-[#FF7A00] bg-[#FFF3EB] border border-[#FFE0CC] rounded-full px-2.5 py-0.5 uppercase tracking-wider">
                              Popular Program
                            </span>
                          </div>

                          <h3 className="text-xl sm:text-2xl font-black text-zinc-900 group-hover:text-[#FF7A00] transition-colors">
                            {featuredTrack.title}
                          </h3>

                          {/* Metadata */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-zinc-100 pt-4 text-xs font-light text-zinc-500">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-center shrink-0">
                                <Clock className="h-4 w-4 text-[#F9B300]" />
                              </div>
                              <div className="text-left">
                                <span className="text-[9px] text-zinc-400 font-extrabold uppercase block">Duration</span>
                                <strong className="text-zinc-700 font-bold">{featuredTrack.duration}</strong>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-center shrink-0">
                                <GraduationCap className="h-4 w-4 text-[#FF7A00]" />
                              </div>
                              <div className="text-left">
                                <span className="text-[9px] text-zinc-400 font-extrabold uppercase block">Level</span>
                                <strong className="text-zinc-700 font-bold">{featuredTrack.level}</strong>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-center shrink-0">
                                <Sparkles className="h-4 w-4 text-[#FF7A00]" />
                              </div>
                              <div className="text-left">
                                <span className="text-[9px] text-zinc-400 font-extrabold uppercase block">Deliverables</span>
                                <strong className="text-zinc-700 font-bold">{featuredTrack.projects}</strong>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col justify-center items-stretch md:items-end gap-3 shrink-0 w-full md:w-auto">
                          <Link
                            href="/auth/register"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F9B300] hover:bg-[#E6A500] px-6 py-3.5 text-xs font-bold text-zinc-900 shadow-sm transition-all text-center"
                          >
                            Enroll in Track
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {relatedTracks.length > 0 && (
                  <div className="max-w-4xl mx-auto mt-6">
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest text-left mb-3 px-2">
                      Additional {activeTrackCategory} Programs
                    </h4>

                    <div className="bg-white border border-zinc-200 rounded-2xl p-2 shadow-xs space-y-1 text-left">
                      {relatedTracks.slice(0, 1).map((track, rIdx) => renderTrackRow(track, rIdx))}

                      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"}`}>
                        <div className="space-y-1 pt-1 border-t border-zinc-100 mt-1">
                          {relatedTracks.slice(1).map((track, rIdx) => renderTrackRow(track, rIdx + 1))}
                        </div>
                      </div>
                    </div>

                    {relatedTracks.length > 1 && (
                      <div className="flex justify-center mt-6">
                        <button
                          onClick={() => setIsExpanded(!isExpanded)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-500 hover:text-zinc-800 text-xs font-bold shadow-xs transition-all cursor-pointer"
                        >
                          <span>{isExpanded ? "Show Less" : `Explore ${relatedTracks.length - 1} More Program${relatedTracks.length > 2 ? "s" : ""}`}</span>
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

        {/* 5. LEARNING OUTCOMES SECTION */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 relative z-10 border-b border-zinc-200 bg-[#FFF9ED]/20">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs text-[#FF7A00] font-bold uppercase tracking-wider bg-[#FFF3EB] px-3 py-1 rounded-full border border-[#FFE0CC]">Vetted Outcomes</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
              Verified Learning Outcomes
            </h2>
            <p className="text-zinc-550 text-sm font-light">
              Compare conventional course certificates with IQIntern's metric-driven skill verification values.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Conventional Course Card */}
            <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 space-y-6 text-left">
              <h3 className="text-sm font-black text-red-500 uppercase tracking-wider flex items-center gap-2">
                Conventional Course Attendance
              </h3>
              <ul className="space-y-4">
                {[
                  "Theory-heavy lessons without strict project code requirements.",
                  "Zero validation testing — certificates sent for purely watching video lists.",
                  "Assessments are simple, non-proctored, and vulnerable to plagiarised submissions.",
                  "Generic files without details on grades, project structures, or scores.",
                  "Requires manual verification emails causing long onboarding placement delays."
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-3 items-start text-xs sm:text-sm text-zinc-500 leading-relaxed font-light">
                    <span className="h-5 w-5 rounded-full bg-red-50 border border-red-100 flex items-center justify-center shrink-0 text-red-500 font-bold text-[10px]">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* IQIntern Verified Outcome Card */}
            <div className="bg-white border border-[#E9D8B4] rounded-3xl p-6 sm:p-8 space-y-6 text-left shadow-xs">
              <h3 className="text-sm font-black text-emerald-600 uppercase tracking-wider flex items-center gap-2">
                The IQIntern Evaluation Standard
              </h3>
              <ul className="space-y-4">
                {[
                  "Mandatory hands-on projects showing actual functional deployments.",
                  "Curriculum designed on practical parameters vetted by tech leaders.",
                  "Secure timed evaluations utilizing protection controls against tab-switching.",
                  "Immutable online certificates verified instantly via ID lookup databases.",
                  "Comprehensive performance scorecards displaying detailed grading metrics."
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-3 items-start text-xs sm:text-sm text-zinc-805 leading-relaxed font-semibold">
                    <span className="h-5 w-5 rounded-full bg-emerald-50 border border-emerald-150 flex items-center justify-center shrink-0 text-emerald-600 font-bold text-xs">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 6. WHY CHOOSE IQINTERN SECTION */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 relative z-10 border-b border-zinc-200">
          <div className="flex flex-col lg:flex-row items-center gap-12 bg-white border border-zinc-200 rounded-3xl p-6 sm:p-10">
            <div className="lg:w-7/12 space-y-5 text-left">
              <span className="text-xs text-[#FF7A00] font-bold uppercase tracking-wider block">Skill Validation</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight leading-snug">
                Why Professional Verification is Essential
              </h2>
              <p className="text-zinc-550 text-xs sm:text-sm leading-relaxed font-light">
                Generic training listings fail to convince modern recruiters. IQIntern shifts the placement search by delivering proctored, metric-driven verification scores that detail actual technical achievements, building trust instantly.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold pt-2">
                <div className="flex items-center gap-2 text-zinc-700">
                  <span className="h-2 w-2 rounded-full bg-[#FF7A00]" />
                  <span>Proctored Assessment Protections</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-700">
                  <span className="h-2 w-2 rounded-full bg-[#FF7A00]" />
                  <span>Live Verification Lookup Portals</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-700">
                  <span className="h-2 w-2 rounded-full bg-[#F9B300]" />
                  <span>Deep Grade Analytics Breakdown</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-700">
                  <span className="h-2 w-2 rounded-full bg-[#F9B300]" />
                  <span>Structured Practical Blueprints</span>
                </div>
              </div>
            </div>

            <div className="lg:w-5/12 w-full bg-[#FFF9ED] border border-[#E9D8B4] p-6 rounded-2xl space-y-4 text-left">
              <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Placement Acceleration Solutions</h4>
              <div className="space-y-3 text-xs text-zinc-650 font-light leading-relaxed">
                <p>
                  <strong>Curriculum Rigor:</strong> Unlike generic portals, we focus exclusively on live deployment builds, code review rules, and proctored timed testing.
                </p>
                <p>
                  <strong>Trust Factor:</strong> Scorecards allow recruiters to verify candidates directly, reducing background review back-and-forth processes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 7. INDUSTRY MENTORS AND FACULTY SECTION */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 relative z-10 border-b border-zinc-200">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs text-[#FF7A00] font-bold uppercase tracking-wider bg-[#FFF3EB] px-3 py-1 rounded-full border border-[#FFE0CC]">Expert Guidance</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
              Curriculum Advisory & Industry Mentors
            </h2>
            <p className="text-zinc-550 text-sm font-light">
              Learn curriculum blueprints designed and vetted by professionals from top global tech organizations.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {mentors.map((mentor, mIdx) => (
              <div key={mIdx} className="bg-white border border-zinc-200 rounded-2xl p-5 space-y-4 text-center hover:border-[#FF7A00]/30 hover:shadow-xs transition-all duration-300">
                <div className="h-14 w-14 rounded-full bg-[#FFF9ED] border border-[#E9D8B4] text-[#F9B300] font-bold text-lg flex items-center justify-center mx-auto">
                  {mentor.initial}
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-zinc-900">{mentor.name}</h4>
                  <p className="text-[10px] text-zinc-450 uppercase tracking-wider font-extrabold">{mentor.role}</p>
                  <span className="inline-block text-[9px] bg-zinc-50 border border-zinc-150 px-2 py-0.5 rounded text-zinc-500 mt-1 font-bold">
                    {mentor.company}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 8. STUDENT TRANSFORMATION TIMELINE SECTION */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 relative z-10 border-b border-zinc-200 bg-[#FFF9ED]/10">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs text-[#F9B300] font-bold uppercase tracking-wider bg-[#FFF9ED] px-3 py-1 rounded-full border border-[#FFE699]">Transformation Maps</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
              Student Career Transformations
            </h2>
            <p className="text-zinc-550 text-sm font-light">
              Real cases showing candidate placement acceleration before and after completing their evaluations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto text-left">
            {caseStudies.map((study, idx) => (
              <div key={idx} className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 space-y-5 hover:border-[#FF7A00]/25 transition-all">
                <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
                  <h3 className="text-base font-black text-zinc-900">{study.student}</h3>
                  <span className="text-[10px] font-extrabold text-[#FF7A00] bg-[#FFF3EB] border border-[#FFE0CC] px-2.5 py-0.5 rounded-full uppercase">
                    {study.tag}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
                  <div className="p-4 bg-red-50/20 border border-red-100 rounded-xl space-y-1">
                    <p className="font-extrabold text-red-600 uppercase tracking-widest text-[9px]">Struggle / Before</p>
                    <p className="text-zinc-500 font-light">{study.before}</p>
                  </div>
                  <div className="p-4 bg-emerald-50/20 border border-emerald-150 rounded-xl space-y-1">
                    <p className="font-extrabold text-emerald-700 uppercase tracking-widest text-[9px]">Placement / After</p>
                    <p className="text-zinc-800 font-semibold">{study.after}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 9. TESTIMONIALS SECTION */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 relative z-10 border-b border-zinc-200">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs text-[#FF7A00] font-bold uppercase tracking-wider bg-[#FFF3EB] px-3 py-1 rounded-full border border-[#FFE0CC]">Stakeholder Reviews</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
              Trusted by Candidates & Administrators
            </h2>
            <p className="text-[#555555] text-sm font-light">
              Read how candidates and placement offices leverage our metric-driven vocational certifications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Student Review */}
            <div className="bg-white border-l-4 border-[#F9B300] border-y border-r border-zinc-200 rounded-r-2xl rounded-l-md p-6 flex flex-col justify-between hover:shadow-xs transition-shadow bg-zinc-50/10">
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-[#FFF9ED] border border-[#E9D8B4] flex items-center justify-center text-[#F9B300] font-bold text-xs">P</div>
                  <div>
                    <h5 className="text-xs font-bold text-zinc-900">Priya Patel</h5>
                    <p className="text-[9px] text-zinc-400 font-medium">Software Engineer</p>
                  </div>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed font-light italic">
                  &ldquo;The curriculum blueprints were incredibly thorough. Completing the projects and passing the tab-protected timed evaluations gave me a verified scorecard that got my application approved without delay.&rdquo;
                </p>
              </div>
              <span className="text-[10px] font-bold text-[#F9B300] block mt-4 uppercase tracking-wider text-left">✓ Verified Alumna</span>
            </div>

            {/* Faculty Review */}
            <div className="bg-white border-l-4 border-[#FF7A00] border-y border-r border-zinc-200 rounded-r-2xl rounded-l-md p-6 flex flex-col justify-between hover:shadow-xs transition-shadow bg-zinc-50/10">
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-[#FFF3EB] border border-[#FFE0CC] flex items-center justify-center text-[#FF7A00] font-bold text-xs">R</div>
                  <div>
                    <h5 className="text-xs font-bold text-zinc-900">Prof. Rajesh Kumar</h5>
                    <p className="text-[9px] text-zinc-400 font-medium">Placement Hub Coordinator</p>
                  </div>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed font-light italic">
                  &ldquo;Monitoring candidate learning assessments has never been simpler. The proctored scoring dashboards protect our compliance logs while giving placements team clear, verifiable details of student competence.&rdquo;
                </p>
              </div>
              <span className="text-[10px] font-bold text-[#FF7A00] block mt-4 uppercase tracking-wider text-left">✓ Verified Coordinator</span>
            </div>

            {/* Recruiter Review */}
            <div className="bg-white border-l-4 border-emerald-500 border-y border-r border-zinc-200 rounded-r-2xl rounded-l-md p-6 flex flex-col justify-between hover:shadow-xs transition-shadow bg-zinc-50/10">
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-emerald-50 border border-emerald-250 flex items-center justify-center text-emerald-600 font-bold text-xs">M</div>
                  <div>
                    <h5 className="text-xs font-bold text-zinc-900">Meera Sen</h5>
                    <p className="text-[9px] text-zinc-400 font-medium">Director, Talent Acquisition</p>
                  </div>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed font-light italic">
                  &ldquo;Credential fraud is a primary concern in volume sourcing. Scannable verification dashboard links solve verification delays instantly. Excellent standard that details score outcomes.&rdquo;
                </p>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 block mt-4 uppercase tracking-wider text-left">✓ Verified Partner</span>
            </div>
          </div>
        </section>

        {/* 10. CTA SECTION */}
        <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8 relative z-10">
          <div className="rounded-3xl border border-[#E9D8B4] bg-[#FFF9ED] p-8 sm:p-12 text-center relative overflow-hidden shadow-xs">
            <div className="max-w-2xl mx-auto space-y-6 relative z-10">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900">Accelerate Your Technical Readiness</h2>
              <p className="text-sm sm:text-base text-zinc-500 leading-relaxed font-light">
                Join IQIntern today, attempt proctored evaluations, and download verified performance credentials to accelerate your corporate recruitment journey.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <Link
                  href="/auth/register"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-[#F9B300] hover:bg-[#E6A500] px-8 py-3.5 text-xs font-bold text-zinc-900 transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  Create Account
                </Link>
                <Link
                  href="/contact"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-zinc-250 bg-white hover:bg-zinc-50 px-8 py-3.5 text-xs font-bold text-zinc-700 transition-all cursor-pointer active:scale-95"
                >
                  Contact Advisors
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 11. PREMIUM FOOTER */}
      <Footer />
    </div>
  );
}
