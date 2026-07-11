/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import {
  getAllProfiles,
  getTestResults,
  getAllPayments,
  getInternships,
  updateTestResult,
  saveTestResult,
  TestResult,
  Internship
} from "@/lib/supabase/db";
import { getCurrentUser, UserSession } from "@/lib/supabase/auth";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  Search,
  BookOpen,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Edit,
  Award,
  RefreshCw,
  SlidersHorizontal,
  ChevronDown
} from "lucide-react";
import Link from "next/link";

interface ProgressItem {
  id: string; // unique identifier (combination of student_id and internship_id)
  student: any;
  internship: Internship;
  payment: any;
  testResult: TestResult | null;
  examStatus: "Exam Not Started" | "Exam In Progress" | "Exam Completed" | "Assessment Expired";
  countdownText: string;
  marksText: string;
  percentageText: string;
  gradeText: string;
  passFailText: string;
  hasCertificate: boolean;
  hasMarksheet: boolean;
  certificateStatusText: "Generated" | "Not Generated";
}

export default function StudentInternshipProgress() {
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [progressList, setProgressList] = useState<ProgressItem[]>([]);
  const [internships, setInternships] = useState<Internship[]>([]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterInternship, setFilterInternship] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPassFail, setFilterPassFail] = useState("all");
  const [filterCertificate, setFilterCertificate] = useState("all");

  // Edit Marks Modal State
  const [editingItem, setEditingItem] = useState<ProgressItem | null>(null);
  const [obtainedMarks, setObtainedMarks] = useState<number>(0);
  const [totalQuestions, setTotalQuestions] = useState<number>(10);
  const [passedToggle, setPassedToggle] = useState<boolean>(true);
  const [savingResult, setSavingResult] = useState(false);
  const [modalError, setModalError] = useState("");
  const [modalSuccess, setModalSuccess] = useState("");
  const [showRegenConfirm, setShowRegenConfirm] = useState(false);

  // Load Data
  const loadData = async () => {
    setLoading(true);
    try {
      const u = await getCurrentUser();
      setCurrentUser(u);

      if (!u) {
        window.location.href = "/auth/login";
        return;
      }

      // Fetch all required data from db
      const [profiles, results, payments, ints] = await Promise.all([
        getAllProfiles(),
        getTestResults(),
        getAllPayments(),
        getInternships(),
      ]);

      setInternships(ints);

      // Fetch student document metadata if supabase configured
      let docs: any[] = [];
      if (isSupabaseConfigured() && supabase) {
        try {
          const { data } = await supabase.from("student_documents").select("*");
          docs = data || [];
        } catch (e) {
          console.warn("Failed to load student_documents metadata from database:", e);
        }
      }

      // Filter and map completed payments of non-admins to progress items
      const mappedItems: ProgressItem[] = [];

      // Valid track helper: skip general credits or general unused credits
      const isValidTrack = (trackId: string) => {
        return trackId && trackId !== "general" && trackId !== "general_credit_unused";
      };

      const completedPayments = payments.filter(
        (p) => p.status === "completed" && isValidTrack(p.internship_id)
      );

      for (const p of completedPayments) {
        const student = profiles.find((s) => s.id === p.student_id);
        if (!student || student.role === "admin") continue;

        const internship = ints.find((i) => i.id === p.internship_id) || {
          id: p.internship_id,
          title: p.internship_id.toUpperCase().replace("-", " ") + " Program",
          category: "General",
          duration: "120 Hrs",
          requirements: [],
          description: "",
        } as unknown as Internship;

        // Find the latest test result
        const trackResults = results.filter(
          (r) => r.student_id === p.student_id && r.internship_id === p.internship_id
        );
        const testResult = trackResults[0] || null;

        // Date calculations
        const payDate = new Date(p.created_at);
        const now = new Date();

        // 28 days lock
        const lockDays = 28;
        const lockEndTime = payDate.getTime() + lockDays * 24 * 60 * 60 * 1000;
        const isLocked = now.getTime() < lockEndTime;

        // 60 days overall expiry
        const expiryDays = 60;
        const expiryTime = payDate.getTime() + expiryDays * 24 * 60 * 60 * 1000;
        const isExpired = now.getTime() >= expiryTime;

        // Assessment Status and Countdowns
        let examStatus: ProgressItem["examStatus"] = "Exam Not Started";
        let countdownText = "—";

        if (testResult) {
          examStatus = "Exam Completed";
        } else if (isLocked) {
          examStatus = "Exam Not Started";
          const diff = lockEndTime - now.getTime();
          const d = Math.floor(diff / (1000 * 60 * 60 * 24));
          const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          countdownText = `${d} Days ${h} Hours to Unlock`;
        } else if (isExpired) {
          examStatus = "Assessment Expired";
          countdownText = "Expired";
        } else {
          examStatus = "Exam In Progress";
          const diff = expiryTime - now.getTime();
          const d = Math.floor(diff / (1000 * 60 * 60 * 24));
          const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          countdownText = `${d} Days ${h} Hours Remaining`;
        }

        // Marks display text
        const marksText = testResult ? `${testResult.score} / ${testResult.total_questions}` : "—";
        const percentageText = testResult ? `${testResult.percentage}%` : "—";
        
        let gradeText = "—";
        if (testResult) {
          const pct = testResult.percentage;
          if (pct >= 90) gradeText = "A+";
          else if (pct >= 80) gradeText = "A";
          else if (pct >= 70) gradeText = "B+";
          else if (pct >= 60) gradeText = "B";
          else if (pct >= 50) gradeText = "C";
          else if (pct >= 40) gradeText = "D";
          else gradeText = "F";
        }

        const passFailText = testResult ? (testResult.passed ? "Pass" : "Fail") : "—";

        // Check document completion status
        let hasCertificate = false;
        let hasMarksheet = false;

        if (isSupabaseConfigured() && supabase) {
          hasCertificate = docs.some(
            (d) =>
              d.student_id === p.student_id &&
              d.internship_id === p.internship_id &&
              d.document_type === "certificate" &&
              d.generation_status === "completed"
          );
          hasMarksheet = docs.some(
            (d) =>
              d.student_id === p.student_id &&
              d.internship_id === p.internship_id &&
              d.document_type === "marksheet" &&
              d.generation_status === "completed"
          );
        } else {
          // Mock mode fallback
          hasCertificate = testResult ? testResult.passed : false;
          hasMarksheet = testResult ? testResult.passed : false;
        }

        const certificateStatusText = hasCertificate ? "Generated" : "Not Generated";

        mappedItems.push({
          id: `${p.student_id}_${p.internship_id}`,
          student,
          internship,
          payment: p,
          testResult,
          examStatus,
          countdownText,
          marksText,
          percentageText,
          gradeText,
          passFailText,
          hasCertificate,
          hasMarksheet,
          certificateStatusText
        });
      }

      setProgressList(mappedItems);
    } catch (e) {
      console.error("Failed to load progress list:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Sync automatic defaults in modal when obtainedMarks changes
  useEffect(() => {
    if (editingItem) {
      const calculatedPct = totalQuestions > 0 ? (obtainedMarks / totalQuestions) * 100 : 0;
      setPassedToggle(calculatedPct >= 40);
    }
  }, [obtainedMarks, totalQuestions]);

  // Open Edit Marks Dialog
  const handleOpenEdit = (item: ProgressItem) => {
    setEditingItem(item);
    setObtainedMarks(item.testResult ? item.testResult.score : 0);
    setTotalQuestions(item.testResult ? item.testResult.total_questions : 10);
    setPassedToggle(item.testResult ? item.testResult.passed : false);
    setModalError("");
    setModalSuccess("");
    setShowRegenConfirm(false);
  };

  // Close Edit Marks Dialog
  const handleCloseEdit = () => {
    setEditingItem(null);
    setShowRegenConfirm(false);
  };

  // Handle Save results and document trigger
  const handleSaveResult = async () => {
    if (!editingItem) return;
    setSavingResult(true);
    setModalError("");
    setModalSuccess("");

    try {
      const pct = totalQuestions > 0 ? Number(((obtainedMarks / totalQuestions) * 100).toFixed(2)) : 0;
      let res: TestResult | null = null;

      if (editingItem.testResult && editingItem.testResult.id) {
        // Update existing record
        res = await updateTestResult(editingItem.testResult.id, {
          score: obtainedMarks,
          total_questions: totalQuestions,
          percentage: pct,
          passed: passedToggle,
        });
      } else {
        // Create new record
        res = await saveTestResult({
          student_id: editingItem.student.id,
          internship_id: editingItem.internship.id,
          score: obtainedMarks,
          total_questions: totalQuestions,
          percentage: pct,
          passed: passedToggle,
          completed_at: new Date().toISOString(),
        });
      }

      if (!res) {
        throw new Error("Database failed to save updated test results.");
      }

      setModalSuccess("Marks updated successfully! Enqueuing documents for regeneration...");

      // Automatically trigger document regeneration (fire-and-forget background execution)
      try {
        const originUrl = typeof window !== "undefined" ? window.location.origin : "";
        await fetch("/api/documents/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentId: editingItem.student.id,
            internshipId: editingItem.internship.id,
            templateType: ["certificate", "marksheet"],
            force: true
          }),
        });
      } catch (genErr) {
        console.error("Failed to enqueue document regeneration:", genErr);
      }

      // Reload dataset to update tables
      await loadData();

      setTimeout(() => {
        setEditingItem(null);
      }, 1500);
    } catch (err: any) {
      setModalError(err.message || "An error occurred while saving the results.");
    } finally {
      setSavingResult(false);
    }
  };

  // Filter list
  const filteredList = progressList.filter((item) => {
    // 1. Search Query
    const nameMatch = item.student.full_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const regMatch = item.student.registration_number?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                     item.student.id?.toLowerCase().includes(searchQuery.toLowerCase());
    if (searchQuery && !nameMatch && !regMatch) return false;

    // 2. Internship Filter
    if (filterInternship !== "all" && item.internship.id !== filterInternship) return false;

    // 3. Status Filter
    if (filterStatus !== "all" && item.examStatus !== filterStatus) return false;

    // 4. Pass/Fail Filter
    if (filterPassFail !== "all") {
      if (filterPassFail === "Pass" && item.passFailText !== "Pass") return false;
      if (filterPassFail === "Fail" && item.passFailText !== "Fail") return false;
      if (filterPassFail === "Not Attempted" && item.passFailText !== "—") return false;
    }

    // 5. Certificate Filter
    if (filterCertificate !== "all") {
      if (filterCertificate === "Generated" && !item.hasCertificate) return false;
      if (filterCertificate === "Not Generated" && item.hasCertificate) return false;
    }

    return true;
  });

  const getStatusBadgeStyles = (status: ProgressItem["examStatus"]) => {
    switch (status) {
      case "Exam Completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-250";
      case "Exam In Progress":
        return "bg-indigo-50 text-indigo-700 border-indigo-250";
      case "Exam Not Started":
        return "bg-zinc-100 text-zinc-650 border-zinc-200";
      case "Assessment Expired":
      default:
        return "bg-rose-50 text-rose-700 border-rose-250";
    }
  };

  const getPassFailBadgeStyles = (pf: string) => {
    switch (pf) {
      case "Pass":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Fail":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-zinc-50 text-zinc-400 border-zinc-100";
    }
  };

  // Grade badge styling helper
  const getGradeBadgeStyles = (grade: string) => {
    if (grade.startsWith("A")) return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (grade.startsWith("B")) return "bg-indigo-50 text-indigo-700 border-indigo-200";
    if (grade.startsWith("C") || grade.startsWith("D")) return "bg-amber-50 text-amber-700 border-amber-200";
    if (grade === "F") return "bg-rose-50 text-rose-700 border-rose-200";
    return "text-zinc-400";
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#FAFAFC] items-center justify-center">
        <div className="text-center space-y-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent mx-auto" />
          <p className="text-zinc-550 text-sm font-semibold uppercase tracking-wider">Loading internship progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in text-zinc-800 pb-12">
      {/* Header */}
      <section className="text-left flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-indigo-600 text-xs font-bold uppercase tracking-wider">Platform Administration</span>
          <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight mt-1">Student Internship Progress</h1>
          <p className="text-zinc-500 text-xs sm:text-sm font-light mt-2 leading-relaxed">
            Monitor students' enrollment dates, eligibility locks, active exam countdowns, exam completion marks, and manage compliance files.
          </p>
        </div>
        <button
          onClick={loadData}
          className="shrink-0 bg-white hover:bg-slate-50 border border-zinc-200 text-zinc-700 text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh Dataset
        </button>
      </section>

      {/* Search & Filter Panel */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-xs flex flex-col gap-4 text-left">
        <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-wider">
          <SlidersHorizontal className="h-4 w-4 text-indigo-500" />
          Search & Filters
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search bar */}
          <div className="relative lg:col-span-1 col-span-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search student or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl outline-none text-xs text-zinc-800 transition-all placeholder:text-zinc-400 font-semibold"
            />
          </div>

          {/* Internship filter */}
          <div className="relative">
            <select
              value={filterInternship}
              onChange={(e) => setFilterInternship(e.target.value)}
              className="w-full appearance-none pr-9 pl-4 py-2.5 bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl outline-none text-xs text-zinc-700 font-bold transition-all cursor-pointer"
            >
              <option value="all">All Internships</option>
              {internships.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.title}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
          </div>

          {/* Status filter */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full appearance-none pr-9 pl-4 py-2.5 bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl outline-none text-xs text-zinc-700 font-bold transition-all cursor-pointer"
            >
              <option value="all">All Exam Statuses</option>
              <option value="Exam Not Started">Exam Not Started</option>
              <option value="Exam In Progress">Exam In Progress</option>
              <option value="Exam Completed">Exam Completed</option>
              <option value="Assessment Expired">Assessment Expired</option>
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
          </div>

          {/* Pass/Fail filter */}
          <div className="relative">
            <select
              value={filterPassFail}
              onChange={(e) => setFilterPassFail(e.target.value)}
              className="w-full appearance-none pr-9 pl-4 py-2.5 bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl outline-none text-xs text-zinc-700 font-bold transition-all cursor-pointer"
            >
              <option value="all">All Pass/Fail Statuses</option>
              <option value="Pass">Pass</option>
              <option value="Fail">Fail</option>
              <option value="Not Attempted">Not Attempted</option>
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
          </div>

          {/* Certificate filter */}
          <div className="relative">
            <select
              value={filterCertificate}
              onChange={(e) => setFilterCertificate(e.target.value)}
              className="w-full appearance-none pr-9 pl-4 py-2.5 bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl outline-none text-xs text-zinc-700 font-bold transition-all cursor-pointer"
            >
              <option value="all">All Certificate Statuses</option>
              <option value="Generated">Generated</option>
              <option value="Not Generated">Not Generated</option>
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Student List Table */}
      <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-xs overflow-hidden">
        {filteredList.length === 0 ? (
          <div className="text-center py-20 bg-white">
            <BookOpen className="h-12 w-12 mx-auto text-zinc-300 mb-4" />
            <p className="text-sm text-zinc-800 font-bold">No progress items found.</p>
            <p className="text-xs text-zinc-550 mt-1 font-medium">Try broadening your search queries or filter attributes.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-450 uppercase font-bold tracking-wider select-none text-[10px]">
                  <th className="py-4 px-5">Student Information</th>
                  <th className="py-4 px-4">Internship Track</th>
                  <th className="py-4 px-4">Assessment Status</th>
                  <th className="py-4 px-4">Countdown / Expiry</th>
                  <th className="py-4 px-4">Result Metrics</th>
                  <th className="py-4 px-4">Pass/Fail</th>
                  <th className="py-4 px-4">Cert / Marksheet</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200/80 text-zinc-700 font-medium">
                {filteredList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Student details */}
                    <td className="py-4 px-5">
                      <div className="space-y-0.5">
                        <span className="font-extrabold text-zinc-900 block">{item.student.full_name}</span>
                        <span className="text-[10px] text-zinc-400 font-mono block">ID: {item.student.registration_number || item.student.id}</span>
                        <span className="text-[10px] text-zinc-450 font-semibold block">{item.student.email}</span>
                        <span className="text-[10px] text-zinc-500 font-light block line-clamp-1 max-w-[200px]">
                          {item.student.college_name || "N/A"} ({item.student.university_name || "N/A"})
                        </span>
                      </div>
                    </td>

                    {/* Internship Name */}
                    <td className="py-4 px-4">
                      <div className="max-w-[150px]">
                        <span className="font-extrabold text-zinc-900 block truncate">{item.internship.title}</span>
                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mt-0.5">{item.internship.category}</span>
                      </div>
                    </td>

                    {/* Exam Status */}
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1 border px-2 py-0.5 rounded-full text-[9px] font-bold ${getStatusBadgeStyles(item.examStatus)}`}>
                        {item.examStatus === "Exam Completed" && <CheckCircle className="h-3 w-3 shrink-0" />}
                        {item.examStatus === "Exam In Progress" && <Clock className="h-3 w-3 shrink-0" />}
                        {item.examStatus === "Exam Not Started" && <AlertCircle className="h-3 w-3 shrink-0" />}
                        {item.examStatus === "Assessment Expired" && <XCircle className="h-3 w-3 shrink-0" />}
                        {item.examStatus}
                      </span>
                    </td>

                    {/* Countdown */}
                    <td className="py-4 px-4 font-semibold text-zinc-500 font-mono">
                      {item.countdownText}
                    </td>

                    {/* Score / Grade / Pct */}
                    <td className="py-4 px-4">
                      {item.testResult ? (
                        <div className="space-y-0.5">
                          <span className="font-bold text-zinc-800 block">Score: {item.marksText}</span>
                          <span className="text-[10px] text-zinc-450 block">Percentage: {item.percentageText}</span>
                          <span className="text-[10px] block mt-0.5">
                            Grade: <span className={`inline-flex border px-1.5 py-0.2 rounded text-[9px] font-bold ${getGradeBadgeStyles(item.gradeText)}`}>{item.gradeText}</span>
                          </span>
                        </div>
                      ) : (
                        <span className="text-zinc-450 font-light">—</span>
                      )}
                    </td>

                    {/* Pass/Fail Status */}
                    <td className="py-4 px-4">
                      <span className={`inline-flex border px-2 py-0.5 rounded-full text-[9px] font-bold ${getPassFailBadgeStyles(item.passFailText)}`}>
                        {item.passFailText}
                      </span>
                    </td>

                    {/* Document Status */}
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold ${item.hasCertificate ? "text-emerald-600" : "text-zinc-400"}`}>
                          <Award className="h-3.5 w-3.5" />
                          Cert: {item.certificateStatusText}
                        </span>
                        <span className={`block text-[9px] font-bold ${item.hasMarksheet ? "text-emerald-600" : "text-zinc-400"}`}>
                          Sheet: {item.hasMarksheet ? "Generated" : "Not Generated"}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="inline-flex items-center gap-1 bg-white hover:bg-slate-50 border border-zinc-200 text-zinc-700 text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all shadow-xs cursor-pointer active:scale-95"
                      >
                        <Edit className="h-3 w-3" />
                        Edit Marks
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Marks Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/45 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white border border-zinc-200 rounded-[24px] shadow-2xl max-w-md w-full overflow-hidden flex flex-col text-left">
            
            {/* Header */}
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-base font-extrabold text-zinc-900">Override Assessment Marks</h3>
                <p className="text-[10px] text-zinc-450 font-medium mt-0.5">Admin Management Control Center</p>
              </div>
              <button
                onClick={handleCloseEdit}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
              {modalError && (
                <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-250 rounded-xl text-xs text-rose-700 font-bold">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{modalError}</span>
                </div>
              )}

              {modalSuccess && (
                <div className="flex items-start gap-2 p-3 bg-emerald-50 border border-emerald-250 rounded-xl text-xs text-emerald-700 font-bold animate-pulse">
                  <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{modalSuccess}</span>
                </div>
              )}

              {/* Student Overview */}
              <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl space-y-1.5">
                <div className="text-[10px] font-bold text-zinc-450 uppercase tracking-wider">Active Target Record</div>
                <div className="text-xs">
                  <strong className="text-zinc-800">Student: </strong>{editingItem.student.full_name}
                </div>
                <div className="text-xs">
                  <strong className="text-zinc-800">Track: </strong>{editingItem.internship.title}
                </div>
                {editingItem.testResult && (
                  <div className="text-[10px] font-mono text-zinc-400 mt-1">
                    Previous Score: {editingItem.testResult.score}/{editingItem.testResult.total_questions} ({editingItem.testResult.percentage}%) - {editingItem.testResult.passed ? "PASSED" : "FAILED"}
                  </div>
                )}
              </div>

              {/* Editing controls */}
              {!showRegenConfirm ? (
                <div className="space-y-4">
                  {/* Obtained Marks */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-zinc-650 uppercase tracking-wider block">Obtained Marks</label>
                    <input
                      type="number"
                      min="0"
                      max={totalQuestions}
                      value={obtainedMarks}
                      onChange={(e) => setObtainedMarks(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full px-4 py-2.5 bg-white border border-zinc-200 focus:border-indigo-500 rounded-xl outline-none text-xs text-zinc-800 font-semibold"
                      required
                    />
                  </div>

                  {/* Total Questions */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-zinc-650 uppercase tracking-wider block">Total Questions</label>
                    <input
                      type="number"
                      min="1"
                      value={totalQuestions}
                      onChange={(e) => setTotalQuestions(Math.max(1, parseInt(e.target.value) || 10))}
                      className="w-full px-4 py-2.5 bg-white border border-zinc-200 focus:border-indigo-500 rounded-xl outline-none text-xs text-zinc-800 font-semibold"
                      required
                    />
                  </div>

                  {/* Calculated metrics preview */}
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="p-3 bg-slate-50 border border-zinc-150 rounded-xl text-left">
                      <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider block">Calculated Percentage</span>
                      <strong className="text-sm font-extrabold text-zinc-800 block mt-0.5">
                        {totalQuestions > 0 ? ((obtainedMarks / totalQuestions) * 100).toFixed(1) : 0}%
                      </strong>
                    </div>
                    <div className="p-3 bg-slate-50 border border-zinc-150 rounded-xl text-left">
                      <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider block">Calculated Grade</span>
                      <strong className="text-sm font-extrabold text-zinc-800 block mt-0.5">
                        {(() => {
                          const pct = totalQuestions > 0 ? (obtainedMarks / totalQuestions) * 100 : 0;
                          if (pct >= 90) return "A+";
                          if (pct >= 80) return "A";
                          if (pct >= 70) return "B+";
                          if (pct >= 60) return "B";
                          if (pct >= 50) return "C";
                          if (pct >= 40) return "D";
                          return "F (Fail)";
                        })()}
                      </strong>
                    </div>
                  </div>

                  {/* Manual Pass/Fail override */}
                  <div className="flex items-center gap-3 pt-2">
                    <input
                      type="checkbox"
                      id="passed_override"
                      checked={passedToggle}
                      onChange={(e) => setPassedToggle(e.target.checked)}
                      className="h-4.5 w-4.5 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                    <label htmlFor="passed_override" className="text-xs font-bold text-zinc-700 cursor-pointer select-none">
                      Mark as Passed Program (Minimum Score required: 40%)
                    </label>
                  </div>
                </div>
              ) : (
                /* Confirmation view */
                <div className="space-y-4 p-4 border border-amber-300 bg-amber-50 rounded-xl text-xs text-amber-800 font-medium">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="h-5 w-5 shrink-0 text-amber-600" />
                    <div>
                      <strong className="font-extrabold text-amber-900 block mb-1">Confirm Update & Document Regeneration</strong>
                      <span className="leading-relaxed block">
                        Updating this student's result to <strong>{obtainedMarks}/{totalQuestions} ({((obtainedMarks/totalQuestions)*100).toFixed(1)}%) - {passedToggle ? "PASS" : "FAIL"}</strong> will automatically save the records to the database.
                      </span>
                      <span className="leading-relaxed block mt-2 font-bold text-amber-950">
                        This action will immediately invalidate and REGENERATE the student's Certificate and Marksheet templates using the updated scores. This cannot be undone.
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-zinc-100 bg-zinc-50 flex justify-end gap-3 shrink-0">
              {!showRegenConfirm ? (
                <>
                  <button
                    onClick={handleCloseEdit}
                    className="px-4 py-2.5 text-xs font-bold border border-zinc-200 bg-white hover:bg-slate-50 text-zinc-700 rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setShowRegenConfirm(true)}
                    className="px-4 py-2.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    Continue to Save
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowRegenConfirm(false)}
                    disabled={savingResult}
                    className="px-4 py-2.5 text-xs font-bold border border-zinc-200 bg-white hover:bg-slate-50 text-zinc-700 rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSaveResult}
                    disabled={savingResult}
                    className="px-4 py-2.5 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
                  >
                    {savingResult ? (
                      <>
                        <RefreshCw className="h-3 w-3 animate-spin" /> Saving...
                      </>
                    ) : (
                      "Confirm & Save changes"
                    )}
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
