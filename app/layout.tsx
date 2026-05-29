import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import SessionTimeoutHandler from "@/components/SessionTimeoutHandler";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

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
      className={`${outfit.variable} ${inter.variable} h-full antialiased light`}
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
