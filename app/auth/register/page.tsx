"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { signUpUser, loginUser } from "@/lib/supabase/auth";
import { User, Phone, Mail, Lock, ArrowRight, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { fullName, phoneNumber, email, password } = formData;
    if (!fullName || !phoneNumber || !email || !password) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);

    try {
      await signUpUser(email, password, fullName, phoneNumber);
      setSuccess("Account registered successfully! Setting up your session...");
      
      // Auto login the user
      await loginUser(email, password);
      
      setSuccess("Account registered successfully! Redirecting to payment...");

      // Clear form
      setFormData({
        fullName: "",
        phoneNumber: "",
        email: "",
        password: "",
      });

      // Redirect to payment page
      setTimeout(() => {
        window.location.href = "/student/payment";
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to complete registration.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="relative min-h-screen flex flex-col bg-slate-50 overflow-x-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-100 pointer-events-none" />
      <div className="absolute inset-0 radial-fade pointer-events-none" />

      <Navbar />

      <main className="flex-grow flex items-center justify-center pt-28 pb-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="w-full max-w-lg glass-panel rounded-3xl p-8 relative overflow-hidden">
          {/* Neon side blur */}
          <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-violet-500/10 blur-2xl pointer-events-none" />

          {/* Heading */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Create Account</h2>
            <p className="mt-2 text-sm text-zinc-500 font-light">
              Register to get access to internship assessments & certifications
            </p>
          </div>

          {/* Error messages */}
          {error && (
            <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 p-3.5 text-xs text-red-600">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Success messages */}
          {success && (
            <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-xs text-emerald-600">
              <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 text-sm bg-white border border-zinc-200 focus:border-indigo-500/50 rounded-xl outline-none text-zinc-800 transition-colors"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <input
                  type="tel"
                  required
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 text-sm bg-white border border-zinc-200 focus:border-indigo-500/50 rounded-xl outline-none text-zinc-800 transition-colors"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 text-sm bg-white border border-zinc-200 focus:border-indigo-500/50 rounded-xl outline-none text-zinc-800 transition-colors"
                  placeholder="john@example.com"
                />
              </div>
            </div>


            {/* Password */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-10 py-3 text-sm bg-white border border-zinc-200 focus:border-indigo-500/50 rounded-xl outline-none text-zinc-800 transition-colors"
                  placeholder="At least 7 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Details */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 hover:scale-102 active:scale-98 transition-all disabled:opacity-50 cursor-pointer mt-6"
            >
              {loading ? "Registering..." : "Register Now"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Switch to Login */}
          <div className="mt-6 pt-6 border-t border-zinc-200/60 text-center text-xs">
            <span className="text-zinc-500">Already registered? </span>
            <Link href="/auth/login" className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors">
              Log in instead
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
