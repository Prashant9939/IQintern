"use client";

import { useEffect, useState } from "react";
import { getCurrentUser, UserSession } from "@/lib/supabase/auth";
import {
  getInternships,
  getTestResults,
  getStudentPayments,
  getPlatformSettings,
  Internship,
  TestResult,
} from "@/lib/supabase/db";
import {
  FileSpreadsheet,
  FileText,
  CheckCircle,
  XCircle,
  Clipboard,
  ChevronRight,
  AlertCircle,
  Clock
} from "lucide-react";
import Link from "next/link";

export default function AssessmentsPage() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [results, setResults] = useState<TestResult[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<any>({ assessment_fee: 150, payments_enabled: true, assessment_availability_days: 30 });
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    async function loadData() {
      try {
        const u = await getCurrentUser();
        setUser(u);
        if (u) {
          const [ints, res, pays, stg] = await Promise.all([
            getInternships(),
            getTestResults(u.id),
            getStudentPayments(u.id),
            getPlatformSettings()
          ]);
          setInternships(ints);
          setResults(res);
          setPayments(pays);
          setSettings(stg);
        }
      } catch (err) {
        console.error("Error loading assessments data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const passedTests = results.filter((r) => r.passed).length;
  const failedTests = results.filter((r) => !r.passed).length;
  const averageScore = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length)
    : 0;

  const selectedTrackIds = Array.from(new Set(payments.filter(p => p.status === "completed").map(p => p.internship_id)));
  const selectedTracks = selectedTrackIds.map(id => internships.find(i => i.id === id)).filter(Boolean);

  // Real-time ticking countdown logic
  useEffect(() => {
    if (!payments || !settings) return;

    const payObj = payments.find((p) => p.status === "completed");
    if (!payObj) return;

    const targetDays = settings.assessment_availability_days ?? 30;
    const payDate = new Date(payObj.created_at);
    const targetTime = payDate.getTime() + targetDays * 24 * 60 * 60 * 1000;

    const updateTimer = () => {
      const diff = targetTime - Date.now();
      setTimeLeft(diff > 0 ? diff : 0);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [payments, settings]);

  const formatTimeLeft = (ms: number) => {
    const totalSecs = Math.floor(ms / 1000);
    const d = Math.floor(totalSecs / (24 * 3600));
    const h = Math.floor((totalSecs % (24 * 3600)) / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;

    if (d > 0) {
      return `${d}d ${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m`;
    }
    return `${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#5B5FF7] border-t-transparent mx-auto" />
          <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Loading assessments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in text-zinc-800 pb-10">
      {/* Page Header & Program Info (Merged Dark Banner) */}
      <div className="relative overflow-hidden rounded-[28px] border border-zinc-200/80 bg-gradient-to-br from-[#1E293B] to-[#0F172A] p-6 sm:p-8 text-white shadow-xl shadow-zinc-900/10 text-left">
        <div className="absolute right-[-100px] top-[-50px] h-[300px] w-[300px] rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10 w-full">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2">
              <Clipboard className="h-4.5 w-4.5 text-indigo-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Assessment Center</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Test History & Results
            </h1>
            
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              {selectedTracks.length > 0 ? (
                <>
                  <span className="font-mono text-xs font-extrabold bg-white/10 text-zinc-300 rounded-lg px-2.5 py-1 uppercase tracking-wide">
                    {selectedTracks.map(t => (t as any).title).join(", ")}
                  </span>
                  {timeLeft > 0 ? (
                    <span className="bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Locked
                    </span>
                  ) : (
                    <span className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider">
                      ✓ Eligible
                    </span>
                  )}
                </>
              ) : (
                <span className="bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider">
                  ⚠️ No Active Track
                </span>
              )}
            </div>
            
            <p className="text-zinc-400 text-xs sm:text-sm font-light max-w-xl leading-relaxed pt-1">
              Track your assessment attempts, scores, and results across all enrolled internship tracks.
            </p>
          </div>

          {/* Right Side Stats & CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 self-stretch md:self-auto justify-end shrink-0">
            {/* SVG Progress Ring for Average Score */}
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-3.5 self-stretch sm:self-auto justify-center">
              <div className="relative h-14 w-14 flex items-center justify-center shrink-0">
                <svg className="h-full w-full -rotate-90">
                  <circle
                    cx="28"
                    cy="28"
                    r="24"
                    className="stroke-white/10"
                    strokeWidth="4"
                    fill="transparent"
                  />
                  <circle
                    cx="28"
                    cy="28"
                    r="24"
                    className="stroke-indigo-400 transition-all duration-700 ease-out"
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 24}
                    strokeDashoffset={2 * Math.PI * 24 - (averageScore / 100) * (2 * Math.PI * 24)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute font-mono text-xs font-black text-white">
                  {averageScore}%
                </div>
              </div>
              <div className="text-left">
                <div className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Average Score</div>
                <div className="text-xs font-black text-white mt-0.5">
                  Passed: {passedTests} of {results.length}
                </div>
              </div>
            </div>

            {selectedTracks.length > 0 ? (
              timeLeft > 0 ? (
                <Link
                  href="/student/internships"
                  className="rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-bold px-5 py-3 transition-all text-center self-stretch sm:self-auto shrink-0 flex items-center justify-center gap-2 active:scale-97 cursor-pointer"
                >
                  <Clock className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span>Start in {formatTimeLeft(timeLeft)}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-white" />
                </Link>
              ) : (
                <Link
                  href={`/student/test/${selectedTrackIds[0]}`}
                  className="rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 text-xs font-bold px-5 py-3 shadow-md transition-all text-center self-stretch sm:self-auto shrink-0 flex items-center justify-center gap-1.5 active:scale-97 cursor-pointer"
                >
                  <span>Start Assessment</span>
                  <ChevronRight className="h-3.5 w-3.5 text-zinc-950 stroke-[3]" />
                </Link>
              )
            ) : (
              <Link
                href="/student/internships"
                className="rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-bold px-5 py-3 transition-all text-center self-stretch sm:self-auto shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Explore Tracks</span>
                <ChevronRight className="h-3.5 w-3.5 text-white" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-zinc-150/80 rounded-[20px] p-5 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#5B5FF7]/10 flex items-center justify-center text-[#5B5FF7]">
              <Clipboard className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-zinc-900">{results.length}</p>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Total Attempts</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-zinc-150/80 rounded-[20px] p-5 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-zinc-900">{passedTests}</p>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Passed</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-zinc-150/80 rounded-[20px] p-5 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
              <XCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-zinc-900">{failedTests}</p>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Failed</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-zinc-150/80 rounded-[20px] p-5 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-zinc-900">{averageScore}%</p>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Avg Score</p>
            </div>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      {results.length === 0 ? (
        <div className="text-center py-20 border border-zinc-200 rounded-[20px] bg-white shadow-xs">
          <FileText className="h-12 w-12 mx-auto text-zinc-300 mb-4" />
          <p className="text-sm text-zinc-800 font-bold">No test attempts logged yet.</p>
          <p className="text-xs text-zinc-500 font-medium mt-1">Navigate to the Tracks page to take your first assessment.</p>
          <Link
            href="/student/internships"
            className="inline-flex items-center gap-1.5 mt-5 bg-[#5B5FF7] hover:bg-[#4A4EE6] text-white text-xs font-bold px-5 py-3 rounded-xl shadow-md transition-all"
          >
            Browse Tracks
            <ChevronRight className="h-3.5 w-3.5 stroke-[3]" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((res) => (
            <div
              key={res.id}
              className="bg-white border border-zinc-150/80 rounded-[20px] p-5 flex flex-col justify-between relative overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 text-left"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 line-clamp-1">{res.internship_title}</h4>
                    <span className="text-[10px] text-zinc-450 font-bold block mt-0.5">
                      {new Date(res.completed_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </span>
                  </div>
                  {res.passed ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-[10px] font-bold text-emerald-700 shrink-0">
                      <CheckCircle className="h-3.5 w-3.5 shrink-0" /> Pass
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 border border-red-200 px-3 py-1 text-[10px] font-bold text-red-600 shrink-0">
                      <XCircle className="h-3.5 w-3.5 shrink-0" /> Fail
                    </span>
                  )}
                </div>

                {/* Score Progress Bar */}
                <div>
                  <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${res.passed ? "bg-emerald-500" : "bg-red-400"}`}
                      style={{ width: `${res.percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1.5">
                    <span className="text-[10px] font-bold text-zinc-400">Score: {res.score}/{res.total_questions}</span>
                    <span className={`text-[10px] font-extrabold ${res.passed ? "text-emerald-600" : "text-red-500"}`}>{res.percentage}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-zinc-650 border-t border-zinc-100 pt-3 font-semibold">
                  <span className="text-[10px] font-mono text-zinc-400">{res.reference_number || "—"}</span>
                  <Link
                    href={`/student/results/${res.id}`}
                    className="text-xs text-[#5B5FF7] hover:text-[#4A4EE6] font-bold transition-all flex items-center gap-0.5"
                  >
                    View Report
                    <ChevronRight className="h-3 w-3 stroke-[3]" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
