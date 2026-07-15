/* eslint-disable react-hooks/purity */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { getCurrentUser, UserSession } from "@/lib/supabase/auth";
import { BRANDING } from "@/config/branding";
import { getInternships, getTestResults, getPaidInternshipIds, getStudentPayments, getPlatformSettings, PlatformSettings, Internship, TestResult, Payment } from "@/lib/supabase/db";
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
  BookOpen,
  CreditCard,
  Lock
} from "lucide-react";
import Link from "next/link";
import Script from "next/script";

const getTrackTheme = (trackId: string) => {
  const cleanId = trackId.toLowerCase();
  if (cleanId.includes("web-dev") || cleanId.includes("webdev")) {
    return {
      borderClass: "border-l-emerald-500",
      badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
      btnClass: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md shadow-emerald-600/10",
      icon: "🌐"
    };
  } else if (cleanId.includes("frontend")) {
    return {
      borderClass: "border-l-sky-500",
      badgeClass: "bg-sky-50 text-sky-700 border-sky-200",
      btnClass: "bg-sky-600 hover:bg-sky-700 text-white shadow-sm hover:shadow-md shadow-sky-600/10",
      icon: "🎨"
    };
  } else if (cleanId.includes("python")) {
    return {
      borderClass: "border-l-indigo-500",
      badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200",
      btnClass: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-md shadow-indigo-600/10",
      icon: "🐍"
    };
  } else if (cleanId.includes("data") || cleanId.includes("analytics") || cleanId.includes("datasci")) {
    return {
      borderClass: "border-l-amber-500",
      badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
      btnClass: "bg-amber-600 hover:bg-amber-700 text-white shadow-sm hover:shadow-md shadow-amber-600/10",
      icon: "📊"
    };
  } else if (cleanId.includes("ai") || cleanId.includes("ml") || cleanId.includes("artificial")) {
    return {
      borderClass: "border-l-violet-500",
      badgeClass: "bg-violet-50 text-violet-700 border-violet-200",
      btnClass: "bg-violet-600 hover:bg-violet-700 text-white shadow-sm hover:shadow-md shadow-violet-600/10",
      icon: "🤖"
    };
  } else if (cleanId.includes("cyber") || cleanId.includes("security")) {
    return {
      borderClass: "border-l-red-500",
      badgeClass: "bg-red-50 text-red-700 border-red-205",
      btnClass: "bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md shadow-red-600/10",
      icon: "🔒"
    };
  } else if (cleanId.includes("cloud")) {
    return {
      borderClass: "border-l-cyan-500",
      badgeClass: "bg-cyan-50 text-cyan-700 border-cyan-205",
      btnClass: "bg-cyan-600 hover:bg-cyan-700 text-white shadow-sm hover:shadow-md shadow-cyan-600/10",
      icon: "☁️"
    };
  } else if (cleanId.includes("hr")) {
    return {
      borderClass: "border-l-pink-500",
      badgeClass: "bg-pink-50 text-pink-700 border-pink-205",
      btnClass: "bg-pink-600 hover:bg-pink-700 text-white shadow-sm hover:shadow-md shadow-pink-600/10",
      icon: "🤝"
    };
  } else {
    return {
      borderClass: "border-l-indigo-500",
      badgeClass: "bg-indigo-50 text-indigo-755 border-indigo-200",
      btnClass: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-md shadow-indigo-600/10",
      icon: "📈"
    };
  }
};

export default function AvailableInternships() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [paidTracks, setPaidTracks] = useState<string[]>([]);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptHtml, setReceiptHtml] = useState("");
  const [settings, setSettings] = useState<PlatformSettings>({ assessment_fee: 150, payments_enabled: true });

  // Modal State
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);

  useEffect(() => {
    async function loadInternshipsData() {
      try {
        const u = await getCurrentUser();
        setUser(u);
        const [ints, stg] = await Promise.all([
          getInternships(),
          getPlatformSettings()
        ]);
        setInternships(ints);
        setSettings(stg);
        if (u) {
          const [res, paidIds, pays] = await Promise.all([
            getTestResults(u.id),
            getPaidInternshipIds(u.id),
            getStudentPayments(u.id)
          ]);
          setResults(res);
          setPaidTracks(paidIds);
          setPayments(pays);
        }
      } catch (err) {
        console.error("Error loading internships route data", err);
      } finally {
        setLoading(false);
      }
    }
    loadInternshipsData();
  }, []);

  const handlePrintReceipt = (pay: Payment, internshipTitle: string) => {
    const formattedDate = pay.created_at ? new Date(pay.created_at).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }) : new Date().toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });

    const receiptNo = pay.razorpay_order_id ? `REC-${pay.razorpay_order_id.replace("order_", "")}` : `REC-MOCK-${Math.floor(Math.random() * 1000000)}`;

    const htmlTpl = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Payment Receipt</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

    :root {
      --primary: #1e3a8a;
      --primary-light: #eff6ff;
      --text-dark: #0f172a;
      --text-body: #334155;
      --text-light: #64748b;
      --border: #e2e8f0;
      --bg-light: #f8fafc;
    }

    * {
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.5;
      color: var(--text-body);
      background: #f8fafc;
      margin: 0;
      padding: 40px 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }

    .letter-container {
      width: 100%;
      max-width: 800px;
      background: #ffffff;
      border: 1px solid var(--border);
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.025);
      overflow: hidden;
    }

    .header {
      background: linear-gradient(135deg, #eff6ff 0%, #ffffff 100%);
      border-bottom: 1px solid var(--border);
      color: var(--text-dark);
      padding: 30px 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .brand h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 800;
      color: var(--primary);
      letter-spacing: -0.5px;
    }

    .brand p {
      margin: 4px 0 0;
      font-size: 12px;
      color: var(--text-light);
      font-weight: 500;
    }

    .header-meta {
      text-align: right;
      font-size: 12px;
      color: var(--text-light);
      line-height: 1.5;
    }

    .header-meta strong {
      display: block;
      font-size: 14px;
      color: var(--text-dark);
      margin-bottom: 4px;
    }

    .content {
      padding: 40px;
    }

    .letter-title {
      text-align: center;
      font-size: 18px;
      font-weight: 700;
      color: var(--text-dark);
      margin-bottom: 30px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 30px;
    }

    .info-card {
      background: var(--bg-light);
      border: 1px solid var(--border);
      padding: 14px 18px;
      border-radius: 8px;
    }

    .info-label {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      color: var(--text-light);
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }

    .info-value {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-dark);
    }

    .table-wrapper {
      margin-bottom: 30px;
      overflow: hidden;
      border-radius: 8px;
      border: 1px solid var(--border);
    }

    .items-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13.5px;
    }

    .items-table th {
      background: var(--bg-light);
      color: var(--text-light);
      text-align: left;
      padding: 12px 16px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid var(--border);
    }

    .items-table td {
      padding: 16px;
      background: white;
      border-bottom: 1px solid var(--border);
      color: var(--text-body);
    }

    .items-table tbody tr:last-child td {
      border-bottom: none;
    }

    .item-desc {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-dark);
    }

    .item-sub {
      display: block;
      font-size: 11px;
      color: var(--text-light);
      margin-top: 3px;
    }

    .items-table .total-row td {
      background: var(--bg-light);
      font-size: 15px;
      font-weight: 700;
      color: var(--primary);
      border-top: 1px solid var(--border);
    }

    .success-box {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 8px;
      padding: 14px 18px;
      margin-bottom: 30px;
      display: flex;
      align-items: center;
      font-size: 13px;
      color: #166534;
      font-weight: 500;
      gap: 12px;
    }

    .success-icon {
      flex-shrink: 0;
      display: inline-flex;
    }

    .footer {
      background: var(--bg-light);
      padding: 20px 40px;
      text-align: center;
      font-size: 11px;
      color: var(--text-light);
      border-top: 1px solid var(--border);
      line-height: 1.6;
    }

    .footer a {
      color: var(--primary);
      text-decoration: none;
      font-weight: 600;
    }

    .verification-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #dcfce7;
      color: #166534;
      font-size: 11px;
      font-weight: 700;
      padding: 6px 12px;
      border-radius: 9999px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border: 1px solid #bbf7d0;
    }

    .print-btn {
      display: block;
      margin: 30px auto 0 auto;
      padding: 12px 24px;
      background: var(--primary);
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: bold;
      cursor: pointer;
      font-size: 13px;
      transition: all 0.2s;
      box-shadow: 0 4px 6px rgba(30, 58, 138, 0.15);
    }

    .print-btn:hover {
      background: #1d4ed8;
      transform: translateY(-1px);
    }

    @media screen and (max-width: 768px) {
      body {
        padding: 20px 10px;
      }
      .letter-container {
        border: none;
        box-shadow: none;
      }
      .header {
        flex-direction: column;
        text-align: center;
        gap: 16px;
        padding: 24px;
      }
      .header-meta {
        text-align: center;
      }
      .content {
        padding: 24px;
      }
      .info-grid {
        grid-template-columns: 1fr;
        gap: 12px;
      }
      .table-wrapper {
        overflow-x: auto;
      }
      .items-table {
        min-width: 500px;
      }
    }

    @media print {
      body {
        padding: 0;
        background: none;
      }
      .invoice-box {
        border: none;
        box-shadow: none;
        padding: 0;
      }
      .letter-container {
        border: none;
        box-shadow: none;
        max-width: 100%;
        width: 100%;
        border-radius: 0;
      }
      .print-btn {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="letter-container">
    <div class="header">
      <div class="brand">
        <h1>${BRANDING.name}</h1>
        <p>Vocational Training Platform</p>
      </div>
      <div class="header-meta">
        <strong>Official Receipt</strong>
        Date: ${formattedDate}<br />
        Receipt ID: ${receiptNo}
      </div>
    </div>

    <div class="content">
      <div class="letter-title">Payment Receipt</div>

      <div class="info-grid">
        <div class="info-card">
          <div class="info-label">Candidate Name</div>
          <div class="info-value">${user?.full_name || "N/A"}</div>
        </div>
        <div class="info-card">
          <div class="info-label">Email Address</div>
          <div class="info-value">${user?.email || "N/A"}</div>
        </div>
        <div class="info-card">
          <div class="info-label">Phone Number</div>
          <div class="info-value">${user?.phone_number || "N/A"}</div>
        </div>
        <div class="info-card">
          <div class="info-label">Order Details</div>
          <div class="info-value" style="font-size: 12px; font-weight: 500; color: #475569; line-height: 1.4;">
            Order: ${pay.razorpay_order_id || "N/A"}<br/>
            Payment: ${pay.razorpay_payment_id || "N/A"}
          </div>
        </div>
      </div>

      <div class="table-wrapper">
        <table class="items-table">
          <thead>
            <tr>
              <th>Description</th>
              <th style="text-align: center; width: 60px;">Qty</th>
              <th style="text-align: right; width: 100px;">Rate</th>
              <th style="text-align: right; width: 100px;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <span class="item-desc">IQ Intern Internship Evaluation Assessment Fee</span><br />
                <span class="item-sub">Track: ${internshipTitle}</span>
              </td>
              <td style="text-align: center; font-weight: 600;">1</td>
              <td style="text-align: right;">₹${(pay.amount / 100).toFixed(2)}</td>
              <td style="text-align: right; font-weight: 600;">₹${(pay.amount / 100).toFixed(2)}</td>
            </tr>
            <tr class="total-row">
              <td colspan="3" style="text-align: right;">Total Amount Paid:</td>
              <td style="text-align: right;">₹${(pay.amount / 100).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="success-box">
        <span class="success-icon">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z" fill="#166534"/>
          </svg>
        </span>
        <span>This is a computer-generated transaction receipt verified under the Razorpay Payment Gateway API. Thank you for using IQ Intern vocational evaluation services!</span>
      </div>

      <div style="text-align: center;">
        <span class="verification-badge">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.5 9L1.5 6L2.5 5L4.5 7L9.5 2L10.5 3L4.5 9Z" fill="#166534" stroke="#166534" stroke-width="0.5"/>
          </svg>
          Payment Verified
        </span>
      </div>
    </div>

    <div class="footer">
      This is a computer-generated receipt and does not require a physical signature. For queries, contact <a
        href="mailto:${BRANDING.emails.support}">${BRANDING.emails.support}</a>.<br />
      © ${new Date().getFullYear()} ${BRANDING.legal.companyName}. All rights reserved.
    </div>
  </div>

  <button class="print-btn" onclick="window.print()">Print Receipt</button>
</body>
</html>
    `;

    setReceiptHtml(htmlTpl);
    setShowReceiptModal(true);
  };

  const handlePayAndStart = async (track: Internship) => {
    if (!user) return;
    setPayingId(track.id);
    try {
      // 1. Create order on the backend
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          internshipId: track.id,
          studentId: user.id
        }),
      });

      const orderData = await res.json();

      if (!res.ok || orderData.error) {
        throw new Error(orderData.error || "Failed to initiate payment. Please try again.");
      }

      // 2. Open Razorpay modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_T89UGIfJWMXNih",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "IQ Intern",
        description: `Assessment Fee for ${track.title}`,
        order_id: orderData.order_id,
        handler: async function (response: any) {
          try {
            // 3. Verify payment signature on the backend
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              const completedPayment: Payment = {
                id: `pay-${Math.random().toString(36).substr(2, 9)}`,
                student_id: user.id,
                internship_id: track.id,
                amount: settings.assessment_fee * 100,
                status: "completed",
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                created_at: new Date().toISOString(),
              };

              // Always write to client local storage mock as a mirror/fallback
              if (typeof window !== "undefined") {
                const mockPayments = JSON.parse(localStorage.getItem("mock_payments") || "[]");
                if (!mockPayments.some((p: any) => p.razorpay_order_id === response.razorpay_order_id)) {
                  mockPayments.push(completedPayment);
                  localStorage.setItem("mock_payments", JSON.stringify(mockPayments));
                }
              }

              // Update state
              setPaidTracks((prev) => [...prev, track.id]);
              setPayments((prev) => [completedPayment, ...prev]);
              alert("Payment successful! Assessment unlocked.");
            } else {
              alert(verifyData.error || "Payment verification failed.");
            }
          } catch (verifyError: any) {
            console.error("Verification error:", verifyError);
            alert("Error verifying payment signature. Please contact support.");
          } finally {
            setPayingId(null);
          }
        },
        prefill: {
          name: user.full_name,
          email: user.email,
          contact: user.phone_number || "",
        },
        theme: {
          color: "#4f46e5",
        },
        modal: {
          ondismiss: function () {
            setPayingId(null);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        alert("Payment failed: " + response.error.description);
        setPayingId(null);
      });
      rzp.open();
    } catch (err: any) {
      console.error("Payment setup error:", err);
      alert(err.message || "Failed to load payment portal.");
      setPayingId(null);
    }
  };

  const handleSelectInternship = async (internshipId: string) => {
    if (!user) return;
    const confirmLock = window.confirm(`Are you sure you want to lock your payment to this internship? You will not be able to change this later.`);
    if (!confirmLock) return;

    setPayingId(internshipId);
    try {
      const res = await fetch("/api/select-internship", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ internshipId, studentId: user.id })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to select internship.");
      }

      setPaidTracks(prev => {
        const newTracks = prev.filter(t => t !== "general_credit_unused");
        return [...newTracks, internshipId];
      });

      setPayments(prev => {
        const updated = prev.map(p => {
          if (p.internship_id === "general_credit_unused") {
            return { ...p, internship_id: internshipId };
          }
          return p;
        });
        if (typeof window !== "undefined") {
          localStorage.setItem("mock_payments", JSON.stringify(updated));
        }
        return updated;
      });

      alert("Internship locked successfully! We've also sent you a confirmation email. You can now start the assessment.");
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setPayingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 bg-white">
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
    <div className="space-y-8 relative z-10 animate-fade-in pb-16 text-zinc-800 bg-white">
      
      {/* Banner */}
      <div className="glass-panel bg-gradient-to-br from-indigo-50 to-indigo-100/50 border border-indigo-200/50 rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-md hover:shadow-lg hover:border-indigo-300 transition-all duration-300">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-gradient-to-br from-indigo-200/10 to-violet-200/10 blur-2xl pointer-events-none" />
        <div className="space-y-1.5">
          <span className="text-indigo-650 text-xs font-extrabold uppercase tracking-wider block">Career Paths</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">Available Internships</h1>
          <p className="text-zinc-700 text-xs sm:text-sm font-semibold leading-relaxed max-w-xl">
            Choose an internship track, review the requirements, and pass the assessment to unlock your official Offer Letter and grading scorecard.
          </p>
        </div>
      </div>

      {/* Filters & Search Row */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm hover:shadow-md hover:border-zinc-300 transition-all duration-300">
        
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs transition-all duration-200 cursor-pointer border ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white border-indigo-600 font-extrabold shadow-sm shadow-indigo-600/10"
                  : "bg-slate-50 border-zinc-200 text-zinc-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 font-bold"
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
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-zinc-205 focus:border-indigo-500 rounded-xl outline-none text-zinc-800 transition-colors animate-fade-in"
          />
        </div>
      </div>

      {/* Internships Grid */}
      {(() => {
        const selectedTrackId = paidTracks.find(id => id !== "general_credit_unused");
        const sortedInternships = [...filteredInternships].sort((a, b) => {
          const aSelected = a.id === selectedTrackId;
          const bSelected = b.id === selectedTrackId;
          if (aSelected && !bSelected) return -1;
          if (!aSelected && bSelected) return 1;
          return 0;
        });

        if (sortedInternships.length === 0) {
          return (
            <div className="text-center py-20 border border-zinc-200 rounded-3xl bg-white shadow-sm hover:shadow-md transition-all duration-300">
              <Briefcase className="h-10 w-10 mx-auto text-zinc-400 mb-3" />
              <p className="text-sm text-zinc-700 font-bold">No internship tracks match your criteria.</p>
            </div>
          );
        }

        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sortedInternships.map((track) => {
              // Check status of this track
              const trackResults = results.filter((r) => r.internship_id === track.id);
              const passed = trackResults.some((r) => r.passed);
              const latestAttempt = trackResults[0];
              const theme = getTrackTheme(track.id);

              return (
                <div 
                  key={track.id}
                  className={`bg-white border border-zinc-200 hover:border-zinc-300 rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 group relative overflow-hidden border-l-4 hover:shadow-lg hover:scale-[1.005] ${theme.borderClass}`}
                >
                  <div className="absolute right-4 top-4 text-2xl opacity-20 group-hover:opacity-40 transition-opacity">
                    {theme.icon}
                  </div>

                  <div className="space-y-4">
                    {/* Category & Status */}
                    <div className="flex justify-between items-start gap-2 pr-8">
                      <span className={`text-[10px] font-bold border px-2.5 py-1 rounded-lg uppercase tracking-wider ${theme.badgeClass}`}>
                        {track.category}
                      </span>
                      
                      {passed ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-550/10 border border-emerald-200 px-3 py-1 text-[10px] font-bold text-emerald-700 font-mono">
                          Passed
                        </span>
                      ) : latestAttempt ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 border border-red-250 px-3 py-1 text-[10px] font-bold text-red-650 font-mono">
                          Failed ({latestAttempt.percentage}%)
                        </span>
                      ) : null}
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="text-lg font-bold text-zinc-900 group-hover:text-indigo-655 transition-colors tracking-tight">
                        {track.title}
                      </h3>
                      <p className="text-zinc-600 text-xs mt-2 leading-relaxed font-normal font-sans">
                        {track.description}
                      </p>
                    </div>

                    {/* Track Duration Details */}
                    <div className={`flex items-center gap-2 text-xs font-bold border p-2.5 rounded-xl w-fit ${theme.badgeClass}`}>
                      <Clock className="h-3.5 w-3.5" />
                      <span>Duration: <span className="text-zinc-900 font-extrabold">{track.duration || "3 Months"}</span></span>
                    </div>

                    {/* Requirements List */}
                    {track.requirements && track.requirements.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-zinc-150">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Requirements:</span>
                        <ul className="grid grid-cols-1 gap-1.5">
                          {track.requirements.map((req, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-[11px] text-zinc-650 leading-relaxed font-normal font-sans">
                              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Bottom Actions */}
                  <div className="pt-6 mt-6 border-t border-zinc-150 flex items-center justify-between gap-4">
                    {passed ? (
                      <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1.5">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        Assessment Passed
                      </div>
                    ) : (
                      <div className="text-[10px] text-zinc-500 font-semibold font-sans">
                        Requires passing threshold of 40%
                      </div>
                    )}

                    {(() => {
                      const hasSelectedThis = paidTracks.includes(track.id);
                      const hasPaidUnused = paidTracks.includes("general_credit_unused");
                      
                      if (hasSelectedThis) {
                        return (
                          <button
                            onClick={() => setSelectedInternship(track)}
                            className={`flex items-center justify-center gap-1.5 rounded-xl px-5 py-2 text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95 ${
                              passed
                                ? "bg-white border border-zinc-200 text-zinc-700 hover:bg-slate-50 hover:border-zinc-300"
                                : theme.btnClass
                            }`}
                          >
                            <Play className="h-3.5 w-3.5" />
                            {passed ? "Retake Assessment" : "Take Assessment"}
                          </button>
                        );
                      } else if (hasPaidUnused) {
                        return (
                          <button
                            onClick={() => handleSelectInternship(track.id)}
                            disabled={payingId !== null}
                            className={`flex items-center justify-center gap-1.5 rounded-xl px-5 py-2 text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-50 ${theme.btnClass}`}
                          >
                            <Play className="h-3.5 w-3.5" />
                            {payingId === track.id ? "Selecting..." : "Select Internship"}
                          </button>
                        );
                      } else {
                        return (
                          <button
                            onClick={() => handlePayAndStart(track)}
                            disabled={payingId !== null}
                            className={`flex items-center justify-center gap-1.5 rounded-xl px-5 py-2 text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md disabled:opacity-50 ${theme.btnClass}`}
                          >
                            <CreditCard className="h-3.5 w-3.5" />
                            {payingId === track.id ? "Processing..." : `Pay ₹${settings.assessment_fee}`}
                          </button>
                        );
                      }
                    })()}
                  </div>

                </div>
              );
            })}
          </div>
        );
      })()}

      {/* GUIDELINES RULES MODAL */}
      {selectedInternship && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />

            <div className="flex items-start gap-4 mb-6">
              <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs text-indigo-650 font-bold uppercase tracking-wider bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-150">{selectedInternship.category}</span>
                <h3 className="text-xl font-bold text-zinc-900 mt-2">{selectedInternship.title}</h3>
                <p className="text-xs text-zinc-700 font-semibold mt-1">Assessment Code Guidelines & Testing Rules</p>
              </div>
            </div>

            {/* Rules list */}
            <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-zinc-200/80 text-xs sm:text-sm text-zinc-700 leading-relaxed mb-6 font-semibold">
              <div className="flex gap-2 items-start">
                <Clock className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                <span><strong>Duration:</strong> You have exactly <strong>5 minutes</strong> to solve the multiple-choice questions.</span>
              </div>
              <div className="flex gap-2 items-start">
                <Award className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                <span><strong>Evaluation:</strong> Passing threshold is <strong>40%</strong>.</span>
              </div>
              <div className="flex gap-2 items-start">
                <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <span><strong>Anti-Cheating:</strong> Do NOT switch tabs or minimize the test screen. Tab changes will be monitored.</span>
              </div>
              <div className="flex gap-2 items-start">
                <CheckCircle className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                <span><strong>Submission:</strong> Leaving the screen or timer completion will trigger auto-submission instantly.</span>
              </div>
            </div>

            {(() => {
              const payObj = payments.find((p) => p.internship_id === selectedInternship.id && p.status === "completed");
              let isEligible = true;
              let countdownStr = "";
              let remainingDays = 0;
              if (payObj) {
                const targetDays = settings.assessment_availability_days ?? 30;
                const payDate = new Date(payObj.created_at);
                const targetTime = payDate.getTime() + targetDays * 24 * 60 * 60 * 1000;
                const diffTime = targetTime - Date.now();
                if (diffTime > 0) {
                  isEligible = false;
                  const totalSecs = Math.floor(diffTime / 1000);
                  const d = Math.floor(totalSecs / (24 * 3600));
                  const h = Math.floor((totalSecs % (24 * 3600)) / 3600);
                  const m = Math.floor((totalSecs % 3600) / 60);
                  remainingDays = d;
                  countdownStr = `${d} Days ${h.toString().padStart(2, '0')} Hours ${m.toString().padStart(2, '0')} Minutes`;
                }
              }
              const hasPaid = !settings.payments_enabled || paidTracks.includes(selectedInternship.id);
              const hasUnusedCredit = paidTracks.includes("general_credit_unused");

              return (
                <>
                  {!isEligible && (
                    <div className="w-full flex items-center gap-3 p-3.5 bg-amber-50 border border-amber-250 rounded-2xl text-xs text-amber-805 font-bold mb-4">
                      <Clock className="h-4 w-4 text-amber-600 shrink-0" />
                      <span>Internship lock active: Assessment Available In <strong>{countdownStr}</strong> (Minimum duration: {settings.assessment_availability_days ?? 30} days from enrollment date).</span>
                    </div>
                  )}

                  <div className="flex gap-3 justify-end items-center flex-wrap w-full">
                    <button
                      onClick={() => setSelectedInternship(null)}
                      className="rounded-xl border border-zinc-200 bg-white hover:bg-slate-100 active:scale-95 px-5 py-2.5 text-xs font-bold text-zinc-700 hover:text-zinc-900 transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    {(hasPaid || !settings.payments_enabled) ? (
                      <>
                        {hasPaid && (
                          <button
                            type="button"
                            onClick={() => {
                              const pObj = payments.find((p) => p.internship_id === selectedInternship.id && p.status === "completed");
                              if (pObj) {
                                handlePrintReceipt(pObj, selectedInternship.title);
                              } else {
                                alert("Receipt details not found for this transaction.");
                              }
                            }}
                            className="rounded-xl border border-zinc-200 bg-white hover:bg-indigo-50/70 active:scale-95 px-5 py-2.5 text-xs font-bold text-zinc-700 hover:text-indigo-700 transition-all cursor-pointer flex items-center gap-1.5 font-sans"
                          >
                            <CreditCard className="h-3.5 w-3.5 text-indigo-555" />
                            Print Receipt
                          </button>
                        )}
                        {isEligible ? (
                          <Link
                            href={`/student/test/${selectedInternship.id}`}
                            className="rounded-xl bg-indigo-600 hover:bg-indigo-755 text-white active:scale-95 px-6 py-2.5 text-xs font-bold transition-all text-center cursor-pointer flex items-center justify-center gap-1.5 shadow-sm shadow-indigo-600/10"
                          >
                            Start Assessment
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        ) : (
                          <button
                            disabled
                            className="rounded-xl bg-slate-100 border border-zinc-200 text-zinc-500 px-6 py-2.5 text-xs font-bold transition-all text-center cursor-not-allowed flex items-center justify-center gap-1.5"
                          >
                            Locked: {remainingDays > 0 ? `${remainingDays} days left` : "Available soon"}
                            <Clock className="h-4 w-4" />
                          </button>
                        )}
                      </>
                    ) : hasUnusedCredit ? (
                      <button
                        onClick={() => handleSelectInternship(selectedInternship.id)}
                        disabled={payingId !== null}
                        className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95 px-6 py-2.5 text-xs font-bold transition-all text-center cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 shadow-sm"
                      >
                        {payingId === selectedInternship.id ? "Processing..." : "Lock & Unlock Internship"}
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePayAndStart(selectedInternship)}
                        disabled={payingId !== null}
                        className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95 px-6 py-2.5 text-xs font-bold transition-all text-center cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50 shadow-sm"
                      >
                        {payingId === selectedInternship.id ? "Processing..." : `Pay ₹${settings.assessment_fee} & Start`}
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {showReceiptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-3xl bg-white border border-zinc-250/80 rounded-3xl p-6 relative overflow-hidden shadow-2xl max-h-[90vh] flex flex-col text-zinc-800">
            <button
              onClick={() => setShowReceiptModal(false)}
              className="absolute top-4 right-4 h-8 w-8 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-405 hover:text-zinc-750 bg-white cursor-pointer hover:bg-slate-50"
            >
              <X className="h-4 w-4" />
            </button>
            <h3 className="text-lg font-bold mb-4 px-2">Payment Receipt Preview</h3>
            <div className="flex-grow overflow-y-auto px-2 pb-4">
              <iframe
                srcDoc={receiptHtml}
                className="w-full h-[60vh] border border-zinc-200 rounded-2xl bg-white shadow-inner"
                title="Receipt Preview"
              />
            </div>
          </div>
        </div>
      )}

      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

    </div>
  );
}
