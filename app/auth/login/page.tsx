"use client";

import { useState, useEffect } from "react";
import { loginUser } from "@/lib/supabase/auth";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import {
  Mail, Lock, ArrowRight, AlertCircle, CheckCircle, Eye, EyeOff
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isMockMode, setIsMockMode] = useState(false);

  useEffect(() => {
    setIsMockMode(!isSupabaseConfigured());
  }, []);

  const handleClearMockData = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("mock_profiles");
      localStorage.removeItem("iqintern_session");
      sessionStorage.removeItem("iqintern_session");
      document.cookie = "iqintern_session=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
      alert("Local mock database cleared successfully! Reloading page...");
      window.location.reload();
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("reason") === "timeout") {
        setError("You have been logged out due to inactivity.");
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill out all fields.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");

    console.log("[INSTRUMENTATION] Login button clicked. Timing started...");
    const loginStart = performance.now();

    try {
      const apiStart = performance.now();
      const res = await loginUser(email, password);
      console.log(`[INSTRUMENTATION] loginUser request finished in ${(performance.now() - apiStart).toFixed(1)}ms`);

      setSuccess("Logged in successfully! Redirecting...");

      console.log(`[INSTRUMENTATION] Redirecting user immediately: role=${res.user.role}`);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("iqintern_show_whatsapp_popup_force", "true");
      }
      if (res.user.role === "admin") {
        window.location.href = "/admin/dashboard";
      } else {
        window.location.href = "/student/dashboard";
      }
    } catch (err: any) {
      console.error("[INSTRUMENTATION] Login request failed:", err);
      setError(err.message || "An error occurred during sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 font-sans antialiased">
      
      {/* Top Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between shrink-0">
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <img
            src="/logo-full.png"
            alt="IQIntern"
            className="h-10 w-auto object-contain"
          />
        </Link>
        <Link href="/auth/register" className="text-xs font-bold text-[#FF7A00] hover:text-[#E66E00] transition-colors cursor-pointer">
          Create an Account →
        </Link>
      </header>

      {/* Main Form Area */}
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[460px] flex flex-col">
          
          {/* Card */}
          <div className="bg-white border border-zinc-200 shadow-md rounded-[24px] p-6 sm:p-8 flex flex-col w-full relative">
            <form onSubmit={handleLogin} className="flex flex-col space-y-4">
              
              {/* Form Title */}
              <div className="pb-4 border-b border-zinc-150 mb-2 shrink-0 text-left">
                <h2 className="text-xl font-extrabold text-zinc-900 tracking-tight">
                  Welcome Back
                </h2>
                <p className="text-[11px] text-zinc-500 font-medium mt-0.5">
                  Enter credentials to access your proctored evaluation dashboard
                </p>
              </div>

              {/* Mock Mode Development Helper Banner */}
              {isMockMode && (
                <div className="mb-2 flex flex-col gap-2 rounded-xl border border-amber-500/30 bg-amber-500/5 p-3.5 text-xs text-amber-800 font-medium shrink-0">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                    <div>
                      <strong className="font-bold block text-amber-900">Developer Mock Mode Active</strong>
                      <span className="text-[11px] text-amber-700 leading-relaxed block mt-0.5">
                        The client is running in Mock Mode because Supabase credentials are not loaded in your browser. Restart your local Next.js dev server after adding `.env.local` to connect to Supabase.
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-1">
                    <button
                      type="button"
                      onClick={handleClearMockData}
                      className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-amber-600 hover:bg-amber-700 text-white rounded-lg shadow-sm shadow-amber-600/10 active:scale-95 transition-all cursor-pointer"
                    >
                      Clear Mock DB
                    </button>
                  </div>
                </div>
              )}

              {/* Error/Success Messages Inside Card */}
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div key="error-message" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-start gap-2.5 rounded-xl border border-red-500/25 bg-red-500/10 p-3 text-xs text-red-650 font-semibold shrink-0 text-left">
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                )}
                {success && (
                  <motion.div key="success-message" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-start gap-2.5 rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-3 text-xs text-emerald-600 font-semibold shrink-0 text-left">
                    <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                    <span>{success}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form Fields */}
              <div className="space-y-4">
                <div className="flex flex-col gap-1 text-left">
                  <label htmlFor="email" className="text-[10px] font-bold text-zinc-700 uppercase tracking-wider ml-1">Email Address or Phone Number *</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-zinc-400" />
                    <input
                      id="email"
                      type="text"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 h-[56px] text-sm bg-zinc-50 border border-zinc-300 focus:bg-white focus:border-[#F9B300] focus:ring-[4px] focus:ring-[#F9B300]/15 rounded-[14px] outline-none text-zinc-800 transition-all duration-200 placeholder:text-zinc-450"
                      placeholder="Enter email address or phone number"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1 text-left">
                  <div className="flex justify-between items-center px-1 mb-0.5">
                    <label htmlFor="password" className="text-[10px] font-bold text-zinc-700 uppercase tracking-wider">Password *</label>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-zinc-400" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full pl-11 pr-11 h-[56px] text-sm bg-zinc-50 border border-zinc-300 focus:bg-white focus:border-[#F9B300] focus:ring-[4px] focus:ring-[#F9B300]/15 rounded-[14px] outline-none text-zinc-800 transition-all duration-200 placeholder:text-zinc-450"
                      placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer focus:outline-none">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="flex justify-end mt-1.5 px-1">
                    <Link href="/auth/forgot-password" className="text-[10px] text-[#FF7A00] hover:text-[#E66E00] font-bold uppercase tracking-wide focus:outline-none">
                      Forgot Password?
                    </Link>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 shrink-0">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 h-[56px] rounded-[14px] bg-[#F9B300] hover:bg-[#E6A500] disabled:bg-zinc-150 disabled:text-zinc-400 disabled:cursor-not-allowed px-6 text-sm font-extrabold text-zinc-800 transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  {loading ? "Verifying Session..." : "Sign In"}
                  <ArrowRight className="h-4.5 w-4.5 stroke-[3.5]" />
                </button>
              </div>
            </form>

            {/* Mobile Register Link */}
            <div className="mt-5 pt-4 border-t border-zinc-100 text-center text-xs md:hidden shrink-0">
              <span className="text-zinc-500 font-medium">New to IQIntern? </span>
              <Link href="/auth/register" className="text-[#FF7A00] hover:text-[#E66E00] font-bold transition-colors">
                Create an Account
              </Link>
            </div>

          </div>
        </div>
      </main>

      {/* Desktop-only Footer */}
      <div className="hidden md:block w-full">
        <Footer />
      </div>

    </div>
  );
}
