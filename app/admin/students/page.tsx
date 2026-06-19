"use client";

import { useEffect, useState, useRef } from "react";
import { getAllProfiles, getTestResults, TestResult, deleteProfile, updateStudentProfile, getAllPayments, getInternships, updateTestResult, Internship, Payment } from "@/lib/supabase/db";
import { getCurrentUser, createAdminUser, UserSession } from "@/lib/supabase/auth";
import {
  Users,
  FileText,
  CheckCircle,
  XCircle,
  Search,
  Mail,
  Phone,
  BookOpen,
  GraduationCap,
  Shield,
  ShieldCheck,
  UserPlus,
  X,
  Eye,
  EyeOff,
  Lock,
  Trash2,
  Edit,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

export default function RegisteredStudents() {
  const currentUserRef = useRef<UserSession | null>(null);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [results, setResults] = useState<TestResult[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [internships, setInternships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"profiles" | "results">("profiles");
  const [searchQuery, setSearchQuery] = useState("");

  // Show details / Delete user state
  const [selectedProfile, setSelectedProfile] = useState<any | null>(null);
  const [profileToDelete, setProfileToDelete] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Override Result state
  const [editingResult, setEditingResult] = useState<TestResult | null>(null);
  const [updatingResult, setUpdatingResult] = useState(false);
  const [resultMsg, setResultMsg] = useState("");

  // Add Admin modal state
  const [showAddAdmin, setShowAddAdmin] = useState(false);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: "",
    email: "",
    phone_number: "",
  });
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");

  useEffect(() => {
    if (selectedProfile) {
      setEditForm({
        full_name: selectedProfile.full_name || "",
        email: selectedProfile.email || "",
        phone_number: selectedProfile.phone_number || "",
      });
      setIsEditingProfile(false);
      setProfileMsg("");
    }
  }, [selectedProfile]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProfile) return;
    setUpdatingProfile(true);
    setProfileMsg("");
    try {
      const res = await updateStudentProfile(selectedProfile.id, {
        full_name: editForm.full_name,
        email: editForm.email,
        phone_number: editForm.phone_number,
      });
      if (res.success) {
        setProfileMsg("Profile updated successfully!");
        setProfiles((prev) =>
          prev.map((p) => (p.id === selectedProfile.id ? { ...p, ...res.data } : p))
        );
        setSelectedProfile((prev: any) => ({ ...prev, ...res.data }));
        setTimeout(() => {
          setIsEditingProfile(false);
          setProfileMsg("");
        }, 1500);
      } else {
        setProfileMsg("Failed to update profile.");
      }
    } catch (err: any) {
      setProfileMsg(err.message || "An error occurred while updating profile.");
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleSaveResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResult) return;
    setUpdatingResult(true);
    setResultMsg("");
    try {
      const score = Number(editingResult.score);
      const total = Number(editingResult.total_questions);
      const pct = total > 0 ? Number(((score / total) * 100).toFixed(2)) : 0;
      const passed = editingResult.passed;

      const res = await updateTestResult(editingResult.id, {
        score,
        total_questions: total,
        percentage: pct,
        passed,
      });

      if (res) {
        setResultMsg("Test result updated successfully!");
        setResults((prev) =>
          prev.map((r) => (r.id === editingResult.id ? { ...r, ...res } : r))
        );
        setTimeout(() => {
          setEditingResult(null);
          setResultMsg("");
        }, 1500);
      } else {
        setResultMsg("Failed to update test result.");
      }
    } catch (err: any) {
      setResultMsg(err.message || "An error occurred while updating test result.");
    } finally {
      setUpdatingResult(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!profileToDelete) return;
    setDeleting(true);
    setDeleteError("");
    try {
      const success = await deleteProfile(profileToDelete.id);
      if (success) {
        setProfiles((prev) => prev.filter((p) => p.id !== profileToDelete.id));
        setResults((prev) => prev.filter((r) => r.student_id !== profileToDelete.id));
        setProfileToDelete(null);
      } else {
        setDeleteError("Failed to delete user profile.");
      }
    } catch (err: any) {
      setDeleteError(err.message || "Failed to delete user profile.");
    } finally {
      setDeleting(false);
    }
  };

  const [adminForm, setAdminForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    departmentStream: "Platform Administration",
    password: "",
  });
  const [showAdminPwd, setShowAdminPwd] = useState(false);
  const [adminCreating, setAdminCreating] = useState(false);
  const [adminMsg, setAdminMsg] = useState("");
  const [adminMsgType, setAdminMsgType] = useState<"success" | "error">("success");

  useEffect(() => {
    async function loadData() {
      try {
        const [user, profileList, testLogs, paymentList, internshipList] = await Promise.all([
          getCurrentUser(),
          getAllProfiles(),
          getTestResults(),
          getAllPayments(),
          getInternships(),
        ]);
        currentUserRef.current = user;
        setProfiles(profileList);
        setResults(testLogs);
        setPayments(paymentList);
        setInternships(internshipList);
      } catch (err) {
        console.error("Failed to load student logs", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserRef.current) return;
    setAdminCreating(true);
    setAdminMsg("");
    try {
      await createAdminUser(
        currentUserRef.current.email,
        adminForm.email,
        adminForm.password,
        adminForm.fullName,
        adminForm.phone,
        adminForm.departmentStream
      );
      setAdminMsg("Admin account created successfully.");
      setAdminMsgType("success");
      setAdminForm({ fullName: "", email: "", phone: "", departmentStream: "Platform Administration", password: "" });
      // Refresh profiles
      const updated = await getAllProfiles();
      setProfiles(updated);
      setTimeout(() => setShowAddAdmin(false), 1500);
    } catch (err: any) {
      setAdminMsg(err.message || "Failed to create admin.");
      setAdminMsgType("error");
    } finally {
      setAdminCreating(false);
    }
  };

  const getSelectedInternshipsForStudent = (studentId: string) => {
    const completedPayments = payments.filter((p) => p.student_id === studentId && p.status === "completed");
    if (completedPayments.length === 0) return "None";
    const titles = completedPayments.map((p) => {
      const track = internships.find((i) => i.id === p.internship_id);
      return track ? track.title : p.internship_id;
    });
    return Array.from(new Set(titles)).join(", ");
  };

  const students = profiles.filter((p) => p.role === "student");
  const admins   = profiles.filter((p) => p.role === "admin");

  const filteredProfiles = profiles.filter(
    (p) =>
      p.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.department_stream?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredResults = results.filter(
    (r) =>
      r.student_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.internship_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reference_number?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 relative z-10 text-zinc-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">
            User Registry &amp; Activity
          </h1>
          <p className="text-zinc-505 text-xs sm:text-sm font-light mt-1">
            All registered accounts, test performance logs, and admin management.
          </p>
        </div>

        {/* Add Admin button */}
        <button
          onClick={() => { setShowAddAdmin(true); setAdminMsg(""); }}
          className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-xs font-bold shadow-lg shadow-indigo-500/10 transition-all active:scale-95 cursor-pointer"
        >
          <UserPlus className="h-3.5 w-3.5" />
          Add Admin Account
        </button>
      </div>

      {/* Summary Stat Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Registrations", value: profiles.length, icon: Users, color: "text-indigo-600 bg-indigo-50 border-indigo-100" },
          { label: "Students", value: students.length, icon: GraduationCap, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
          { label: "Admins", value: admins.length, icon: Shield, color: "text-violet-600 bg-violet-50 border-violet-100" },
          { label: "Test Submissions", value: results.length, icon: FileText, color: "text-amber-600 bg-amber-50 border-amber-100" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="glass-panel bg-white border border-zinc-200/85 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
              <div className={`p-2.5 rounded-xl border ${stat.color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{stat.label}</p>
                <p className="text-lg font-extrabold text-zinc-900">{loading ? "..." : stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-md">
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => { setActiveTab("profiles"); setSearchQuery(""); }}
            className={`flex-grow sm:flex-grow-0 px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              activeTab === "profiles"
                ? "bg-indigo-50 text-indigo-600 border-indigo-150 shadow-sm"
                : "bg-zinc-50 border-zinc-200 text-zinc-650 hover:bg-zinc-100 hover:text-zinc-900 shadow-sm"
            }`}
          >
            All Accounts ({profiles.length})
          </button>
          <button
            onClick={() => { setActiveTab("results"); setSearchQuery(""); }}
            className={`flex-grow sm:flex-grow-0 px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              activeTab === "results"
                ? "bg-indigo-50 text-indigo-600 border-indigo-150 shadow-sm"
                : "bg-zinc-50 border-zinc-200 text-zinc-655 hover:bg-zinc-100 hover:text-zinc-900 shadow-sm"
            }`}
          >
            Test Logs ({results.length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
          <input
            type="text"
            placeholder={activeTab === "profiles" ? "Search name, email, role..." : "Search student, track, ref no..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs bg-white border border-zinc-205 focus:border-indigo-500/50 rounded-xl outline-none text-zinc-800"
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
        </div>
      ) : activeTab === "profiles" ? (
        filteredProfiles.length === 0 ? (
          <div className="text-center py-20 border border-zinc-200 rounded-3xl bg-white shadow-sm">
            <Users className="h-10 w-10 mx-auto text-zinc-400 mb-3" />
            <p className="text-sm text-zinc-500 font-bold">No accounts found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-zinc-200/80 shadow-sm bg-white">
            <table className="w-full text-left text-xs text-zinc-600 border-collapse">
              <thead className="text-[10px] text-zinc-400 uppercase tracking-wider bg-zinc-50 border-b border-zinc-200/80">
                <tr>
                  <th className="px-5 py-4">Name</th>
                  <th className="px-5 py-4">Email</th>
                  <th className="px-5 py-4">Phone</th>
                  <th className="px-5 py-4">Course / Department</th>
                  <th className="px-5 py-4">Selected Internship(s)</th>
                  <th className="px-5 py-4">Role</th>
                  <th className="px-5 py-4">Registered</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredProfiles.map((profile) => (
                  <tr key={profile.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src="/ai_avatar.png" 
                          alt={profile.full_name || "User Avatar"} 
                          className="h-7 w-7 rounded-lg border border-zinc-205 object-cover shrink-0" 
                        />
                        <span className="font-bold text-zinc-900 whitespace-nowrap">{profile.full_name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-indigo-550 shrink-0" />
                        {profile.email}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-indigo-550 shrink-0" />
                        {profile.phone_number || "N/A"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="h-3.5 w-3.5 text-indigo-550 shrink-0" />
                        <span className="max-w-[160px] truncate font-medium">{profile.department_stream || "N/A"}</span>
                      </span>
                    </td>
                    <td className="px-5 py-4 font-bold text-zinc-900">
                      {profile.role === "admin" ? "N/A" : getSelectedInternshipsForStudent(profile.id)}
                    </td>
                    <td className="px-5 py-4">
                      {profile.role === "admin" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-bold text-violet-700 border border-violet-100">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-bold text-indigo-650 border border-indigo-100">
                          <GraduationCap className="h-3.5 w-3.5" />
                          Student
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-zinc-400">
                      {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setSelectedProfile(profile)}
                          className="p-1 text-zinc-450 hover:text-indigo-600 hover:bg-zinc-50 rounded-lg transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        
                        {profile.role !== "admin" && (
                          <button
                            onClick={() => { setProfileToDelete(profile); setDeleteError(""); }}
                            className="p-1 text-zinc-455 hover:text-red-600 hover:bg-zinc-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete User"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        /* RESULTS TAB */
        filteredResults.length === 0 ? (
          <div className="text-center py-20 border border-zinc-200 rounded-3xl bg-white shadow-sm">
            <FileText className="h-10 w-10 mx-auto text-zinc-400 mb-3" />
            <p className="text-sm text-zinc-550 font-bold">No test performance logs recorded.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-zinc-200/80 shadow-sm bg-white">
            <table className="w-full text-left text-xs text-zinc-650 border-collapse">
              <thead className="text-[10px] text-zinc-400 uppercase tracking-wider bg-zinc-50 border-b border-zinc-200/80">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Internship Track</th>
                  <th className="px-6 py-4">Reference No.</th>
                  <th className="px-6 py-4">Score</th>
                  <th className="px-6 py-4">Percentage</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Attempt Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredResults.map((res) => (
                  <tr key={res.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-zinc-900">{res.student_name}</td>
                    <td className="px-6 py-4 font-semibold text-zinc-700">{res.internship_title}</td>
                    <td className="px-6 py-4">
                      {res.reference_number ? (
                        <span className="inline-flex items-center font-mono text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg px-2.5 py-1 tracking-wide select-all">
                          {res.reference_number}
                        </span>
                      ) : (
                        <span className="text-zinc-350 text-[10px] italic">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold text-zinc-800">{res.score} / {res.total_questions}</td>
                    <td className="px-6 py-4 text-indigo-650 font-bold">{res.percentage}%</td>
                    <td className="px-6 py-4">
                      {res.passed ? (
                        <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-150">
                          <CheckCircle className="h-3 w-3" /> Pass
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-650 border border-red-155">
                          <XCircle className="h-3 w-3" /> Fail
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-zinc-400">{new Date(res.completed_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-3">
                        <Link
                          href={`/student/results/${res.id}`}
                          target="_blank"
                          className="text-indigo-600 hover:text-indigo-700 font-bold transition-colors"
                        >
                          Inspect
                        </Link>
                        <button
                          onClick={() => {
                            setEditingResult(res);
                            setResultMsg("");
                          }}
                          className="inline-flex items-center gap-1 text-xs text-indigo-650 hover:text-indigo-800 font-bold cursor-pointer"
                        >
                          <Edit className="h-3.5 w-3.5" />
                          Override
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* Add Admin Modal */}
      {showAddAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md glass-panel bg-white border border-zinc-200 rounded-3xl p-6 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-violet-50 border border-violet-100">
                  <Shield className="h-4 w-4 text-violet-600" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-zinc-900">Create Admin Account</h2>
                  <p className="text-[10px] text-zinc-400">Only admins can create other admins</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddAdmin(false)}
                className="p-1.5 rounded-xl hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddAdmin} className="space-y-4">
              <div>
                <label htmlFor="admin-fullName" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Full Name</label>
                <input
                  id="admin-fullName"
                  type="text"
                  required
                  value={adminForm.fullName}
                  onChange={(e) => setAdminForm((f) => ({ ...f, fullName: e.target.value }))}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-zinc-205 focus:border-violet-500/50 rounded-xl outline-none text-zinc-800 placeholder-zinc-400 transition-colors"
                  placeholder="e.g. Admin User"
                />
              </div>

              <div>
                <label htmlFor="admin-email" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Email Address</label>
                <input
                  id="admin-email"
                  type="email"
                  required
                  value={adminForm.email}
                  onChange={(e) => setAdminForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-zinc-205 focus:border-violet-500/50 rounded-xl outline-none text-zinc-800 placeholder-zinc-400 transition-colors"
                  placeholder="admin@example.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="admin-phone" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Phone</label>
                  <input
                    id="admin-phone"
                    type="tel"
                    required
                    value={adminForm.phone}
                    onChange={(e) => setAdminForm((f) => ({ ...f, phone: e.target.value }))}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-zinc-205 focus:border-violet-500/50 rounded-xl outline-none text-zinc-800 placeholder-zinc-400 transition-colors"
                    placeholder="10-digit number"
                  />
                </div>
                <div>
                  <label htmlFor="admin-dept" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Department</label>
                  <input
                    id="admin-dept"
                    type="text"
                    required
                    value={adminForm.departmentStream}
                    onChange={(e) => setAdminForm((f) => ({ ...f, departmentStream: e.target.value }))}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-zinc-205 focus:border-violet-500/50 rounded-xl outline-none text-zinc-800 placeholder-zinc-400 transition-colors"
                    placeholder="Platform Administration"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="admin-pwd" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-455" />
                  <input
                    id="admin-pwd"
                    type={showAdminPwd ? "text" : "password"}
                    required
                    value={adminForm.password}
                    onChange={(e) => setAdminForm((f) => ({ ...f, password: e.target.value }))}
                    className="w-full pl-10 pr-10 py-2.5 text-xs bg-white border border-zinc-205 focus:border-violet-500/50 rounded-xl outline-none text-zinc-800 placeholder-zinc-400 transition-colors"
                    placeholder="Min 8 chars, uppercase + symbol + number"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPwd((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-800 transition-colors cursor-pointer"
                  >
                    {showAdminPwd ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              {adminMsg && (
                <div className={`p-3 rounded-xl text-[11px] border font-medium ${
                  adminMsgType === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}>
                  {adminMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={adminCreating}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-650 hover:from-violet-650 hover:to-indigo-700 text-white text-xs font-bold shadow-lg shadow-violet-500/10 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <ShieldCheck className="h-4 w-4" />
                {adminCreating ? "Creating Admin..." : "Create Admin Account"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {selectedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl glass-panel bg-white border border-zinc-200 rounded-3xl p-6 shadow-2xl my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6 border-b border-zinc-150 pb-4">
              <div className="flex items-center gap-3">
                <img 
                  src="/ai_avatar.png" 
                  alt={selectedProfile.full_name} 
                  className="h-12 w-12 rounded-2xl border border-zinc-205 object-cover shrink-0" 
                />
                <div>
                  <h2 className="text-base font-extrabold text-zinc-900">{selectedProfile.full_name}</h2>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 mt-1 text-[10px] font-bold ${
                    selectedProfile.role === "admin"
                      ? "bg-violet-50 text-violet-700 border border-violet-100"
                      : "bg-indigo-50 text-indigo-650 border border-indigo-100"
                  }`}>
                    {selectedProfile.role === "admin" ? <ShieldCheck className="h-3 w-3" /> : <GraduationCap className="h-3 w-3" />}
                    {selectedProfile.role === "admin" ? "Administrator" : "Student Candidate"}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedProfile(null)}
                className="p-1.5 rounded-xl hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Details Grid */}
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {/* Full Name */}
                {isEditingProfile && (
                  <div className="sm:col-span-2 border-b border-zinc-100 pb-2">
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={editForm.full_name}
                      onChange={(e) => setEditForm((f) => ({ ...f, full_name: e.target.value }))}
                      className="w-full px-3 py-2 text-xs bg-white border border-zinc-205 focus:border-indigo-500/50 rounded-xl outline-none text-zinc-800"
                    />
                  </div>
                )}

                {/* Email */}
                <div className="border-b border-zinc-100 pb-2">
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Account Email</label>
                  {isEditingProfile ? (
                    <input
                      type="email"
                      required
                      value={editForm.email}
                      onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                      className="w-full px-3 py-2 text-xs bg-white border border-zinc-205 focus:border-indigo-500/50 rounded-xl outline-none text-zinc-800"
                    />
                  ) : (
                    <p className="text-xs font-semibold text-zinc-805 mt-0.5">{selectedProfile.email}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div className="border-b border-zinc-100 pb-2">
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Phone Number</label>
                  {isEditingProfile ? (
                    <input
                      type="text"
                      required
                      value={editForm.phone_number}
                      onChange={(e) => setEditForm((f) => ({ ...f, phone_number: e.target.value }))}
                      className="w-full px-3 py-2 text-xs bg-white border border-zinc-205 focus:border-indigo-500/50 rounded-xl outline-none text-zinc-800"
                    />
                  ) : (
                    <p className="text-xs font-semibold text-zinc-805 mt-0.5">{selectedProfile.phone_number || "N/A"}</p>
                  )}
                </div>

                {/* Other fields are read-only */}
                {[
                  { label: "University Name", value: selectedProfile.university_name || "N/A" },
                  { label: "College Name", value: selectedProfile.college_name || "N/A" },
                  { label: "Degree Course", value: selectedProfile.degree || "N/A" },
                  { label: "Department / Stream", value: selectedProfile.department_stream || "N/A" },
                  { label: "Active Semester", value: selectedProfile.semester || "N/A" },
                  { label: "Academic Session", value: selectedProfile.academic_session || "N/A" },
                  { label: "Major Subject", value: selectedProfile.major_subject || "N/A" },
                  { label: "Institutional Roll Number", value: selectedProfile.roll_number || "N/A" },
                  { label: "Registration Number", value: selectedProfile.registration_number || "N/A" },
                  { label: "Gender Identity", value: selectedProfile.gender || "N/A" },
                  { label: "Date of Birth", value: selectedProfile.date_of_birth || "N/A" },
                  { label: "Profile Completed", value: selectedProfile.profile_completed ? "Completed" : "Incomplete", colorClass: selectedProfile.profile_completed ? "text-emerald-600 font-bold" : "text-amber-600 font-bold" },
                  { label: "Registered At", value: selectedProfile.created_at ? new Date(selectedProfile.created_at).toLocaleString() : "N/A" },
                ].map((item, i) => (
                  <div key={i} className="border-b border-zinc-100 pb-2">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{item.label}</p>
                    <p className={`text-xs font-semibold text-zinc-805 mt-0.5 ${item.colorClass || ""}`}>{item.value}</p>
                  </div>
                ))}

                <div className="sm:col-span-2 border-b border-zinc-100 pb-2">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Full Address</p>
                  <p className="text-xs font-semibold text-zinc-805 mt-0.5">
                    {selectedProfile.full_address ? (
                      `${selectedProfile.full_address}, ${selectedProfile.city || ""}, ${selectedProfile.state || ""} - ${selectedProfile.pincode || ""}`
                    ) : "N/A"}
                  </p>
                </div>

                {selectedProfile.role !== "admin" && (
                  <div className="sm:col-span-2 border-b border-zinc-100 pb-2">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Enrolled Internship(s)</p>
                    <div className="text-xs font-semibold text-zinc-805 mt-1 space-y-1.5 bg-slate-50 p-3 rounded-xl border border-zinc-200">
                      {payments.filter(p => p.student_id === selectedProfile.id && p.status === "completed").length === 0 ? (
                        <p className="text-zinc-550 italic font-medium">No internships enrolled yet.</p>
                      ) : (
                        payments
                          .filter(p => p.student_id === selectedProfile.id && p.status === "completed")
                          .map((p, pIdx) => {
                            const trackObj = internships.find(i => i.id === p.internship_id);
                            const title = trackObj ? trackObj.title : p.internship_id;
                            const date = p.created_at ? new Date(p.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "N/A";
                            return (
                              <div key={pIdx} className="flex justify-between items-center gap-2 border-b border-zinc-150 last:border-b-0 pb-1 last:pb-0">
                                <span className="font-bold text-zinc-900">{title}</span>
                                <span className="text-[10px] text-zinc-500 font-bold">Paid ₹{(p.amount / 100).toFixed(2)} on {date}</span>
                              </div>
                            );
                          })
                      )}
                    </div>
                  </div>
                )}
              </div>

              {profileMsg && (
                <div className="p-3.5 rounded-xl text-xs bg-indigo-50 border border-indigo-150 text-indigo-700 font-medium">
                  {profileMsg}
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-zinc-150">
                {isEditingProfile ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="px-5 py-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-bold transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updatingProfile}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                    >
                      {updatingProfile ? "Saving..." : "Save Updates"}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(true)}
                      className="px-5 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-bold transition-all cursor-pointer"
                    >
                      Edit User Profile
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedProfile(null)}
                      className="px-5 py-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-bold transition-all cursor-pointer"
                    >
                      Close Details
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {profileToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md glass-panel bg-white border border-zinc-200 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-2xl">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-zinc-950">Delete Student Account</h2>
                <p className="text-[10px] text-zinc-400">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-xs text-zinc-650 leading-relaxed font-light mb-4">
              Are you sure you want to permanently delete the profile for <strong>{profileToDelete.full_name}</strong> ({profileToDelete.email})? This will also remove all their associated test submissions and certificate records from the database.
            </p>

            {deleteError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-[11px] text-red-750 font-semibold mb-4">
                {deleteError}
              </div>
            )}

            <div className="flex justify-end gap-3 border-t border-zinc-150 pt-4">
              <button
                onClick={() => { setProfileToDelete(null); setDeleteError(""); }}
                className="px-4 py-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={deleting}
                className="px-4 py-2.5 rounded-xl bg-red-650 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/10 transition-all cursor-pointer"
              >
                {deleting ? "Deleting..." : "Permanently Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Override Test Result Modal */}
      {editingResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md glass-panel bg-white border border-zinc-200 rounded-3xl p-6 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-100">
                  <Edit className="h-4 w-4 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-zinc-900">Override Test Score</h2>
                  <p className="text-[10px] text-zinc-400">Manually edit assessment scores and status</p>
                </div>
              </div>
              <button
                onClick={() => setEditingResult(null)}
                className="p-1.5 rounded-xl hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Student and Track Details */}
            <div className="mb-4 p-3 bg-zinc-50 border border-zinc-100 rounded-xl space-y-1">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Candidate / Track</p>
              <p className="text-xs font-bold text-zinc-800">{editingResult.student_name}</p>
              <p className="text-[11px] text-zinc-550 font-medium">{editingResult.internship_title}</p>
            </div>

            <form onSubmit={handleSaveResult} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="override-score" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Score</label>
                  <input
                    id="override-score"
                    type="number"
                    required
                    min={0}
                    value={editingResult.score}
                    onChange={(e) => setEditingResult((r) => r ? { ...r, score: Number(e.target.value) } : null)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-zinc-205 focus:border-indigo-500/50 rounded-xl outline-none text-zinc-800 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="override-total" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Total Questions</label>
                  <input
                    id="override-total"
                    type="number"
                    required
                    min={1}
                    value={editingResult.total_questions}
                    onChange={(e) => setEditingResult((r) => r ? { ...r, total_questions: Number(e.target.value) } : null)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-zinc-205 focus:border-indigo-500/50 rounded-xl outline-none text-zinc-800 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Assessment Status</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingResult((r) => r ? { ...r, passed: true } : null)}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      editingResult.passed
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm"
                        : "bg-zinc-50 border-zinc-200 text-zinc-500 hover:bg-zinc-100"
                    }`}
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                    Pass
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingResult((r) => r ? { ...r, passed: false } : null)}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      !editingResult.passed
                        ? "bg-red-50 text-red-700 border-red-200 shadow-sm"
                        : "bg-zinc-50 border-zinc-200 text-zinc-500 hover:bg-zinc-100"
                    }`}
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    Fail
                  </button>
                </div>
              </div>

              {resultMsg && (
                <div className="p-3.5 rounded-xl text-xs bg-indigo-50 border border-indigo-150 text-indigo-700 font-medium">
                  {resultMsg}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-150">
                <button
                  type="button"
                  onClick={() => setEditingResult(null)}
                  className="px-4 py-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingResult}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-xs font-bold shadow-lg shadow-indigo-500/10 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {updatingResult ? "Saving..." : "Save Override"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
