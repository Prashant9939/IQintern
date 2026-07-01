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
import { ShieldAlert, LogOut, LayoutDashboard, LogIn, UserPlus } from "lucide-react";
import { BRANDING } from "@/config/branding";

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<UserSession | null>(null);
  const [supabaseConfigured, setSupabaseConfigured] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    fetchUser();
    setSupabaseConfigured(isSupabaseConfigured());
  }, [pathname]);

  const handleLogout = async () => {
    await signOut();
    setUser(null);
    window.location.href = "/";
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Internships", href: "/internships" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const handleVerifyScroll = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === "/") {
      const el = document.getElementById("verify");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = "/#verify";
    }
  };

  return (
    <div className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-7xl">
      <nav className="glass-navbar rounded-2xl shadow-md border border-white/20">
        <div className="mx-auto max-w-7xl px-3 md:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo on the left */}
            <div className="flex items-center">
              <Link
                href={user ? (user.role === "admin" ? "/admin/dashboard" : "/student/dashboard") : "/"}
                className="group flex items-center gap-2"
                aria-label="Go to home"
              >
                <img
                  src={BRANDING.logoIcon}
                  className="h-12 w-auto object-contain group-hover:scale-105 transition-all"
                  alt={BRANDING.name}
                />
              </Link>
            </div>

            {/* Desktop Nav Links (Hidden on Mobile/Tablet < md) */}
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
            </div>

            {/* Desktop Auth / User Controls (Hidden on Mobile/Tablet < md) */}
            <div className="hidden md:flex items-center space-x-4">
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
                    className="flex items-center gap-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200/60 border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-650 hover:text-indigo-800 transition-all shadow-sm"
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

            {/* Mobile Controls (Visible ONLY on Mobile/Tablet < md) */}
            <div className="flex md:hidden items-center space-x-1.5">
              {user ? (
                <>
                  <Link
                    href={user.role === "admin" ? "/admin/dashboard" : "/student/dashboard"}
                    className="flex h-11 items-center justify-center rounded-xl bg-zinc-100 border border-zinc-250 px-3 text-xs font-semibold text-zinc-700 transition-all active:scale-98 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer"
                    aria-label="Access your student dashboard"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex h-11 items-center justify-center rounded-xl border border-red-200 bg-red-50/30 px-3 text-xs font-semibold text-red-500 cursor-pointer transition-all active:scale-98 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    aria-label="Log out of your account"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="flex h-11 items-center justify-center rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 px-3 text-xs font-semibold text-zinc-700 transition-all active:scale-98 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer"
                    aria-label="Log in to your student portal account"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/register"
                    className="flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-500 px-3 text-xs font-bold text-white transition-all active:scale-98 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer"
                    aria-label="Create a new student account"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
