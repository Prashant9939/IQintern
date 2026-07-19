"use client";

import { useState, useEffect } from "react";
import { loginUser } from "@/lib/supabase/auth";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import {
  AlertCircle, CheckCircle, Eye, EyeOff
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
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
            --brand-primary: #F5A623;
            --brand-dark: #0F172A;
            --brand-light: #F8FAFC;
            --text-main: #1E293B;
            --text-secondary: #64748B;
            --border-ui: #E2E8F0;
            --border-focus: #F5A623;
            --glass-bg: rgba(255, 255, 255, 0.85);
        }
        
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        .login-page-container {
            background-color: var(--brand-light);
            color: var(--text-main);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            overflow-x: hidden;
            position: relative;
            font-family: 'Plus Jakarta Sans', sans-serif;
            -webkit-font-smoothing: antialiased;
        }

        .login-content-wrapper {
            flex-grow: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .premium-shape {
            position: absolute;
            top: -130px;
            right: -130px;
            width: 280px;
            height: 280px;
            border-radius: 50%;
            background: linear-gradient(135deg, rgba(15,23,42,.04), rgba(245,166,35,.04));
            pointer-events: none;
        }

        .wrapper {
            position: relative;
            z-index: 2;
            width: 100%;
            max-width: 500px;
            min-height: 580px;
            overflow: hidden;
            display: flex;
            border-radius: 24px;
            background: linear-gradient(135deg, rgba(255,255,255,.97), rgba(255,251,245,.96));
            backdrop-filter: blur(25px);
            -webkit-backdrop-filter: blur(25px);
            border: 1px solid rgba(255,255,255,.85);
            box-shadow: 0 2px 10px rgba(255,255,255,.70), 0 20px 60px rgba(15,23,42,.08), 0 12px 35px rgba(245,166,35,.06), 0 0 30px rgba(245,166,35,.03);
        }

        .wrapper::before {
            content: "";
            position: absolute;
            inset: 0;
            border-radius: 24px;
            pointer-events: none;
            background: linear-gradient(135deg, rgba(255,255,255,.15), transparent 30%, rgba(255,255,255,.10));
        }

        .wrapper::after {
            content: "";
            position: absolute;
            width: 320px;
            height: 320px;
            top: -180px;
            right: -150px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(245,166,35,.08), transparent 70%);
            filter: blur(60px);
            pointer-events: none;
        }

        .mesh-gradient {
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at top right, rgba(245,166,35,.08), transparent 35%), radial-gradient(circle at bottom left, rgba(99,102,241,.05), transparent 35%);
            pointer-events: none;
        }

        .noise {
            position: absolute;
            inset: 0;
            opacity: .025;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)' opacity='.5'/%3E%3C/svg%3E");
            pointer-events: none;
        }

        .premium-glow {
            position: absolute;
            width: 220px;
            height: 220px;
            top: -50px;
            right: -50px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(245,166,35,.15), transparent 70%);
            filter: blur(30px);
            pointer-events: none;
        }

        .login-panel {
            flex: 1;
            padding: 40px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            background: transparent;
            position: relative;
            z-index: 2;
        }

        .main-form-zone {
            max-width: 380px;
            width: 100%;
            margin: 0 auto;
        }

        .header-title {
            font-size: 30px;
            font-weight: 700;
            color: var(--brand-dark);
            letter-spacing: -0.75px;
            margin-bottom: 8px;
        }

        .header-subtitle {
            font-size: 15px;
            color: var(--text-secondary);
            margin-bottom: 32px;
        }

        .floating-field {
            position: relative;
            margin-bottom: 20px;
        }

        .floating-field input {
            width: 100%;
            height: 56px;
            padding: 18px 16px 6px 16px;
            border: 1.5px solid var(--border-ui);
            border-radius: 12px;
            background: #ffffff;
            font-size: 15px;
            font-weight: 500;
            color: var(--brand-dark);
            outline: none;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .floating-field input.has-icon {
            padding-right: 44px;
        }

        .floating-field label {
            position: absolute;
            left: 16px;
            top: 18px;
            font-size: 15px;
            color: var(--text-secondary);
            pointer-events: none;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .floating-field input:focus,
        .floating-field input:not(:placeholder-shown) {
            border-color: var(--border-focus);
            box-shadow: 0 0 0 4px rgba(245, 166, 35, 0.1);
        }

        .floating-field input:focus ~ label,
        .floating-field input:not(:placeholder-shown) ~ label {
            top: 6px;
            font-size: 11px;
            font-weight: 600;
            color: var(--brand-primary);
        }

        .utilities {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 28px;
            font-size: 14px;
        }

        .remember-toggle {
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            color: var(--text-secondary);
            font-weight: 500;
        }

        .remember-toggle input {
            accent-color: var(--brand-primary);
            width: 16px;
            height: 16px;
            border-radius: 4px;
        }

        .forgot-link {
            color: var(--brand-primary);
            text-decoration: none;
            font-weight: 600;
        }

        .forgot-link:hover {
            text-decoration: underline;
        }

        .submit-btn {
            width: 100%;
            height: 52px;
            background: var(--brand-dark);
            color: #ffffff;
            border: none;
            border-radius: 12px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .submit-btn:hover {
            background: #1e293b;
            transform: translateY(-1px);
        }
        
        .submit-btn:disabled {
            background: var(--text-secondary);
            cursor: not-allowed;
            transform: none;
        }

        .social-divider {
            display: flex;
            align-items: center;
            text-align: center;
            color: var(--text-secondary);
            font-size: 13px;
            margin: 24px 0;
            font-weight: 500;
        }

        .social-divider::before, .social-divider::after {
            content: '';
            flex: 1;
            border-bottom: 1px solid var(--border-ui);
        }
        .social-divider:not(:empty)::before { margin-right: 12px; }
        .social-divider:not(:empty)::after { margin-left: 12px; }

        .register-btn {
            width: 100%;
            height: 52px;
            background: #ffffff;
            border: 1.5px solid var(--border-ui);
            border-radius: 12px;
            font-size: 14px;
            font-weight: 600;
            color: var(--brand-dark);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
            text-decoration: none;
        }

        .register-btn:hover {
            background: var(--brand-light);
            border-color: #cbd5e1;
        }

        @media (max-width: 900px) {
            .wrapper {
                max-width: 480px;
                height: auto;
                min-height: auto;
            }
            .login-panel {
                padding: 40px 24px;
            }
            .main-form-zone {
                margin: 20px 0;
            }
        }
      `}} />

      <div className="login-page-container">
        
        {/* Top Header */}
        <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between shrink-0 relative z-10">
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <img
              src="/logo-full.png"
              alt="IQIntern"
              className="h-10 w-auto object-contain"
            />
          </Link>
          <Link href="/auth/register" className="text-sm font-bold text-[var(--brand-primary)] hover:underline transition-colors cursor-pointer">
            Create an Account →
          </Link>
        </header>

        <main className="login-content-wrapper">
          <div className="wrapper">
            <div className="premium-shape"></div>
            <div className="logo-leaf"></div>
            <div className="mesh-gradient"></div>
            <div className="premium-glow"></div>
            <div className="noise"></div>

            <section className="login-panel">
              <div className="main-form-zone">
                <header>
                  <h1 className="header-title">Account Login</h1>
                  <p className="header-subtitle">
                    Access your professional evaluations hub.
                  </p>
                </header>

                {isMockMode && (
                  <div className="mb-4 flex flex-col gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-800 font-medium">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                      <div>
                        <strong className="font-bold block text-amber-900">Developer Mock Mode Active</strong>
                        <span className="text-[11px] text-amber-700 leading-relaxed block mt-0.5">
                          Running in Mock Mode. Restart your Next.js server after adding `.env.local` to connect to Supabase.
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleClearMockData}
                      className="mt-1 px-3 py-1.5 text-[10px] font-bold uppercase bg-amber-600 hover:bg-amber-700 text-white rounded-lg self-end"
                    >
                      Clear Mock DB
                    </button>
                  </div>
                )}

                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div key="error-message" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-500/25 bg-red-500/10 p-3 text-xs text-red-600 font-semibold shrink-0 text-left">
                      <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
                      <span>{error}</span>
                    </motion.div>
                  )}
                  {success && (
                    <motion.div key="success-message" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="mb-4 flex items-start gap-2.5 rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-3 text-xs text-emerald-600 font-semibold shrink-0 text-left">
                      <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                      <span>{success}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleLogin}>
                  <div className="floating-field">
                    <input
                      type="email"
                      id="email"
                      placeholder=" "
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      autoComplete="email"
                    />
                    <label htmlFor="email">Corporate Email Address</label>
                  </div>

                  <div className="floating-field">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      placeholder=" "
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="has-icon"
                    />
                    <label htmlFor="password">Security Password</label>
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)} 
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--brand-primary)] transition-colors focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>

                  <div className="utilities">
                    <label className="remember-toggle">
                      <input type="checkbox" />
                      Keep me signed in
                    </label>
                    <Link href="/auth/forgot-password" className="forgot-link">
                      Forgot?
                    </Link>
                  </div>

                  <button type="submit" disabled={loading} className="submit-btn">
                    {loading ? "Verifying..." : "Sign In"}
                  </button>

                  <div className="social-divider">New Here</div>

                  <Link href="/auth/register" className="register-btn">
                    Register Now
                  </Link>
                </form>
              </div>
            </section>
          </div>
        </main>

        {/* Desktop-only Footer */}
        <div className="hidden md:block w-full z-10 relative">
          <Footer />
        </div>
      </div>
    </>
  );
}
