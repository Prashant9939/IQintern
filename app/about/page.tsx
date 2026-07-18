/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/set-state-in-effect */
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Compass, Eye, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | IQ Intern",
  description: "Learn more about IQ Intern's mission to bridge the gap between academic education and industry readiness.",
};

export default function About() {
  const values = [
    {
      title: "Our Mission",
      desc: "To help engineering and design students showcase their actual project readiness through authenticated assessment pathways.",
      icon: Compass,
      iconColor: "text-yellow-300",
      iconBg: "bg-yellow-400/20",
      iconBorder: "border-yellow-400/30"
    },
    {
      title: "Our Vision",
      desc: "Creating a globally recognized certification standard that represents reliable, cheat-proof, and hands-on developer testing.",
      icon: Eye,
      iconColor: "text-white",
      iconBg: "bg-white/10",
      iconBorder: "border-white/20"
    },
    {
      title: "Our Core Trust",
      desc: "We stand for absolute transparency. Every credential we issue has full detail scores and answers history linked.",
      icon: ShieldCheck,
      iconColor: "text-yellow-300",
      iconBg: "bg-yellow-400/20",
      iconBorder: "border-yellow-400/30"
    }
  ];

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden" style={{ background: '#264367' }}>
      <Navbar />

      <main className="flex-grow mx-auto max-w-7xl px-4 pt-28 pb-16 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs text-yellow-300 font-bold uppercase tracking-wider bg-yellow-400/20 px-3 py-1 rounded-full border border-yellow-400/40">Our Story</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mt-5 tracking-tight">
            Bridging Academics &amp; Industry
          </h1>
          <p className="mt-4 text-white/70 text-lg font-light">
            IQ Intern was founded to provide a clear, standardized, and secure validation platform for internships.
          </p>
        </div>

        {/* Values grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <div key={v.title} className="rounded-3xl p-8 flex flex-col items-center text-center border border-white/15 hover:border-yellow-400/40 transition-all duration-300" style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)' }}>
                <div className={`p-4 rounded-2xl border mb-6 ${v.iconBg} ${v.iconBorder} ${v.iconColor}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{v.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed font-light">{v.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Detailed text */}
        <div className="rounded-3xl p-8 sm:p-10 max-w-4xl mx-auto relative overflow-hidden border border-white/15" style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)' }}>
          <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-yellow-400/5 blur-3xl pointer-events-none" />
          <h2 className="text-2xl font-bold text-white mb-4">How It Works</h2>
          <div className="space-y-4 text-white/60 text-sm sm:text-base leading-relaxed font-light">
            <p>
              Students register on our platform by entering their basic academic details. They can search through active, vetted internship tracks listed by companies.
            </p>
            <p>
              To validate their skills, students must take a proctored, timed multiple-choice questionnaire assessment test. The test evaluates practical code comprehension, design guidelines, and system architectures.
            </p>
            <p>
              On passing (40% score or higher), the platform validates the track completion. A scorecard is produced containing their detailed test metadata, ready for resume insertion or LinkedIn sharing.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
