"use client";

import { useEffect, useState } from "react";
import { getCurrentUser, UserSession } from "@/lib/supabase/auth";
import {
  getInternships,
  getTestResults,
  getStudentPayments,
  Internship,
  TestResult,
  Payment
} from "@/lib/supabase/db";
import {
  CheckCircle,
  Clock,
  TrendingUp,
  Briefcase,
  ChevronRight,
  Target,
} from "lucide-react";
import Link from "next/link";

export default function ProgressPage() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const u = await getCurrentUser();
        if (u) {
          const [ints, res, pays] = await Promise.all([
            getInternships(),
            getTestResults(u.id),
            getStudentPayments(u.id)
          ]);
          setInternships(ints);
          setResults(res);
          setPayments(pays);
        }
      } catch (err) {
        console.error("Error loading progress data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const activeTrackIds = Array.from(
    new Set([
      ...payments.map((p) => p.internship_id),
      ...results.map((r) => r.internship_id)
    ])
  );

  const activeTrackDetails = activeTrackIds.map((trackId) => {
    const trackObj = internships.find((i) => i.id === trackId);
    const trackTitle = trackObj ? trackObj.title : trackId;
    const trackResults = results.filter((r) => r.internship_id === trackId);
    const passedResult = trackResults.find((r) => r.passed);
    const bestResult = passedResult || (trackResults.length > 0 ? [...trackResults].sort((a, b) => b.percentage - a.percentage)[0] : null);

    return {
      trackId,
      trackTitle,
      category: trackObj?.category || "N/A",
      duration: trackObj?.duration || "120 Hrs",
      passed: !!passedResult,
      percentage: bestResult?.percentage || 0,
      attempts: trackResults.length,
      completedAt: passedResult?.completed_at || null
    };
  });

  const passedTracks = activeTrackDetails.filter(t => t.passed).length;
  const totalHours = activeTrackIds.length * 120;

  // Journey steps
  const journeySteps = [
    { step: 1, name: "Onboarding", active: activeTrackIds.length > 0 },
    { step: 2, name: "Registration", active: payments.length > 0 },
    { step: 3, name: "Training", active: payments.length > 0, borderOnly: results.length === 0 },
    { step: 4, name: "Assessment", active: results.length > 0 },
    { step: 5, name: "Projects", active: results.length > 0 },
    { step: 6, name: "Review", active: passedTracks > 0 },
    { step: 7, name: "Submission", active: passedTracks > 0 },
    { step: 8, name: "Credential", active: passedTracks > 0 },
  ];

  const activeStepCount = journeySteps.filter(s => s.active).length;
  const progressPercentage = Math.round((activeStepCount / journeySteps.length) * 100);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#5B5FF7] border-t-transparent mx-auto" />
          <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Loading progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in text-zinc-800 pb-10">
      {/* Page Header */}
      <section className="text-left">
        <span className="text-[#5B5FF7] text-xs font-bold uppercase tracking-wider">Learning Journey</span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight mt-1">Progress & Milestones</h2>
        <p className="text-zinc-500 text-sm mt-2 font-light leading-relaxed max-w-2xl">
          Track your overall learning journey, view track-by-track progress, and see how far you&apos;ve come.
        </p>
      </section>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-zinc-150/80 rounded-[20px] p-5 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#5B5FF7]/10 flex items-center justify-center text-[#5B5FF7]">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-zinc-900">{activeTrackIds.length}</p>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Active Tracks</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-zinc-150/80 rounded-[20px] p-5 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-zinc-900">{passedTracks}</p>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Completed</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-zinc-150/80 rounded-[20px] p-5 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-500">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-zinc-900">{totalHours} hrs</p>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Total Learning</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-zinc-150/80 rounded-[20px] p-5 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-zinc-900">{progressPercentage}%</p>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Journey Progress</p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Journey Roadmap */}
      <div className="bg-white border border-zinc-150/80 rounded-[24px] p-6 sm:p-8 shadow-xs">
        <h3 className="text-lg font-bold text-center text-zinc-900 mb-10">Your Interactive Credential Journey</h3>
        <div className="relative px-4 sm:px-8">
          <div className="absolute top-[20px] left-0 w-full h-1 bg-zinc-150 z-0"></div>
          <div className="absolute top-[20px] left-0 h-1 bg-gradient-to-r from-[#5B5FF7] to-[#7B7FFA] z-0 shadow-xs" style={{ width: `${progressPercentage}%` }}></div>
          <div className="flex justify-between relative z-10 overflow-x-auto gap-4 scrollbar-none pb-2">
            {journeySteps.map((s) => (
              <div key={s.step} className="flex flex-col items-center gap-3 shrink-0 min-w-[70px]">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs border-2 ring-4 ring-white transition-transform hover:scale-105 ${
                  s.active
                    ? "bg-[#5B5FF7] text-white border-[#5B5FF7]"
                    : s.borderOnly
                      ? "bg-slate-50 text-zinc-800 border-[#5B5FF7]/50"
                      : "bg-slate-50 text-zinc-500 border-zinc-200"
                }`}>
                  {s.step}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${s.active ? "text-zinc-800" : "text-zinc-400"}`}>
                  {s.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Track-by-Track Progress */}
      {activeTrackDetails.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-base font-extrabold text-zinc-900 flex items-center gap-2">
            <Target className="h-5 w-5 text-[#5B5FF7]" />
            Track Progress
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {activeTrackDetails.map((track) => (
              <div
                key={track.trackId}
                className="bg-white border border-zinc-150/80 rounded-[24px] p-6 shadow-xs hover:shadow-md transition-all duration-300 text-left"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  {/* Track Info */}
                  <div className="space-y-3 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-base font-extrabold text-zinc-900 truncate">{track.trackTitle}</h4>
                      {track.passed ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-250 px-2 py-0.5 text-[9px] font-bold text-emerald-700 shrink-0 font-mono">
                          <CheckCircle className="h-3 w-3" /> Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-amber-50 border border-amber-250 px-2 py-0.5 text-[9px] font-bold text-amber-600 shrink-0 font-mono">
                          In Progress
                        </span>
                      )}
                    </div>
                    
                    {/* Overall Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs text-zinc-500 font-bold">
                        <span>Overall Progress</span>
                        <span className="font-extrabold text-[#5B5FF7]">{track.passed ? "100%" : `${Math.max(20, track.percentage)}%`}</span>
                      </div>
                      <div className="w-full bg-zinc-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-750 ${
                            track.passed ? "bg-emerald-500" : "bg-[#5B5FF7]"
                          }`}
                          style={{ width: `${track.passed ? 100 : Math.max(20, track.percentage)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Metrics grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 border-t md:border-t-0 md:border-l border-zinc-100 pt-5 md:pt-0 md:pl-6 shrink-0 min-w-[280px] text-left">
                    <div>
                      <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Assessment Score</span>
                      <strong className={`text-base font-extrabold block mt-0.5 ${track.passed ? "text-emerald-600 font-mono" : "text-zinc-700 font-mono"}`}>
                        {track.percentage}%
                      </strong>
                    </div>
                    
                    <div>
                      <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Attempts</span>
                      <span className="text-base font-extrabold block mt-0.5 text-zinc-700 font-mono">
                        {track.attempts}
                      </span>
                    </div>

                    <div className="col-span-2 sm:col-span-1 flex items-center justify-end">
                      <Link
                        href="/student/internships"
                        className="flex items-center gap-1 text-xs text-[#5B5FF7] hover:text-[#4A4EE6] font-bold transition-all shrink-0 cursor-pointer"
                      >
                        {track.passed ? "View Track" : "Continue"}
                        <ChevronRight className="h-3.5 w-3.5 stroke-[3]" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-20 border border-zinc-200 rounded-[20px] bg-white shadow-xs">
          <TrendingUp className="h-12 w-12 mx-auto text-zinc-300 mb-4" />
          <p className="text-sm text-zinc-800 font-bold">No active tracks yet</p>
          <p className="text-xs text-zinc-500 font-medium mt-1">Enroll in an internship track to start tracking your progress.</p>
          <Link
            href="/student/internships"
            className="inline-flex items-center gap-1.5 mt-5 bg-[#5B5FF7] hover:bg-[#4A4EE6] text-white text-xs font-bold px-5 py-3 rounded-xl shadow-md transition-all"
          >
            Browse Tracks
            <ChevronRight className="h-3.5 w-3.5 stroke-[3]" />
          </Link>
        </div>
      )}
    </div>
  );
}
