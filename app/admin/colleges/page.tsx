"use client";

import { useEffect, useState } from "react";
import { getUniversities, saveUniversities, University } from "@/lib/supabase/db";
import { 
  GraduationCap, 
  Building, 
  Plus, 
  Trash2, 
  Save, 
  AlertCircle, 
  CheckCircle,
  X
} from "lucide-react";

export default function ManageColleges() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // New University state
  const [newUnivName, setNewUnivName] = useState("");

  // New College state map: { [univName]: newCollegeName }
  const [newCollegeNames, setNewCollegeNames] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getUniversities();
        setUniversities(data);
      } catch (err) {
        console.error("Failed to load universities", err);
        setError("Failed to load college and university lists from database.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleAddUniversity = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newUnivName.trim();
    if (!name) return;

    if (universities.some((u) => u.name.toLowerCase() === name.toLowerCase())) {
      setError("A university with this name already exists.");
      return;
    }

    setError("");
    setSuccess("");
    const updated = [...universities, { name, colleges: [] }];
    setUniversities(updated);
    setNewUnivName("");
  };

  const handleRemoveUniversity = (univName: string) => {
    if (!confirm(`Are you sure you want to delete "${univName}"? This will delete all colleges registered under it.`)) {
      return;
    }
    setError("");
    setSuccess("");
    const updated = universities.filter((u) => u.name !== univName);
    setUniversities(updated);
  };

  const handleCollegeInputChange = (univName: string, value: string) => {
    setNewCollegeNames((prev) => ({
      ...prev,
      [univName]: value,
    }));
  };

  const handleAddCollege = (univName: string) => {
    const collegeName = (newCollegeNames[univName] || "").trim();
    if (!collegeName) return;

    setError("");
    setSuccess("");

    const updated = universities.map((u) => {
      if (u.name === univName) {
        if (u.colleges.some((c) => c.toLowerCase() === collegeName.toLowerCase())) {
          setError(`College "${collegeName}" already exists under ${univName}.`);
          return u;
        }
        return {
          ...u,
          colleges: [...u.colleges, collegeName],
        };
      }
      return u;
    });

    setUniversities(updated);
    setNewCollegeNames((prev) => ({
      ...prev,
      [univName]: "",
    }));
  };

  const handleRemoveCollege = (univName: string, collegeName: string) => {
    setError("");
    setSuccess("");

    const updated = universities.map((u) => {
      if (u.name === univName) {
        return {
          ...u,
          colleges: u.colleges.filter((c) => c !== collegeName),
        };
      }
      return u;
    });

    setUniversities(updated);
  };

  const handleSaveChanges = async () => {
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      await saveUniversities(universities);
      setSuccess("University and college registries updated successfully in the database!");
    } catch (err: any) {
      console.error("Failed to save registries", err);
      setError(err.message || "An unexpected error occurred while saving registries.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-16">
      
      {/* Header Panel */}
      <div className="bg-white border border-zinc-200/85 rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-sm">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-indigo-500/5 blur-2xl pointer-events-none" />
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-xs font-semibold">
            <Building className="h-3.5 w-3.5" /> Registry Configurator
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">Manage Universities & Colleges</h1>
          <p className="text-zinc-500 text-xs sm:text-sm font-light leading-relaxed max-w-xl">
            Configure the default dropdown selections available for students during registration and onboarding.
          </p>
        </div>
        <button
          onClick={handleSaveChanges}
          disabled={saving}
          className="flex items-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs py-3.5 px-6 transition-all active:scale-95 shadow-md shadow-indigo-600/10 cursor-pointer shrink-0"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving Changes..." : "Save Registry Changes"}
        </button>
      </div>

      {/* Error & Success Messages */}
      {error && (
        <div className="flex items-start gap-2.5 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-600">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
          <div className="space-y-1">
            <h5 className="font-bold">Registry Error</h5>
            <p className="text-xs text-red-500">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-2.5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-600">
          <CheckCircle className="h-5 w-5 shrink-0 text-emerald-500 mt-0.5" />
          <div className="space-y-1">
            <h5 className="font-bold">Registry Updated</h5>
            <p className="text-xs text-emerald-650">{success}</p>
          </div>
        </div>
      )}

      {/* Main Grid: Add Panel & University List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Add University Form */}
        <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 space-y-6 shadow-sm sticky top-24">
          <div className="flex items-center gap-2.5 border-b border-zinc-100 pb-3">
            <Plus className="h-5 w-5 text-indigo-600" />
            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Add New University</h3>
          </div>
          <form onSubmit={handleAddUniversity} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">University Name</label>
              <input
                type="text"
                placeholder="e.g. Patna University"
                value={newUnivName}
                required
                onChange={(e) => setNewUnivName(e.target.value)}
                className="w-full px-4 py-3 text-sm bg-white border border-zinc-200 focus:border-indigo-500/50 rounded-xl outline-none text-zinc-850 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs py-3 px-4 shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Add to Registry
            </button>
          </form>
        </div>

        {/* Right Column: Universities List */}
        <div className="lg:col-span-2 space-y-6">
          {universities.length === 0 ? (
            <div className="text-center py-20 bg-white border border-zinc-200/80 rounded-3xl shadow-sm">
              <GraduationCap className="h-10 w-10 mx-auto text-zinc-400 mb-3" />
              <p className="text-sm text-zinc-500 font-bold">No registered universities yet.</p>
              <p className="text-xs text-zinc-400 font-light mt-1">Use the panel on the left to add a university.</p>
            </div>
          ) : (
            universities.map((univ) => (
              <div 
                key={univ.name}
                className="bg-white border border-zinc-200/80 rounded-3xl p-6 space-y-4 hover:border-zinc-300 transition-all shadow-xs"
              >
                {/* University Header Row */}
                <div className="flex items-start justify-between gap-4 border-b border-zinc-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-650 shrink-0">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-zinc-900">{univ.name}</h4>
                      <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider block mt-0.5">
                        {univ.colleges.length} Colleges Registered
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveUniversity(univ.name)}
                    className="p-2 rounded-xl text-zinc-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                    title="Remove University"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>

                {/* Colleges List Tags */}
                {univ.colleges.length === 0 ? (
                  <p className="text-xs text-zinc-400 italic">No colleges registered under this university yet.</p>
                ) : (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {univ.colleges.map((col) => (
                      <span 
                        key={col}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-50 border border-zinc-200/60 text-xs font-medium text-zinc-700"
                      >
                        {col}
                        <button
                          type="button"
                          onClick={() => handleRemoveCollege(univ.name, col)}
                          className="h-4 w-4 rounded-full flex items-center justify-center hover:bg-red-100 text-zinc-400 hover:text-red-600 transition-colors cursor-pointer"
                          title="Remove College"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Add College Form within University */}
                <div className="flex gap-2.5 pt-3 border-t border-zinc-100 mt-2">
                  <input
                    type="text"
                    placeholder="Add college name..."
                    value={newCollegeNames[univ.name] || ""}
                    onChange={(e) => handleCollegeInputChange(univ.name, e.target.value)}
                    className="flex-grow px-3.5 py-2 text-xs bg-zinc-50 border border-zinc-200 focus:border-indigo-500/30 focus:bg-white rounded-xl outline-none text-zinc-800 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddCollege(univ.name)}
                    className="flex items-center gap-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs py-2 px-4 border border-indigo-100 transition-all cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add College
                  </button>
                </div>

              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
}
