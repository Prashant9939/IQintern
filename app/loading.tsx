"use client";

import React from "react";

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50/60 backdrop-blur-md">
      <div className="flex flex-col items-center space-y-4">
        {/* Premium rotating dual ring loader */}
        <div className="relative flex items-center justify-center h-16 w-16">
          <div className="absolute h-16 w-16 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
          <div className="absolute h-10 w-10 animate-spin rounded-full border-4 border-violet-400 border-b-transparent duration-1000 rotate-180"></div>
        </div>
        
        {/* Animated text placeholder */}
        <div className="text-center space-y-1.5">
          <h3 className="text-sm font-extrabold text-zinc-800 tracking-tight uppercase animate-pulse">IQ Intern</h3>
          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Syncing secure gateway...</p>
        </div>
      </div>
    </div>
  );
}
