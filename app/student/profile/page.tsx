"use client";

import { useEffect, useState } from "react";
import { getCurrentUser, updateStoredSessionFields, UserSession } from "@/lib/supabase/auth";
import { getStudentProfile, updateStudentProfile } from "@/lib/supabase/db";
import { 
  GraduationCap, 
  User, 
  MapPin, 
  AlertCircle, 
  CheckCircle,
  Lock,
  Edit3,
  X,
  Save,
  Phone,
  Mail,
  UserCheck,
  Briefcase
} from "lucide-react";

export default function StudentProfile() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
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

  const [initialData, setInitialData] = useState({ ...formData });

  useEffect(() => {
    async function loadProfile() {
      try {
        const u = await getCurrentUser();
        if (!u) {
          window.location.href = "/auth/login";
          return;
        }
        setUser(u);
        
        const profile = await getStudentProfile(u.id);
        if (profile) {
          const profileData = {
            full_name: profile.full_name || u.full_name || "",
            phone_number: profile.phone_number || u.phone_number || "",
            university_name: profile.university_name || "",
            college_name: profile.college_name || "",
            degree: profile.degree || "",
            department_stream: profile.department_stream || "",
            semester: profile.semester || "",
            academic_session: profile.academic_session || "",
            major_subject: profile.major_subject || "",
            roll_number: profile.roll_number || "",
            registration_number: profile.registration_number || "",
            gender: profile.gender || "",
            date_of_birth: profile.date_of_birth || "",
            full_address: profile.full_address || "",
            city: profile.city || "",
            state: profile.state || "",
            pincode: profile.pincode || "",
          };
          setFormData(profileData);
          setInitialData(profileData);
        }
      } catch (err) {
        console.error("Error loading profile details:", err);
        setError("Failed to load your profile details.");
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    setFormData({ ...initialData });
    setIsEditing(false);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!user) {
      setError("User session not found.");
      return;
    }

    // Required fields check
    const requiredKeys = Object.keys(formData).filter((key) => key !== "academic_session" && key !== "registration_number");
    const emptyKeys = requiredKeys.filter((key) => !formData[key as keyof typeof formData]);
    
    if (emptyKeys.length > 0) {
      setError("Please fill in all the required fields.");
      return;
    }

    // Pincode validation
    if (!/^\d{6}$/.test(formData.pincode)) {
      setError("Invalid pincode. Must be exactly 6 digits.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await updateStudentProfile(user.id, formData);
      if (res.success) {
        setSuccess("Profile details updated successfully!");
        setInitialData({ ...formData });
        
        // Update user session cache so sidebar updates instantly
        updateStoredSessionFields({
          full_name: formData.full_name,
          phone_number: formData.phone_number,
        });

        // Toggle back to view mode
        setTimeout(() => {
          setIsEditing(false);
          setSuccess("");
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
    <div className="max-w-4xl mx-auto space-y-8 relative z-10 animate-fade-in pb-16">
      
      {/* Profile Header Block */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-brand-indigo/5 blur-2xl pointer-events-none" />
        
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
            <UserCheck className="h-3 w-3" /> Profile Active
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
            {isEditing ? "Edit Profile Details" : "My Profile"}
          </h1>
          <p className="text-zinc-500 text-xs sm:text-sm font-light leading-relaxed max-w-xl">
            {isEditing 
              ? "Update your academic, personal, and contact details below. Ensure details are accurate as they appear on your certification documentation."
              : "View your verified academic profile, contact details, and institutional records."}
          </p>
        </div>

        {/* Action Toggle Button */}
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3.5 px-6 transition-all active:scale-95 shadow-md shadow-indigo-600/10 cursor-pointer"
          >
            <Edit3 className="h-4 w-4" />
            Edit Profile
          </button>
        ) : (
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 font-bold text-xs py-3.5 px-6 transition-all active:scale-95 shadow-sm cursor-pointer"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>
        )}
      </div>

      {/* Error & Success Banners */}
      {error && (
        <div className="flex items-start gap-2.5 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-600 animate-shake">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
          <div className="space-y-1">
            <h5 className="font-bold">Check Profile Form</h5>
            <p className="text-xs text-red-500">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-2.5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-600">
          <CheckCircle className="h-5 w-5 shrink-0 text-emerald-500 mt-0.5" />
          <div className="space-y-1">
            <h5 className="font-bold">Success</h5>
            <p className="text-xs text-emerald-600">{success}</p>
          </div>
        </div>
      )}

      {/* Form Content / View Details Card wrapper */}
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* SECTION 1: ACCOUNT & CONTACT DATA */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 relative">
          <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-indigo-500/5 blur-xl pointer-events-none" />
          
          <div className="flex items-center gap-3 border-b border-zinc-200/50 pb-4">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900">Account Details</h3>
              <p className="text-xs text-zinc-400 font-light mt-0.5">Primary identifier credentials</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="full_name"
                  required
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="w-full px-4 py-3 text-sm bg-white border border-zinc-200 focus:border-indigo-500/50 rounded-xl outline-none text-zinc-800 transition-colors"
                />
              ) : (
                <div className="px-4 py-3 text-sm bg-zinc-50 border border-zinc-100 rounded-xl text-zinc-800 font-semibold">
                  {formData.full_name || "N/A"}
                </div>
              )}
            </div>

            {/* Email - Read Only */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Email Address (Primary Account ID)</label>
              <div className="px-4 py-3 text-sm bg-zinc-50 border border-zinc-100 rounded-xl text-zinc-500 flex items-center gap-2 cursor-not-allowed">
                <Lock className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                <span>{user?.email}</span>
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone_number"
                  required
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="w-full px-4 py-3 text-sm bg-white border border-zinc-200 focus:border-indigo-500/50 rounded-xl outline-none text-zinc-800 transition-colors"
                />
              ) : (
                <div className="px-4 py-3 text-sm bg-zinc-50 border border-zinc-100 rounded-xl text-zinc-800 font-semibold">
                  {formData.phone_number || "N/A"}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 2: ACADEMIC CREDENTIALS */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 relative">
          <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-indigo-500/5 blur-xl pointer-events-none" />
          
          <div className="flex items-center gap-3 border-b border-zinc-200/50 pb-4">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900">Academic Credentials</h3>
              <p className="text-xs text-zinc-400 font-light mt-0.5">University enrollment and specialization records</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* University Name */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">University Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="university_name"
                  required
                  value={formData.university_name}
                  onChange={handleChange}
                  placeholder="University Name"
                  className="w-full px-4 py-3 text-sm bg-white border border-zinc-200 focus:border-indigo-500/50 rounded-xl outline-none text-zinc-800 transition-colors"
                />
              ) : (
                <div className="px-4 py-3 text-sm bg-zinc-50 border border-zinc-100 rounded-xl text-zinc-800 font-semibold">
                  {formData.university_name || "N/A"}
                </div>
              )}
            </div>

            {/* College Name */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">College Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="college_name"
                  required
                  value={formData.college_name}
                  onChange={handleChange}
                  placeholder="College Name"
                  className="w-full px-4 py-3 text-sm bg-white border border-zinc-200 focus:border-indigo-500/50 rounded-xl outline-none text-zinc-800 transition-colors"
                />
              ) : (
                <div className="px-4 py-3 text-sm bg-zinc-50 border border-zinc-100 rounded-xl text-zinc-800 font-semibold">
                  {formData.college_name || "N/A"}
                </div>
              )}
            </div>



            {/* Degree */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Degree</label>
              {isEditing ? (
                <input
                  type="text"
                  name="degree"
                  required
                  value={formData.degree}
                  onChange={handleChange}
                  placeholder="e.g. Bachelor of Technology"
                  className="w-full px-4 py-3 text-sm bg-white border border-zinc-200 focus:border-indigo-500/50 rounded-xl outline-none text-zinc-800 transition-colors"
                />
              ) : (
                <div className="px-4 py-3 text-sm bg-zinc-50 border border-zinc-100 rounded-xl text-zinc-800 font-semibold">
                  {formData.degree || "N/A"}
                </div>
              )}
            </div>

            {/* Department / Stream */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Department / Stream</label>
              {isEditing ? (
                <input
                  type="text"
                  name="department_stream"
                  required
                  value={formData.department_stream}
                  onChange={handleChange}
                  placeholder="e.g. Computer Science"
                  className="w-full px-4 py-3 text-sm bg-white border border-zinc-200 focus:border-indigo-500/50 rounded-xl outline-none text-zinc-800 transition-colors"
                />
              ) : (
                <div className="px-4 py-3 text-sm bg-zinc-50 border border-zinc-100 rounded-xl text-zinc-800 font-semibold">
                  {formData.department_stream || "N/A"}
                </div>
              )}
            </div>

            {/* Major Subject */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Major Subject</label>
              {isEditing ? (
                <input
                  type="text"
                  name="major_subject"
                  required
                  value={formData.major_subject}
                  onChange={handleChange}
                  placeholder="Major Subject"
                  className="w-full px-4 py-3 text-sm bg-white border border-zinc-200 focus:border-indigo-500/50 rounded-xl outline-none text-zinc-800 transition-colors"
                />
              ) : (
                <div className="px-4 py-3 text-sm bg-zinc-50 border border-zinc-100 rounded-xl text-zinc-800 font-semibold">
                  {formData.major_subject || "N/A"}
                </div>
              )}
            </div>

            {/* Semester */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Current Semester</label>
              {isEditing ? (
                <select
                  name="semester"
                  required
                  value={formData.semester}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-sm bg-white border border-zinc-200 focus:border-indigo-500/50 rounded-xl outline-none text-zinc-750 transition-colors cursor-pointer font-medium"
                >
                  <option value="">Select Semester</option>
                  {semesters.map((sem) => (
                    <option key={sem} value={sem}>{sem}</option>
                  ))}
                </select>
              ) : (
                <div className="px-4 py-3 text-sm bg-zinc-50 border border-zinc-100 rounded-xl text-zinc-800 font-semibold">
                  {formData.semester || "N/A"}
                </div>
              )}
            </div>

            {/* Academic Session */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Academic Session</label>
              {isEditing ? (
                <input
                  type="text"
                  name="academic_session"
                  required
                  value={formData.academic_session}
                  onChange={handleChange}
                  placeholder="e.g. 2022 - 2026"
                  className="w-full px-4 py-3 text-sm bg-white border border-zinc-200 focus:border-indigo-500/50 rounded-xl outline-none text-zinc-800 transition-colors"
                />
              ) : (
                <div className="px-4 py-3 text-sm bg-zinc-50 border border-zinc-100 rounded-xl text-zinc-800 font-semibold">
                  {formData.academic_session || "N/A"}
                </div>
              )}
            </div>

            {/* Roll Number */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Roll Number</label>
              {isEditing ? (
                <input
                  type="text"
                  name="roll_number"
                  required
                  value={formData.roll_number}
                  onChange={handleChange}
                  placeholder="Roll Number"
                  className="w-full px-4 py-3 text-sm bg-white border border-zinc-200 focus:border-indigo-500/50 rounded-xl outline-none text-zinc-800 transition-colors"
                />
              ) : (
                <div className="px-4 py-3 text-sm bg-zinc-50 border border-zinc-100 rounded-xl text-zinc-800 font-semibold">
                  {formData.roll_number || "N/A"}
                </div>
              )}
            </div>

            {/* Registration Number */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Registration Number</label>
              {isEditing ? (
                <input
                  type="text"
                  name="registration_number"
                  required
                  value={formData.registration_number}
                  onChange={handleChange}
                  placeholder="Registration Number"
                  className="w-full px-4 py-3 text-sm bg-white border border-zinc-200 focus:border-indigo-500/50 rounded-xl outline-none text-zinc-800 transition-colors"
                />
              ) : (
                <div className="px-4 py-3 text-sm bg-zinc-50 border border-zinc-100 rounded-xl text-zinc-800 font-semibold">
                  {formData.registration_number || "N/A"}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 3: PERSONAL DEMOGRAPHICS */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 relative">
          <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-violet-500/5 blur-xl pointer-events-none" />
          
          <div className="flex items-center gap-3 border-b border-zinc-200/50 pb-4">
            <div className="h-10 w-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900">Personal Information</h3>
              <p className="text-xs text-zinc-400 font-light mt-0.5">Demographics and identity details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gender */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Gender</label>
              {isEditing ? (
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
              ) : (
                <div className="px-4 py-3 text-sm bg-zinc-50 border border-zinc-100 rounded-xl text-zinc-800 font-semibold">
                  {formData.gender || "N/A"}
                </div>
              )}
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Date of Birth</label>
              {isEditing ? (
                <input
                  type="date"
                  name="date_of_birth"
                  required
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-sm bg-white border border-zinc-200 focus:border-indigo-500/50 rounded-xl outline-none text-zinc-800 transition-colors font-semibold"
                />
              ) : (
                <div className="px-4 py-3 text-sm bg-zinc-50 border border-zinc-100 rounded-xl text-zinc-800 font-semibold">
                  {formData.date_of_birth || "N/A"}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 4: CONTACT ADDRESS */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 relative">
          <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-emerald-500/5 blur-xl pointer-events-none" />
          
          <div className="flex items-center gap-3 border-b border-zinc-200/50 pb-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900">Contact Address</h3>
              <p className="text-xs text-zinc-400 font-light mt-0.5">Permanent dispatch address details</p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Full Address */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Full Address</label>
              {isEditing ? (
                <textarea
                  name="full_address"
                  required
                  rows={3}
                  value={formData.full_address}
                  onChange={handleChange}
                  placeholder="House No, Street name, Area"
                  className="w-full px-4 py-3 text-sm bg-white border border-zinc-200 focus:border-indigo-500/50 rounded-xl outline-none text-zinc-800 transition-colors resize-none"
                />
              ) : (
                <div className="px-4 py-3 text-sm bg-zinc-50 border border-zinc-100 rounded-xl text-zinc-800 font-semibold min-h-[70px]">
                  {formData.full_address || "N/A"}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* City */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">City</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="w-full px-4 py-3 text-sm bg-white border border-zinc-200 focus:border-indigo-500/50 rounded-xl outline-none text-zinc-800 transition-colors"
                  />
                ) : (
                  <div className="px-4 py-3 text-sm bg-zinc-50 border border-zinc-100 rounded-xl text-zinc-800 font-semibold">
                    {formData.city || "N/A"}
                  </div>
                )}
              </div>

              {/* State */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">State</label>
                {isEditing ? (
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
                ) : (
                  <div className="px-4 py-3 text-sm bg-zinc-50 border border-zinc-100 rounded-xl text-zinc-800 font-semibold">
                    {formData.state || "N/A"}
                  </div>
                )}
              </div>

              {/* Pincode */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Pincode</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="pincode"
                    required
                    maxLength={6}
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="Pincode"
                    className="w-full px-4 py-3 text-sm bg-white border border-zinc-200 focus:border-indigo-500/50 rounded-xl outline-none text-zinc-800 transition-colors"
                  />
                ) : (
                  <div className="px-4 py-3 text-sm bg-zinc-50 border border-zinc-100 rounded-xl text-zinc-800 font-semibold">
                    {formData.pincode || "N/A"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Edit Mode Save Button */}
        {isEditing && (
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-full md:w-auto flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 px-8 py-4.5 text-sm font-bold text-white shadow-xl shadow-indigo-500/10 hover:shadow-indigo-500/20 hover:scale-101 active:scale-98 disabled:opacity-50 transition-all cursor-pointer"
            >
              {submitting ? "Saving Changes..." : "Save Changes"}
              <Save className="h-4 w-4" />
            </button>
          </div>
        )}

      </form>
    </div>
  );
}
