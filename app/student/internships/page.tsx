"use client";

import { useEffect, useState } from "react";
import { getCurrentUser, UserSession } from "@/lib/supabase/auth";
import { getInternships, getTestResults, Internship, TestResult } from "@/lib/supabase/db";
import { 
  Briefcase, 
  Clock, 
  Award, 
  AlertCircle, 
  CheckCircle, 
  Play, 
  Search, 
  HelpCircle, 
  XCircle, 
  X,
  ChevronRight,
  BookOpen
} from "lucide-react";
import Link from "next/link";

export default function AvailableInternships() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Modal State
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);

  useEffect(() => {
    async function loadInternshipsData() {
      try {
        const u = await getCurrentUser();
        setUser(u);
        if (u) {
          const [ints, res] = await Promise.all([
            getInternships(),
            getTestResults(u.id)
          ]);
          setInternships(ints);
          setResults(res);
        }
      } catch (err) {
        console.error("Error loading internships route data", err);
      } finally {
        setLoading(false);
      }
    }
    loadInternshipsData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  // Get unique categories for filtering
  const categories = ["All", ...Array.from(new Set(internships.map((i) => i.category)))];

  // Filtering Logic
  const filteredInternships = internships.filter((track) => {
    const matchesSearch = 
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.category.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = selectedCategory === "All" || track.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 relative z-10 animate-fade-in pb-16">
      
      {/* Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-indigo-500/5 blur-2xl pointer-events-none" />
        <div className="space-y-1.5">
          <span className="text-indigo-650 text-xs font-bold uppercase tracking-wider block">Career Paths</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">Available Internships</h1>
          <p className="text-zinc-500 text-xs sm:text-sm font-light leading-relaxed max-w-xl">
            Choose an internship track, review the requirements, and pass the assessment to unlock your official Offer Letter, Project Report, and Certificate.
          </p>
        </div>
      </div>

      {/* Filters & Search Row */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-sm">
        
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-indigo-50 text-indigo-650 border-indigo-150 shadow-sm font-extrabold"
                  : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search tracks, skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-zinc-200 focus:border-indigo-500/50 rounded-xl outline-none text-zinc-800 transition-colors"
          />
        </div>
      </div>

      {/* Internships Grid */}
      {filteredInternships.length === 0 ? (
        <div className="text-center py-20 border border-zinc-200 rounded-3xl bg-white shadow-sm">
          <Briefcase className="h-10 w-10 mx-auto text-zinc-300 mb-3" />
          <p className="text-sm text-zinc-500 font-bold">No internship tracks match your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredInternships.map((track) => {
            // Check status of this track
            const trackResults = results.filter((r) => r.internship_id === track.id);
            const passed = trackResults.some((r) => r.passed);
            const latestAttempt = trackResults[0]; // ordered by completed_at desc in getTestResults

            return (
              <div 
                key={track.id}
                className="glass-panel bg-white border border-zinc-200/80 rounded-3xl p-6 flex flex-col justify-between hover:border-indigo-500/30 hover:shadow-md transition-all group relative overflow-hidden"
              >
                {/* Visual Status Indicator Glow */}
                {passed && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
                )}

                <div className="space-y-4">
                  {/* Category & Status */}
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                      {track.category}
                    </span>
                    
                    {passed ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 text-[10px] font-bold text-emerald-600">
                        <CheckCircle className="h-3.5 w-3.5 shrink-0" />
                        Passed
                      </span>
                    ) : latestAttempt ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 border border-red-100 px-3 py-1 text-[10px] font-bold text-red-600">
                        <XCircle className="h-3.5 w-3.5 shrink-0" />
                        Failed ({latestAttempt.percentage}%)
                      </span>
                    ) : null}
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-lg font-bold text-zinc-900 group-hover:text-indigo-650 transition-colors tracking-tight">
                      {track.title}
                    </h3>
                    <p className="text-zinc-500 text-xs mt-2 leading-relaxed font-light">
                      {track.description}
                    </p>
                  </div>

                  {/* Track Duration Details */}
                  <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 bg-zinc-50 border border-zinc-150 p-2.5 rounded-xl w-fit">
                    <Clock className="h-3.5 w-3.5 text-indigo-500" />
                    <span>Duration: <span className="text-zinc-700 font-bold">{track.duration || "3 Months"}</span></span>
                  </div>

                  {/* Requirements List */}
                  {track.requirements && track.requirements.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-zinc-100">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Requirements:</span>
                      <ul className="grid grid-cols-1 gap-1.5">
                        {track.requirements.map((req, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-[11px] text-zinc-550 leading-relaxed font-light">
                            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="pt-6 mt-6 border-t border-zinc-100 flex items-center justify-between gap-4">
                  {passed ? (
                    <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1.5">
                      <CheckCircle className="h-4 w-4" />
                      Certificates Unlocked
                    </div>
                  ) : (
                    <div className="text-[10px] text-zinc-400 font-medium">
                      Requires passing threshold of 70%
                    </div>
                  )}

                  <button
                    onClick={() => setSelectedInternship(track)}
                    className={`flex items-center justify-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                      passed
                        ? "bg-zinc-50 border border-zinc-200 text-zinc-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-150 active:scale-95"
                        : "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-md shadow-indigo-600/10"
                    }`}
                  >
                    <Play className="h-3.5 w-3.5" />
                    {passed ? "Retake Assessment" : "Take Assessment"}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* GUIDELINES RULES MODAL */}
      {selectedInternship && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg glass-panel bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-indigo-500/5 blur-2xl" />

            <div className="flex items-start gap-4 mb-6">
              <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs text-indigo-600 font-bold uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">{selectedInternship.category}</span>
                <h3 className="text-xl font-bold text-zinc-900 mt-2">{selectedInternship.title}</h3>
                <p className="text-xs text-zinc-400 mt-1">Assessment Code Guidelines & Testing Rules</p>
              </div>
            </div>

            {/* Rules list */}
            <div className="space-y-4 bg-zinc-50 p-5 rounded-2xl border border-zinc-200/60 text-xs sm:text-sm text-zinc-650 leading-relaxed mb-6 font-light">
              <div className="flex gap-2 items-start">
                <Clock className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                <span>**Duration:** You have exactly **5 minutes** to solve the multiple-choice questions.</span>
              </div>
              <div className="flex gap-2 items-start">
                <Award className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                <span>**Evaluation:** Passing threshold is **70%**. You need to score at least 7 out of 10 questions.</span>
              </div>
              <div className="flex gap-2 items-start">
                <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <span>**Anti-Cheating:** Do NOT switch tabs or minimize the test screen. Tab changes will be monitored.</span>
              </div>
              <div className="flex gap-2 items-start">
                <CheckCircle className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                <span>**Submission:** Leaving the screen or timer completion will trigger auto-submission instantly.</span>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setSelectedInternship(null)}
                className="rounded-xl border border-zinc-250 bg-white hover:bg-zinc-100 active:bg-zinc-200 active:scale-95 px-5 py-2.5 text-xs font-bold text-zinc-500 hover:text-zinc-800 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <Link
                href={`/student/test/${selectedInternship.id}`}
                className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 active:from-indigo-700 active:to-violet-850 active:scale-95 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all text-center cursor-pointer flex items-center justify-center gap-1.5"
              >
                Start Assessment
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
