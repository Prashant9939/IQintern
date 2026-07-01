"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Rubik } from "next/font/google";
import { BRANDING } from "@/config/branding";

const rubik = Rubik({ subsets: ["latin"] });

const cancellationParagraphs = [
  `At IQ Intern, users can request cancellation of their enrollment in any simulated internship track. If you wish to cancel your track participation, you must submit a cancellation request via email to ${BRANDING.emails.support} or through your platform support interface.`,
  "Once enrollment is cancelled, your progress, assessment scores, and track details will be archived and will no longer be visible on your dashboard. Please note that cancellation does not automatically entitle you to a refund of enrollment fees (see our Refund Policy).",
  "Cancellation requests must be submitted prior to beginning the final assessment modules. Once an assessment has been attempted, the track cannot be cancelled or modified.",
  "We reserve the right to suspend or cancel any account that is found to violate our terms of service, academic integrity policies, or plagiarism rules without prior notice or refund of paid fees."
];

export default function CancellationPolicy() {
  return (
    <div className={`relative min-h-screen flex flex-col bg-slate-50 overflow-x-hidden ${rubik.className}`}>
      <div className="absolute inset-0 bg-grid-pattern opacity-100 pointer-events-none" />
      <div className="absolute inset-0 radial-fade pointer-events-none" />

      <Navbar />

      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-zinc-200 shadow-sm pt-20 pb-4 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-900 tracking-tight">Cancellation Policy</h1>
            <p className="mt-2 text-sm text-zinc-500 font-medium">Last Updated: October 25, 2026</p>
          </div>
          <div className="text-sm font-medium text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100">
            IQ Intern Legal
          </div>
        </div>
      </div>

      <main className="flex-grow max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 relative z-10 flex flex-col gap-12 items-center">
        <div className="w-full glass-panel bg-white p-8 md:p-12 rounded-3xl shadow-lg border border-zinc-200/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="prose prose-sm prose-zinc max-w-none text-zinc-650 prose-headings:text-zinc-900 prose-headings:font-bold prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4 prose-p:leading-relaxed prose-p:mb-5 prose-a:text-indigo-600 hover:prose-a:text-indigo-700">
            
            <section className="mb-8">
              <h2>Section 1: Requesting Track Cancellation</h2>
              <p>{cancellationParagraphs[0]}</p>
              <p>{cancellationParagraphs[1]}</p>
              <div className="h-px bg-zinc-200/60 w-full my-8" />
            </section>

            <section className="mb-8">
              <h2>Section 2: Limitations on Cancellation</h2>
              <p>{cancellationParagraphs[2]}</p>
              <div className="h-px bg-zinc-200/60 w-full my-8" />
            </section>

            <section className="mb-8">
              <h2>Section 3: Platform-Initiated Cancellations</h2>
              <p>{cancellationParagraphs[3]}</p>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
