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
  FileText, 
  CheckCircle,
  XCircle,
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
          <p className="text-zinc-505 text-xs sm:text-sm mt-1 font-light">
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
                          type="button"
                          onClick={() => handleViewDocument("offer_letter", res)}
                          className="flex items-center gap-1.5 rounded-xl border border-zinc-250 bg-white hover:bg-indigo-50/60 hover:text-indigo-755 hover:border-indigo-200 active:bg-indigo-100 active:scale-95 px-4 py-2.5 text-xs font-bold transition-all shadow-sm cursor-pointer"
                        >
                          <FileText className="h-4 w-4 text-indigo-500" />
                          View Offer Letter
                        </button>
                      )}
                      {certVisible && (
                        <button
                          type="button"
                          onClick={() => handleViewDocument("certificate", res)}
                          className="flex items-center gap-1.5 rounded-xl border border-zinc-250 bg-white hover:bg-indigo-50/60 hover:text-indigo-755 hover:border-indigo-200 active:bg-indigo-100 active:scale-95 px-4 py-2.5 text-xs font-bold transition-all shadow-sm cursor-pointer"
                        >
                          <Award className="h-4 w-4 text-amber-500" />
                          View Certificate
                        </button>
                      )}
                      {reportVisible && (
                        <button
                          type="button"
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

      {/* Certification Logs Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-zinc-900 tracking-tight flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-indigo-600" />
          Test History
        </h2>

        {results.length === 0 ? (
          <div className="text-center py-16 border border-zinc-205 rounded-3xl bg-white shadow-sm">
            <FileText className="h-10 w-10 mx-auto text-zinc-400 mb-3" />
            <p className="text-sm text-zinc-555 font-bold">No test attempts logged yet.</p>
            <p className="text-xs text-zinc-400 font-light mt-1">Navigate to the Available Internships tab to take your first test.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((res) => (
              <div 
                key={res.id} 
                className="glass-panel bg-white border border-zinc-200/80 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-zinc-900 line-clamp-1">{res.internship_title}</h4>
                      <span className="text-[10px] text-zinc-400 font-light block mt-0.5">{new Date(res.completed_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
                    </div>
                    {res.passed ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 text-[10px] font-bold text-emerald-600 shrink-0">
                        <CheckCircle className="h-3.5 w-3.5 shrink-0" /> Pass
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 border border-red-100 px-3 py-1 text-[10px] font-bold text-red-600 border border-red-100 shrink-0">
                        <XCircle className="h-3.5 w-3.5 shrink-0" /> Fail
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-zinc-505 border-t border-zinc-100 pt-3 font-light">
                    <span>Score: <span className="text-zinc-800 font-semibold">{res.score}/{res.total_questions}</span> ({res.percentage}%)</span>
                    <Link
                      href={`/student/results/${res.id}`}
                      className="text-xs text-indigo-650 hover:text-indigo-755 font-bold transition-all"
                    >
                      View Report &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
