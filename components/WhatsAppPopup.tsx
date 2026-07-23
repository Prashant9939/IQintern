"use client";

import React, { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, Megaphone, Gift, Users, ShieldCheck, ChevronRight } from "lucide-react";
import { BRANDING } from "@/config/branding";

const WHATSAPP_CHANNEL_URL = "https://whatsapp.com/channel/0029VbCvij93rZZfOyvoKx3l";

// Custom SVG component for the official WhatsApp logo
const WhatsAppIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.434 2.503 1.163 3.473L6.6 19.53l4.247-1.113c.92.503 1.977.788 3.102.788 3.182 0 5.767-2.586 5.768-5.766 0-3.18-2.586-5.767-5.767-5.767zm3.39 8.083c-.22.617-1.285 1.112-1.778 1.164-.477.05-1.077.078-1.748-.135-.67-.213-1.503-.538-2.55-1.42a10.9 10.9 0 0 1-2.483-3.111c-.482-.782-.818-1.616-.818-2.5 0-1.012.528-1.503.743-1.722.213-.219.467-.275.62-.275.155 0 .307.001.44.008.14.007.329-.053.513.395.188.456.643 1.567.7 1.678.058.112.096.242.02.392-.075.15-.113.242-.227.375-.113.133-.244.298-.349.4-.117.113-.24.237-.103.471.137.234.608.997 1.3 1.62.892.802 1.64 1.05 1.874 1.164.234.113.37.095.508-.057.138-.152.593-.69.75-.926.157-.236.314-.197.528-.117.215.079 1.362.642 1.597.76.235.117.392.176.45.275.057.1.057.577-.164 1.194z" />
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 2.136.67 4.116 1.81 5.74L2.03 22l4.43-1.16C8.04 21.62 9.94 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.25c-1.847 0-3.565-.515-5.031-1.411l-.361-.22-2.585.677.689-2.518-.242-.387A8.209 8.209 0 0 1 3.75 12c0-4.549 3.701-8.25 8.25-8.25s8.25 3.701 8.25 8.25-3.701 8.25-8.25 8.25z" />
  </svg>
);

export default function WhatsAppPopup() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Suppress the popup on any authentication page (like login/register)
    if (pathname && pathname.startsWith("/auth")) {
      if (isOpen) {
        setIsOpen(false);
      }
      return;
    }

    // Check if we need to force show the popup (triggered by successful login or registration)
    const forceShow = typeof window !== "undefined" ? sessionStorage.getItem("iqintern_show_whatsapp_popup_force") : null;
    if (forceShow === "true") {
      sessionStorage.removeItem("iqintern_show_whatsapp_popup_force");
      sessionStorage.removeItem("iqintern_whatsapp_popup_session_dismissed");
      localStorage.removeItem("iqintern_whatsapp_popup_dismissed_at");

      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }

    // If popup is already open, do not reset the timer or re-trigger it
    if (isOpen) return;

    // Check if user dismissed the popup in the current session
    const sessionDismissed = typeof window !== "undefined" ? sessionStorage.getItem("iqintern_whatsapp_popup_session_dismissed") : null;
    if (sessionDismissed) return;

    // Check if user dismissed the popup in the last 24 hours
    const dismissedAt = typeof window !== "undefined" ? localStorage.getItem("iqintern_whatsapp_popup_dismissed_at") : null;
    if (dismissedAt) {
      const timePassed = Date.now() - parseInt(dismissedAt, 10);
      const twentyFourHours = 24 * 60 * 60 * 1000;
      if (timePassed < twentyFourHours) {
        return;
      }
    }

    // Delay showing the popup slightly for better user onboarding experience (e.g. 1.5 seconds)
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, [pathname, isOpen]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    // Mark as dismissed for the session
    sessionStorage.setItem("iqintern_whatsapp_popup_session_dismissed", "true");
    // Mark as dismissed with 24h timestamp
    localStorage.setItem("iqintern_whatsapp_popup_dismissed_at", Date.now().toString());
  }, []);

  const handleJoin = useCallback(() => {
    // Treat joining as a dismissal so they aren't repeatedly prompted
    handleClose();
    window.open(WHATSAPP_CHANNEL_URL, "_blank", "noopener,noreferrer");
  }, [handleClose]);

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  // Disable scroll when popup is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const features = [
    { icon: Zap, label: "Instant Updates" },
    { icon: Megaphone, label: "Important Announcements" },
    { icon: Gift, label: "Exclusive Content" },
    { icon: Users, label: "Community Support" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Blur background overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-sm md:max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col md:flex-row z-10 max-h-[90vh] md:max-h-[80vh]"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {/* DESKTOP VIEW LAYOUT */}
            <div className="hidden md:flex flex-1 flex-col md:flex-row w-full p-10 gap-8">
              {/* Left Column */}
              <div className="flex-1 flex flex-col justify-between pr-4">
                <div>
                  {/* IQIntern Logo */}
                  <div className="flex items-center gap-2 mb-6">
                    <img src={BRANDING.logoFull} alt={BRANDING.name} className="h-32 w-auto object-contain" />
                  </div>

                  {/* Heading */}
                  <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight leading-tight mb-3">
                    Join our <span className="text-emerald-600 font-black">WhatsApp</span> Channel
                  </h2>

                  {/* Custom Divider */}
                  <div className="flex items-center gap-4 my-5">
                    <div className="flex-1 h-[1px] bg-emerald-100" />
                    <WhatsAppIcon className="w-6 h-6 text-emerald-500 animate-pulse" />
                    <div className="flex-1 h-[1px] bg-emerald-100" />
                  </div>

                  {/* Description */}
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    Get the latest internship updates, important announcements, assessments, certificates, exclusive resources, and placement opportunities directly on WhatsApp.
                  </p>

                  {/* Feature Grid */}
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    {features.map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <div key={idx} className="flex flex-col items-center text-center p-3 rounded-2xl bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-100/30 transition-all duration-200">
                          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-emerald-600 mb-2">
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="text-[10px] font-bold text-slate-700 leading-tight">
                            {item.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Verification/Official Badge */}
                <div className="bg-emerald-50/70 border border-emerald-100/50 rounded-2xl p-4 flex items-center gap-3 shadow-inner">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-emerald-600 shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-emerald-800 leading-none mb-1">
                      Official IQIntern Channel
                    </h4>
                    <p className="text-[10px] font-semibold text-emerald-600/80 leading-none">
                      Trusted • Verified • Secure
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column Divider */}
              <div className="w-[1px] bg-slate-100 self-stretch my-2" />

              {/* Right Column */}
              <div className="w-[320px] shrink-0 flex flex-col justify-between items-center text-center bg-slate-50/50 rounded-2xl p-6 border border-slate-50">
                <div className="flex flex-col items-center w-full">
                  {/* Scan to Join Capsule */}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-emerald-700 bg-emerald-100/70 border border-emerald-200/50 mb-4">
                    Scan to Join
                  </span>

                  {/* Clickable QR Code Card */}
                  <a
                    href={WHATSAPP_CHANNEL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleClose}
                    className="group relative block p-4 bg-white rounded-3xl border border-emerald-500/20 shadow-md hover:shadow-xl hover:border-emerald-500/40 hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                  >
                    <div className="w-[190px] h-[190px] relative overflow-hidden rounded-2xl flex items-center justify-center bg-white">
                      <img
                        src="/whatsapp/qr-code.png"
                        alt="WhatsApp QR Code"
                        className="w-full h-full object-contain"
                        loading="lazy"
                      />
                    </div>
                  </a>

                  {/* QR Subtitle Description */}
                  <p className="text-slate-500 text-[11px] leading-normal font-medium mt-4 px-2">
                    Scan this QR code using your camera to view or follow this channel.
                  </p>
                </div>

                {/* CTA Button */}
                <button
                  onClick={handleJoin}
                  className="w-full flex items-center justify-between px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-extrabold rounded-2xl shadow-lg hover:shadow-emerald-500/20 hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-500/35 cursor-pointer group mt-4"
                >
                  <div className="flex items-center gap-2.5">
                    <WhatsAppIcon className="w-5 h-5 text-white" />
                    <span>Join Now</span>
                  </div>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* MOBILE VIEW LAYOUT */}
            <div className="md:hidden flex flex-1 flex-col p-6 overflow-y-auto w-full">
              {/* 1. IQIntern Logo */}
              <div className="flex justify-center mb-4">
                <img src={BRANDING.logoFull} alt={BRANDING.name} className="h-10 w-auto object-contain" />
              </div>

              {/* 2. Heading */}
              <h2 className="text-xl font-extrabold text-slate-800 text-center tracking-tight leading-tight mb-2">
                Join our <span className="text-emerald-600">WhatsApp</span> Channel
              </h2>

              {/* 3. Divider */}
              <div className="flex items-center gap-3 my-3 px-4">
                <div className="flex-1 h-[1px] bg-emerald-100" />
                <WhatsAppIcon className="w-5 h-5 text-emerald-500 animate-pulse" />
                <div className="flex-1 h-[1px] bg-emerald-100" />
              </div>

              {/* 4. Description */}
              <p className="text-slate-600 text-xs leading-relaxed text-center px-2 mb-4">
                Get the latest updates, important announcements, and exclusive content directly on WhatsApp.
              </p>

              {/* 5. Clickable QR Code Card */}
              <div className="flex justify-center mb-3">
                <a
                  href={WHATSAPP_CHANNEL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleClose}
                  className="group relative block p-3 bg-white rounded-2xl border border-emerald-500/20 shadow-md hover:scale-[1.01] transition-transform cursor-pointer"
                >
                  <div className="w-[140px] h-[140px] relative overflow-hidden rounded-xl flex items-center justify-center bg-white">
                    <img
                      src="/whatsapp/qr-code.png"
                      alt="WhatsApp QR Code"
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                </a>
              </div>

              {/* 6. Scan Description */}
              <p className="text-slate-500 text-[10px] leading-normal text-center mb-4 px-4 bg-emerald-50/40 rounded-full py-1.5 border border-emerald-100/10 max-w-[280px] mx-auto">
                Scan this QR code using the camera to view or follow this channel.
              </p>

              {/* 7. Feature Badges Grid */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {features.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-100/60 rounded-xl">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100/70 flex items-center justify-center text-emerald-600 shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-700 leading-tight">
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* 8. Official Badge */}
              <div className="bg-emerald-50/70 border border-emerald-100/50 rounded-xl p-3 flex items-center gap-2.5 mb-5">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="text-left">
                  <h4 className="text-[10px] font-bold text-emerald-800 leading-none mb-0.5">
                    Official IQIntern Channel
                  </h4>
                  <p className="text-[9px] font-semibold text-emerald-600/80 leading-none">
                    Trusted • Verified • Secure
                  </p>
                </div>
              </div>

              {/* 9. Join Now Button */}
              <button
                onClick={handleJoin}
                className="w-full flex items-center justify-between px-5 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-extrabold rounded-xl shadow-md focus:outline-none focus:ring-4 focus:ring-emerald-500/35 cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <WhatsAppIcon className="w-4.5 h-4.5 text-white" />
                  <span className="text-xs">Join Now</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
