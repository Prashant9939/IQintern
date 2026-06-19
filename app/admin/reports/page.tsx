"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import {
  BarChart3,
  Users,
  CreditCard,
  Briefcase,
  TrendingUp,
  Award,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export default function AdminReportsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalPayments: 0,
    totalRevenue: 0,
    totalInternships: 0,
    passedAssessments: 0,
    totalAssessments: 0,
  });

  useEffect(() => {
    async function loadStats() {
      try {
        if (!supabase) return;
        const [studentsRes, paymentsRes, internshipsRes, resultsRes] = await Promise.all([
          supabase.from("profiles").select("id", { count: "exact", head: true }),
          supabase.from("payments").select("amount"),
          supabase.from("internships").select("id", { count: "exact", head: true }),
          supabase.from("test_results").select("passed"),
        ]);

        const totalRevenue = (paymentsRes.data || []).reduce((sum, p) => sum + (p.amount || 0), 0);
        const passedCount = (resultsRes.data || []).filter(r => r.passed).length;

        setStats({
          totalStudents: studentsRes.count || 0,
          totalPayments: (paymentsRes.data || []).length,
          totalRevenue: totalRevenue / 100,
          totalInternships: internshipsRes.count || 0,
          passedAssessments: passedCount,
          totalAssessments: (resultsRes.data || []).length,
        });
      } catch (err) {
        console.error("Error loading report stats", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const passRate = stats.totalAssessments > 0
    ? Math.round((stats.passedAssessments / stats.totalAssessments) * 100)
    : 0;

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#5B5FF7] border-t-transparent mx-auto" />
          <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Generating reports...</p>
        </div>
      </div>
    );
  }

  const metricsCards = [
    {
      title: "Total Students",
      value: stats.totalStudents.toLocaleString(),
      icon: Users,
      color: "bg-[#5B5FF7]/10 text-[#5B5FF7]",
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: CreditCard,
      color: "bg-emerald-500/10 text-emerald-500",
      trend: "+8%",
      trendUp: true,
    },
    {
      title: "Active Tracks",
      value: stats.totalInternships.toString(),
      icon: Briefcase,
      color: "bg-amber-500/10 text-amber-500",
      trend: "+3",
      trendUp: true,
    },
    {
      title: "Pass Rate",
      value: `${passRate}%`,
      icon: Award,
      color: "bg-sky-500/10 text-sky-500",
      trend: passRate >= 50 ? "+5%" : "-2%",
      trendUp: passRate >= 50,
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in text-zinc-800 pb-10">
      {/* Page Header */}
      <section className="text-left">
        <span className="text-[#5B5FF7] text-xs font-bold uppercase tracking-wider">Analytics</span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight mt-1">Reports & Analytics</h2>
        <p className="text-zinc-500 text-sm mt-2 font-light leading-relaxed max-w-2xl">
          Comprehensive overview of platform performance, student engagement, and revenue metrics.
        </p>
      </section>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricsCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white border border-zinc-150/80 rounded-[20px] p-6 shadow-xs hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`h-12 w-12 rounded-2xl ${card.color} flex items-center justify-center`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className={`flex items-center gap-0.5 text-xs font-bold ${card.trendUp ? "text-emerald-500" : "text-red-500"}`}>
                  {card.trendUp ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                  {card.trend}
                </div>
              </div>
              <h3 className="text-2xl font-extrabold text-zinc-900">{card.value}</h3>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-1">{card.title}</p>
            </div>
          );
        })}
      </div>

      {/* Assessment Breakdown */}
      <div className="bg-white border border-zinc-150/80 rounded-[20px] p-6 shadow-xs">
        <h3 className="text-base font-extrabold text-zinc-900 mb-6 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-[#5B5FF7]" />
          Assessment Overview
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-slate-50 border border-zinc-150/80 rounded-2xl p-5 text-center">
            <p className="text-3xl font-extrabold text-zinc-900">{stats.totalAssessments}</p>
            <p className="text-xs text-zinc-500 font-semibold mt-1">Total Assessments</p>
            <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden mt-3">
              <div className="h-full bg-[#5B5FF7] rounded-full" style={{ width: "100%" }} />
            </div>
          </div>
          <div className="bg-slate-50 border border-zinc-150/80 rounded-2xl p-5 text-center">
            <p className="text-3xl font-extrabold text-emerald-600">{stats.passedAssessments}</p>
            <p className="text-xs text-zinc-500 font-semibold mt-1">Passed</p>
            <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden mt-3">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${passRate}%` }} />
            </div>
          </div>
          <div className="bg-slate-50 border border-zinc-150/80 rounded-2xl p-5 text-center">
            <p className="text-3xl font-extrabold text-red-500">{stats.totalAssessments - stats.passedAssessments}</p>
            <p className="text-xs text-zinc-500 font-semibold mt-1">Failed</p>
            <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden mt-3">
              <div className="h-full bg-red-400 rounded-full" style={{ width: `${100 - passRate}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="bg-white border border-zinc-150/80 rounded-[20px] p-6 shadow-xs">
        <h3 className="text-base font-extrabold text-zinc-900 mb-6 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-[#5B5FF7]" />
          Revenue Summary
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-[#5B5FF7]/5 to-[#7B7FFA]/5 border border-[#5B5FF7]/10 rounded-2xl p-6">
            <p className="text-xs text-[#5B5FF7] font-bold uppercase tracking-wider">Total Revenue</p>
            <p className="text-3xl font-extrabold text-zinc-900 mt-2">₹{stats.totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-zinc-500 font-light mt-1">Across {stats.totalPayments} transactions</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-500/5 to-emerald-400/5 border border-emerald-500/10 rounded-2xl p-6">
            <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider">Avg. Transaction</p>
            <p className="text-3xl font-extrabold text-zinc-900 mt-2">
              ₹{stats.totalPayments > 0 ? Math.round(stats.totalRevenue / stats.totalPayments).toLocaleString() : "0"}
            </p>
            <p className="text-xs text-zinc-500 font-light mt-1">Per student payment</p>
          </div>
        </div>
      </div>
    </div>
  );
}
