"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Rubik } from "next/font/google";
import { BRANDING } from "@/config/branding";

const rubik = Rubik({ subsets: ["latin"] });

const refundParagraphs = [
  "At IQ Intern, we are committed to providing high-quality vocational training and skill-validation programs. Since our digital services—including simulated internship tracks, downloadable utility documents, and performance scorecards—are delivered immediately and electronically upon access, all sales and transaction fees are generally non-refundable.",
  "We encourage all users to thoroughly review the features, details, and requirements of their selected internship tracks before making any payments. By purchasing access to a track evaluation, you acknowledge and agree that digital products represent instant value transfer and cannot be 'returned' once processed.",
  `In exceptional circumstances, such as double-billing errors or accidental duplicate transactions on the same account for the identical track, we will review refund request requests on a case-by-case basis. To request a review, you must contact our billing support team at ${BRANDING.emails.support} within 48 hours of the transaction, providing your receipt ID and transaction details.`,
  "If a refund is approved by our billing department, it will be processed back to the original payment method through our third-party payment gateway (Razorpay) within 5 to 7 business days. Please note that processing times depend entirely on your financial institution."
];

export default function RefundPolicy() {
  return (
    <div className={`relative min-h-screen flex flex-col bg-slate-50 overflow-x-hidden ${rubik.className}`}>
      <div className="absolute inset-0 bg-grid-pattern opacity-100 pointer-events-none" />
      <div className="absolute inset-0 radial-fade pointer-events-none" />

      <Navbar />

      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-zinc-200 shadow-sm pt-20 pb-4 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-900 tracking-tight">Refund Policy</h1>
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
              <h2>Section 1: General Refund Conditions</h2>
              <p>{refundParagraphs[0]}</p>
              <p>{refundParagraphs[1]}</p>
              <div className="h-px bg-zinc-200/60 w-full my-8" />
            </section>

            <section className="mb-8">
              <h2>Section 2: Transaction Discrepancies & Duplicate Billing</h2>
              <p>{refundParagraphs[2]}</p>
              <div className="h-px bg-zinc-200/60 w-full my-8" />
            </section>

            <section className="mb-8">
              <h2>Section 3: Processing Approved Claims</h2>
              <p>{refundParagraphs[3]}</p>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
