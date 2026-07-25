"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { signUpUser, loginUser } from "@/lib/supabase/auth";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getUniversities, type University } from "@/lib/supabase/db";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ------------------------------------------------------------------ */
/*  Types & Constants                                                  */
/* ------------------------------------------------------------------ */

interface FormData {
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
  dateOfBirth: string;
  gender: string;
  university: string;
  college: string;
  course: string;
  departmentStream: string;
  semester: string;
  batch: string;
  rollNumber: string;
  registrationNumber: string;
  address: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  emergencyContactRelation: string;
  documentId: string;
  agreedTerms: boolean;
  agreedUpdates: boolean;
}

const INITIAL_FORM: FormData = {
  fullName: "",
  phoneNumber: "",
  email: "",
  password: "",
  dateOfBirth: "",
  gender: "",
  university: "",
  college: "",
  course: "",
  departmentStream: "",
  semester: "",
  batch: "",
  rollNumber: "",
  registrationNumber: "",
  address: "",
  emergencyContactName: "",
  emergencyContactNumber: "",
  emergencyContactRelation: "",
  documentId: "",
  agreedTerms: false,
  agreedUpdates: false,
};

// 4-step form configuration
const STEP_META = [
  { id: 1, label: "Account", title: "Register Your Profile", subtitle: "Step 1 of 4", icon: "user" },
  { id: 2, label: "Academic", title: "Register Your Profile", subtitle: "Step 2 of 4", icon: "book" },
  { id: 3, label: "Contact", title: "Register Your Profile", subtitle: "Step 3 of 4", icon: "phone" },
  { id: 4, label: "Security", title: "Register Your Profile", subtitle: "Step 4 of 4", icon: "lock" },
];

const BATCH_OPTIONS = ["2022-26", "2023-27", "2024-28", "2025-29", "Other"];
const SEMESTER_OPTIONS = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];
const RELATION_OPTIONS = ["Father", "Mother", "Brother", "Sister", "Guardian", "Other"];
const BRANCH_OPTIONS = [
  "UG", "PG", "Diploma", "PhD", "Other",
];
const COURSE_OPTIONS = [
  { value: "B.Tech/BE", label: "B.Tech/BE" },
  { value: "BCA", label: "BCA" },
  { value: "BSC", label: "B.Sc Computer Science" },
  { value: "BBA", label: "BBA" },
  { value: "BCOM", label: "B.Com" },
  { value: "BA", label: "BA" },
  { value: "MBA", label: "MBA" },
  { value: "MCA", label: "MCA" },
];
const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getPasswordStrength(pass: string) {
  if (!pass) return {
    label: "",
    dots: [false, false, false, false],
    color: "text-zinc-300",
    colorClass: "bg-transparent border-zinc-300",
    checks: { length: false, upper: false, number: false, special: false }
  };

  const checks = {
    length: pass.length >= 7,
    upper: /[A-Z]/.test(pass),
    number: /[0-9]/.test(pass),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(pass),
  };

  const score = Object.values(checks).filter(Boolean).length;

  if (score <= 1) return { label: "Weak", dots: [true, false, false, false], color: "text-red-500", colorClass: "bg-red-500 border-red-500", checks };
  if (score <= 3) return { label: "Medium", dots: [true, true, false, false], color: "text-amber-500", colorClass: "bg-amber-500 border-amber-500", checks };
  return { label: "Strong", dots: [true, true, true, true], color: "text-emerald-500", colorClass: "bg-emerald-500 border-emerald-500", checks };
}

/* ------------------------------------------------------------------ */
/*  Small Reusable Components with Hover Effects                       */
/* ------------------------------------------------------------------ */

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <motion.label
      className="block text-[11px] font-extrabold text-slate-800 tracking-wider uppercase"
      whileHover={{ color: "#f59e0b" }}
      transition={{ duration: 0.2 }}
    >
      {children} *
    </motion.label>
  );
}

function SelectField({
  value, onChange, options, placeholder, disabled = false, icon: Icon,
}: {
  value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[]; placeholder: string;
  disabled?: boolean; icon?: React.ElementType;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.01, boxShadow: "0 4px 14px rgba(0,0,0,0.08)" }}
      transition={{ duration: 0.2 }}
      className="relative"
    >
      {Icon && (
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none transition-all duration-300 group-hover:text-blue-500">
          <Icon className="w-[18px] h-[18px]" />
        </span>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full ${Icon ? "pl-11" : "px-4"} pr-10 py-3.5 text-sm bg-slate-50 border border-slate-300 focus:border-amber-500 focus:ring-[4px] focus:ring-amber-500/15 rounded-2xl outline-none text-slate-800 transition-all duration-300 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed custom-select hover:border-blue-400 hover:bg-white hover:shadow-lg`}
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`, backgroundPosition: "right 0.75rem center", backgroundRepeat: "no-repeat", backgroundSize: "1.25rem" }}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </motion.div>
  );
}

function Checkbox({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: React.ReactNode }) {
  return (
    <motion.label
      className="flex items-start gap-2.5 cursor-pointer group"
      whileHover={{ x: 4, backgroundColor: "rgba(245, 158, 11, 0.05)" }}
      transition={{ type: "spring", stiffness: 400 }}
      style={{ borderRadius: "12px", padding: "8px 12px" }}
    >
      <div className="relative flex items-center justify-center shrink-0 mt-0.5">
        <input type="checkbox" className="peer sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <motion.div
          role="checkbox"
          aria-checked={checked}
          className={`h-5 w-5 rounded-md border-2 transition-all ${checked ? "bg-amber-500 border-amber-500 shadow-lg shadow-amber-500/30" : "border-slate-300 bg-white group-hover:border-amber-400 group-hover:shadow-md"
            }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {checked && (
            <motion.svg
              className="w-3 h-3 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={4}
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 500, delay: 0.1 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </motion.svg>
          )}
        </motion.div>
      </div>
      <span className="text-xs text-slate-600 font-medium leading-normal group-hover:text-slate-800 transition-colors">{children}</span>
    </motion.label>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function Register() {
  const [step, setStep] = useState(1);
  const [universities, setUniversities] = useState<University[]>([]);
  const [colleges, setColleges] = useState<string[]>([]);
  const [isMockMode, setIsMockMode] = useState(false);
  const [customUniversity, setCustomUniversity] = useState("");
  const [customCollege, setCustomCollege] = useState("");
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  // DOB state for separate selects
  const [dobDay, setDobDay] = useState("");
  const [dobMonth, setDobMonth] = useState("");
  const [dobYear, setDobYear] = useState("");

  // Track hovered field for icon animations
  const [hoveredField, setHoveredField] = useState<string | null>(null);

  /* ---- derived ---- */
  const passwordStrength = useMemo(() => getPasswordStrength(formData.password), [formData.password]);

  const progressPercentage = useMemo(() => {
    let filled = 0;
    const total = 17; // Updated total (removed address)

    if (formData.fullName.trim()) filled++;
    if (formData.phoneNumber.trim()) filled++;
    if (formData.email.trim()) filled++;
    if (formData.password.trim()) filled++;
    if (formData.dateOfBirth.trim()) filled++;
    if (formData.university) { if (formData.university === "Other" ? customUniversity.trim() : true) filled++; }
    if (formData.college) { if (formData.college === "Other" ? customCollege.trim() : true) filled++; }
    if (formData.course.trim()) filled++;
    if (formData.departmentStream.trim()) filled++;
    if (formData.semester.trim()) filled++;
    if (formData.batch.trim()) filled++;
    if (formData.rollNumber.trim()) filled++;
    if (formData.registrationNumber.trim()) filled++;
    if (formData.emergencyContactName.trim()) filled++;
    if (formData.emergencyContactNumber.trim()) filled++;
    if (formData.emergencyContactRelation.trim()) filled++;
    if (formData.agreedTerms) filled++;

    return Math.round((filled / total) * 100);
  }, [formData, customUniversity, customCollege]);

  /* ---- effects ---- */
  useEffect(() => {
    setIsMockMode(!isSupabaseConfigured());
  }, []);

  useEffect(() => {
    async function loadUniversities() {
      try {
        setUniversities(await getUniversities());
      } catch (err) {
        console.error("Failed to load universities:", err);
      }
    }
    loadUniversities();
  }, []);

  useEffect(() => {
    if (!formData.university) {
      setColleges([]);
      return;
    }
    if (formData.university === "Other") {
      setColleges([]);
      setFormData((p) => ({ ...p, college: "Other" }));
    } else {
      const found = universities.find((u) => u.name === formData.university);
      setColleges(found ? found.colleges : []);
      setFormData((p) => ({ ...p, college: "" }));
    }
  }, [formData.university, universities]);

  /* ---- helpers ---- */
  const updateForm = useCallback(<K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  }, []);

  // Handle DOB change from separate selects
  const handleDOBChange = useCallback((type: 'day' | 'month' | 'year', value: string) => {
    let newDay = dobDay;
    let newMonth = dobMonth;
    let newYear = dobYear;

    if (type === 'day') newDay = value;
    if (type === 'month') newMonth = value;
    if (type === 'year') newYear = value;

    // Update local state
    if (type === 'day') setDobDay(value);
    if (type === 'month') setDobMonth(value);
    if (type === 'year') setDobYear(value);

    // Combine when all three are selected
    if (newDay && newMonth && newYear) {
      updateForm('dateOfBirth', `${newYear}-${newMonth.padStart(2, '0')}-${newDay.padStart(2, '0')}`);
    }
  }, [dobDay, dobMonth, dobYear, updateForm]);



  /* ---- validation ---- */
  const validateStep1 = (): boolean => {
    const { fullName, email, phoneNumber, dateOfBirth } = formData;

    if (!fullName || !email || !phoneNumber || !dateOfBirth) {
      setError("Please fill in all account details.");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }

    const birth = new Date(dateOfBirth);
    if (isNaN(birth.getTime())) {
      setError("Please select a valid Date of Birth.");
      return false;
    }

    const now = new Date();
    if (birth > now) {
      setError("Date of Birth cannot be in the future.");
      return false;
    }

    let age = now.getFullYear() - birth.getFullYear();
    const mDiff = now.getMonth() - birth.getMonth();
    if (mDiff < 0 || (mDiff === 0 && now.getDate() < birth.getDate())) age--;

    if (age < 16) {
      setError("Minimum age requirement is 16 years.");
      return false;
    }

    if (age > 80) {
      setError("Maximum age limit is 80 years.");
      return false;
    }

    setError("");
    return true;
  };

  const validateStep2 = (): boolean => {
    const { university, college, course, departmentStream, semester, batch, rollNumber, registrationNumber } = formData;

    if (!university || !college || !course || !departmentStream || !semester || !batch || !rollNumber || !registrationNumber) {
      setError("Please fill in all academic details.");
      return false;
    }

    if (university === "Other" && !customUniversity.trim()) {
      setError("Please write your University name.");
      return false;
    }

    if (college === "Other" && !customCollege.trim()) {
      setError("Please write your College name.");
      return false;
    }

    setError("");
    return true;
  };

  const validateStep3 = (): boolean => {
    const { emergencyContactName, emergencyContactNumber, emergencyContactRelation } = formData;

    if (!emergencyContactName || !emergencyContactNumber || !emergencyContactRelation) {
      setError("Please fill in all emergency contact details.");
      return false;
    }

    setError("");
    return true;
  };

  const validateStep4 = (): boolean => {
    const { password, agreedTerms } = formData;

    if (!password) {
      setError("Please enter your password.");
      return false;
    }

    if (password.length < 7) {
      setError("Password must be at least 7 characters long.");
      return false;
    }

    if (!confirmPassword) {
      setError("Please confirm your password.");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }

    if (!agreedTerms) {
      setError("You must agree to the Terms and Conditions.");
      return false;
    }

    setError("");
    return true;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
    else if (step === 3 && validateStep3()) setStep(4);
  };

  /* ---- submit ---- */
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step !== 4) return;

    setError("");
    setSuccess("");

    if (!validateStep4()) return;

    setLoading(true);

    try {
      await signUpUser(
        formData.email,
        formData.password,
        formData.fullName,
        formData.phoneNumber,
        formData.college === "Other" ? customCollege : formData.college,
        formData.university === "Other" ? customUniversity : formData.university,
        formData.course,
        formData.semester,
        "", // No address
        formData.documentId || "N/A",
        formData.departmentStream,
        formData.batch,
        formData.rollNumber,
        formData.registrationNumber,
        formData.emergencyContactName,
        formData.emergencyContactNumber,
        formData.emergencyContactRelation,
        formData.agreedTerms,
        formData.agreedUpdates,
        formData.dateOfBirth,
      );

      setSuccess("Account created! Logging you in...");

      await loginUser(formData.email, formData.password);

      setSuccess("Redirecting to payment portal...");

      setTimeout(() => {
        sessionStorage.setItem("iqintern_show_whatsapp_popup_force", "true");
        window.location.href = "/student/payment";
      }, 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Registration failed.";
      setError(msg);
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  /* ---- Render helpers ---- */
  const generateDays = () => Array.from({ length: 31 }, (_, i) => i + 1);
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 50 }, (_, i) => currentYear - 16 - i);
  };

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */
  return (
    <div
      className="min-h-screen flex flex-col justify-between py-10 px-4"
      style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        background: "radial-gradient(circle at top right, #f1f5f9, #e2e8f0)",
      }}
    >
      {/* Google Fonts & FontAwesome */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          
          .form-input-custom {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .form-input-custom:hover {
            background-color: #ffffff;
            border-color: #94a3b8;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08), 0 0 20px rgba(59, 130, 246, 0.1);
            transform: translateY(-1px);
          }
          .form-input-custom:focus {
            background-color: #ffffff;
            border-color: #f59e0b;
            box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.1), 0 0 20px rgba(245, 158, 11, 0.2), 0 4px 12px rgba(245, 158, 11, 0.15);
            outline: none;
            transform: translateY(-1px);
          }
          select.custom-select {
            appearance: none;
          }
          .active-glow-node {
            background: linear-gradient(135deg, #f59e0b, #d97706);
            box-shadow: 0 0 16px rgba(245, 158, 11, 0.65), 0 0 32px rgba(245, 158, 11, 0.3);
            border-color: #f59e0b;
          }
          @keyframes shimmer {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
          .shimmer-border {
            background: linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.4), transparent);
            background-size: 200% 100%;
            animation: shimmer 2s infinite;
          }
          .glow-effect {
            box-shadow: 0 0 20px rgba(245, 158, 11, 0.4), 0 0 40px rgba(245, 158, 11, 0.2);
          }
          .input-icon {
            transition: all 0.3s ease;
          }
          .input-wrapper:hover .input-icon {
            color: #3b82f6;
            transform: scale(1.15);
          }
          @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 10px rgba(245, 158, 11, 0.3); }
            50% { box-shadow: 0 0 25px rgba(245, 158, 11, 0.6), 0 0 40px rgba(245, 158, 11, 0.3); }
          }
          .pulse-glow {
            animation: pulse-glow 2s ease-in-out infinite;
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
          }
          .float-animation {
            animation: float 3s ease-in-out infinite;
          }
        `
      }} />

      {/* Brand Header */}
      <Navbar />

      {/* Main Card */}
      <main className="mt-20 mb-12 w-full max-w-lg mx-auto bg-[#152746] rounded-[32px] shadow-2xl overflow-hidden flex flex-col relative">
        {/* Animated background glow */}
        <motion.div
          className="absolute inset-0 opacity-30 pointer-events-none "
          animate={{
            background: [
              "radial-gradient(circle at 20% 20%, rgba(245, 158, 11, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 20%, rgba(245, 158, 11, 0.1) 0%, transparent 50%)",
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Step Controller Container - Dark Blue Header */}
        <div
          className="p-6 md:p-8 pb-12 relative z-0"
          style={{ background: "linear-gradient(180deg, #223a60 0%, #152746 100%)" }}
        >
          {/* Title & Progress Badge */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xs font-bold tracking-widest text-slate-300 uppercase">Register Your Profile</h2>
              <h3 className="text-sm font-semibold text-white mt-1 uppercase opacity-90">
                Step {step} of {STEP_META.length}
              </h3>
            </div>
            <motion.span
              className="px-3 py-1 text-amber-400 rounded-full text-xs font-bold font-mono tracking-wider"
              style={{
                backgroundColor: "rgba(245, 158, 11, 0.1)",
                borderColor: "rgba(245, 158, 11, 0.3)",
                borderWidth: "1px",
              }}
              animate={progressPercentage > 50 ? {
                boxShadow: [
                  "0 0 10px rgba(245, 158, 11, 0.3)",
                  "0 0 25px rgba(245, 158, 11, 0.6)",
                  "0 0 10px rgba(245, 158, 11, 0.3)"
                ],
                scale: [1, 1.05, 1]
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
              whileHover={{ scale: 1.1 }}
            >
              {progressPercentage}% COMPLETE
            </motion.span>
          </div>

          {/* Stepper Progress Bar */}
          <div className="relative flex items-center justify-between px-2">
            {/* Background Line */}
            <div className="absolute top-[21px] left-0 right-0 h-0.5 bg-slate-700/60 -z-10"></div>

            {/* Active Progress Line */}
            <motion.div
              className="absolute top-[21px] left-0 h-0.5 -z-10 shimmer-border"
              style={{
                width: `${((step - 1) / (STEP_META.length - 1)) * 100}%`,
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />

            {/* Step Nodes */}
            {STEP_META.map((node) => {
              const completed = step > node.id;
              const active = step === node.id;

              return (
                <div key={node.id} className="flex flex-col items-center flex-1">
                  <motion.div
                    whileHover={{ scale: active ? 1.2 : 1.1 }}
                    animate={{
                      scale: active ? 1.15 : 1,
                      rotate: active ? [0, 5, -5, 0] : 0
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                      rotate: { duration: 1.5, repeat: Infinity }
                    }}
                    className={`w-11 h-11 rounded-full border-2 flex items-center justify-center font-bold text-sm transition-all duration-300 ${active
                      ? "border-amber-500 active-glow-node text-white glow-effect"
                      : completed
                        ? "border-amber-500 bg-amber-500 text-white"
                        : "border-slate-600 text-slate-400 bg-[#152746]"
                      }`}
                  >
                    {completed ? (
                      <motion.svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </motion.svg>
                    ) : node.icon === "book" ? (
                      <i className="fa-solid fa-book-open text-xs"></i>
                    ) : node.icon === "phone" ? (
                      <i className="fa-solid fa-mobile-screen-button text-xs"></i>
                    ) : node.icon === "lock" ? (
                      <i className="fa-solid fa-lock text-xs"></i>
                    ) : node.icon === "user" ? (
                      <i className="fa-solid fa-user text-xs"></i>
                    ) : (
                      node.id
                    )}
                  </motion.div>
                  <motion.span
                    className={`text-[11px] font-bold mt-2 tracking-wide uppercase ${active ? "text-amber-500" : completed ? "text-amber-500" : "text-slate-400"
                      }`}
                    animate={active ? {
                      scale: [1, 1.05, 1],
                    } : {}}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    {node.label}
                  </motion.span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Container - White Section */}
        <div className="bg-white rounded-t-[32px] p-6 md:p-8 -mt-5 relative z-10 flex-grow shadow-[0_-8px_30px_rgba(0,0,0,0.15)]">
          <form onSubmit={handleRegister} className="space-y-5">

            {/* Mock Mode Banner */}
            {isMockMode && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3"
                whileHover={{ boxShadow: "0 4px 20px rgba(245, 158, 11, 0.2)" }}
              >
                <motion.svg
                  className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </motion.svg>
                <div className="flex-1">
                  <strong className="text-sm text-amber-800">Developer Mock Mode Active</strong>
                  <p className="text-xs text-amber-600 mt-1">
                    Supabase credentials not loaded. Add <code className="bg-amber-100 px-1 rounded">.env.local</code> and restart.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Error / Success Messages */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  key="err"
                  initial={{ opacity: 0, scale: 0.95, x: -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3"
                >
                  <motion.svg
                    className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    animate={{ x: [0, -3, 3, 0] }}
                    transition={{ duration: 0.3, repeat: 2 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </motion.svg>
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </motion.div>
              )}
              {success && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3"
                >
                  <motion.svg
                    className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, delay: 0.1 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </motion.svg>
                  <p className="text-sm text-emerald-700 font-medium">{success}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* STEP CONTENTS */}
            <div>
              <AnimatePresence mode="wait">

                {/* ==================== STEP 1: ACCOUNT INFO ==================== */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="space-y-5"
                  >
                    {/* Section Header */}
                    <motion.div
                      className="mb-6"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <motion.h3
                        className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-1"
                        whileHover={{ x: 4 }}
                      >
                        <motion.div
                          className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30"
                          whileHover={{ rotate: 15, scale: 1.1, boxShadow: "0 8px 25px rgba(59, 130, 246, 0.4)" }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </motion.div>
                        Personal Information
                      </motion.h3>
                      <p className="text-xs text-slate-500 ml-10">Enter your basic profile details</p>
                    </motion.div>

                    {/* Full Name Field */}
                    <motion.div
                      className="space-y-1 input-wrapper"
                      onHoverStart={() => setHoveredField('fullName')}
                      onHoverEnd={() => setHoveredField(null)}
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FieldLabel>Full Name</FieldLabel>
                      <div className="relative">
                        <motion.span
                          className={`absolute left-4 top-1/2 -translate-y-1/2 input-icon ${hoveredField === 'fullName' ? 'text-blue-500' : 'text-slate-400'}`}
                          animate={hoveredField === 'fullName' ? { scale: 1.15, rotate: [0, -10, 10, 0] } : {}}
                          transition={{ duration: 0.3 }}
                        >
                          <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </motion.span>
                        <input
                          type="text"
                          placeholder="John Doe"
                          value={formData.fullName}
                          onChange={(e) => updateForm("fullName", e.target.value)}
                          className="form-input-custom w-full pl-11 pr-4 py-3.5 text-sm rounded-2xl outline-none"
                        />
                      </div>
                    </motion.div>

                    {/* Email Field */}
                    <motion.div
                      className="space-y-1 input-wrapper"
                      onHoverStart={() => setHoveredField('email')}
                      onHoverEnd={() => setHoveredField(null)}
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FieldLabel>Email Address</FieldLabel>
                      <div className="relative">
                        <motion.span
                          className={`absolute left-4 top-1/2 -translate-y-1/2 input-icon ${hoveredField === 'email' ? 'text-blue-500' : 'text-slate-400'}`}
                          animate={hoveredField === 'email' ? { scale: 1.15 } : {}}
                        >
                          <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </motion.span>
                        <input
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(e) => updateForm("email", e.target.value)}
                          className="form-input-custom w-full pl-11 pr-4 py-3.5 text-sm rounded-2xl outline-none"
                        />
                      </div>
                    </motion.div>

                    {/* Phone Number Field */}
                    <motion.div
                      className="space-y-1 input-wrapper"
                      onHoverStart={() => setHoveredField('phone')}
                      onHoverEnd={() => setHoveredField(null)}
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FieldLabel>Phone Number</FieldLabel>
                      <div className="relative">
                        <motion.span
                          className={`absolute left-4 top-1/2 -translate-y-1/2 input-icon ${hoveredField === 'phone' ? 'text-blue-500' : 'text-slate-400'}`}
                          animate={hoveredField === 'phone' ? { scale: 1.15 } : {}}
                        >
                          <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </motion.span>
                        <input
                          type="tel"
                          placeholder="+91 98765 43210"
                          value={formData.phoneNumber}
                          onChange={(e) => updateForm("phoneNumber", e.target.value)}
                          className="form-input-custom w-full pl-11 pr-4 py-3.5 text-sm rounded-2xl outline-none"
                        />
                      </div>
                    </motion.div>

                    {/* Gender Selection */}
                    <motion.div
                      className="space-y-1"
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FieldLabel>Gender</FieldLabel>
                      <div className="grid grid-cols-3 gap-2">
                        {GENDER_OPTIONS.map((option) => (
                          <motion.button
                            key={option.value}
                            type="button"
                            onClick={() => updateForm("gender", option.value)}
                            className={`py-3 px-4 rounded-xl text-sm font-semibold transition-all ${formData.gender === option.value
                              ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                              }`}
                            whileHover={{ scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            animate={formData.gender === option.value ? {
                              boxShadow: ["0 4px 15px rgba(59, 130, 246, 0.3)", "0 8px 25px rgba(59, 130, 246, 0.4)", "0 4px 15px rgba(59, 130, 246, 0.3)"]
                            } : {}}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            {option.label}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>

                    {/* Date of Birth - Three Selects */}
                    <motion.div
                      className="space-y-1"
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FieldLabel>Date of Birth</FieldLabel>
                      <div className="grid grid-cols-3 gap-2">
                        {/* Day Select */}
                        <motion.select
                          value={dobDay}
                          onChange={(e) => handleDOBChange('day', e.target.value)}
                          className="form-input-custom px-3 py-3 text-sm rounded-xl outline-none cursor-pointer"
                          whileHover={{ scale: 1.02 }}
                          whileFocus={{ boxShadow: "0 0 0 3px rgba(245, 158, 11, 0.2)" }}
                        >
                          <option value="" disabled>Day</option>
                          {generateDays().map((d) => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </motion.select>

                        {/* Month Select */}
                        <motion.select
                          value={dobMonth}
                          onChange={(e) => handleDOBChange('month', e.target.value)}
                          className="form-input-custom px-3 py-3 text-sm rounded-xl outline-none cursor-pointer"
                          whileHover={{ scale: 1.02 }}
                          whileFocus={{ boxShadow: "0 0 0 3px rgba(245, 158, 11, 0.2)" }}
                        >
                          <option value="" disabled>Month</option>
                          {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => (
                            <option key={m} value={String(i + 1).padStart(2, '0')}>{m}</option>
                          ))}
                        </motion.select>

                        {/* Year Select */}
                        <motion.select
                          value={dobYear}
                          onChange={(e) => handleDOBChange('year', e.target.value)}
                          className="form-input-custom px-3 py-3 text-sm rounded-xl outline-none cursor-pointer"
                          whileHover={{ scale: 1.02 }}
                          whileFocus={{ boxShadow: "0 0 0 3px rgba(245, 158, 11, 0.2)" }}
                        >
                          <option value="" disabled>Year</option>
                          {generateYears().map((y) => (
                            <option key={y} value={y}>{y}</option>
                          ))}
                        </motion.select>
                      </div>
                    </motion.div>

                    {/* Next Button */}
                    <motion.div className="pt-4">
                      <motion.button
                        type="button"
                        onClick={handleNextStep}
                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-sm tracking-wide shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
                        whileHover={{
                          scale: 1.02,
                          boxShadow: "0 8px 30px rgba(37, 99, 235, 0.4)",
                          background: "linear-gradient(to right, #2563eb, #1d4ed8)"
                        }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                      >
                        Continue to Academic Details
                        <motion.svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </motion.svg>
                      </motion.button>
                    </motion.div>
                  </motion.div>
                )}

                {/* ==================== STEP 2: ACADEMIC DETAILS ==================== */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="space-y-5"
                  >
                    {/* Section Header */}
                    <motion.div className="mb-6">
                      <motion.h3
                        className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-1"
                        whileHover={{ x: 4 }}
                      >
                        <motion.div
                          className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30"
                          whileHover={{ rotate: 15, scale: 1.1, boxShadow: "0 8px 25px rgba(147, 51, 234, 0.4)" }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.828 4.902 9.15 4 7.375 4S3.922 4.902 3.375 6.253m15 13C18.172 19.098 16.45 20 14.675 20s-3.277-.902-3.825-2.247m0-13C9.078 4.098 7.35 3 5.575 3S2.078 4.098 1.525 5.753m15 13c.922.79 1.475 1.962 1.475 3.25v.001m-16.95 0v-.001c0-1.288.553-2.46 1.475-3.25M3.375 8.25C4.902 7.114 6.95 6.5 9.125 6.5s4.223.614 5.75 1.75m-11.55 0c.922.79 1.475 1.962 1.475 3.25v.001m-1.45 0v-.001c0-1.288.527-2.47 1.402-3.269" />
                          </svg>
                        </motion.div>
                        Academic Information
                      </motion.h3>
                      <p className="text-xs text-slate-500 ml-10">Tell us about your education</p>
                    </motion.div>

                    {/* University Dropdown */}
                    <SelectField
                      value={formData.university}
                      onChange={(v) => updateForm("university", v)}
                      options={[
                        ...universities.map((u) => ({ value: u.name, label: u.name })),
                        { value: "Other", label: "Other (Not Listed)" },
                      ]}
                      placeholder="Select University"
                    />

                    {/* Custom University Input */}
                    {formData.university === "Other" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-1"
                      >
                        <FieldLabel>University Name</FieldLabel>
                        <motion.input
                          type="text"
                          placeholder="Enter university name"
                          value={customUniversity}
                          onChange={(e) => setCustomUniversity(e.target.value)}
                          className="form-input-custom w-full px-4 py-3.5 text-sm rounded-2xl outline-none"
                          whileFocus={{ boxShadow: "0 0 0 4px rgba(147, 51, 234, 0.15)" }}
                        />
                      </motion.div>
                    )}

                    {/* College Dropdown */}
                    <SelectField
                      value={formData.college}
                      onChange={(v) => updateForm("college", v)}
                      options={[
                        ...colleges.map((c) => ({ value: c, label: c })),
                        ...(formData.university !== "Other" ? [{ value: "Other", label: "Other (Not Listed)" }] : []),
                      ]}
                      placeholder="Select College"
                      disabled={!formData.university || colleges.length === 0}
                    />

                    {/* Custom College Input */}
                    {formData.college === "Other" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-1"
                      >
                        <FieldLabel>College Name</FieldLabel>
                        <motion.input
                          type="text"
                          placeholder="Enter college name"
                          value={customCollege}
                          onChange={(e) => setCustomCollege(e.target.value)}
                          className="form-input-custom w-full px-4 py-3.5 text-sm rounded-2xl outline-none"
                          whileFocus={{ boxShadow: "0 0 0 4px rgba(147, 51, 234, 0.15)" }}
                        />
                      </motion.div>
                    )}

                    {/* Course & Branch Row */}
                    <div className="grid grid-cols-2 gap-3">
                      <motion.div className="space-y-1" whileHover={{ y: -2 }}>
                        <FieldLabel>Course</FieldLabel>
                        <SelectField
                          value={formData.course}
                          onChange={(v) => updateForm("course", v)}
                          options={COURSE_OPTIONS}
                          placeholder="Select Course"
                        />
                      </motion.div>

                      <motion.div className="space-y-1" whileHover={{ y: -2 }}>
                        <FieldLabel>Branch / Stream</FieldLabel>
                        <SelectField
                          value={formData.departmentStream}
                          onChange={(v) => updateForm("departmentStream", v)}
                          options={BRANCH_OPTIONS.map((b) => ({ value: b, label: b }))}
                          placeholder="Select Branch"
                        />
                      </motion.div>
                    </div>

                    {/* Semester & Batch Row */}
                    <div className="grid grid-cols-2 gap-3">
                      <motion.div className="space-y-1" whileHover={{ y: -2 }}>
                        <FieldLabel>Semester</FieldLabel>
                        <SelectField
                          value={formData.semester}
                          onChange={(v) => updateForm("semester", v)}
                          options={SEMESTER_OPTIONS.map((s) => ({ value: s, label: s }))}
                          placeholder="Semester"
                        />
                      </motion.div>

                      <motion.div className="space-y-1" whileHover={{ y: -2 }}>
                        <FieldLabel>Batch</FieldLabel>
                        <SelectField
                          value={formData.batch}
                          onChange={(v) => updateForm("batch", v)}
                          options={BATCH_OPTIONS.map((b) => ({ value: b, label: b }))}
                          placeholder="Batch Year"
                        />
                      </motion.div>
                    </div>

                    {/* Roll Number & Registration Number */}
                    <div className="grid grid-cols-2 gap-3">
                      <motion.div
                        className="space-y-1 input-wrapper"
                        onHoverStart={() => setHoveredField('rollNo')}
                        onHoverEnd={() => setHoveredField(null)}
                        whileHover={{ y: -2 }}
                      >
                        <FieldLabel>Roll Number</FieldLabel>
                        <div className="relative">
                          <motion.span
                            className={`absolute left-3 top-1/2 -translate-y-1/2 input-icon text-sm ${hoveredField === 'rollNo' ? 'text-purple-500' : 'text-slate-400'}`}
                            animate={hoveredField === 'rollNo' ? { scale: 1.15 } : {}}
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                            </svg>
                          </motion.span>
                          <input
                            type="text"
                            placeholder="CS123"
                            value={formData.rollNumber}
                            onChange={(e) => updateForm("rollNumber", e.target.value)}
                            className="form-input-custom w-full pl-9 pr-3 py-3.5 text-sm rounded-2xl outline-none"
                          />
                        </div>
                      </motion.div>

                      <motion.div
                        className="space-y-1 input-wrapper"
                        onHoverStart={() => setHoveredField('regNo')}
                        onHoverEnd={() => setHoveredField(null)}
                        whileHover={{ y: -2 }}
                      >
                        <FieldLabel>Registration No.</FieldLabel>
                        <div className="relative">
                          <motion.span
                            className={`absolute left-3 top-1/2 -translate-y-1/2 input-icon text-sm ${hoveredField === 'regNo' ? 'text-purple-500' : 'text-slate-400'}`}
                            animate={hoveredField === 'regNo' ? { scale: 1.15 } : {}}
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </motion.span>
                          <input
                            type="text"
                            placeholder="REG2024001"
                            value={formData.registrationNumber}
                            onChange={(e) => updateForm("registrationNumber", e.target.value)}
                            className="form-input-custom w-full pl-9 pr-3 py-3.5 text-sm rounded-2xl outline-none"
                          />
                        </div>
                      </motion.div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex gap-3 pt-4">
                      <motion.button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex-1 py-4 rounded-2xl bg-slate-100 text-slate-600 font-bold text-sm tracking-wide flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.02, backgroundColor: "#e2e8f0" }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        Back
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={handleNextStep}
                        className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold text-sm tracking-wide shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2"
                        whileHover={{
                          scale: 1.02,
                          boxShadow: "0 8px 30px rgba(147, 51, 234, 0.4)"
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Continue
                        <motion.svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </motion.svg>
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* ==================== STEP 3: EMERGENCY CONTACT ==================== */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="space-y-5"
                  >
                    {/* Section Header */}
                    <motion.div className="mb-6">
                      <motion.h3
                        className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-1"
                        whileHover={{ x: 4 }}
                      >
                        <motion.div
                          className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center"
                          whileHover={{ rotate: 15, scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </motion.div>
                        Emergency Contact
                      </motion.h3>
                      <p className="text-xs text-slate-500 ml-10">Provide an emergency contact person</p>
                    </motion.div>

                    {/* Emergency Contact Name */}
                    <motion.div
                      className="space-y-1 input-wrapper"
                      onHoverStart={() => setHoveredField('emergencyName')}
                      onHoverEnd={() => setHoveredField(null)}
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FieldLabel>Emergency Contact Name</FieldLabel>
                      <div className="relative">
                        <motion.span
                          className={`absolute left-4 top-1/2 -translate-y-1/2 input-icon ${hoveredField === 'emergencyName' ? 'text-orange-500' : 'text-slate-400'}`}
                          animate={hoveredField === 'emergencyName' ? { scale: 1.15 } : {}}
                        >
                          <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </motion.span>
                        <input
                          type="text"
                          placeholder="Parent/Guardian Name"
                          value={formData.emergencyContactName}
                          onChange={(e) => updateForm("emergencyContactName", e.target.value)}
                          className="form-input-custom w-full pl-11 pr-4 py-3.5 text-sm rounded-2xl outline-none"
                        />
                      </div>
                    </motion.div>

                    {/* Emergency Contact Phone */}
                    <motion.div
                      className="space-y-1 input-wrapper"
                      onHoverStart={() => setHoveredField('emergencyPhone')}
                      onHoverEnd={() => setHoveredField(null)}
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FieldLabel>Emergency Contact Phone</FieldLabel>
                      <div className="relative">
                        <motion.span
                          className={`absolute left-4 top-1/2 -translate-y-1/2 input-icon ${hoveredField === 'emergencyPhone' ? 'text-orange-500' : 'text-slate-400'}`}
                          animate={hoveredField === 'emergencyPhone' ? { scale: 1.15 } : {}}
                        >
                          <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </motion.span>
                        <input
                          type="tel"
                          placeholder="+91 98765 43210"
                          value={formData.emergencyContactNumber}
                          onChange={(e) => updateForm("emergencyContactNumber", e.target.value)}
                          className="form-input-custom w-full pl-11 pr-4 py-3.5 text-sm rounded-2xl outline-none"
                        />
                      </div>
                    </motion.div>

                    {/* Emergency Contact Relation */}
                    <motion.div
                      className="space-y-1"
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FieldLabel>Relationship</FieldLabel>
                      <SelectField
                        value={formData.emergencyContactRelation}
                        onChange={(v) => updateForm("emergencyContactRelation", v)}
                        options={RELATION_OPTIONS.map((r) => ({ value: r, label: r }))}
                        placeholder="Select Relationship"
                      />
                    </motion.div>

                    {/* Navigation Buttons */}
                    <div className="flex gap-3 pt-4">
                      <motion.button
                        type="button"
                        onClick={() => setStep(2)}
                        className="flex-1 py-4 rounded-2xl bg-slate-100 text-slate-600 font-bold text-sm tracking-wide flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.02, backgroundColor: "#e2e8f0" }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        Back
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={handleNextStep}
                        className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2"
                        whileHover={{
                          scale: 1.02,
                          boxShadow: "0 8px 30px rgba(245, 158, 11, 0.4)"
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Continue to Security
                        <motion.svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </motion.svg>
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* ==================== STEP 4: PASSWORD & TERMS (NEW!) ==================== */}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="space-y-5"
                  >
                    {/* Section Header */}
                    <motion.div className="mb-6">
                      <motion.h3
                        className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-1"
                        whileHover={{ x: 4 }}
                      >
                        <motion.div
                          className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30 pulse-glow"
                          whileHover={{ rotate: 15, scale: 1.1, boxShadow: "0 8px 25px rgba(16, 185, 129, 0.5)" }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </motion.div>
                        Security Setup
                      </motion.h3>
                      <p className="text-xs text-slate-500 ml-10">Create a secure password for your account</p>
                    </motion.div>

                    {/* Password Field */}
                    <motion.div
                      className="space-y-1 input-wrapper"
                      onHoverStart={() => setHoveredField('password')}
                      onHoverEnd={() => setHoveredField(null)}
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FieldLabel>Create Password</FieldLabel>
                      <div className="relative">
                        <motion.span
                          className={`absolute left-4 top-1/2 -translate-y-1/2 input-icon ${hoveredField === 'password' ? 'text-green-500' : 'text-slate-400'}`}
                          animate={hoveredField === 'password' ? { scale: 1.15 } : {}}
                        >
                          <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </motion.span>
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Min 7 characters with mix of letters, numbers & symbols"
                          value={formData.password}
                          onChange={(e) => updateForm("password", e.target.value)}
                          className="form-input-custom w-full pl-11 pr-12 py-3.5 text-sm rounded-2xl outline-none"
                        />
                        <motion.button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-green-500 p-1"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {showPassword ? (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </motion.button>
                      </div>

                      {/* Password Strength Indicator */}
                      {formData.password && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 space-y-2"
                        >
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1.5">
                              {passwordStrength.dots.map((filled, i) => (
                                <motion.div
                                  key={i}
                                  className={`h-1.5 w-8 rounded-full ${filled ? passwordStrength.colorClass : 'bg-slate-200'}`}
                                  initial={{ scaleX: 0 }}
                                  animate={{ scaleX: 1 }}
                                  transition={{ delay: i * 0.1 }}
                                />
                              ))}
                            </div>
                            <motion.span
                              className={`text-xs font-bold ${passwordStrength.color}`}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                            >
                              {passwordStrength.label}
                            </motion.span>
                          </div>

                          {/* Password Requirements Checklist */}
                          <div className="grid grid-cols-2 gap-1 pt-1">
                            {[
                              { label: "7+ characters", check: passwordStrength.checks.length },
                              { label: "Uppercase letter", check: passwordStrength.checks.upper },
                              { label: "Number", check: passwordStrength.checks.number },
                              { label: "Special character", check: passwordStrength.checks.special },
                            ].map((req) => (
                              <motion.div
                                key={req.label}
                                className={`flex items-center gap-1.5 text-xs ${req.check ? 'text-emerald-600' : 'text-slate-400'}`}
                                animate={req.check ? { x: [0, 3, 0] } : {}}
                                transition={{ duration: 0.3 }}
                              >
                                <motion.svg
                                  className="w-3.5 h-3.5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={3}
                                  initial={{ scale: 0 }}
                                  animate={{ scale: req.check ? 1 : 0 }}
                                  transition={{ type: "spring", stiffness: 500 }}
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </motion.svg>
                                {req.label}
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </motion.div>

                    {/* Confirm Password Field */}
                    <motion.div
                      className="space-y-1 input-wrapper"
                      onHoverStart={() => setHoveredField('confirmPassword')}
                      onHoverEnd={() => setHoveredField(null)}
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FieldLabel>Confirm Password</FieldLabel>
                      <div className="relative">
                        <motion.span
                          className={`absolute left-4 top-1/2 -translate-y-1/2 input-icon ${hoveredField === 'confirmPassword' ? 'text-green-500' : 'text-slate-400'}`}
                          animate={hoveredField === 'confirmPassword' ? { scale: 1.15 } : {}}
                        >
                          <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </motion.span>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Re-enter your password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="form-input-custom w-full pl-11 pr-12 py-3.5 text-sm rounded-2xl outline-none"
                        />
                        <motion.button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-green-500 p-1"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {showConfirmPassword ? (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </motion.button>
                      </div>

                      {/* Password Match Indicator */}
                      {confirmPassword && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex items-center gap-1.5 mt-2 text-xs font-medium ${confirmPassword === formData.password
                            ? 'text-emerald-600'
                            : 'text-red-500'
                            }`}
                        >
                          <motion.svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                            animate={{
                              scale: confirmPassword === formData.password ? [1, 1.2, 1] : [1, 1.1, 1],
                              rotate: confirmPassword === formData.password ? 0 : [0, -10, 10, 0]
                            }}
                            transition={{ duration: 0.4 }}
                          >
                            {confirmPassword === formData.password ? (
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            )}
                          </motion.svg>
                          {confirmPassword === formData.password ? 'Passwords match!' : 'Passwords do not match'}
                        </motion.div>
                      )}
                    </motion.div>

                    {/* Terms & Conditions Checkboxes */}
                    <motion.div
                      className="space-y-3 pt-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Checkbox
                        checked={formData.agreedTerms}
                        onChange={(v) => updateForm("agreedTerms", v)}
                      >
                        I agree to the{" "}
                        <Link href="/terms" className="text-blue-600 hover:text-blue-700 underline font-semibold">
                          Terms & Conditions
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-blue-600 hover:text-blue-700 underline font-semibold">
                          Privacy Policy
                        </Link>
                      </Checkbox>

                      <Checkbox
                        checked={formData.agreedUpdates}
                        onChange={(v) => updateForm("agreedUpdates", v)}
                      >
                        Send me updates about internships, workshops, and opportunities via WhatsApp & Email
                      </Checkbox>
                    </motion.div>

                    {/* Navigation Buttons */}
                    <div className="flex gap-3 pt-4">
                      <motion.button
                        type="button"
                        onClick={() => setStep(3)}
                        className="flex-1 py-4 rounded-2xl bg-slate-100 text-slate-600 font-bold text-sm tracking-wide flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.02, backgroundColor: "#e2e8f0" }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        Back
                      </motion.button>
                      <motion.button
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold text-sm tracking-wide shadow-lg shadow-green-500/25 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        whileHover={!loading ? {
                          scale: 1.02,
                          boxShadow: "0 8px 30px rgba(16, 185, 129, 0.4)",
                          background: "linear-gradient(to right, #10b981, #059669)"
                        } : {}}
                        whileTap={!loading ? { scale: 0.98 } : {}}
                        animate={loading ? {
                          boxShadow: [
                            "0 4px 14px rgba(21, 39, 70, 0.3)",
                            "0 6px 20px rgba(21, 39, 70, 0.4)",
                            "0 4px 14px rgba(21, 39, 70, 0.3)"
                          ]
                        } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Creating Account...
                          </>
                        ) : (
                          <>
                            <motion.span
                              className="relative z-10"
                              whileHover={{ scale: 1.05 }}
                            >
                              Create Account
                            </motion.span>
                            <motion.svg
                              className="w-3.5 h-3.5 relative z-10"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                              animate={{ x: [0, 4, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </motion.svg>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

          </form>
        </div>

      </main>

      {/* Footer */}
      <Footer />

      {/* FontAwesome CDN */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    </div>
  );
}
