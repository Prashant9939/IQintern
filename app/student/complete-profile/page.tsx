"use client";

import { useEffect, useState } from "react";
import { getCurrentUser, updateStoredSessionFields, UserSession } from "@/lib/supabase/auth";
import { updateStudentProfile, getUniversities, University } from "@/lib/supabase/db";
import { 
  GraduationCap, 
  User, 
  MapPin, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle,
  Lock
} from "lucide-react";

export default function CompleteProfile() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    university_name: "",
    college_name: "",
    degree: "",
    department_stream: "",
    semester: "",
    academic_session: "",
    major_subject: "",
    roll_number: "",
    registration_number: "",
    gender: "",
    date_of_birth: "",
    full_address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [universities, setUniversities] = useState<University[]>([]);
  const [availableColleges, setAvailableColleges] = useState<string[]>([]);

  useEffect(() => {
    async function loadUser() {
      try {
        const u = await getCurrentUser();
        setUser(u);
        
        // Fetch universities
        const univs = await getUniversities();
        setUniversities(univs);
      } catch (err) {
        console.error("Error loading user profile", err);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  useEffect(() => {
    const selectedUniv = universities.find((u) => u.name === formData.university_name);
    if (selectedUniv) {
      setAvailableColleges(selectedUniv.colleges);
    } else {
      setAvailableColleges([]);
    }
  }, [formData.university_name, universities]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!user) {
      setError("User session not found. Please log in again.");
      return;
    }

    // Double check required fields
    const requiredKeys = Object.keys(formData).filter((key) => key !== "academic_session" && key !== "registration_number");
    const emptyKeys = requiredKeys.filter((key) => !formData[key as keyof typeof formData]);
    
    if (emptyKeys.length > 0) {
      setError("Please fill in all the required fields.");
      return;
    }

    // Validate pincode format (6 digits)
    if (!/^\d{6}$/.test(formData.pincode)) {
      setError("Invalid pincode. Must be exactly 6 digits.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await updateStudentProfile(user.id, formData);
      if (res.success) {
        setSuccess("Profile completed successfully! Redirecting to your dashboard...");
        
        // Update the stored session
        updateStoredSessionFields({
          profile_completed: true,
        });

        // Redirect to dashboard
        setTimeout(() => {
          window.location.href = "/student/dashboard";
        }, 1500);
      } else {
        setError("Failed to update profile details. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  const semesters = ["1st Semester", "2nd Semester", "3rd Semester", "4th Semester", "5th Semester", "6th Semester", "7th Semester", "8th Semester"];
  
  const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", 
    "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", 
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu & Kashmir", "Ladakh", "Other"
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 relative z-10 animate-fade-in">
      {/* Top Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-brand-indigo/5 blur-2xl pointer-events-none" />
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-100 text-amber-600 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
            <Lock className="h-3 w-3" /> Action Required
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">Complete Your Profile</h1>
          <p className="text-zinc-700 text-xs sm:text-sm font-semibold leading-relaxed max-w-xl">
            Please fill out your academic details, personal info, and address. This information will be printed on your official certificates and verified during selection.
          </p>
        </div>
        <div className="flex flex-col items-start md:items-end gap-1.5 bg-zinc-50 border border-zinc-200/60 rounded-2xl px-5 py-3 text-xs self-stretch md:self-auto shadow-sm">
          <span className="text-zinc-600 block font-bold">Logged in as</span>
          <span className="text-zinc-800 font-bold text-sm block">{user?.full_name}</span>
          <span className="text-zinc-750 block font-semibold">{user?.email}</span>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-start gap-2.5 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-600 animate-shake">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
          <div className="space-y-1">
            <h5 className="font-bold">Check Form Validation</h5>
            <p className="text-xs text-red-500">{error}</p>
          </div>
        </div>
      )}

      {/* Success Banner */}
      {success && (
        <div className="flex items-start gap-2.5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-600">
          <CheckCircle className="h-5 w-5 shrink-0 text-emerald-500 mt-0.5" />
          <div className="space-y-1">
            <h5 className="font-bold">Saving Profile Details</h5>
            <p className="text-xs text-emerald-550">{success}</p>
          </div>
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* SECTION 1: ACADEMIC INFO */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 relative">
          <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-indigo-500/5 blur-xl pointer-events-none" />
          
          <div className="flex items-center gap-3 border-b border-zinc-200/50 pb-4">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900">Academic Credentials</h3>
              <p className="text-xs text-zinc-600 font-bold mt-0.5">Your official university enrolment and course details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* University Name */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-650 uppercase tracking-wider block">University Name</label>
              <select
                name="university_name"
                required
                value={formData.university_name}
                onChange={handleChange}
                className="w-full px-4 py-3 text-sm bg-white border border-zinc-200 focus:border-indigo-500/50 rounded-xl outline-none text-zinc-700 transition-colors cursor-pointer font-medium"
              >
                <option value="">Select University</option>
                {universities.map((u) => (
                  <option key={u.name} value={u.name}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            {/* College Name */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-650 uppercase tracking-wider block">College Name</label>
              <select
                name="college_name"
                required
                disabled={!formData.university_name}
                value={formData.college_name}
                onChange={handleChange}
                className="w-full px-4 py-3 text-sm bg-white border border-zinc-200 focus:border-indigo-500/50 rounded-xl outline-none text-zinc-700 transition-colors cursor-pointer font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Select College</option>
                {availableColleges.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>



            {/* Degree */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-650 uppercase tracking-wider block">Degree Awarded/Pursuing</label>
              <input
                type="text"
                name="degree"
                required
                value={formData.degree}
                onChange={handleChange}
                placeholder="e.g. Bachelor of Technology (B.Tech)"
                className="w-full px-4 py-3 text-sm bg-white border border-zinc-200 focus:border-indigo-500/50 rounded-xl outline-none text-zinc-800 transition-colors"
              />
            </div>

            {/* Department / Stream */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-650 uppercase tracking-wider block">Department / Stream</label>
              <input
                type="text"
                name="department_stream"
                required
                value={formData.department_stream}
                onChange={handleChange}
                placeholder="e.g. Computer Science & Engineering"
                className="w-full px-4 py-3 text-sm bg-white border border-zinc-200 focus:border-indigo-500/50 rounded-xl outline-none text-zinc-800 transition-colors"
              />
            </div>

            {/* Major Subject */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-650 uppercase tracking-wider block">Major Subject</label>
              <input
                type="text"
                name="major_subject"
                required
                value={formData.major_subject}
                onChange={handleChange}
                placeholder="e.g. Software Development / Machine Learning"
                className="w-full px-4 py-3 text-sm bg-white border border-zinc-200 focus:border-indigo-500/50 rounded-xl outline-none text-zinc-800 transition-colors"
              />
            </div>

            {/* Semester */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-650 uppercase tracking-wider block">Current Semester</label>
              <select
                name="semester"
                required
                value={formData.semester}
                onChange={handleChange}
                className="w-full px-4 py-3 text-sm bg-white border border-zinc-200 focus:border-indigo-500/50 rounded-xl outline-none text-zinc-700 transition-colors cursor-pointer font-medium"
              >
                <option value="">Select Semester</option>
                {semesters.map((sem) => (
                  <option key={sem} value={sem}>{sem}</option>
                ))}
              </select>
            </div>

            {/* Academic Session */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-650 uppercase tracking-wider block">Academic Session</label>
              <input
                type="text"
                name="academic_session"
                required
                value={formData.academic_session}
                onChange={handleChange}
                placeholder="e.g. 2022 - 2026"
                className="w-full px-4 py-3 text-sm bg-white border border-zinc-200 focus:border-indigo-500/50 rounded-xl outline-none text-zinc-800 transition-colors"
              />
            </div>

            {/* Roll Number */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-650 uppercase tracking-wider block">Roll Number</label>
              <input
                type="text"
                name="roll_number"
                required
                value={formData.roll_number}
                onChange={handleChange}
                placeholder="e.g. DTU/2K22/CS/105"
                className="w-full px-4 py-3 text-sm bg-white border border-zinc-200 focus:border-indigo-500/50 rounded-xl outline-none text-zinc-800 transition-colors"
              />
            </div>

            {/* Registration Number */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-650 uppercase tracking-wider block">Registration Number</label>
              <input
                type="text"
                name="registration_number"
                required
                value={formData.registration_number}
                onChange={handleChange}
                placeholder="e.g. 2201020304"
                className="w-full px-4 py-3 text-sm bg-white border border-zinc-200 focus:border-indigo-500/50 rounded-xl outline-none text-zinc-800 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: PERSONAL INFORMATION */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 relative">
          <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-violet-500/5 blur-xl pointer-events-none" />
          
          <div className="flex items-center gap-3 border-b border-zinc-200/50 pb-4">
            <div className="h-10 w-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900">Personal Information</h3>
              <p className="text-xs text-zinc-600 font-bold mt-0.5">Demographic information as listed on identification papers</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Gender */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-650 uppercase tracking-wider block">Gender</label>
              <select
                name="gender"
                required
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-3 text-sm bg-white border border-zinc-200 focus:border-indigo-500/50 rounded-xl outline-none text-zinc-700 transition-colors cursor-pointer font-medium"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other / Prefer not to say</option>
              </select>
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-650 uppercase tracking-wider block">Date of Birth</label>
              <input
                type="date"
                name="date_of_birth"
                required
                value={formData.date_of_birth}
                onChange={handleChange}
                className="w-full px-4 py-3 text-sm bg-white border border-zinc-200 focus:border-indigo-500/50 rounded-xl outline-none text-zinc-800 transition-colors font-medium"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: ADDRESS INFORMATION */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 relative">
          <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-emerald-500/5 blur-xl pointer-events-none" />
          
          <div className="flex items-center gap-3 border-b border-zinc-200/50 pb-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900">Contact Address</h3>
              <p className="text-xs text-zinc-600 font-bold mt-0.5">Permanent address for dispatching certificates/documents</p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Full Address */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-650 uppercase tracking-wider block">Full Address</label>
              <textarea
                name="full_address"
                required
                rows={3}
                value={formData.full_address}
                onChange={handleChange}
                placeholder="House No, Street, Landmark, Area Name"
                className="w-full px-4 py-3 text-sm bg-white border border-zinc-200 focus:border-indigo-500/50 rounded-xl outline-none text-zinc-800 transition-colors resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* City */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-650 uppercase tracking-wider block">City</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. New Delhi"
                  className="w-full px-4 py-3 text-sm bg-white border border-zinc-200 focus:border-indigo-500/50 rounded-xl outline-none text-zinc-800 transition-colors"
                />
              </div>

              {/* State */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-650 uppercase tracking-wider block">State</label>
                <select
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-sm bg-white border border-zinc-200 focus:border-indigo-500/50 rounded-xl outline-none text-zinc-700 transition-colors cursor-pointer font-medium"
                >
                  <option value="">Select State</option>
                  {states.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              {/* Pincode */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-650 uppercase tracking-wider block">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  required
                  maxLength={6}
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="e.g. 110001"
                  className="w-full px-4 py-3 text-sm bg-white border border-zinc-200 focus:border-indigo-500/50 rounded-xl outline-none text-zinc-800 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Section */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="w-full md:w-auto flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 px-8 py-4.5 text-sm font-bold text-white shadow-xl shadow-indigo-500/10 hover:shadow-indigo-500/20 hover:scale-101 active:scale-98 disabled:opacity-50 transition-all cursor-pointer"
          >
            {submitting ? "Saving Profile..." : "Save and Submit Details"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

      </form>
    </div>
  );
}
