import Link from "next/link";
import { BRANDING } from "@/config/branding";

export default function Footer() {
  return (
    <div className="antigravity-footer-container">
      <footer className="antigravity-footer-main">
        <div className="mx-auto max-w-7xl w-full">
          {/* Footer Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 mb-12 text-left">

            {/* Column 1: Brand (Col-span 4) */}
            <div className="lg:col-span-4 antigravity-footer-card">
              <Link href="/" className="inline-block mb-1">
                <img
                  src="/white-logo.png"
                  alt="IQIntern"
                  className="h-21 w-auto object-contain"
                />
              </Link>
              <p className="text-xs text-[#A3A3A3] font-light leading-relaxed">
                Empowering next-gen professionals with proctored verification testing, structured domain blueprints, and instant scorecard lookups.
              </p>
              <div className="flex gap-3">
                {/* Twitter */}
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="antigravity-social-btn"
                  aria-label="Twitter"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                {/* LinkedIn */}
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="antigravity-social-btn"
                  aria-label="LinkedIn"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="antigravity-social-btn"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Column 2: Quick Links (Col-span 2) */}
            <div className="lg:col-span-2 antigravity-footer-card">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Quick Links</h4>
              <div className="flex flex-col gap-3">
                <Link href="/" className="antigravity-footer-link text-xs text-[#A3A3A3] hover:text-[#F9B300] no-underline">
                  Home
                </Link>
                <Link href="/about" className="antigravity-footer-link text-xs text-[#A3A3A3] hover:text-[#F9B300] no-underline">
                  About Us
                </Link>
                <Link href="/internships" className="antigravity-footer-link text-xs text-[#A3A3A3] hover:text-[#F9B300] no-underline">
                  Internship Tracks
                </Link>
                <Link href="/verify" className="antigravity-footer-link text-xs text-[#A3A3A3] hover:text-[#F9B300] no-underline">
                  Verify Certificate
                </Link>
                <Link href="/contact" className="antigravity-footer-link text-xs text-[#A3A3A3] hover:text-[#F9B300] no-underline">
                  Contact Us
                </Link>
              </div>
            </div>

            {/* Column 3: Resources (Col-span 2) */}
            <div className="lg:col-span-2 antigravity-footer-card">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Resources</h4>
              <div className="flex flex-col gap-3">
                <Link href="/#faqs" className="antigravity-footer-link text-xs text-[#A3A3A3] hover:text-[#F9B300] no-underline">
                  FAQs
                </Link>
                <Link href="/contact" className="antigravity-footer-link text-xs text-[#A3A3A3] hover:text-[#F9B300] no-underline">
                  Support Center
                </Link>
                <span className="text-xs text-[#555] cursor-not-allowed">
                  Blog
                </span>
                <Link href="/internships" className="antigravity-footer-link text-xs text-[#A3A3A3] hover:text-[#F9B300] no-underline">
                  Career Paths
                </Link>
                <Link href="/verify" className="antigravity-footer-link text-xs text-[#A3A3A3] hover:text-[#F9B300] no-underline">
                  Scorecard Guide
                </Link>
              </div>
            </div>

            {/* Column 4: Contact (Col-span 4) */}
            <div className="lg:col-span-4 antigravity-footer-card text-left space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Contact</h4>
              <div className="space-y-3.5 text-xs text-[#A3A3A3]">
                <div className="flex items-start gap-2.5">
                  <svg className="w-4 h-4 text-[#F9B300] shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <a href="mailto:support.iqintern@gmail.com" className="hover:text-[#F9B300] transition-colors truncate">
                    support.iqintern@gmail.com
                  </a>
                </div>

                <div className="flex items-start gap-2.5">
                  <svg className="w-4 h-4 text-[#F9B300] shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <a href="tel:+919939503289" className="hover:text-[#F9B300] transition-colors">
                    +91 9939503289
                  </a>
                </div>

                <div className="flex items-start gap-2.5">
                  <svg className="w-4 h-4 text-[#F9B300] shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>
                    Sector 154, Noida,<br />Uttar Pradesh, India
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom copyright bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-t border-[#262626] pt-8 mt-8 text-xs text-[#A3A3A3]">
            <div>
              © 2026 {BRANDING.name}. All rights reserved.
            </div>
            <div className="flex gap-5">
              <Link href="/privacy-policy" className="hover:text-[#F9B300] transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-and-conditions" className="hover:text-[#F9B300] transition-colors">
                Terms & Conditions
              </Link>
              <Link href="/refund-policy" className="hover:text-[#F9B300] transition-colors">
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
