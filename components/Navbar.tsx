/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  getCurrentUser,
  signOut,
  UserSession,
  devToggleRole
} from "@/lib/supabase/auth";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { Menu, X, ShieldAlert, LogOut, LayoutDashboard, Briefcase, Info, Mail, LogIn, UserPlus } from "lucide-react";
import { BRANDING } from "@/config/branding";

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<UserSession | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [supabaseConfigured, setSupabaseConfigured] = useState(false);
  // Track scroll position to restore on iOS after body lock
  const scrollYRef = useRef(0);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    fetchUser();
    setSupabaseConfigured(isSupabaseConfigured());
  }, [pathname]);

  // iOS-safe body scroll lock
  // On iOS Safari, `overflow: hidden` on body/html does NOT prevent scrolling.
  // The correct approach is to freeze the body at its current scroll position using
  // `position: fixed` + `top: -scrollY`, then restore on close.
  useEffect(() => {
    if (isMobileMenuOpen) {
      // Capture current scroll position before locking
      scrollYRef.current = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollYRef.current}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.overflow = "hidden";
      document.body.style.width = "100%";
    } else {
      // Restore body and scroll position
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollYRef.current);
    }
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      document.body.style.width = "";
    };
  }, [isMobileMenuOpen]);

  // Close drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await signOut();
    setUser(null);
    window.location.href = "/";
  };

  const navLinks = [
    { name: "Home", href: "/", icon: null },
    { name: "About", href: "/about", icon: Info },
    { name: "Internships", href: "/internships", icon: Briefcase },
    { name: "Contact", href: "/contact", icon: Mail },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const handleVerifyScroll = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (pathname === "/") {
      // Restore scroll first on iOS before attempting to scroll to element
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.overflow = "";
      window.scrollTo(0, scrollYRef.current);
      setTimeout(() => {
        const el = document.getElementById("verify");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 50);
    } else {
      window.location.href = "/#verify";
    }
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      {/* Navbar bar — isolated from drawer to avoid stacking context issues */}
      <div className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-7xl">
        <nav className="glass-navbar rounded-2xl">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <Link
                  href={user ? (user.role === "admin" ? "/admin/dashboard" : "/student/dashboard") : "/"}
                  className="group flex items-center gap-2"
                >
                  <img
                    src={BRANDING.logoIcon}
                    className="h-12 w-auto object-contain group-hover:scale-105 transition-all"
                    alt={BRANDING.name}
                  />
                </Link>
              </div>

              {/* Desktop Nav Links */}
              <div className="hidden md:flex items-center space-x-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-sm font-semibold px-4 py-2 rounded-full transition-all duration-200 ${
                      isActive(link.href)
                        ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/20"
                        : "text-zinc-600 hover:bg-indigo-50 hover:text-indigo-700"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                <button
                  onClick={handleVerifyScroll}
                  className="text-sm font-semibold px-4 py-2 rounded-full transition-all duration-200 text-zinc-600 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer"
                >
                  Verify Certificate
                </button>
              </div>

              {/* User Controls / Auth Buttons */}
              <div className="hidden md:flex items-center space-x-4">
                {/* Developer Mode Role Toggle */}
                {!supabaseConfigured && user && (
                  <button
                    onClick={devToggleRole}
                    title="Mock Mode: Click to switch Admin / Student role"
                    className="flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 hover:bg-amber-100 transition-all cursor-pointer"
                  >
                    <ShieldAlert className="h-3.5 w-3.5 text-amber-600 animate-pulse" />
                    Role: {user.role === "admin" ? "Admin" : "Student"}
                  </button>
                )}

                {user ? (
                  <div className="flex items-center space-x-4">
                    <Link
                      href={user.role === "admin" ? "/admin/dashboard" : "/student/dashboard"}
                      className="flex items-center gap-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200/60 border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-600 hover:text-zinc-850 transition-all shadow-sm"
                    >
                      <LayoutDashboard className="h-4 w-4 text-indigo-500" />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-1.5 rounded-xl border border-red-200 hover:border-red-300 hover:bg-red-50/50 px-4 py-2 text-sm font-semibold text-red-500 hover:text-red-650 transition-all cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <Link
                      href="/auth/login"
                      className="flex items-center gap-1.5 text-sm font-semibold text-zinc-650 hover:text-indigo-600 transition-colors"
                    >
                      <LogIn className="h-4.5 w-4.5" />
                      Login
                    </Link>
                    <Link
                      href="/auth/register"
                      className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-500 hover:from-indigo-700 hover:to-violet-650 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 active:scale-98 transition-all"
                    >
                      <UserPlus className="h-4.5 w-4.5" />
                      Register Now
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <div className="flex md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="inline-flex items-center justify-center rounded-xl p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-800 transition-colors"
                  aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                  aria-expanded={isMobileMenuOpen}
                  aria-controls="mobile-nav-drawer"
                >
                  {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/*
        MOBILE DRAWER — rendered as a React Portal target OUTSIDE the navbar div.
        
        iOS WebKit root causes fixed here:
        1. Drawer is NOT a child of the fixed navbar div — avoids inherited stacking context
           from backdrop-filter on .glass-navbar (which creates a new compositing layer on WebKit)
        2. Uses position: fixed with explicit top/left/right/bottom instead of inset shorthand
           for maximum WebKit compatibility
        3. Height uses 100dvh (dynamic viewport height) with 100vh fallback — prevents
           the drawer being clipped by iOS Safari's URL bar
        4. No transform-based animation on the drawer itself — avoids iOS WebKit bug where
           transform on a fixed element repositions it relative to the transformed ancestor
        5. Solid background #ffffff (no alpha) — prevents content bleed-through
        6. Backdrop uses pointer-events-none alternative: a separate fixed overlay handles clicks
      */}
      {isMobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="mobile-drawer-root md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          {/* Dark backdrop overlay */}
          <div
            className="mobile-drawer-backdrop"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="mobile-drawer-panel">
            {/* Drawer Header */}
            <div className="mobile-drawer-header">
              <Link href="/" onClick={closeMobileMenu} aria-label="Go to home">
                <img
                  src={BRANDING.logoIcon}
                  className="h-10 w-auto object-contain"
                  alt={BRANDING.name}
                />
              </Link>
              <button
                onClick={closeMobileMenu}
                className="p-2 rounded-xl hover:bg-slate-100 text-zinc-500 hover:text-zinc-800 transition-colors cursor-pointer"
                aria-label="Close navigation menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Nav Links — scrollable section */}
            <nav className="mobile-drawer-nav">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                    isActive(link.href)
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-zinc-700 hover:bg-indigo-50 hover:text-indigo-700"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <button
                onClick={handleVerifyScroll}
                className="w-full text-left flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 text-zinc-700 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer"
              >
                Verify Certificate
              </button>
            </nav>

            {/* Auth / User Controls — fixed footer of drawer */}
            <div className="mobile-drawer-footer">
              {/* Developer Mode Role Toggle */}
              {!supabaseConfigured && user && (
                <button
                  onClick={() => {
                    devToggleRole();
                    closeMobileMenu();
                  }}
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 py-2.5 text-sm font-bold text-amber-700 hover:bg-amber-100 transition-all"
                >
                  <ShieldAlert className="h-4 w-4 text-amber-400" />
                  Change Role (Currently: {user.role})
                </button>
              )}

              {user ? (
                <div className="space-y-2">
                  <Link
                    href={user.role === "admin" ? "/admin/dashboard" : "/student/dashboard"}
                    onClick={closeMobileMenu}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 py-2.5 text-sm font-bold text-white transition-all shadow-sm"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      closeMobileMenu();
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white hover:bg-red-50 py-2.5 text-sm font-bold text-red-600 hover:text-red-700 transition-all cursor-pointer shadow-sm"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/auth/login"
                    onClick={closeMobileMenu}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
                  >
                    <LogIn className="h-4 w-4" />
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={closeMobileMenu}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-500 hover:from-indigo-700 hover:to-violet-600 py-2.5 text-sm font-bold text-white shadow-sm"
                  >
                    <UserPlus className="h-4 w-4" />
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
