"use client";

import { useEffect, useState } from "react";
import { 
  getInternships, 
  getQuestions, 
  saveQuestion, 
  deleteQuestion, 
  Internship, 
  Question 
} from "@/lib/supabase/db";
import { Plus, Edit2, Trash2, X, AlertCircle, HelpCircle } from "lucide-react";

export default function ManageQuestions() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [selectedTrackId, setSelectedTrackId] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingTracks, setLoadingTracks] = useState(true);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  // Form Modal State
  const [isOpen, setIsOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [formData, setFormData] = useState({
    question_text: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correct_option_index: 0,
  });

  useEffect(() => {
    async function loadTracks() {
      try {
        const data = await getInternships();
        setInternships(data);
        if (data.length > 0) {
          setSelectedTrackId(data[0].id);
        }
      } catch (err) {
        console.error("Failed to load tracks", err);
      } finally {
        setLoadingTracks(false);
      }
    }
    loadTracks();
  }, []);

  const loadQuestions = async (trackId: string) => {
    if (!trackId) return;
    setLoadingQuestions(true);
    try {
      const q = await getQuestions(trackId);
      setQuestions(q);
    } catch (err) {
      console.error("Failed to load questions", err);
    } finally {
      setLoadingQuestions(false);
    }
  };

  useEffect(() => {
    if (selectedTrackId) {
      loadQuestions(selectedTrackId);
    }
  }, [selectedTrackId]);

  const handleOpenAdd = () => {
    if (!selectedTrackId) return;
    setEditingQuestion(null);
    setFormData({
      question_text: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correct_option_index: 0,
    });
    setIsOpen(true);
  };

  const handleOpenEdit = (q: Question) => {
    setEditingQuestion(q);
    setFormData({
      question_text: q.question_text,
      optionA: q.options[0] || "",
      optionB: q.options[1] || "",
      optionC: q.options[2] || "",
      optionD: q.options[3] || "",
      correct_option_index: q.correct_option_index,
    });
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrackId || !formData.question_text || !formData.optionA || !formData.optionB) return;

    try {
      const optionsArray = [formData.optionA, formData.optionB, formData.optionC || "", formData.optionD || ""];
      
      await saveQuestion({
        id: editingQuestion?.id,
        internship_id: selectedTrackId,
        question_text: formData.question_text,
        options: optionsArray,
        correct_option_index: Number(formData.correct_option_index),
      });

      setIsOpen(false);
      loadQuestions(selectedTrackId);
    } catch (err) {
      console.error("Failed to save question", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;
    try {
      await deleteQuestion(id);
      loadQuestions(selectedTrackId);
    } catch (err) {
      console.error("Failed to delete question", err);
    }
  };

  return (
    <div className="space-y-8 relative z-10 text-zinc-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">Question Bank Management</h1>
          <p className="text-zinc-500 text-xs sm:text-sm font-light mt-1">Configure evaluation questions, answers, and category assignments.</p>
        </div>
        {selectedTrackId && (
          <button
            onClick={handleOpenAdd}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/10 cursor-pointer transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" />
            Add MCQ Question
          </button>
        )}
      </div>

      {/* Select Internship Track */}
      <div className="glass-panel bg-white border border-zinc-200/80 shadow-md p-5 rounded-2xl flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="w-full sm:w-auto">
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Select Internship Track</label>
          {loadingTracks ? (
            <div className="h-10 w-48 bg-zinc-50 rounded-xl animate-pulse border border-zinc-150" />
          ) : (
            <select
              value={selectedTrackId}
              onChange={(e) => setSelectedTrackId(e.target.value)}
              className="w-full sm:w-64 px-3.5 py-2 text-sm bg-white border border-zinc-205 focus:border-indigo-500/50 rounded-xl outline-none text-zinc-700 cursor-pointer font-medium"
            >
              {internships.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
          <HelpCircle className="h-4 w-4 text-indigo-500" />
          <span>Note: Evaluation requires exactly 5 questions per track.</span>
        </div>
      </div>

      {/* Questions list */}
      {loadingQuestions ? (
        <div className="flex justify-center items-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
        </div>
      ) : !selectedTrackId ? (
        <div className="text-center py-20 border border-zinc-200 rounded-3xl bg-white shadow-sm">
          <p className="text-zinc-500 text-xs">No active track selected. Please list an internship track first.</p>
        </div>
      ) : questions.length === 0 ? (
        <div className="text-center py-20 border border-zinc-200 rounded-3xl bg-white shadow-sm">
          <AlertCircle className="h-10 w-10 mx-auto text-zinc-400 mb-3" />
          <p className="text-sm text-zinc-500 font-bold">No MCQs registered for this track.</p>
          <button
            onClick={handleOpenAdd}
            className="mt-4 rounded-xl border border-indigo-150 bg-indigo-50 hover:bg-indigo-100 px-4 py-2.5 text-xs font-bold text-indigo-600 transition-all shadow-sm"
          >
            Create first MCQ
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q, idx) => (
            <div key={q.id} className="glass-panel bg-white border border-zinc-200/85 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row justify-between gap-6 relative shadow-sm hover:border-zinc-300 transition-colors">
              <div className="space-y-4 flex-grow">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-650 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-150">
                    Q{idx + 1}
                  </span>
                  <span className="text-xs text-zinc-400 font-medium">MCQ Object ID: {q.id}</span>
                </div>
                <h3 className="text-base font-bold text-zinc-900 leading-relaxed">{q.question_text}</h3>
                
                {/* Options representation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {q.options.map((opt, oIdx) => {
                    const isCorrect = q.correct_option_index === oIdx;
                    return (
                      <div 
                        key={oIdx} 
                        className={`p-3 rounded-xl border text-xs flex justify-between items-center ${
                          isCorrect 
                            ? "bg-emerald-50 border-emerald-200 text-emerald-700 font-bold" 
                            : "bg-zinc-50/50 border-zinc-200 text-zinc-650"
                        }`}
                      >
                        <span>{opt}</span>
                        {isCorrect && <span className="text-[10px] font-extrabold tracking-wider text-emerald-600 uppercase">Correct Key</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CRUD controls */}
              <div className="flex sm:flex-col gap-2 shrink-0 justify-end">
                <button
                  onClick={() => handleOpenEdit(q)}
                  className="rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 px-3.5 py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(q.id)}
                  className="rounded-xl border border-red-200 hover:border-red-300 bg-red-50 hover:bg-red-100 text-red-500 px-3.5 py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD/EDIT QUESTIONS MODAL */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-lg glass-panel bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
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
                <h3 className="text-lg font-bold text-zinc-900">{editingQuestion ? "Edit MCQ Question" : "New MCQ Question"}</h3>
                <p className="text-xs text-zinc-400 font-light">Formulate question prompt and specify key answers.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Question text */}
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">Question Prompt *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.question_text}
                  onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
                  placeholder="e.g. Which hook triggers side-effects in React?"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-205 rounded-xl outline-none focus:border-indigo-500/50 text-zinc-800 transition-colors resize-none"
                />
              </div>

              {/* Option A & B */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">Option A (Index 0) *</label>
                  <input
                    type="text"
                    required
                    value={formData.optionA}
                    onChange={(e) => setFormData({ ...formData, optionA: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-zinc-205 rounded-xl outline-none focus:border-indigo-500/50 text-zinc-800 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">Option B (Index 1) *</label>
                  <input
                    type="text"
                    required
                    value={formData.optionB}
                    onChange={(e) => setFormData({ ...formData, optionB: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-zinc-205 rounded-xl outline-none focus:border-indigo-500/50 text-zinc-800 transition-colors"
                  />
                </div>
              </div>

              {/* Option C & D */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">Option C (Index 2)</label>
                  <input
                    type="text"
                    value={formData.optionC}
                    onChange={(e) => setFormData({ ...formData, optionC: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-zinc-205 rounded-xl outline-none focus:border-indigo-500/50 text-zinc-800 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">Option D (Index 3)</label>
                  <input
                    type="text"
                    value={formData.optionD}
                    onChange={(e) => setFormData({ ...formData, optionD: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-zinc-205 rounded-xl outline-none focus:border-indigo-500/50 text-zinc-800 transition-colors"
                  />
                </div>
              </div>

              {/* Correct Option Index */}
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">Correct Option Index *</label>
                <select
                  value={formData.correct_option_index}
                  onChange={(e) => setFormData({ ...formData, correct_option_index: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-zinc-205 rounded-xl outline-none focus:border-indigo-500/50 text-zinc-705 cursor-pointer appearance-none font-medium"
                >
                  <option value={0}>Option A (Index 0)</option>
                  <option value={1}>Option B (Index 1)</option>
                  <option value={2}>Option C (Index 2)</option>
                  <option value={3}>Option D (Index 3)</option>
                </select>
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
                  {editingQuestion ? "Update MCQ" : "Create MCQ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
