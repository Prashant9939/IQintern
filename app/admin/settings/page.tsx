"use client";

import { useEffect, useState } from "react";
import { getPlatformSettings, savePlatformSettings } from "@/lib/supabase/db";
import {
  Settings,
  ToggleLeft,
  ToggleRight,
  Shield,
  CreditCard,
  Mail,
  Wrench,
  Save,
  Clock
} from "lucide-react";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    payments_enabled: true,
    maintenance_mode: false,
  });
  const [assessmentAvailabilityDays, setAssessmentAvailabilityDays] = useState<number>(30);
  const [customDays, setCustomDays] = useState<string>("30");
  const [isCustom, setIsCustom] = useState(false);
  const [attendanceGenerationMode, setAttendanceGenerationMode] = useState<'start_date' | 'completion_date'>('start_date');
  const [holidays, setHolidays] = useState<Array<{ date: string; name: string }>>([]);
  const [newHolidayName, setNewHolidayName] = useState("");
  const [newHolidayDate, setNewHolidayDate] = useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        const s = await getPlatformSettings();
        setSettings({
          payments_enabled: s.payments_enabled ?? true,
          maintenance_mode: false,
        });
        setAttendanceGenerationMode(s.attendance_generation_mode ?? 'start_date');
        setHolidays(s.holidays ?? []);

        const days = s.assessment_availability_days ?? 30;
        if ([7, 15, 30, 45, 60].includes(days)) {
          setAssessmentAvailabilityDays(days);
          setIsCustom(false);
        } else {
          setAssessmentAvailabilityDays(0); // 0 means custom
          setCustomDays(days.toString());
          setIsCustom(true);
        }
      } catch (err) {
        console.error("Error loading settings", err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const daysToSave = isCustom ? Number(customDays) : assessmentAvailabilityDays;
      await savePlatformSettings({
        payments_enabled: settings.payments_enabled,
        assessment_fee: 150, // default fee
        assessment_availability_days: isNaN(daysToSave) || daysToSave <= 0 ? 30 : daysToSave,
        attendance_generation_mode: attendanceGenerationMode,
        holidays: holidays
      });
      alert("Settings saved successfully!");
    } catch (err) {
      console.error("Error saving settings", err);
      alert("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#5B5FF7] border-t-transparent mx-auto" />
          <p className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Loading settings...</p>
        </div>
      </div>
    );
  }

  const settingsItems = [
    {
      title: "Payment Gateway",
      description: "Enable or disable Razorpay payment collection for student assessments.",
      icon: CreditCard,
      color: "bg-[#5B5FF7]/10 text-[#5B5FF7]",
      key: "payments_enabled" as const,
      enabled: settings.payments_enabled,
    },
    {
      title: "Maintenance Mode",
      description: "Put the platform in maintenance mode. Students will see a maintenance page.",
      icon: Wrench,
      color: "bg-amber-500/10 text-amber-500",
      key: "maintenance_mode" as const,
      enabled: settings.maintenance_mode,
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in text-zinc-800 pb-10">
      {/* Page Header */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
        <div>
          <span className="text-[#5B5FF7] text-xs font-bold uppercase tracking-wider">Configuration</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight mt-1">Platform Settings</h2>
          <p className="text-zinc-500 text-sm mt-2 font-light leading-relaxed max-w-xl">
            Manage platform-wide configurations, payment gateway, and maintenance mode.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#5B5FF7] hover:bg-[#4A4EE6] disabled:opacity-50 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-md shadow-[#5B5FF7]/15 transition-all cursor-pointer shrink-0"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </section>

      {/* Settings Cards */}
      <div className="space-y-4">
        {settingsItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.key}
              className="bg-white border border-zinc-150/80 rounded-[20px] p-6 shadow-xs hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`h-12 w-12 rounded-2xl ${item.color} flex items-center justify-center shrink-0`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-zinc-900">{item.title}</h3>
                    <p className="text-xs text-zinc-500 font-light mt-0.5 leading-relaxed">{item.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSettings(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                  className="shrink-0 cursor-pointer transition-colors"
                >
                  {item.enabled ? (
                    <ToggleRight className="h-8 w-8 text-[#5B5FF7]" />
                  ) : (
                    <ToggleLeft className="h-8 w-8 text-zinc-300" />
                  )}
                </button>
              </div>
            </div>
          );
        })}

        {/* Assessment Availability Setting Card */}
        <div className="bg-white border border-zinc-150/80 rounded-[20px] p-6 shadow-xs hover:shadow-md transition-all duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4 min-w-0">
              <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 text-[#5B5FF7] flex items-center justify-center shrink-0">
                <Clock className="h-6 w-6" />
              </div>
              <div className="min-w-0 text-left">
                <h3 className="text-sm font-bold text-zinc-900">Assessment Availability Window</h3>
                <p className="text-xs text-zinc-500 font-light mt-0.5 leading-relaxed">
                  Configure how many days after registration a student becomes eligible to take their assessment.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto shrink-0 justify-start sm:justify-end">
              <select
                value={isCustom ? "custom" : assessmentAvailabilityDays}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "custom") {
                    setIsCustom(true);
                  } else {
                    setIsCustom(false);
                    setAssessmentAvailabilityDays(Number(val));
                  }
                }}
                className="px-3.5 py-2.5 text-xs bg-white border border-zinc-200 focus:border-indigo-500/50 rounded-xl outline-none text-zinc-800 transition-colors cursor-pointer min-w-[120px]"
              >
                <option value={7}>7 Days</option>
                <option value={15}>15 Days</option>
                <option value={30}>30 Days</option>
                <option value={45}>45 Days</option>
                <option value={60}>60 Days</option>
                <option value="custom">Custom Value</option>
              </select>

              {isCustom && (
                <div className="flex items-center gap-1.5 animate-fade-in w-full sm:w-auto">
                  <input
                    type="number"
                    min={1}
                    value={customDays}
                    onChange={(e) => setCustomDays(e.target.value)}
                    className="px-3.5 py-2.5 text-xs bg-white border border-zinc-200 focus:border-indigo-500/50 rounded-xl outline-none text-zinc-800 transition-colors w-24"
                    placeholder="Days"
                  />
                  <span className="text-xs text-zinc-500 font-bold">Days</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Attendance Settings Card */}
        <div className="bg-white border border-zinc-150/80 rounded-[20px] p-6 shadow-xs hover:shadow-md transition-all duration-300">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 text-[#5B5FF7] flex items-center justify-center shrink-0">
                <Clock className="h-6 w-6" />
              </div>
              <div className="text-left">
                <h3 className="text-sm font-bold text-zinc-900">Attendance Sheet Settings</h3>
                <p className="text-xs text-zinc-500 font-light mt-0.5 leading-relaxed">
                  Configure attendance dates generation mode and public holiday exclusions.
                </p>
              </div>
            </div>

            {/* Generation Mode Select */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-zinc-100">
              <div className="text-left">
                <span className="text-xs font-bold text-zinc-800">Generation Mode</span>
                <p className="text-[11px] text-zinc-400 font-light">Determine if attendance log is calculated from start date or completions backward.</p>
              </div>
              <select
                value={attendanceGenerationMode}
                onChange={(e) => setAttendanceGenerationMode(e.target.value as 'start_date' | 'completion_date')}
                className="px-3 py-2 text-xs bg-white border border-zinc-200 focus:border-indigo-500/50 rounded-xl outline-none text-zinc-800 transition-colors cursor-pointer min-w-[220px]"
              >
                <option value="start_date">Start Date Mode (Default)</option>
                <option value="completion_date">Completion Date Mode (Backdated)</option>
              </select>
            </div>

            {/* Holiday Configuration */}
            <div className="space-y-4 pt-4 border-t border-zinc-100">
              <div className="text-left">
                <span className="text-xs font-bold text-zinc-800">Centralized Holiday Exclusions</span>
                <p className="text-[11px] text-zinc-400 font-light">Sundays are automatically excluded. Configure additional public/festival holidays below.</p>
              </div>

              {/* Holiday List Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {holidays.map((h, index) => (
                  <div key={index} className="flex items-center justify-between bg-zinc-50 border border-zinc-150 rounded-xl px-3 py-2 text-xs">
                    <div className="text-left">
                      <span className="font-bold text-zinc-800">{h.name}</span>
                      <span className="block text-[10px] text-zinc-400 mt-0.5">{h.date}</span>
                    </div>
                    <button
                      onClick={() => setHolidays(prev => prev.filter((_, idx) => idx !== index))}
                      className="text-red-500 hover:text-red-700 font-bold px-1.5 py-0.5 rounded hover:bg-red-50 cursor-pointer text-[10px]"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Holiday Form */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <input
                  type="text"
                  placeholder="Holiday Name (e.g. Diwali)"
                  value={newHolidayName}
                  onChange={(e) => setNewHolidayName(e.target.value)}
                  className="px-3.5 py-2.5 text-xs bg-white border border-zinc-200 focus:border-indigo-500/50 rounded-xl outline-none text-zinc-800 transition-colors w-full sm:flex-1"
                />
                <input
                  type="date"
                  value={newHolidayDate}
                  onChange={(e) => setNewHolidayDate(e.target.value)}
                  className="px-3.5 py-2.5 text-xs bg-white border border-zinc-200 focus:border-indigo-500/50 rounded-xl outline-none text-zinc-800 transition-colors w-full sm:w-auto"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!newHolidayName.trim() || !newHolidayDate) {
                      alert("Please specify both holiday name and date.");
                      return;
                    }
                    if (holidays.some(h => h.date === newHolidayDate)) {
                      alert("A holiday for this date is already configured.");
                      return;
                    }
                    setHolidays(prev => [...prev, { name: newHolidayName.trim(), date: newHolidayDate }].sort((a, b) => a.date.localeCompare(b.date)));
                    setNewHolidayName("");
                    setNewHolidayDate("");
                  }}
                  className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200/50 hover:border-indigo-300 text-xs font-bold rounded-xl transition-all cursor-pointer w-full sm:w-auto text-center"
                >
                  + Add Holiday
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Info */}
      <div className="bg-white border border-zinc-150/80 rounded-[20px] p-6 shadow-xs">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-900">Security & Access</h3>
            <p className="text-xs text-zinc-500 font-light mt-0.5">Platform security overview</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-50 border border-zinc-150/80 rounded-xl p-4 text-center">
            <p className="text-2xl font-extrabold text-zinc-900">RLS</p>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-1">Row Level Security</p>
            <span className="inline-flex items-center gap-1 mt-2 bg-emerald-100 text-emerald-700 text-[9px] font-bold px-2 py-0.5 rounded-full">Active</span>
          </div>
          <div className="bg-slate-50 border border-zinc-150/80 rounded-xl p-4 text-center">
            <p className="text-2xl font-extrabold text-zinc-900">AES-256</p>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-1">Encryption</p>
            <span className="inline-flex items-center gap-1 mt-2 bg-emerald-100 text-emerald-700 text-[9px] font-bold px-2 py-0.5 rounded-full">Enabled</span>
          </div>
          <div className="bg-slate-50 border border-zinc-150/80 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-1">
              <Mail className="h-4 w-4 text-[#5B5FF7]" />
              <p className="text-sm font-extrabold text-zinc-900">OTP Auth</p>
            </div>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-1">Phone Verification</p>
            <span className="inline-flex items-center gap-1 mt-2 bg-emerald-100 text-emerald-700 text-[9px] font-bold px-2 py-0.5 rounded-full">Enabled</span>
          </div>
        </div>
      </div>

      {/* Platform Info */}
      <div className="bg-white border border-zinc-150/80 rounded-[20px] p-6 shadow-xs">
        <h3 className="text-sm font-bold text-zinc-900 mb-4 flex items-center gap-2">
          <Settings className="h-4 w-4 text-[#5B5FF7]" />
          Platform Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="flex justify-between border-b border-zinc-100 pb-2">
            <span className="text-zinc-500 font-medium">Platform Version</span>
            <span className="text-zinc-900 font-bold">v2.0.0</span>
          </div>
          <div className="flex justify-between border-b border-zinc-100 pb-2">
            <span className="text-zinc-500 font-medium">Framework</span>
            <span className="text-zinc-900 font-bold">Next.js 15</span>
          </div>
          <div className="flex justify-between border-b border-zinc-100 pb-2">
            <span className="text-zinc-500 font-medium">Database</span>
            <span className="text-zinc-900 font-bold">Supabase PostgreSQL</span>
          </div>
          <div className="flex justify-between border-b border-zinc-100 pb-2">
            <span className="text-zinc-500 font-medium">Payment Gateway</span>
            <span className="text-zinc-900 font-bold">Razorpay</span>
          </div>
        </div>
      </div>
    </div>
  );
}
