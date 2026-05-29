"use client";

import { useEffect, useState } from "react";
import { getCurrentUser, UserSession } from "@/lib/supabase/auth";
import { 
  getInternships, 
  getTestResults, 
  getStudentProfile,
  getDocumentTemplates,
  Internship, 
  TestResult,
  DocumentTemplate
} from "@/lib/supabase/db";
import { 
  Award, 
  Briefcase, 
  FileSpreadsheet, 
  Play, 
  FileText, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  XCircle,
  HelpCircle,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";

// Helper function to render documents with placeholders dynamically replaced
function renderDocument(templateHtml: string, profile: any, internshipTitle: string, result: TestResult) {
  if (!templateHtml) return "";
  
  // Calculate Grade based on percentage
  const pct = result?.percentage || 0;
  let grade = "B";
  if (pct >= 90) grade = "A+";
  else if (pct >= 80) grade = "A";
  
  // Calculate score formatted
  const scoreFormatted = `${result?.score || 0}/${result?.total_questions || 5}`;
  
  // Date formatting (e.g. 28 June 2026)
  const compDate = result?.completed_at ? new Date(result.completed_at) : new Date();
  const formattedDate = compDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  
  // Calculate Joining Date (e.g. 3 months before completion)
  const joinDate = new Date(compDate);
  joinDate.setMonth(joinDate.getMonth() - 3);
  const formattedJoiningDate = joinDate.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
  
  // Verification ID (use result.reference_number)
  const verificationId = result?.reference_number || "SI-MOCK-ID";
  
  // Clean values, fallback to empty string if undefined
  const values: Record<string, string> = {
    "{{STUDENT_NAME}}": profile?.full_name || "",
    "{{NAME}}": profile?.full_name || "", // keep index.html compatibility
    "{{ROLL_NUMBER}}": profile?.roll_number || "N/A",
    "{{COLLEGE_NAME}}": profile?.college_name || "N/A",
    "{{DEPARTMENT}}": profile?.department_stream || "N/A",
    "{{SEMESTER}}": profile?.semester || "N/A",
    "{{COURSE}}": profile?.department_stream || "N/A",
    "{{INTERNSHIP_TITLE}}": internshipTitle || "",
    "{{SCORE}}": scoreFormatted,
    "{{GRADE}}": grade,
    "{{COMPLETION_DATE}}": formattedDate,
    "{{JOINING_DATE}}": formattedJoiningDate,
    "{{VERIFICATION_ID}}": verificationId,
    "{{DURATION}}": "120 Hours" // default duration placeholder
  };
  
  let output = templateHtml;
  for (const [placeholder, val] of Object.entries(values)) {
    const regex = new RegExp(placeholder, "g");
    output = output.replace(regex, val);
  }
  
  return output;
}

export default function StudentDashboard() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any | null>(null);
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);

  // Modal State
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);

  // Document Preview Modal State
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [previewTitle, setPreviewTitle] = useState<string>("");
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const u = await getCurrentUser();
        setUser(u);
        if (u) {
          const [ints, res, prof, tpls] = await Promise.all([
            getInternships(),
            getTestResults(u.id),
            getStudentProfile(u.id),
            getDocumentTemplates()
          ]);
          setInternships(ints);
          setResults(res);
          setProfile(prof);
          setTemplates(tpls);
        }
      } catch (err) {
        console.error("Error loading dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const handleViewDocument = (tplCode: string, result: TestResult) => {
    const tpl = templates.find((t) => t.code === tplCode);
    if (!tpl) {
      alert("Document template not found.");
      return;
    }
    
    const rendered = renderDocument(tpl.html_content, profile, result.internship_title || "Internship Program", result);
    setPreviewHtml(rendered);
    setPreviewTitle(tpl.name);
    setShowPreviewModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  const passedTests = results.filter((r) => r.passed).length;

  return (
    <div className="space-y-8 relative z-10">
      {/* Welcome Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-indigo-500/5 blur-2xl pointer-events-none" />
        <div>
          <span className="text-indigo-600 text-xs font-bold uppercase tracking-wider">Welcome back</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 mt-1 tracking-tight">{user?.full_name}</h1>
          <p className="text-zinc-500 text-xs sm:text-sm mt-1 font-light">
            Department: <span className="text-zinc-800 font-semibold">{profile?.department_stream || "N/A"}</span> • Phone: <span className="text-zinc-800">{user?.phone_number}</span>
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-2 text-xs shadow-sm">
          <Award className="h-4 w-4 text-amber-500" />
          <span className="text-zinc-700 font-semibold">{passedTests} Assessments Passed</span>
        </div>
      </div>

      {/* Internship Documents Section (Visible only if student passed at least one test) */}
      {results.some((r) => r.passed) && (
        <div className="glass-panel bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-sm">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-indigo-500/[0.02] blur-2xl pointer-events-none" />
          <div className="mb-6">
            <span className="text-indigo-650 text-xs font-bold uppercase tracking-wider">Academic Credentials</span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-950 tracking-tight mt-1">My Internship Documents</h2>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1 font-light leading-relaxed">
              Congratulations on passing your assessments! You can now view and print your verified internship documents.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {results
              .filter((r) => r.passed)
              .map((res) => {
                // Find if templates are visible
                const certVisible = templates.find((t) => t.code === "certificate")?.is_visible !== false;
                const offerVisible = templates.find((t) => t.code === "offer_letter")?.is_visible !== false;
                const reportVisible = templates.find((t) => t.code === "project_report")?.is_visible !== false;

                // Show row if at least one document template is visible
                if (!certVisible && !offerVisible && !reportVisible) return null;

                return (
                  <div 
                    key={res.id} 
                    className="border border-zinc-100 bg-zinc-50/30 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-zinc-50/70 transition-all border-l-4 border-l-indigo-600"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-zinc-900">{res.internship_title}</h3>
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 border border-emerald-150 px-2 py-0.5 text-[10px] font-bold text-emerald-600 font-mono shrink-0">
                          Passed ({res.percentage}%)
                        </span>
                      </div>
                      <p className="text-zinc-400 text-xs mt-1.5 font-light">
                        Issued on {new Date(res.completed_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} • Credential ID: <span className="font-mono text-zinc-800 font-semibold">{res.reference_number}</span>
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2.5">
                      {offerVisible && (
                        <button
                          onClick={() => handleViewDocument("offer_letter", res)}
                          className="flex items-center gap-1.5 rounded-xl border border-zinc-250 bg-white hover:bg-indigo-50/60 hover:text-indigo-755 hover:border-indigo-200 active:bg-indigo-100 active:scale-95 px-4 py-2.5 text-xs font-bold transition-all shadow-sm cursor-pointer"
                        >
                          <FileText className="h-4 w-4 text-indigo-500" />
                          View Offer Letter
                        </button>
                      )}
                      {certVisible && (
                        <button
                          onClick={() => handleViewDocument("certificate", res)}
                          className="flex items-center gap-1.5 rounded-xl border border-zinc-250 bg-white hover:bg-indigo-50/60 hover:text-indigo-755 hover:border-indigo-200 active:bg-indigo-100 active:scale-95 px-4 py-2.5 text-xs font-bold transition-all shadow-sm cursor-pointer"
                        >
                          <Award className="h-4 w-4 text-amber-500" />
                          View Certificate
                        </button>
                      )}
                      {reportVisible && (
                        <button
                          onClick={() => handleViewDocument("project_report", res)}
                          className="flex items-center gap-1.5 rounded-xl border border-zinc-250 bg-white hover:bg-indigo-50/60 hover:text-indigo-755 hover:border-indigo-200 active:bg-indigo-100 active:scale-95 px-4 py-2.5 text-xs font-bold transition-all shadow-sm cursor-pointer"
                        >
                          <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
                          View Project Report
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel rounded-2xl p-5 flex items-center gap-4">
          <div className="h-10 w-10 shrink-0 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider block">Available Tracks</span>
            <span className="text-xl font-bold text-zinc-900 tracking-tight">{internships.length}</span>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 flex items-center gap-4">
          <div className="h-10 w-10 shrink-0 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 border border-violet-100">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
          <div>
            <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider block">Tests Attempted</span>
            <span className="text-xl font-bold text-zinc-900 tracking-tight">{results.length}</span>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 flex items-center gap-4">
          <div className="h-10 w-10 shrink-0 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider block">Pass Rate</span>
            <span className="text-xl font-bold text-zinc-900 tracking-tight">
              {results.length > 0 ? `${Math.round((passedTests / results.length) * 100)}%` : "0%"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Available Tests */}
        <div className="lg:col-span-8 space-y-6">
          <h2 className="text-xl font-bold text-zinc-900 tracking-tight flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-indigo-600" />
            Start Assessment Tracks
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {internships.map((track) => (
              <div 
                key={track.id} 
                className="glass-panel rounded-2xl p-5 flex flex-col justify-between hover:border-indigo-500/30 transition-all group"
              >
                <div>
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 mb-3 inline-block">
                    {track.category}
                  </span>
                  <h3 className="text-base font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors mb-1.5">
                    {track.title}
                  </h3>
                  <p className="text-zinc-500 text-xs line-clamp-2 leading-relaxed mb-4 font-light">
                    {track.description}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedInternship(track)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-50 border border-indigo-150 text-indigo-600 hover:bg-indigo-600 hover:text-white active:bg-indigo-700 active:scale-95 px-4 py-2.5 text-xs font-bold transition-all cursor-pointer"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  Take Assessment
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Certification Logs */}
        <div className="lg:col-span-4 space-y-6">
          <h2 className="text-xl font-bold text-zinc-900 tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-indigo-600" />
            Test History
          </h2>

          <div className="space-y-3">
            {results.length === 0 ? (
              <div className="text-center py-10 border border-zinc-200 rounded-3xl bg-white shadow-sm">
                <FileText className="h-8 w-8 mx-auto text-zinc-400 mb-2" />
                <p className="text-xs text-zinc-500 font-light">No test attempts logged yet.</p>
              </div>
            ) : (
              results.map((res) => (
                <div 
                  key={res.id} 
                  className="glass-panel rounded-2xl p-4 flex flex-col gap-3 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-zinc-900 line-clamp-1">{res.internship_title}</h4>
                      <span className="text-[10px] text-zinc-400 font-light">{new Date(res.completed_at).toLocaleDateString()}</span>
                    </div>
                    {res.passed ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-100 shrink-0">
                        <CheckCircle className="h-3 w-3" /> Pass
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600 border border-red-100 shrink-0">
                        <XCircle className="h-3 w-3" /> Fail
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-zinc-500 border-t border-zinc-200/50 pt-2 font-light">
                    <span>Score: <span className="text-zinc-900 font-semibold">{res.score}/{res.total_questions}</span> ({res.percentage}%)</span>
                    <Link
                      href={`/student/results/${res.id}`}
                      className="text-xs text-indigo-600 hover:text-indigo-700 font-bold transition-all"
                    >
                      View Report
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* RULES MODAL */}
      {selectedInternship && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-indigo-500/5 blur-2xl" />

            <div className="flex items-start gap-4 mb-6">
              <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
                <HelpCircle className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs text-indigo-600 font-bold uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">{selectedInternship.category}</span>
                <h3 className="text-xl font-bold text-zinc-900 mt-2">{selectedInternship.title}</h3>
                <p className="text-xs text-zinc-400 mt-1">Assessment Code Guidelines & Testing Rules</p>
              </div>
            </div>

            {/* Rules list */}
            <div className="space-y-4 bg-zinc-50 p-5 rounded-2xl border border-zinc-200/60 text-xs sm:text-sm text-zinc-600 leading-relaxed mb-6 font-light">
              <div className="flex gap-2 items-start">
                <Clock className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                <span>**Duration:** You have exactly **5 minutes** to solve the multiple-choice questions.</span>
              </div>
              <div className="flex gap-2 items-start">
                <Award className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                <span>**Evaluation:** Passing threshold is **70%**. You need to score at least 4 out of 5 questions.</span>
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
                className="rounded-xl border border-zinc-250 bg-white hover:bg-zinc-100 active:bg-zinc-200 active:scale-95 px-5 py-2.5 text-xs font-bold text-zinc-550 hover:text-zinc-800 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <Link
                href={`/student/test/${selectedInternship.id}`}
                className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 active:from-indigo-700 active:to-violet-850 active:scale-95 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all text-center cursor-pointer"
              >
                Start Assessment
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* DOCUMENT PREVIEW MODAL */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-5xl h-[85vh] bg-white rounded-3xl flex flex-col overflow-hidden shadow-2xl border border-zinc-200">
            {/* Modal Header */}
            <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-zinc-200 bg-zinc-50">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-indigo-600 animate-pulse" />
                <h3 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wider">{previewTitle} Preview</h3>
              </div>
              <button
                onClick={() => {
                  setShowPreviewModal(false);
                  setPreviewHtml("");
                }}
                className="rounded-xl border border-zinc-250 bg-white hover:bg-zinc-100 active:bg-zinc-200 active:scale-95 text-xs font-bold text-zinc-600 hover:text-zinc-800 px-4 py-2 transition-all cursor-pointer"
              >
                Close Preview
              </button>
            </div>
            
            {/* Modal Body: iframe to isolate styles */}
            <div className="flex-grow bg-zinc-100 p-4 flex items-center justify-center overflow-hidden">
              <iframe
                title="Document Preview"
                srcDoc={previewHtml}
                className="w-full h-full border border-zinc-200 bg-white rounded-2xl shadow-inner"
                sandbox="allow-modals allow-scripts allow-same-origin allow-downloads"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
