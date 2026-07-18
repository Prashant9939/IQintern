"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { BRANDING } from "@/config/branding";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    setSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1200);
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden" style={{ background: '#264367' }}>

      <Navbar />

      <main className="flex-grow mx-auto max-w-7xl w-full px-4 pt-28 pb-16 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs text-yellow-300 font-bold uppercase tracking-wider bg-yellow-400/20 px-3 py-1 rounded-full border border-yellow-400/40">Get in Touch</span>
          <h1 className="text-4xl font-extrabold text-white mt-5 tracking-tight">
            How Can We Help You?
          </h1>
          <p className="mt-4 text-white/70 font-light">
            Have questions about documents, validation checks, or setting up company test portals? Send us a message!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto">
          {/* Info Side */}
          <div className="lg:col-span-4 flex flex-col gap-6 justify-center">
            <div className="rounded-3xl p-6 flex gap-4 border border-white/15 hover:border-yellow-400/40 transition-all duration-300" style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)' }}>
              <div className="h-10 w-10 shrink-0 rounded-xl bg-yellow-400/20 border border-yellow-400/30 flex items-center justify-center text-yellow-300">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Email Support</h4>
                <a href={`mailto:${BRANDING.emails.support}`} className="text-xs text-white/60 hover:text-yellow-300 transition-colors">
                  {BRANDING.emails.support}
                </a>
              </div>
            </div>

            <div className="rounded-3xl p-6 flex gap-4 border border-white/15 hover:border-yellow-400/40 transition-all duration-300" style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)' }}>
              <div className="h-10 w-10 shrink-0 rounded-xl bg-yellow-400/20 border border-yellow-400/30 flex items-center justify-center text-yellow-300">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Call Us</h4>
                <a href={BRANDING.phoneLink} className="text-xs text-white/60 hover:text-yellow-300 transition-colors font-medium">
                  {BRANDING.phone}
                </a>
              </div>
            </div>

            <div className="rounded-3xl p-6 flex gap-4 border border-white/15 hover:border-yellow-400/40 transition-all duration-300" style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)' }}>
              <div className="h-10 w-10 shrink-0 rounded-xl bg-yellow-400/20 border border-yellow-400/30 flex items-center justify-center text-yellow-300">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Headquarters</h4>
                <p className="text-xs text-white/60 leading-relaxed font-light">
                  {BRANDING.address}
                </p>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-8">
            <div className="rounded-3xl p-8 relative overflow-hidden border border-white/15" style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)' }}>
              {submitted ? (
                <div className="text-center py-12 flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mb-4">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Message Sent Successfully!</h3>
                  <p className="text-white/60 text-sm max-w-sm font-light">
                    Thank you for reaching out. A support coordinator will respond to your inquiry via email within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-5 py-2.5 text-xs font-semibold text-white/70 hover:text-white transition-all cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-white/60 uppercase tracking-wider block">Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 text-sm border border-white/20 focus:border-yellow-400/60 rounded-xl outline-none text-white transition-colors" style={{ background: 'rgba(255,255,255,0.08)' }}
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-white/60 uppercase tracking-wider block">Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 text-sm border border-white/20 focus:border-yellow-400/60 rounded-xl outline-none text-white transition-colors" style={{ background: 'rgba(255,255,255,0.08)' }}
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">Subject</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 text-sm bg-white border border-zinc-200 focus:border-indigo-500/50 rounded-xl outline-none text-zinc-800 transition-colors"
                      placeholder="Document verification issue, etc."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">Message *</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 text-sm border border-white/20 focus:border-yellow-400/60 rounded-xl outline-none text-white transition-colors resize-none" style={{ background: 'rgba(255,255,255,0.08)' }}
                      placeholder="Write your message details..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 px-6 py-4 text-sm font-bold text-slate-900 shadow-lg shadow-yellow-400/20 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {submitting ? "Sending..." : "Send Message"}
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
