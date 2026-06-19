"use client";

import { useState } from "react";
import {
  Megaphone,
  Plus,
  Calendar,
  AlertCircle,
  Info,
  CheckCircle,
  X,
} from "lucide-react";

type Announcement = {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success";
  createdAt: string;
  active: boolean;
};

const mockAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "Platform Maintenance Scheduled",
    message: "Scheduled maintenance on June 25th, 2026 from 2:00 AM to 6:00 AM IST. The platform may be temporarily unavailable.",
    type: "warning",
    createdAt: "2026-06-18",
    active: true,
  },
  {
    id: "2",
    title: "New Internship Tracks Available",
    message: "We have added 5 new internship tracks including AI/ML, Cloud Computing, and DevOps. Enroll now!",
    type: "info",
    createdAt: "2026-06-15",
    active: true,
  },
  {
    id: "3",
    title: "Assessment System Upgrade Complete",
    message: "The assessment system has been upgraded with improved security and faster loading times.",
    type: "success",
    createdAt: "2026-06-10",
    active: false,
  },
];

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [newType, setNewType] = useState<"info" | "warning" | "success">("info");

  const handleCreate = () => {
    if (!newTitle.trim() || !newMessage.trim()) {
      alert("Please fill in both title and message.");
      return;
    }
    const newAnnouncement: Announcement = {
      id: Date.now().toString(),
      title: newTitle,
      message: newMessage,
      type: newType,
      createdAt: new Date().toISOString().split("T")[0],
      active: true,
    };
    setAnnouncements([newAnnouncement, ...announcements]);
    setNewTitle("");
    setNewMessage("");
    setNewType("info");
    setShowCreateForm(false);
  };

  const toggleActive = (id: string) => {
    setAnnouncements(prev =>
      prev.map(a => a.id === id ? { ...a, active: !a.active } : a)
    );
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "warning": return AlertCircle;
      case "success": return CheckCircle;
      default: return Info;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "warning": return "bg-amber-500/10 text-amber-500 border-amber-200";
      case "success": return "bg-emerald-500/10 text-emerald-500 border-emerald-200";
      default: return "bg-[#5B5FF7]/10 text-[#5B5FF7] border-[#5B5FF7]/20";
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-zinc-800 pb-10">
      {/* Page Header */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
        <div>
          <span className="text-[#5B5FF7] text-xs font-bold uppercase tracking-wider">Communication</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight mt-1">Announcements</h2>
          <p className="text-zinc-500 text-sm mt-2 font-light leading-relaxed max-w-xl">
            Create and manage platform-wide announcements visible to all students.
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2 bg-[#5B5FF7] hover:bg-[#4A4EE6] text-white text-xs font-bold px-5 py-3 rounded-xl shadow-md shadow-[#5B5FF7]/15 transition-all cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4" />
          New Announcement
        </button>
      </section>

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-white border border-zinc-150/80 rounded-[20px] p-6 shadow-xs animate-fade-in">
          <h3 className="text-sm font-bold text-zinc-900 mb-4">Create New Announcement</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-zinc-600 block mb-1.5">Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Announcement title..."
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#5B5FF7]/20 focus:border-[#5B5FF7]/40 transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-600 block mb-1.5">Message</label>
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Write the announcement message..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#5B5FF7]/20 focus:border-[#5B5FF7]/40 transition-all resize-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-600 block mb-1.5">Type</label>
              <div className="flex gap-3">
                {(["info", "warning", "success"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setNewType(type)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer capitalize ${
                      newType === type
                        ? "bg-[#5B5FF7] text-white border-[#5B5FF7]"
                        : "bg-white text-zinc-600 border-zinc-200 hover:border-[#5B5FF7]/30"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleCreate}
                className="bg-[#5B5FF7] hover:bg-[#4A4EE6] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
              >
                Publish Announcement
              </button>
              <button
                onClick={() => setShowCreateForm(false)}
                className="bg-white border border-zinc-200 text-zinc-600 text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-zinc-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.length === 0 ? (
          <div className="text-center py-20 border border-zinc-200 rounded-[20px] bg-white shadow-xs">
            <Megaphone className="h-12 w-12 mx-auto text-zinc-300 mb-4" />
            <p className="text-sm text-zinc-800 font-bold">No announcements yet</p>
            <p className="text-xs text-zinc-500 font-medium mt-1">Create your first announcement to notify students.</p>
          </div>
        ) : (
          announcements.map((ann) => {
            const TypeIcon = getTypeIcon(ann.type);
            const typeColor = getTypeColor(ann.type);
            return (
              <div
                key={ann.id}
                className={`bg-white border border-zinc-150/80 rounded-[20px] p-6 shadow-xs hover:shadow-md transition-all duration-300 ${!ann.active ? "opacity-50" : ""}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 min-w-0">
                    <div className={`h-10 w-10 rounded-xl ${typeColor} flex items-center justify-center shrink-0 border`}>
                      <TypeIcon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-bold text-zinc-900">{ann.title}</h3>
                        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${ann.active ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-500"}`}>
                          {ann.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 font-light leading-relaxed">{ann.message}</p>
                      <div className="flex items-center gap-1.5 mt-2 text-[10px] text-zinc-400 font-bold">
                        <Calendar className="h-3 w-3" />
                        {ann.createdAt}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleActive(ann.id)}
                      className="text-xs font-bold px-3 py-1.5 rounded-lg border border-zinc-200 hover:bg-slate-50 transition-all cursor-pointer text-zinc-600"
                    >
                      {ann.active ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => deleteAnnouncement(ann.id)}
                      className="p-1.5 rounded-lg border border-zinc-200 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-all cursor-pointer text-zinc-400"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
