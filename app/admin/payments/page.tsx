/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { getAllPayments, getInternships, Internship, updatePaymentStatus, getAllProfiles, createManualPayment } from "@/lib/supabase/db";
import { Search, CreditCard, Filter, RefreshCw, CheckCircle, AlertCircle, Clock, UserPlus, X } from "lucide-react";

export default function AdminPayments() {
  const [payments, setPayments] = useState<any[]>([]);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [studentsList, setStudentsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [trackFilter, setTrackFilter] = useState("all");

  // Manual payment modal state
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualForm, setManualForm] = useState({
    studentId: "",
    internshipId: "general_credit_unused",
    amount: "150",
    status: "completed" as "pending" | "completed" | "failed"
  });
  const [recording, setRecording] = useState(false);

  const handleStatusChange = async (paymentId: string, newStatus: any, studentId: string) => {
    try {
      const success = await updatePaymentStatus(paymentId, newStatus, studentId);
      if (success) {
        setPayments((prev) =>
          prev.map((p) => (p.id === paymentId ? { ...p, status: newStatus } : p))
        );
      } else {
        alert("Failed to update payment status.");
      }
    } catch (err) {
      console.error("Error updating payment status:", err);
      alert("Error updating payment status.");
    }
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.studentId) {
      alert("Please select a student.");
      return;
    }
    setRecording(true);
    try {
      const amt = Number(manualForm.amount) * 100; // to paisa
      const payRecord = await createManualPayment(
        manualForm.studentId,
        manualForm.internshipId,
        amt,
        manualForm.status
      );

      if (payRecord) {
        alert("Payment recorded successfully!");
        setShowManualModal(false);
        setManualForm({
          studentId: "",
          internshipId: "general_credit_unused",
          amount: "150",
          status: "completed"
        });
        loadData();
      } else {
        alert("Failed to record manual payment.");
      }
    } catch (err) {
      console.error("Error recording manual payment:", err);
      alert("Error recording manual payment.");
    } finally {
      setRecording(false);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [allPayments, allInternships, allProfiles] = await Promise.all([
        getAllPayments(),
        getInternships(),
        getAllProfiles()
      ]);
      setPayments(allPayments);
      setInternships(allInternships);
      setStudentsList(allProfiles.filter((p: any) => p.role === "student"));
    } catch (err) {
      console.error("Failed to load admin payments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtering logic
  const filteredPayments = payments.filter((pay) => {
    // 1. Search Query
    const searchLower = searchQuery.toLowerCase();
    const student = pay.student || {};
    const matchesSearch = 
      (student.full_name || "").toLowerCase().includes(searchLower) ||
      (student.email || "").toLowerCase().includes(searchLower) ||
      (student.phone_number || "").toLowerCase().includes(searchLower) ||
      (pay.razorpay_payment_id || "").toLowerCase().includes(searchLower) ||
      (pay.razorpay_order_id || "").toLowerCase().includes(searchLower);

    // 2. Status Filter
    const matchesStatus = statusFilter === "all" || pay.status === statusFilter;

    // 3. Track/Internship Filter
    const matchesTrack = trackFilter === "all" || pay.internship_id === trackFilter;

    return matchesSearch && matchesStatus && matchesTrack;
  });

  return (
    <div className="space-y-8 relative z-10 animate-fade-in text-zinc-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-indigo-600" />
            Student Payment Transactions
          </h1>
          <p className="text-zinc-500 text-xs sm:text-sm font-light mt-1">
            Monitor registration fees, track-specific transactions, and verify payment gateways.
          </p>
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-1.5 border border-zinc-200 hover:border-zinc-300 bg-white hover:bg-zinc-50 font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer shadow-xs active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh Data
        </button>
      </div>

      {/* Filters Board */}
      <div className="glass-panel bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search */}
        <div className="relative w-full md:flex-grow max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search student name, email, payment ID, order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 focus:border-indigo-500 rounded-xl outline-none text-xs text-zinc-800 transition-colors"
          />
        </div>

        {/* Filters Select */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Status filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-zinc-200 rounded-xl py-2 px-3 text-xs font-semibold text-zinc-700 outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {/* Internship track filter */}
          <select
            value={trackFilter}
            onChange={(e) => setTrackFilter(e.target.value)}
            className="bg-white border border-zinc-200 rounded-xl py-2 px-3 text-xs font-semibold text-zinc-700 outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">All Channels</option>
            <option value="general">One-Time Platform Fee</option>
            {internships.map((track) => (
              <option key={track.id} value={track.id}>
                {track.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Payments Table */}
      {loading ? (
        <div className="flex justify-center items-center py-24 bg-white border border-zinc-200/80 rounded-2xl shadow-xs">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
        </div>
      ) : filteredPayments.length === 0 ? (
        <div className="text-center py-20 border border-zinc-200/80 rounded-2xl bg-white shadow-xs">
          <CreditCard className="h-10 w-10 mx-auto text-zinc-350 mb-3" />
          <p className="text-sm text-zinc-500 font-bold">No matching payment transactions found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-zinc-200/80 rounded-2xl bg-white shadow-xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-200/80 bg-slate-50 text-zinc-500 font-bold uppercase tracking-wider">
                <th className="p-4">Student Details</th>
                <th className="p-4">Payment Description</th>
                <th className="p-4">Transaction Details</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Amount</th>
                <th className="p-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200/60">
              {filteredPayments.map((pay) => {
                const dateStr = pay.created_at
                  ? new Date(pay.created_at).toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })
                  : "N/A";

                const student = pay.student || {};
                const trackObj = internships.find((i) => i.id === pay.internship_id);
                const trackTitle = trackObj 
                  ? trackObj.title 
                  : (pay.internship_id === "general" ? "One-Time Platform Admission Fee" : pay.internship_id);

                return (
                  <tr key={pay.id} className="hover:bg-slate-50/50 transition-colors text-zinc-700">
                    <td className="p-4">
                      <div>
                        <p className="font-extrabold text-zinc-900 text-sm">{student.full_name || "Unknown Student"}</p>
                        <p className="text-zinc-500 text-[10px] mt-0.5">{student.email || "No Email"}</p>
                        <p className="text-zinc-400 text-[9px] mt-0.5">{student.phone_number || "No Phone"}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-bold text-zinc-800">{trackTitle}</p>
                        <p className="text-zinc-450 text-[9px] mt-0.5">Channel ID: <span className="font-mono">{pay.internship_id}</span></p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-mono text-[10px] text-zinc-500 space-y-0.5">
                        <p>Order: <span className="font-semibold text-zinc-700">{pay.razorpay_order_id || "N/A"}</span></p>
                        <p>Payment: <span className="font-semibold text-zinc-700">{pay.razorpay_payment_id || "N/A"}</span></p>
                      </div>
                    </td>
                    <td className="p-4 font-light text-zinc-500">{dateStr}</td>
                    <td className="p-4 font-extrabold text-indigo-650 text-sm">₹{(pay.amount / 100).toFixed(2)}</td>
                    <td className="p-4 text-center">
                      <select
                        value={pay.status}
                        onChange={(e) => handleStatusChange(pay.id, e.target.value as any, pay.student_id)}
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold outline-none cursor-pointer border ${
                          pay.status === "completed"
                            ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                            : pay.status === "failed"
                            ? "bg-red-50 border-red-200 text-red-600"
                            : "bg-amber-50 border-amber-200 text-amber-600"
                        }`}
                      >
                        <option value="pending" className="bg-white text-amber-700">Pending</option>
                        <option value="completed" className="bg-white text-emerald-700">Completed</option>
                        <option value="failed" className="bg-white text-red-700">Failed</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
