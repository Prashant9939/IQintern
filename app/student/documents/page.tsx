/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { getCurrentUser, UserSession } from "@/lib/supabase/auth";
import {
  getInternships,
  getTestResults,
  getStudentProfile,
  getStudentPayments,
  Internship,
  TestResult,
  Payment
} from "@/lib/supabase/db";
import {
  FileText,
  BookOpen,
  MessageSquare,
  Calendar,
  FolderOpen,
  CreditCard,
  ShieldCheck,
  Award,
  Lock,
  CheckCircle,
  CheckCircle2,
  BarChart2,
  AlertCircle,
  Loader2,
  Download,
  Clipboard,
  ChevronDown,
  RefreshCw
} from "lucide-react";
import { getDocumentStatus, InternDocument, InternshipProgress, DocumentStatus } from "@/lib/utils/documents-gating";

export default function DocumentsPage() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);

  // State to track selected active internship track context
  const [selectedTrackId, setSelectedTrackId] = useState<string>("");
  // Simulated document generation/failure states for premium interactive UX
  const [docSimulatedStates, setDocSimulatedStates] = useState<Record<string, DocumentStatus | null>>({});

  useEffect(() => {
    async function loadData() {
      try {
        const u = await getCurrentUser();
        setUser(u);
        if (u) {
          const [ints, res, prof, pays] = await Promise.all([
            getInternships(),
            getTestResults(u.id),
            getStudentProfile(u.id),
            getStudentPayments(u.id)
          ]);
          setInternships(ints);
          setResults(res);
          setProfile(prof);
          setPayments(pays);
        }
      } catch (err) {
        console.error("Error loading documents data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Compute enrolled tracks (excluding general admissions if any)
  const enrolledTrackIds = Array.from(new Set([
    ...payments.map(p => p.internship_id),
    ...results.map(r => r.internship_id)
  ])).filter(id => id && id !== "general");

  // Automatically select the first track as default
  useEffect(() => {
    if (enrolledTrackIds.length > 0 && !selectedTrackId) {
      setSelectedTrackId(enrolledTrackIds[0]);
    }
  }, [enrolledTrackIds, selectedTrackId]);

  // Handle simulated generation process for UI presentation
  const handleDownloadClick = (doc: InternDocument, downloadUrl: string) => {
    const docId = doc.id;
    // Set to generating state first
    setDocSimulatedStates(prev => ({ ...prev, [docId]: 'generating' }));

    setTimeout(() => {
      // 90% chance of success, 10% chance of failure for realistic demonstration
      const isSuccess = Math.random() > 0.1;
      if (isSuccess) {
        setDocSimulatedStates(prev => ({ ...prev, [docId]: null }));
        window.open(downloadUrl, "_blank");
      } else {
        setDocSimulatedStates(prev => ({ ...prev, [docId]: 'failed' }));
      }
    }, 1500);
  };

  const handleRetryClick = (doc: InternDocument, downloadUrl: string) => {
    handleDownloadClick(doc, downloadUrl);
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#5B5FF7] border-t-transparent mx-auto" />
          <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider animate-pulse">Loading documents...</p>
        </div>
      </div>
    );
  }

  // Handle empty state
  if (enrolledTrackIds.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center py-20 border border-zinc-200 rounded-[32px] bg-white shadow-xs">
          <FolderOpen className="h-12 w-12 mx-auto text-zinc-300 mb-4" />
          <p className="text-sm text-zinc-800 font-bold">No documents available yet</p>
          <p className="text-xs text-zinc-500 font-medium mt-1">Enroll in an internship track and make a payment to unlock your document center.</p>
        </div>
      </div>
    );
  }

  // Active track details
  const activeTrackId = selectedTrackId || enrolledTrackIds[0];
  const activeTrack = internships.find(i => i.id === activeTrackId);
  const paymentForTrack = payments.find(p => p.internship_id === activeTrackId && p.status === "completed");
  const paymentDate = paymentForTrack ? new Date(paymentForTrack.created_at) : new Date();
  const endDate = new Date(paymentDate.getTime() + 28 * 24 * 60 * 60 * 1000);
  const isPeriodCompleted = Date.now() >= endDate.getTime() || results.some(r => r.internship_id === activeTrackId && r.passed);

  const bestResult = results
    .filter(r => r.internship_id === activeTrackId)
    .sort((a, b) => b.percentage - a.percentage)[0] || null;

  const assessmentStatus = bestResult
    ? (bestResult.passed ? 'passed' : 'failed')
    : 'not_attempted';

  // Construct progress state
  const progress: InternshipProgress = {
    internshipId: activeTrackId.replace("int-", "").toUpperCase(),
    programName: activeTrack?.title || "Selected Track",
    active: true,
    paymentStatus: paymentForTrack ? 'paid' : 'unpaid',
    assessmentStatus: assessmentStatus,
    assessmentPassMark: 40,
    internshipPeriod: {
      completed: isPeriodCompleted,
      endDate: endDate.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })
    },
    documentsReadyCount: 0,
    documentsTotalCount: 6,
    documents: []
  };

  // Defining the six types of documents
  const initialDocuments: Omit<InternDocument, 'status'>[] = [
    { id: 'offer_letter', title: 'Internship Offer Letter', unlockCondition: 'Pay the enrollment fee to unlock' },
    { id: 'payment_receipt', title: 'Payment Receipt', unlockCondition: 'Pay the enrollment fee to unlock' },
    { id: 'attendance_record', title: 'Attendance Record', unlockCondition: 'Pass the assessment to unlock' },
    { id: 'assessment_marksheet', title: 'Assessment Marksheet', unlockCondition: 'Pass the assessment to unlock' },
    { id: 'internship_report', title: 'Internship Report', unlockCondition: 'Pass the assessment to unlock' },
    { id: 'internship_certificate', title: 'Internship Certificate', unlockCondition: 'Pass the assessment to unlock' }
  ];

  const processedDocuments: InternDocument[] = initialDocuments.map(doc => {
    // Map internal document IDs to API templateTypes
    const templateTypeMap: Record<string, string> = {
      offer_letter: 'offer_letter',
      payment_receipt: 'receipt',
      attendance_record: 'attendance_sheet',
      assessment_marksheet: 'marksheet',
      internship_report: 'project_report',
      internship_certificate: 'certificate'
    };

    const apiTemplateType = templateTypeMap[doc.id] || doc.id;
    const downloadUrl = `/api/documents/download?templateType=${apiTemplateType}&studentId=${user?.id}&internshipId=${activeTrackId}`;
    
    // Check if there is an active simulated state override
    const simulatedStatus = docSimulatedStates[doc.id];
    const defaultStatus = getDocumentStatus(doc as InternDocument, progress);
    
    return {
      ...doc,
      status: simulatedStatus !== undefined && simulatedStatus !== null ? simulatedStatus : defaultStatus,
      downloadUrl: defaultStatus === 'ready' ? downloadUrl : undefined
    } as InternDocument;
  });

  progress.documents = processedDocuments;
  progress.documentsReadyCount = processedDocuments.filter(d => d.status === 'ready').length;

  // Icon mapping helper
  const getDocIcon = (id: string) => {
    switch (id) {
      case 'offer_letter': return FileText;
      case 'payment_receipt': return CreditCard;
      case 'attendance_record': return Calendar;
      case 'assessment_marksheet': return BarChart2;
      case 'internship_report': return Clipboard;
      case 'internship_certificate': return Award;
      default: return FileText;
    }
  };

  // Color mapping helper
  const getDocIconStyles = (status: DocumentStatus) => {
    switch (status) {
      case 'ready':
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/25";
      case 'generating':
        return "bg-indigo-500/10 text-indigo-600 border-indigo-500/25";
      case 'failed':
        return "bg-rose-500/10 text-rose-600 border-rose-500/25";
      case 'locked':
      default:
        return "bg-zinc-100 text-zinc-400 border-zinc-200";
    }
  };

  // Circular progress dimensions
  const radius = 32;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress.documentsReadyCount / progress.documentsTotalCount) * circumference;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header Selector Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 sm:px-6 rounded-2xl border border-zinc-200 shadow-xs">
        <div>
          <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Active Workspace</h2>
          <p className="text-zinc-800 text-xs font-medium mt-0.5">Toggle active tracks to inspect corresponding compliance credentials.</p>
        </div>
        
        {enrolledTrackIds.length > 1 && (
          <div className="relative shrink-0 w-full sm:w-auto">
            <select
              value={activeTrackId}
              onChange={(e) => {
                setSelectedTrackId(e.target.value);
                setDocSimulatedStates({}); // Reset simulation status when track changes
              }}
              className="appearance-none w-full sm:w-64 pr-10 pl-4 py-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-bold transition-all shadow-xs cursor-pointer outline-none focus:border-[#5B5FF7] focus:ring-1 focus:ring-[#5B5FF7]"
            >
              {enrolledTrackIds.map((id) => (
                <option key={id} value={id}>
                  {internships.find((i) => i.id === id)?.title || id}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
          </div>
        )}
      </div>

      {/* Main Document Center Hero Block */}
      <div className="relative overflow-hidden rounded-[28px] border border-zinc-200/80 bg-gradient-to-br from-[#1E293B] to-[#0F172A] p-6 sm:p-8 text-white shadow-xl shadow-zinc-900/10">
        <div className="absolute right-[-100px] top-[-50px] h-[300px] w-[300px] rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FolderOpen className="h-4.5 w-4.5 text-indigo-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Document Center</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {progress.programName}
            </h1>
            
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              <span className="font-mono text-xs font-extrabold bg-white/10 text-zinc-300 rounded-lg px-2.5 py-1 uppercase tracking-wide">
                {progress.internshipId}
              </span>
              <span className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider">
                ✓ Active
              </span>
            </div>
            
            <p className="text-zinc-400 text-xs sm:text-sm font-light max-w-xl leading-relaxed pt-1">
              Official documents are generated automatically and unlock as you progress through the internship.
            </p>
          </div>

          {/* SVG Progress Ring */}
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 self-stretch md:self-auto justify-center">
            <div className="relative h-18 w-18 flex items-center justify-center shrink-0">
              <svg className="h-full w-full -rotate-90">
                <circle
                  cx="36"
                  cy="36"
                  r={radius}
                  className="stroke-white/10"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                />
                <circle
                  cx="36"
                  cy="36"
                  r={radius}
                  className="stroke-indigo-400 transition-all duration-700 ease-out"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute font-mono text-sm font-black text-white">
                {progress.documentsReadyCount}/{progress.documentsTotalCount}
              </div>
            </div>
            <div className="text-left">
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Compliance Status</div>
              <div className="text-sm font-black text-white mt-0.5">{Math.round((progress.documentsReadyCount / progress.documentsTotalCount) * 100)}% Complete</div>
              <div className="text-[10px] text-zinc-400 mt-0.5">{progress.documentsReadyCount} of {progress.documentsTotalCount} documents ready</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tri-Metrics Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Metric 1: Payment */}
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-between text-left hover:border-zinc-300 transition-colors">
          <div className="space-y-1">
            <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider block">Payment</span>
            <strong className="text-sm font-extrabold text-zinc-800 block">
              {progress.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
            </strong>
            <span className="text-[11px] text-zinc-400 font-semibold block">
              {progress.paymentStatus === 'paid' ? 'Receipt available' : 'Admission pending'}
            </span>
          </div>
          <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${
            progress.paymentStatus === 'paid' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
          }`}>
            {progress.paymentStatus === 'paid' ? <CheckCircle2 className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
          </div>
        </div>

        {/* Metric 2: Assessment */}
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-between text-left hover:border-zinc-300 transition-colors">
          <div className="space-y-1">
            <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider block">Assessment</span>
            <strong className="text-sm font-extrabold text-zinc-800 block">
              {progress.assessmentStatus === 'passed' ? 'Passed' : progress.assessmentStatus === 'failed' ? 'Attempted (Failed)' : 'Not attempted'}
            </strong>
            <span className="text-[11px] text-zinc-400 font-semibold block">
              Pass mark {progress.assessmentPassMark}%
            </span>
          </div>
          <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${
            progress.assessmentStatus === 'passed' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-zinc-100 text-zinc-400'
          }`}>
            {progress.assessmentStatus === 'passed' ? <CheckCircle2 className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
          </div>
        </div>

        {/* Metric 3: Internship Period */}
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-xs flex items-center justify-between text-left hover:border-zinc-300 transition-colors">
          <div className="space-y-1">
            <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider block">Internship Period</span>
            <strong className="text-sm font-extrabold text-zinc-800 block">
              {progress.internshipPeriod.completed ? 'Completed' : 'In Progress'}
            </strong>
            <span className="text-[11px] text-zinc-400 font-semibold block">
              Ends {progress.internshipPeriod.endDate}
            </span>
          </div>
          <div className="h-9 w-9 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

      </div>

      {/* Documents Grid Section */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest text-left">Document Vault & Checklists</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {progress.documents.map((doc) => {
            const Icon = getDocIcon(doc.id);
            const isReady = doc.status === 'ready';
            const isLocked = doc.status === 'locked';
            const isGenerating = doc.status === 'generating';
            const isFailed = doc.status === 'failed';
            
            return (
              <div
                key={doc.id}
                className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-zinc-300 transition-all duration-300 text-left min-h-[170px] relative group"
              >
                {/* Header Row: Icon & Status Check */}
                <div className="flex justify-between items-start gap-4">
                  <div className="flex gap-3.5 items-start">
                    <div className={`h-11 w-11 rounded-xl border flex items-center justify-center shrink-0 transition-colors ${getDocIconStyles(doc.status)}`}>
                      {isGenerating ? (
                        <Loader2 className="h-5.5 w-5.5 animate-spin" />
                      ) : (
                        <Icon className="h-5.5 w-5.5" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-zinc-850 group-hover:text-zinc-950 transition-colors">
                        {doc.title}
                      </h3>
                      {isReady && (
                        <p className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 stroke-[3]" /> Generated & verified
                        </p>
                      )}
                      {isLocked && (
                        <p className="text-[11px] text-amber-500 font-extrabold uppercase mt-1 tracking-wider">
                          {doc.unlockCondition}
                        </p>
                      )}
                      {isGenerating && (
                        <p className="text-[11px] text-indigo-500 font-semibold mt-1 animate-pulse">
                          Generating server PDF...
                        </p>
                      )}
                      {isFailed && (
                        <p className="text-[11px] text-rose-500 font-bold mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> Generation failed. Please try again.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Top corner indicator icon */}
                  <div>
                    {isReady && <CheckCircle className="h-5 w-5 text-emerald-500" />}
                    {isLocked && <Lock className="h-4.5 w-4.5 text-zinc-300" />}
                    {isFailed && <AlertCircle className="h-5 w-5 text-rose-500" />}
                  </div>
                </div>

                {/* Bottom Actions Row */}
                <div className="mt-6 pt-4 border-t border-zinc-150">
                  {isReady && (
                    <button
                      onClick={() => handleDownloadClick(doc, doc.downloadUrl!)}
                      className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 text-xs transition-all active:scale-97 shadow-sm shadow-indigo-600/10 cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download PDF
                    </button>
                  )}
                  {isLocked && (
                    <button
                      disabled
                      className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-zinc-100 text-zinc-400 font-bold py-2.5 px-4 text-xs select-none border border-zinc-200"
                    >
                      <Lock className="h-3.5 w-3.5" />
                      Locked
                    </button>
                  )}
                  {isGenerating && (
                    <button
                      disabled
                      className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-50 text-indigo-500 border border-indigo-150 font-bold py-2.5 px-4 text-xs"
                    >
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Generating...
                    </button>
                  )}
                  {isFailed && (
                    <button
                      onClick={() => handleRetryClick(doc, `/api/documents/download?templateType=${doc.id === 'payment_receipt' ? 'receipt' : doc.id === 'internship_certificate' ? 'certificate' : doc.id === 'attendance_record' ? 'attendance_sheet' : doc.id === 'internship_report' ? 'project_report' : doc.id === 'assessment_marksheet' ? 'marksheet' : doc.id}&studentId=${user?.id}&internshipId=${activeTrackId}`)}
                      className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 px-4 text-xs transition-all active:scale-97 shadow-sm shadow-rose-600/10 cursor-pointer"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      Retry Generation
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
