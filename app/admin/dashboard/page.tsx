"use client";

import { useEffect, useState } from "react";
import { 
  getInternships, 
  getTestResults, 
  getStudentProfiles,
  getAllProfiles,
  seedDatabase
} from "@/lib/supabase/db";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { 
  Users, 
  Briefcase, 
  Award, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  BarChart2
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  Legend
} from "recharts";

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalInternships: 0,
    totalAttempts: 0,
    passRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState("");
  const [seedStatus, setSeedStatus] = useState<"success" | "error" | "">("");
  const [dbEmpty, setDbEmpty] = useState(false);

  const handleSeed = async () => {
    setSeeding(true);
    setSeedMsg("");
    setSeedStatus("");
    try {
      const res = await seedDatabase();
      if (res.success) {
        setSeedStatus("success");
        setSeedMsg(res.message);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setSeedStatus("error");
        setSeedMsg(res.message);
      }
    } catch (err: any) {
      setSeedStatus("error");
      setSeedMsg(err.message || "Seeding failed.");
    } finally {
      setSeeding(false);
    }
  };

  // Mock charts data
  const registrationTrend = [
    { name: "Jan", Students: 40 },
    { name: "Feb", Students: 65 },
    { name: "Mar", Students: 98 },
    { name: "Apr", Students: 120 },
    { name: "May", Students: 185 },
  ];

  const certificationDistribution = [
    { name: "Frontend React", Pass: 42, Fail: 18 },
    { name: "Backend Node", Pass: 28, Fail: 22 },
    { name: "UI/UX Product", Pass: 35, Fail: 10 },
  ];

  useEffect(() => {
    setMounted(true);
    async function loadStats() {
      try {
        const [allUsers, students, internships, results] = await Promise.all([
          getAllProfiles(),
          getStudentProfiles(),
          getInternships(),
          getTestResults(),
        ]);

        const passCount = results.filter((r) => r.passed).length;
        const rate = results.length > 0 ? Math.round((passCount / results.length) * 100) : 0;

        const supabaseActive = isSupabaseConfigured();
        if (supabaseActive && internships.length === 0) {
          setDbEmpty(true);
        }

        // Student count: prefer student-only list; fall back to allUsers minus admins
        const studentCount =
          students.length > 0
            ? students.length
            : allUsers.filter((u: any) => u.role === "student").length;

        setStats({
          totalStudents: studentCount,
          totalInternships: internships.length,
          totalAttempts: results.length,
          passRate: rate,
        });
      } catch (err) {
        console.error("Error loading admin stats", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const statCards = [
    { label: "Total Registrations", value: stats.totalStudents, icon: Users, color: "text-indigo-600 bg-indigo-50 border-indigo-150" },
    { label: "Internships Listed", value: stats.totalInternships, icon: Briefcase, color: "text-violet-600 bg-violet-50 border-violet-150" },
    { label: "Total Test Attempts", value: stats.totalAttempts, icon: BarChart2, color: "text-emerald-600 bg-emerald-50 border-emerald-150" },
    { label: "Global Pass Rate", value: `${stats.passRate}%`, icon: CheckCircle, color: "text-amber-600 bg-amber-50 border-amber-150" },
  ];

  return (
    <div className="space-y-8 relative z-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">Platform Analytics</h1>
        <p className="text-zinc-500 text-xs sm:text-sm font-light mt-1">Live tracking database statistics and assessment performance rates.</p>
      </div>

      {/* Database Seeding/Syncing Utility */}
      <div className="p-5 rounded-2xl border border-indigo-150 bg-indigo-50/40 text-zinc-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-indigo-500/[0.03] blur-xl pointer-events-none" />
        <div>
          <h4 className="text-sm font-extrabold text-indigo-950 mb-1">Database Sync & Management</h4>
          <p className="text-xs text-zinc-550 font-light">
            Synchronize the database to ensure all 11 default internship tracks, their corresponding 110 evaluation questions, and the latest certificate document templates are loaded and up-to-date.
          </p>
        </div>
        <button
          onClick={handleSeed}
          disabled={seeding}
          className="shrink-0 bg-indigo-600 hover:bg-indigo-700 px-4.5 py-2.5 rounded-xl text-xs font-bold text-white transition-all disabled:opacity-50 cursor-pointer shadow-md shadow-indigo-650/10 active:scale-95"
        >
          {seeding ? "Syncing..." : "Sync Database"}
        </button>
      </div>

      {seedMsg && (
        <div className={`p-4 rounded-xl text-xs border ${
          seedStatus === "success" 
            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
            : "border-red-200 bg-red-50 text-red-700"
        }`}>
          {seedMsg}
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((c, idx) => {
          const Icon = c.icon;
          return (
            <div key={idx} className="glass-panel bg-white border border-zinc-200/80 rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:border-zinc-300 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{c.label}</span>
                <div className={`p-2 rounded-xl border ${c.color}`}>
                  <Icon className="h-4.5 w-4.5" />
                </div>
              </div>
              <span className="text-xl sm:text-2xl font-extrabold text-zinc-900 tracking-tight">
                {loading ? "..." : c.value}
              </span>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Registration Trend */}
        <div className="glass-panel bg-white border border-zinc-200/80 rounded-3xl p-6 flex flex-col h-[350px] shadow-sm">
          <h3 className="text-sm font-bold text-zinc-800 mb-6 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-indigo-600" />
            Registration Trend (Monthly Growth)
          </h3>
          
          <div className="flex-grow w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={registrationTrend} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ background: "#ffffff", borderColor: "rgba(0,0,0,0.08)", borderRadius: "12px", fontSize: "12px", color: "#0f172a" }}
                    labelStyle={{ color: "#0f172a", fontWeight: "bold" }}
                  />
                  <Area type="monotone" dataKey="Students" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorStudents)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full bg-zinc-50 animate-pulse rounded-2xl border border-zinc-200" />
            )}
          </div>
        </div>

        {/* Certifications distribution passes vs fails */}
        <div className="glass-panel bg-white border border-zinc-200/80 rounded-3xl p-6 flex flex-col h-[350px] shadow-sm">
          <h3 className="text-sm font-bold text-zinc-800 mb-6 flex items-center gap-2">
            <BarChart2 className="h-4 w-4 text-indigo-600" />
            Pass vs Fail Ratios By Track
          </h3>

          <div className="flex-grow w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={certificationDistribution} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ background: "#ffffff", borderColor: "rgba(0,0,0,0.08)", borderRadius: "12px", fontSize: "12px", color: "#0f172a" }}
                  />
                  <Legend wrapperStyle={{ fontSize: "10px", paddingTop: "10px" }} />
                  <Bar dataKey="Pass" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Fail" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full bg-zinc-50 animate-pulse rounded-2xl border border-zinc-200" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
