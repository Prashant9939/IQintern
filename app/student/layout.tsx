"use client";

import { useEffect, useState } from "react";
import { getCurrentUser, signOut, UserSession } from "@/lib/supabase/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";
import { 
  LayoutDashboard, 
  LogOut, 
  User, 
  Menu, 
  X,
  Lock,
  Award,
  Briefcase
} from "lucide-react";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const u = await getCurrentUser();
      if (!u) {
        window.location.href = "/auth/login";
        return;
      }
      if (u.role !== "student") {
        // Redirect admins to admin dashboard
        window.location.href = "/admin/dashboard";
        return;
      }
      setUser(u);
      
      // Redirect if profile is not completed and they are trying to access dashboard/tests/results
      if (!u.profile_completed && pathname !== "/student/complete-profile") {
        window.location.href = "/student/complete-profile";
        return;
      }
      
      // Redirect to dashboard if they have completed their profile and try to visit the completion page
      if (u.profile_completed && pathname === "/student/complete-profile") {
        window.location.href = "/student/dashboard";
        return;
      }

      setLoading(false);
    }
    loadUser();
  }, [pathname]);

  const handleLogout = async () => {
    await signOut();
    window.location.href = "/";
  };

  const navItems: { name: string; href: string; icon: any }[] = user?.profile_completed
    ? [
        { name: "Dashboard Overview", href: "/student/dashboard", icon: LayoutDashboard },
        { name: "Available Internships", href: "/student/internships", icon: Briefcase },
        { name: "My Profile", href: "/student/profile", icon: User },
      ]
    : [
        { name: "Complete Profile", href: "/student/complete-profile", icon: User },
      ];

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50 items-center justify-center">
        <div className="text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent mx-auto mb-4" />
          <p className="text-zinc-500 text-sm font-medium">Verifying credentials...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-slate-50 text-zinc-800 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-grid-pattern opacity-100 pointer-events-none" />
      <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-zinc-200/80 bg-white relative z-20 shadow-sm">
        {/* Brand */}
        <div className="flex h-16 items-center px-6 border-b border-zinc-200/60">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-zinc-800">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-extrabold text-white">
              SI
            </div>
            <span>Skill<span className="text-indigo-600 font-extrabold">Intern</span></span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-grow p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl border transition-all cursor-pointer ${
                  active
                    ? "bg-indigo-600 text-white border-indigo-650 shadow-md shadow-indigo-600/15"
                    : "text-zinc-600 hover:bg-indigo-50/70 hover:text-indigo-700 hover:border-indigo-100 active:bg-indigo-100/80 active:scale-95 border-transparent"
                }`}
              >
                <Icon className="h-4.5 w-4.5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Card */}
        <div className="p-4 border-t border-zinc-200/60 mt-auto">
          <div className="flex items-center gap-3 p-2 bg-zinc-50 rounded-2xl border border-zinc-200/60 mb-3">
            <div className="h-9 w-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100 uppercase">
              {user.full_name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-zinc-900 truncate">{user.full_name}</p>
              <p className="text-[10px] text-zinc-500 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white hover:bg-red-500 hover:text-white hover:border-red-500 active:bg-red-600 active:scale-95 py-2.5 text-xs font-bold text-red-600 transition-all cursor-pointer shadow-sm"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header Nav */}
      <div className="md:hidden w-full flex flex-col relative z-20">
        <header className="flex h-16 items-center justify-between px-4 border-b border-zinc-200/60 bg-white/95 w-full shadow-sm">
          <Link href="/" className="flex items-center gap-2 font-bold text-zinc-800">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white">SI</div>
            <span>Skill<span className="text-indigo-600 font-extrabold">Intern</span></span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-zinc-500 hover:text-zinc-800"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="glass-panel border-b border-zinc-200/60 px-4 py-4 space-y-3 shadow-md bg-white/95 animate-fade-in">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl border transition-all cursor-pointer ${
                    active
                      ? "bg-indigo-600 text-white border-indigo-650 shadow-md shadow-indigo-600/15"
                      : "text-zinc-655 hover:bg-indigo-50/70 hover:text-indigo-700 hover:border-indigo-100 active:bg-indigo-100/80 active:scale-95 border-transparent"
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                  {item.name}
                </Link>
              );
            })}
            <div className="border-t border-zinc-200/60 pt-3 flex flex-col gap-3">
              <div className="flex items-center gap-3 p-2 bg-zinc-50 rounded-xl border border-zinc-200/60">
                <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                  {user.full_name.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-800">{user.full_name}</p>
                  <p className="text-[10px] text-zinc-500">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white hover:bg-red-500 hover:text-white hover:border-red-500 active:bg-red-600 active:scale-95 py-2.5 text-xs font-bold text-red-600 transition-all cursor-pointer shadow-sm"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-w-0 z-10 md:h-screen md:overflow-y-auto">
        {/* Desktop Header */}
        <header className="hidden md:flex h-16 items-center justify-between px-8 border-b border-zinc-200/60 bg-white/40">
          <span className="text-xs text-zinc-500 font-semibold">Student Dashboard</span>
          <div className="flex items-center gap-2 text-zinc-600 text-xs bg-white border border-zinc-200 px-3.5 py-1.5 rounded-full shadow-sm">
            <Lock className="h-3 w-3 text-emerald-500" />
            <span>Secure Student Session</span>
          </div>
        </header>

        {/* Content Wrapper */}
        <main className="flex-grow p-4 sm:p-8 flex flex-col justify-between">
          <div className="flex-grow pb-8">
            {children}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
