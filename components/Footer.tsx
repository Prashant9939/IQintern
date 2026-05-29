import Link from "next/link";
import { 
  Award, 
  ShieldCheck, 
  Zap, 
  Briefcase, 
  Globe, 
  Smartphone, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard, 
  Wallet, 
  Landmark,
  GraduationCap
} from "lucide-react";

// Inline SVG brand icons since lucide-react deprecated them in v0.400+
const LinkedInIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const GitHubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

export default function Footer() {
  const featureBadges = [
    { text: "Industry Certified", icon: GraduationCap, color: "text-amber-500 bg-amber-50 border-amber-100" },
    { text: "Secure Platform", icon: ShieldCheck, color: "text-indigo-500 bg-indigo-50 border-indigo-100" },
    { text: "Instant Access", icon: Zap, color: "text-violet-500 bg-violet-50 border-violet-100" },
    { text: "Internship Experience", icon: Briefcase, color: "text-emerald-500 bg-emerald-50 border-emerald-100" },
    { text: "Expert Guidance", icon: Globe, color: "text-blue-500 bg-blue-50 border-blue-100" },
    { text: "Mobile Friendly", icon: Smartphone, color: "text-rose-500 bg-rose-50 border-rose-100" }
  ];

  const paymentMethods = [
    { name: "Credit Cards", icon: CreditCard },
    { name: "Debit Cards", icon: CreditCard },
    { name: "UPI", icon: Smartphone },
    { name: "Net Banking", icon: Landmark },
    { name: "Wallet", icon: Wallet },
    { name: "EMI", icon: Award }
  ];

  return (
    <footer className="w-full bg-gradient-to-b from-white via-zinc-50/50 to-zinc-100/90 border-t border-zinc-200/80 pt-16 pb-8 mt-auto shadow-[0_-8px_30px_-15px_rgba(0,0,0,0.03)] relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-0 h-80 w-80 rounded-full bg-violet-500/5 blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Main Grid: Branding and Link Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand Info (Col span 4) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg text-zinc-900 group w-fit">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white font-black group-hover:scale-105 transition-transform shadow-sm">
                SI
              </div>
              <span className="text-xl font-extrabold tracking-tight">
                Skill<span className="text-indigo-600 font-black">Intern</span>
              </span>
            </Link>
            
            <div className="space-y-1">
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Empowering Students, Building Future Careers
              </p>
              <p className="text-[11px] text-zinc-400 font-medium leading-none">
                A Professional Internship & Certification Platform
              </p>
            </div>
            
            <p className="text-zinc-500 text-xs sm:text-sm font-light leading-relaxed">
              SkillIntern helps students gain practical industry exposure through internship programs, assessments, certification, and career-focused learning experiences across multiple domains.
            </p>

            {/* Social Icons with custom borders & hover gradients */}
            <div className="flex gap-2.5 pt-2">
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="h-8.5 w-8.5 rounded-xl border border-zinc-200 bg-white text-zinc-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/30 flex items-center justify-center transition-all cursor-pointer"
                title="LinkedIn"
              >
                <LinkedInIcon className="h-4 w-4" />
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="h-8.5 w-8.5 rounded-xl border border-zinc-200 bg-white text-zinc-500 hover:text-zinc-900 hover:border-zinc-300 hover:bg-zinc-50 flex items-center justify-center transition-all cursor-pointer"
                title="GitHub"
              >
                <GitHubIcon className="h-4 w-4" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="h-8.5 w-8.5 rounded-xl border border-zinc-200 bg-white text-zinc-500 hover:text-sky-500 hover:border-sky-200 hover:bg-sky-50/30 flex items-center justify-center transition-all cursor-pointer"
                title="Twitter"
              >
                <TwitterIcon className="h-4 w-4" />
              </a>
              <a 
                href="mailto:support@skillintern.com" 
                className="h-8.5 w-8.5 rounded-xl border border-zinc-200 bg-white text-zinc-500 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50/30 flex items-center justify-center transition-all cursor-pointer"
                title="Email Support"
              >
                <Mail className="h-4 w-4" />
              </a>
              <a 
                href="tel:+919939503289" 
                className="h-8.5 w-8.5 rounded-xl border border-zinc-200 bg-white text-zinc-500 hover:text-emerald-500 hover:border-emerald-200 hover:bg-emerald-50/30 flex items-center justify-center transition-all cursor-pointer"
                title="Phone Support"
              >
                <Phone className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Links Column 1: Platform (Col span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider border-b border-zinc-200/60 pb-2">
              Platform
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/#features" className="text-xs text-zinc-500 hover:text-indigo-600 font-medium transition-colors cursor-pointer">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/internships" className="text-xs text-zinc-500 hover:text-indigo-600 font-medium transition-colors cursor-pointer">
                  Internship Programs
                </Link>
              </li>
              <li>
                <Link href="/#certifications" className="text-xs text-zinc-500 hover:text-indigo-600 font-medium transition-colors cursor-pointer">
                  Certifications
                </Link>
              </li>
              <li>
                <Link href="/student/dashboard" className="text-xs text-zinc-500 hover:text-indigo-600 font-medium transition-colors cursor-pointer">
                  Student Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 2: Support (Col span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider border-b border-zinc-200/60 pb-2">
              Support
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/#faqs" className="text-xs text-zinc-500 hover:text-indigo-600 font-medium transition-colors cursor-pointer">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/#help" className="text-xs text-zinc-500 hover:text-indigo-600 font-medium transition-colors cursor-pointer">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-xs text-zinc-500 hover:text-indigo-600 font-medium transition-colors cursor-pointer">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/#verify" className="text-xs text-zinc-500 hover:text-indigo-600 font-medium transition-colors cursor-pointer">
                  Student Verification
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 3: Company (Col span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider border-b border-zinc-200/60 pb-2">
              Company
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/about" className="text-xs text-zinc-500 hover:text-indigo-600 font-medium transition-colors cursor-pointer">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/#careers" className="text-xs text-zinc-500 hover:text-indigo-600 font-medium transition-colors cursor-pointer">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/#stories" className="text-xs text-zinc-500 hover:text-indigo-600 font-medium transition-colors cursor-pointer">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link href="/#insights" className="text-xs text-zinc-500 hover:text-indigo-600 font-medium transition-colors cursor-pointer">
                  Insights
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 4: Legal (Col span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider border-b border-zinc-200/60 pb-2">
              Legal
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/#privacy" className="text-xs text-zinc-500 hover:text-indigo-600 font-medium transition-colors cursor-pointer">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/#terms" className="text-xs text-zinc-500 hover:text-indigo-600 font-medium transition-colors cursor-pointer">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/#refund" className="text-xs text-zinc-500 hover:text-indigo-600 font-medium transition-colors cursor-pointer">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/#cookies" className="text-xs text-zinc-500 hover:text-indigo-600 font-medium transition-colors cursor-pointer">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-zinc-200/60" />

        {/* Feature Badges & Get In Touch Double Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Modern Rounded Feature Badges (Col span 7) */}
          <div className="lg:col-span-7 space-y-4">
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
              Why SkillIntern?
            </h4>
            <div className="flex flex-wrap gap-2.5">
              {featureBadges.map((badge, idx) => {
                const Icon = badge.icon;
                return (
                  <div 
                    key={idx} 
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-xs font-bold shadow-sm transition-all hover:-translate-y-0.5 cursor-default ${badge.color}`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {badge.text}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contact Details & Trust Indicators (Col span 5) */}
          <div className="lg:col-span-5 space-y-4">
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
              Get In Touch & Security
            </h4>
            
            {/* Modern Card-Style Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Phone & Email Card */}
              <div className="bg-white/80 backdrop-blur border border-zinc-200/80 p-4 rounded-2xl shadow-sm hover:border-indigo-200 transition-all flex flex-col gap-2">
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">Direct Contact</span>
                <a href="mailto:support@skillintern.com" className="text-xs text-zinc-700 hover:text-indigo-600 font-bold flex items-center gap-1.5 transition-colors">
                  <Mail className="h-3.5 w-3.5 text-indigo-500" />
                  support@skillintern.com
                </a>
                <a href="tel:+919939503289" className="text-xs text-zinc-700 hover:text-indigo-600 font-bold flex items-center gap-1.5 transition-colors">
                  <Phone className="h-3.5 w-3.5 text-emerald-500" />
                  +91 9939503289
                </a>
              </div>

              {/* Address & Trust Indicators Card */}
              <div className="bg-white/80 backdrop-blur border border-zinc-200/80 p-4 rounded-2xl shadow-sm hover:border-indigo-200 transition-all flex flex-col gap-2">
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">Office & Trust</span>
                <span className="text-xs text-zinc-700 font-bold flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                  Bhojpur, Bihar, India
                </span>
                <div className="flex gap-2 pt-1 border-t border-zinc-100 mt-1">
                  <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                    ✓ 100% Secure
                  </span>
                  <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded">
                    ★ Industry Ready
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-zinc-200/60" />

        {/* Bottom Section: Copyright, Payments, Counter */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-2">
          
          {/* Copyright Info */}
          <div className="space-y-1 text-center md:text-left">
            <p className="text-xs font-bold text-zinc-800">
              © 2026 SkillIntern. All rights reserved.
            </p>
            <p className="text-[10px] text-zinc-400 font-light leading-none">
              Designed for modern internship and certification experiences.
            </p>
          </div>

          {/* Payment Methods */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider mr-1">Supported Payments:</span>
            {paymentMethods.map((pay, idx) => {
              const PayIcon = pay.icon;
              return (
                <div 
                  key={idx} 
                  className="flex items-center gap-1 bg-white border border-zinc-200/80 px-2.5 py-1 rounded-lg text-[9px] font-bold text-zinc-600 shadow-sm cursor-default hover:border-zinc-350 transition-colors"
                  title={pay.name}
                >
                  <PayIcon className="h-3 w-3 text-zinc-400" />
                  {pay.name}
                </div>
              );
            })}
          </div>

          {/* Glowing Student Counter Badge */}
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
              24,000+ Students Enrolled
            </span>
          </div>

        </div>

      </div>
    </footer>
  );
}
