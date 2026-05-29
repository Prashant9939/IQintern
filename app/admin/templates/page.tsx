"use client";

import { useEffect, useState } from "react";
import {
  getDocumentTemplates,
  saveDocumentTemplate,
  DocumentTemplate,
} from "@/lib/supabase/db";
import {
  FileText,
  Calendar,
  Loader2,
  Eye,
  EyeOff,
  Edit3,
  Upload,
  X,
} from "lucide-react";

export default function AdminTemplates() {
  const [htmlTemplates, setHtmlTemplates] = useState<DocumentTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  // HTML Template Editor State
  const [editingHtmlTemplate, setEditingHtmlTemplate] = useState<DocumentTemplate | null>(null);
  const [editingHtmlContent, setEditingHtmlContent] = useState<string>("");
  const [savingHtml, setSavingHtml] = useState(false);

  // Action loaders
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function loadData() {
    setLoading(true);
    try {
      const htmlTplList = await getDocumentTemplates();
      setHtmlTemplates(htmlTplList);
    } catch (err) {
      console.error("Error loading HTML templates data:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleHtmlVisibility = async (tpl: DocumentTemplate) => {
    setUpdatingId(tpl.code);
    try {
      await saveDocumentTemplate(tpl.code, tpl.html_content, !tpl.is_visible);
      await loadData();
    } catch (err) {
      console.error("Failed to toggle template visibility:", err);
      alert("Error toggling template visibility.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleOpenHtmlEditor = (tpl: DocumentTemplate) => {
    setEditingHtmlTemplate(tpl);
    setEditingHtmlContent(tpl.html_content);
  };

  const handleSaveHtmlTemplate = async () => {
    if (!editingHtmlTemplate) return;
    setSavingHtml(true);
    try {
      await saveDocumentTemplate(
        editingHtmlTemplate.code,
        editingHtmlContent,
        editingHtmlTemplate.is_visible
      );
      setEditingHtmlTemplate(null);
      setEditingHtmlContent("");
      await loadData();
      alert("HTML template successfully updated.");
    } catch (err) {
      console.error("Failed to save HTML template:", err);
      alert("Failed to save HTML template.");
    } finally {
      setSavingHtml(false);
    }
  };

  const handleReplaceHtmlTemplate = async (code: string, file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      if (!content) {
        alert("Empty file or error reading file.");
        return;
      }
      setUpdatingId(code);
      try {
        const existing = htmlTemplates.find((t) => t.code === code);
        await saveDocumentTemplate(code, content, existing ? existing.is_visible : true);
        await loadData();
        alert("Template successfully replaced.");
      } catch (err) {
        console.error("Failed to replace template:", err);
        alert("Error replacing template.");
      } finally {
        setUpdatingId(null);
      }
    };
    reader.onerror = () => {
      alert("Error reading file.");
    };
    reader.readAsText(file);
  };

  if (loading && htmlTemplates.length === 0) {
    return (
      <div className="flex justify-center items-center py-20 min-h-[60vh]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8 relative z-10">
      {/* Header Banner */}
      <div>
        <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">Document Automation Templates</h1>
        <p className="text-zinc-500 text-xs sm:text-sm font-light mt-1">
          Configure, edit, and manage client-side rendered student document templates (Offer Letters, Certificates, Reports).
        </p>
      </div>

      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-bold text-zinc-800">HTML Document Templates</h3>
          <span className="text-[10px] text-zinc-400 font-light">Manage client-side rendered student documents</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {htmlTemplates.map((tpl) => (
            <div
              key={tpl.id}
              className="glass-panel border rounded-3xl p-6 flex flex-col justify-between hover:shadow-md transition-all bg-white border-zinc-200"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <span className="text-[9px] text-zinc-400 font-mono">CODE: {tpl.code}</span>
                  <button
                    onClick={() => handleToggleHtmlVisibility(tpl)}
                    disabled={updatingId !== null}
                    title={tpl.is_visible ? "Click to Hide from Students" : "Click to Show to Students"}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border transition-all cursor-pointer hover:shadow-sm ${
                      tpl.is_visible
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 active:bg-emerald-200 active:scale-95"
                        : "bg-zinc-50 text-zinc-500 border-zinc-200 hover:bg-zinc-100 hover:text-zinc-700 active:bg-zinc-200 active:scale-95"
                    }`}
                  >
                    {tpl.is_visible ? (
                      <>
                        <Eye className="h-3 w-3" /> Visible
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-3 w-3" /> Hidden
                      </>
                    )}
                  </button>
                </div>

                <h4 className="text-base font-bold text-zinc-900 mb-1">{tpl.name}</h4>
                <p className="text-zinc-550 text-xs font-light mb-4 leading-relaxed">
                  {tpl.code === "offer_letter"
                    ? "Customizable HTML layout for internship offer letters."
                    : tpl.code === "certificate"
                    ? "Verified certificate layout featuring dynamic name, grade and date."
                    : "Multi-page A4 landscape or portrait project summary report."}
                </p>
                
                <p className="text-zinc-400 text-[9px] font-light mb-4 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Last updated: {new Date(tpl.updated_at).toLocaleString()}
                </p>
              </div>

              <div className="border-t border-zinc-100 pt-4 flex gap-2 justify-between items-center">
                <label className="flex items-center gap-1.5 border border-zinc-250 bg-zinc-50 hover:bg-indigo-50/60 hover:text-indigo-700 hover:border-indigo-150 active:bg-indigo-100 active:scale-95 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm">
                  <Upload className="h-3.5 w-3.5" />
                  Replace File
                  <input
                    type="file"
                    accept=".html"
                    disabled={updatingId !== null}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleReplaceHtmlTemplate(tpl.code, file);
                      }
                    }}
                    className="hidden"
                  />
                </label>

                <button
                  onClick={() => handleOpenHtmlEditor(tpl)}
                  className="flex items-center gap-1 bg-indigo-50 border border-indigo-150 hover:bg-indigo-600 hover:text-white active:bg-indigo-750 active:scale-95 text-indigo-700 font-bold px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer shadow-sm"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit HTML
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* HTML CODE EDITOR MODAL */}
      {editingHtmlTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-6xl h-[90vh] bg-white rounded-3xl flex flex-col overflow-hidden shadow-2xl border border-zinc-200">
            {/* Header */}
            <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-zinc-200 bg-zinc-50">
              <div className="flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-indigo-650 animate-pulse" />
                <h3 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wider">
                  Edit Template: {editingHtmlTemplate.name}
                </h3>
              </div>
              <button
                onClick={() => {
                  setEditingHtmlTemplate(null);
                  setEditingHtmlContent("");
                }}
                className="rounded-xl p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 active:bg-zinc-200 active:scale-90 transition-all cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Editor Area */}
            <div className="flex-grow flex flex-col p-6 space-y-4 overflow-hidden bg-zinc-50">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-400 font-light">
                  Tip: You can use double curly-braces placeholders like <code className="bg-white border border-zinc-200 px-1 py-0.5 rounded text-indigo-600 font-mono font-bold">{"{{STUDENT_NAME}}"}</code>, <code className="bg-white border border-zinc-200 px-1 py-0.5 rounded text-indigo-600 font-mono font-bold">{"{{INTERNSHIP_TITLE}}"}</code>, etc.
                </span>
                <span className="font-mono text-zinc-500">{editingHtmlContent.length} characters</span>
              </div>
              <textarea
                value={editingHtmlContent}
                onChange={(e) => setEditingHtmlContent(e.target.value)}
                className="flex-grow w-full font-mono text-xs p-5 rounded-2xl border border-zinc-250 bg-zinc-950 text-emerald-400 focus:outline-none focus:border-indigo-500 shadow-inner resize-none overflow-y-auto leading-relaxed"
                spellCheck="false"
              />
            </div>
            
            {/* Footer */}
            <div className="flex h-16 shrink-0 items-center justify-end px-6 border-t border-zinc-200 bg-zinc-50 gap-3">
              <button
                type="button"
                onClick={() => {
                  setEditingHtmlTemplate(null);
                  setEditingHtmlContent("");
                }}
                className="rounded-xl border border-zinc-250 bg-white hover:bg-zinc-100 active:bg-zinc-200 active:scale-95 px-4 py-2.5 text-xs font-bold text-zinc-550 hover:text-zinc-850 transition-all cursor-pointer animate-fade-in"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveHtmlTemplate}
                disabled={savingHtml}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-650 hover:bg-indigo-700 active:bg-indigo-805 active:scale-95 px-5 py-2.5 text-xs font-bold text-white transition-all disabled:opacity-50 cursor-pointer shadow-sm"
              >
                {savingHtml ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
