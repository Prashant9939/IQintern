"use client";

import { useEffect, useState } from "react";
import { getCurrentUser, UserSession } from "@/lib/supabase/auth";
import {
  getInternships,
  getTestResults,
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
} from "lucide-react";
import Link from "next/link";

export default function AssessmentsPage() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const u = await getCurrentUser();
        setUser(u);
        if (u) {
          const [ints, res] = await Promise.all([
            getInternships(),
            getTestResults(u.id),
          ]);
          setInternships(ints);
          setResults(res);
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
      {/* Page Header */}
      <section className="text-left">
        <span className="text-[#5B5FF7] text-xs font-bold uppercase tracking-wider">Assessment Center</span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight mt-1">Test History & Results</h2>
        <p className="text-zinc-500 text-sm mt-2 font-light leading-relaxed max-w-2xl">
          Track your assessment attempts, scores, and results across all enrolled internship tracks.
        </p>
      </section>

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
