/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { getInternships, saveInternship, deleteInternship, Internship } from "@/lib/supabase/db";
import { Plus, Edit2, Trash2, X, Briefcase, FileText, Tag, Clock } from "lucide-react";

export default function ManageInternships() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);

  // Form Modal State
  const [isOpen, setIsOpen] = useState(false);
  const [editingTrack, setEditingTrack] = useState<Internship | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "", // comma separated in form
    duration: "3 Months",
    category: "",
  });

  const loadInternships = async () => {
    setLoading(true);
    try {
      const data = await getInternships();
      setInternships(data);
    } catch (err) {
      console.error("Failed to load internships", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInternships();
  }, []);

  const handleOpenAdd = () => {
    setEditingTrack(null);
    setFormData({
      title: "",
      description: "",
      requirements: "",
      duration: "3 Months",
      category: "",
    });
    setIsOpen(true);
  };

  const handleOpenEdit = (track: Internship) => {
    setEditingTrack(track);
    setFormData({
      title: track.title,
      description: track.description,
      requirements: track.requirements ? track.requirements.join(", ") : "",
      duration: track.duration,
      category: track.category,
    });
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;

    try {
      const requirementsArr = formData.requirements
        ? formData.requirements.split(",").map((r) => r.trim()).filter((r) => r.length > 0)
        : [];

      await saveInternship({
        id: editingTrack?.id,
        title: formData.title,
        description: formData.description,
        requirements: requirementsArr,
        duration: formData.duration,
        category: formData.category,
      });

      setIsOpen(false);
      loadInternships();
    } catch (err) {
      console.error("Failed to save internship", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this internship track? This will delete all associated MCQs and logs.")) return;
    try {
      await deleteInternship(id);
      loadInternships();
    } catch (err) {
      console.error("Failed to delete internship", err);
    }
  };

  return (
    <div className="space-y-8 relative z-10 text-zinc-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">Manage Internship Tracks</h1>
          <p className="text-zinc-500 text-xs sm:text-sm font-light mt-1">Configure, edit, and audit listed internships for evaluation.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/10 cursor-pointer transition-all active:scale-95"
        >
          <Plus className="h-4 w-4" />
          Add Internship Track
        </button>
      </div>

      {/* Internships grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
        </div>
      ) : internships.length === 0 ? (
        <div className="text-center py-20 border border-zinc-200 rounded-3xl bg-white shadow-sm">
          <Briefcase className="h-10 w-10 mx-auto text-zinc-400 mb-3" />
          <p className="text-sm text-zinc-500 font-bold">No internships configured.</p>
          <button 
            onClick={handleOpenAdd}
            className="mt-4 rounded-xl border border-indigo-150 bg-indigo-50 hover:bg-indigo-100 px-4 py-2.5 text-xs font-bold text-indigo-600 transition-all shadow-sm"
          >
            Create first track
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {internships.map((track) => (
            <div key={track.id} className="glass-panel bg-white border border-zinc-200/85 rounded-2xl p-5 flex flex-col justify-between hover:border-zinc-350 transition-colors shadow-sm">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 text-[10px] font-bold text-indigo-600">
                    <Tag className="h-3 w-3" />
                    {track.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] text-zinc-400 font-medium">
                    <Clock className="h-3 w-3" />
                    {track.duration}
                  </span>
                </div>
                <h3 className="text-base font-bold text-zinc-900 mb-2">{track.title}</h3>
                <p className="text-zinc-500 text-xs sm:text-sm line-clamp-3 leading-relaxed mb-4 font-light">{track.description}</p>
                
                {track.requirements && track.requirements.length > 0 && (
                  <div className="mb-4">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Expectations:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {track.requirements.map((req, idx) => (
                        <span key={idx} className="bg-zinc-50 text-zinc-600 text-[10px] px-2.5 py-0.5 rounded-lg border border-zinc-200 truncate max-w-full font-medium">
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 border-t border-zinc-100 pt-4 mt-4">
                <button
                  onClick={() => handleOpenEdit(track)}
                  className="flex-grow flex items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-650 hover:text-zinc-950 py-2.5 text-xs font-bold cursor-pointer transition-all shadow-sm"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(track.id)}
                  className="flex items-center justify-center rounded-xl border border-red-200 hover:border-red-300 hover:bg-red-100/50 bg-red-50 text-red-500 px-3 py-2.5 text-xs font-semibold cursor-pointer transition-all shadow-sm"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD/EDIT MODAL OVERLAY */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-lg glass-panel bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 p-1.5 rounded-xl text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex gap-3 mb-6">
              <div className="h-10 w-10 bg-indigo-50 text-indigo-650 border border-indigo-150 rounded-xl flex items-center justify-center">
                <Plus className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-900">{editingTrack ? "Edit Internship Track" : "New Internship Track"}</h3>
                <p className="text-xs text-zinc-400 font-light">Provide details for the internship certification pathway.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">Track Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Full Stack Developer"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-205 rounded-xl outline-none focus:border-indigo-500/50 text-zinc-800 transition-colors"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">Description</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief summary of internship work scope..."
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-205 rounded-xl outline-none focus:border-indigo-500/50 text-zinc-800 transition-colors resize-none"
                />
              </div>

              {/* Details row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">Duration</label>
                  <input
                    type="text"
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g. 3 Months"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-205 rounded-xl outline-none focus:border-indigo-500/50 text-zinc-800 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">Category</label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. AI & Machine Learning"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-205 rounded-xl outline-none focus:border-indigo-500/50 text-zinc-800 transition-colors font-medium"
                  />
                </div>
              </div>

              {/* Requirements */}
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
                  Checklist Expectations (Comma separated)
                </label>
                <input
                  type="text"
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  placeholder="e.g. Next.js, Node.js, SQL database integration"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-205 rounded-xl outline-none focus:border-indigo-500/50 text-zinc-800 transition-colors"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 px-4 py-2.5 text-xs text-zinc-500 font-bold hover:text-zinc-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/10 cursor-pointer"
                >
                  {editingTrack ? "Update Track" : "Create Track"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
