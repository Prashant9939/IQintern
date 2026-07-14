"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  CheckCircle,
  XCircle,
  Loader2,
  FileText,
  Building,
  GraduationCap,
  Calendar,
  Award,
  ExternalLink,
  ShieldCheck,
  ChevronLeft
} from "lucide-react";

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const certificate = searchParams.get("certificate") || "";
  const reference = searchParams.get("reference") || "";
  const queryId = searchParams.get("id") || "";
  const initialId = certificate || reference || queryId;

  const [searchId, setSearchId] = useState(initialId);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [verifiedTime, setVerifiedTime] = useState("");

  const fetchVerification = async (idToVerify: string) => {
    if (!idToVerify.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`/api/documents/verify?id=${encodeURIComponent(idToVerify.trim())}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setResult(data);
        setVerifiedTime(new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }));
      } else {
        setError(data.error || "Document not found or invalid verification ID.");
      }
    } catch (err) {
      setError("An error occurred while contacting the verification server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      setSearchId(initialId);
      fetchVerification(initialId);
    }
  }, [initialId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    
    // Update URL to support shareable lookup links
    router.push(`/verify?id=${encodeURIComponent(searchId.trim())}`);
  };

  const documentTypeMap: Record<string, string> = {
    offer_letter: "Internship Offer Letter",
    receipt: "Payment Receipt",
    payment_receipt: "Payment Receipt",
    attendance_sheet: "Attendance Record",
    attendance_record: "Attendance Record",
    marksheet: "Assessment Marksheet",
    assessment_marksheet: "Assessment Marksheet",
    project_report: "Internship Project Report",
    internship_report: "Internship Project Report",
    certificate: "Internship Certificate",
    internship_certificate: "Internship Certificate",
  };

  return (
    <div className="min-h-screen bg-[#F8FAF8] flex flex-col justify-between font-sans antialiased text-slate-800">
      
      {/* Decorative top bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600" />
      
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 max-w-4xl mx-auto w-full">
        
        {/* Navigation back option */}
        <div className="w-full flex justify-start mb-6">
          <Link 
            href="/student/dashboard" 
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Back to Dashboard
          </Link>
        </div>

        {/* Portal Header */}
        <div className="text-center mb-8 space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-wider font-mono">
            <ShieldCheck className="h-3.5 w-3.5" />
            Platform Audit Registry
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            IQ Intern Verification Portal
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto">
            Instantly verify the authenticity of certificates, offer letters, marksheets, and reports generated on the IQ Intern platform.
          </p>
        </div>

        {/* Lookup Box Card */}
        <div className="w-full bg-white border border-slate-200 shadow-xs rounded-[24px] p-6 sm:p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <label htmlFor="verify-input" className="block text-xs font-black uppercase tracking-wider text-slate-500">
              Enter Certificate Number / Reference ID
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-400" />
                <input
                  id="verify-input"
                  type="text"
                  placeholder="e.g., IQ-2026-0000125 or IQ-REF-0000872"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white focus:outline-none rounded-xl text-sm font-semibold tracking-wide placeholder-slate-400 transition-all shadow-inner"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !searchId.trim()}
                className="inline-flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold py-3.5 px-6 rounded-xl text-xs transition-all cursor-pointer shadow-md shadow-indigo-600/10 active:scale-98"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify Credential"}
              </button>
            </div>
          </form>

          {/* Loader */}
          {loading && (
            <div className="py-12 text-center space-y-3">
              <Loader2 className="h-8 w-8 text-indigo-600 animate-spin mx-auto" />
              <p className="text-xs text-slate-500 font-bold">Querying secure registry index...</p>
            </div>
          )}

          {/* Error Banner */}
          {error && !loading && (
            <div className="bg-rose-50/70 border border-rose-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
              <XCircle className="h-10 w-10 text-rose-500 shrink-0" />
              <div className="space-y-1">
                <h3 className="text-sm font-black text-rose-900 font-sans">Verification Failure</h3>
                <p className="text-xs text-rose-700 leading-relaxed max-w-lg font-semibold">
                  {error === "Document not found" || error?.includes("not found")
                    ? "No valid document found for the provided Certificate Number or Reference ID."
                    : error}
                </p>
              </div>
            </div>
          )}

          {/* Success Result Display Card */}
          {result && !loading && (
            <div className="space-y-6 animate-fade-in">
              {/* Verification Stamp */}
              <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4 flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-emerald-600 shrink-0" />
                <div className="text-left">
                  <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wide">
                    Document Verified Authentically
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium">
                    This document is registered, verified, and audited by the IQ Intern registry.
                  </p>
                </div>
              </div>

              {/* Document Details Grid */}
              <div className="border border-slate-200 rounded-[20px] overflow-hidden bg-slate-50/50">
                <div className="bg-slate-100/50 px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Registry ID</span>
                    <span className="text-xs font-black text-slate-700 font-mono tracking-wide">{result.verificationId}</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-wide">
                    <FileText className="h-3 w-3" />
                    {documentTypeMap[result.documentType] || result.documentType.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
                  
                  {/* Candidate Profile Info */}
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Student Name</span>
                      <span className="text-sm font-black text-slate-900">{result.candidate.name}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Registration ID</span>
                      <span className="text-xs font-mono font-bold text-slate-700 mt-0.5 block">{result.candidate.registrationNumber || 'N/A'}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Course / Degree</span>
                      <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mt-0.5">
                        <GraduationCap className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                        {result.candidate.course} (Semester {result.candidate.semester})
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">College / University</span>
                      <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mt-0.5">
                        <Building className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                        {result.candidate.college}
                      </span>
                    </div>
                  </div>

                  {/* Internship Details */}
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Internship Name</span>
                      <span className="text-sm font-black text-slate-900">{result.internship.title}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Document Type</span>
                      <span className="text-xs font-bold text-slate-700 mt-0.5 block">
                        {documentTypeMap[result.documentType] || result.documentType.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Certificate / Reference ID</span>
                      <span className="text-xs font-mono font-bold text-slate-700 mt-0.5 block">{result.verificationId}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Issue Date</span>
                      <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mt-0.5">
                        <Calendar className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                        {new Date(result.generatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                </div>

                {/* Audit Registry Info Footer */}
                <div className="bg-slate-100/30 px-6 py-4 border-t border-slate-200 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Verification Status</span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide bg-emerald-100 text-emerald-800 border border-emerald-200 mt-1">
                      {result.status || 'Valid'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Verification Timestamp</span>
                    <span className="text-[11px] font-bold text-slate-600 font-mono block mt-1">{verifiedTime}</span>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={result.downloadUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-6 rounded-xl text-xs transition-all cursor-pointer text-center shadow-md active:scale-98"
                >
                  <Award className="h-4 w-4" />
                  View Original Document (PDF)
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          )}

        </div>

      </main>

      {/* Footer */}
      <footer className="w-full py-6 border-t border-slate-200 bg-white text-center text-[10px] sm:text-xs text-slate-400">
        <div className="max-w-4xl mx-auto px-4 space-y-1">
          <p>© {new Date().getFullYear()} IQ Intern Vocational Training Pvt. Ltd. All rights reserved.</p>
          <p className="font-mono text-[9px] opacity-75">Secure Audit Verification Portal | SHA-256 Checksum Secured</p>
        </div>
      </footer>

    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen bg-[#F8FAF8] items-center justify-center">
        <div className="text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent mx-auto mb-4" />
          <p className="text-slate-500 text-sm font-bold">Initializing Verification Portal...</p>
        </div>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
