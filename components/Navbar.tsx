/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getCurrentUser,
  signOut,
  UserSession,
  devToggleRole
} from "@/lib/supabase/auth";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import {
  ShieldAlert,
  LogOut,
  LayoutDashboard,
  LogIn,
  Menu,
  X
} from "lucide-react";
import { BRANDING } from "@/config/branding";

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<UserSession | null>(null);
  const [supabaseConfigured, setSupabaseConfigured] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    fetchUser();
    setSupabaseConfigured(isSupabaseConfigured());
  }, [pathname]);

  // Monitor scroll for shadow and blur transitions
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut();
    setUser(null);
    window.location.href = "/";
  };

  const navLinks = [
    { name: "Programs", href: "/internships" },
    { name: "Learning Journey", href: "/#journey" },
    { name: "Certification", href: "/verify" },
    { name: "About", href: "/about" },
    { name: "FAQ", href: "/#faqs" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) {
      return pathname === "/" && typeof window !== "undefined" && window.location.hash === href.substring(1);
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-20 flex items-center ${isScrolled
          ? "bg-white/80 backdrop-blur-md border-b border-zinc-200/80 shadow-xs"
          : "bg-white border-b border-transparent"
          }`}
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">

          {/* Brand Logo on the Left */}
          <div className="flex items-center">
            <Link
              href="/"
              className="group flex items-center gap-2"
              aria-label="Go to home"
            >
              <img
                src={BRANDING.logoIcon}
                className="h-31 w-auto object-contain group-hover:scale-105 transition-all"
                alt={BRANDING.name}
              />
            </Link>
          </div>

          {/* Desktop Nav Links (Hidden on Mobile/Tablet < md) */}
          <nav className="hidden md:flex items-center space-x-8 lg:space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`relative text-sm font-bold py-2 transition-all duration-200 text-zinc-800 hover:text-[#F9B300] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:scale-x-0 after:bg-[#F9B300] after:transition-transform after:duration-300 hover:after:scale-x-100 ${isActive(link.href) ? "text-[#F9B300] after:scale-x-100" : ""
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth / Controls (Hidden on Mobile/Tablet < md) */}
          <div className="hidden md:flex items-center space-x-4">
            {!supabaseConfigured && user && (
              <button
                onClick={devToggleRole}
                title="Mock Mode: Click to switch Admin / Student role"
                className="flex items-center gap-1.5 rounded-full border border-[#FFE699] bg-[#FFF9ED] px-3 py-1 text-xs font-bold text-[#F9B300] hover:bg-[#FFE699] transition-all cursor-pointer shadow-xs"
              >
                <ShieldAlert className="h-3.5 w-3.5 text-[#F9B300]" />
                Role: {user.role === "admin" ? "Admin" : "Student"}
              </button>
            )}

            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  href={user.role === "admin" ? "/admin/dashboard" : "/student/dashboard"}
                  className="flex items-center gap-1.5 rounded-xl bg-zinc-50 border border-zinc-200 px-4 py-2 text-xs font-bold text-zinc-700 hover:bg-zinc-100 transition-all shadow-xs"
                >
                  <LayoutDashboard className="h-4 w-4 text-[#F9B300]" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 rounded-xl border border-red-200 hover:border-red-300 hover:bg-red-50/50 px-4 py-2 text-xs font-bold text-red-500 transition-all cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-6">
                <Link
                  href="/auth/login"
                  className="text-sm font-bold text-zinc-800 hover:text-[#F9B300] transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="flex items-center gap-1.5 rounded-xl bg-[#F9B300] hover:bg-[#E6A500] px-5 py-2.5 text-sm font-bold text-zinc-900 shadow-xs transition-all active:scale-98"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Trigger & Controls */}
          <div className="flex md:hidden items-center gap-3">
            {!supabaseConfigured && user && (
              <button
                onClick={devToggleRole}
                title="Mock Mode: Click to switch Admin / Student role"
                className="flex items-center gap-1 bg-[#FFF9ED] border border-[#FFE699] px-2 py-0.5 rounded text-[10px] font-bold text-[#F9B300]"
              >
                Role: {user.role === "admin" ? "Admin" : "Student"}
              </button>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-650 transition-colors focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-20 left-0 right-0 bg-white border-b border-zinc-200 shadow-lg z-45 animate-slide-down">
          <div className="px-4 pt-4 pb-6 space-y-3.5 bg-white text-left">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${isActive(link.href)
                  ? "bg-[#FFF9ED] text-[#FF7A00]"
                  : "text-zinc-600 hover:bg-zinc-50"
                  }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="border-t border-zinc-100 pt-4 flex flex-col gap-3">
              {user ? (
                <>
                  <Link
                    href={user.role === "admin" ? "/admin/dashboard" : "/student/dashboard"}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex h-11 items-center justify-center rounded-xl bg-zinc-50 border border-zinc-200 px-4 text-sm font-bold text-zinc-700 transition-all hover:bg-zinc-100"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex h-11 items-center justify-center rounded-xl border border-red-200 bg-red-50/20 px-4 text-sm font-bold text-red-500 cursor-pointer hover:bg-red-50 transition-all"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex h-11 items-center justify-center rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 px-4 text-sm font-bold text-zinc-700 transition-all"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex h-11 items-center justify-center rounded-xl bg-[#F9B300] hover:bg-[#E6A500] px-4 text-sm font-bold text-zinc-900 transition-all shadow-xs"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
