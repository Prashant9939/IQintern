import type { Metadata } from "next";
import "./globals.css";
import SessionTimeoutHandler from "@/components/SessionTimeoutHandler";

export const metadata: Metadata = {
  title: "SkillIntern | Internship Certification Platform",
  description: "Accelerate your career with verified professional internship certificates and test scorecards.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased light"
      suppressHydrationWarning
    >
      <body 
        className="min-h-full flex flex-col bg-slate-50 text-zinc-900 font-sans selection:bg-indigo-500/20 selection:text-indigo-800"
        suppressHydrationWarning
      >
        <SessionTimeoutHandler />
        {children}
      </body>
    </html>
  );
}
