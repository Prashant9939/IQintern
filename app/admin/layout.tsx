"use client";

import { useEffect, useState } from "react";
import { getCurrentUser, signOut, UserSession, devToggleRole } from "@/lib/supabase/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";
import { 
  Shield, 
  LayoutDashboard, 
  Briefcase, 
  HelpCircle, 
  Users, 
  LogOut,
  Menu,
  X,
  RefreshCw,
  Award
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function checkAdmin() {
      const u = await getCurrentUser();
      if (!u) {
        window.location.href = "/auth/login";
        return;
      }
      if (u.role !== "admin") {
        // Redirection to student dashboard if role is student
        window.location.href = "/student/dashboard";
        return;
      }
      setUser(u);
      setLoading(false);
    }
    checkAdmin();
  }, [pathname]);

  const handleLogout = async () => {
    await signOut();
    window.location.href = "/";
  };

  const menuItems = [
    { name: "Analytics Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Manage Internships", href: "/admin/internships", icon: Briefcase },
    { name: "Manage MCQs", href: "/admin/questions", icon: HelpCircle },
    { name: "Registered Students", href: "/admin/students", icon: Users },
    { name: "Document Templates", href: "/admin/templates", icon: Award },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50 items-center justify-center">
        <div className="text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent mx-auto mb-4" />
          <p className="text-zinc-550 text-sm font-medium">Authorizing admin access...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 text-zinc-800 relative">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-100 pointer-events-none" />
      <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

      {/* Mobile Sticky Header */}
      <header className="sticky top-0 z-30 lg:hidden flex h-16 w-full items-center justify-between border-b border-zinc-200/80 bg-white/95 backdrop-blur px-4 shadow-sm shrink-0">
        <Link href="/" className="flex items-center gap-2 font-bold text-zinc-805">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white">SI</div>
          <span>Admin<span className="text-indigo-600 font-extrabold">Hub</span></span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 rounded-xl text-zinc-550 hover:bg-zinc-100 hover:text-zinc-800 transition-colors cursor-pointer"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </header>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-zinc-900/50 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Desktop & Mobile Drawer */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-zinc-200/80 bg-white transition-transform duration-300 ease-in-out shadow-lg
        lg:sticky lg:z-20 lg:translate-x-0 lg:shadow-sm lg:h-screen lg:top-0
        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="flex h-16 items-center justify-between px-6 border-b border-zinc-200/60 shrink-0">
          <Link href="/" className="flex items-center gap-2 font-bold text-zinc-800">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-extrabold text-white">SI</div>
            <span>Admin<span className="text-indigo-600 font-extrabold">Hub</span></span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1.5 rounded-xl hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Menu Navigation */}
        <nav className="flex-grow p-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
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
                    : "text-zinc-660 hover:bg-indigo-50/70 hover:text-indigo-700 hover:border-indigo-100 active:bg-indigo-100/80 active:scale-95 border-transparent"
                }`}
              >
                <Icon className="h-4.5 w-4.5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer Admin controls */}
        <div className="p-4 border-t border-zinc-200/60 mt-auto shrink-0 bg-white">
          {/* Quick Role switcher in development mock mode */}
          <button
            onClick={() => {
              devToggleRole();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-500 hover:text-white hover:border-amber-500 active:bg-amber-650 active:scale-95 py-2.5 text-xs font-bold text-amber-700 transition-all mb-3 cursor-pointer shadow-sm"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Switch to Student View
          </button>
          
          <div className="flex items-center gap-3 p-2 bg-zinc-50 rounded-2xl border border-zinc-200/60 mb-3">
            <img 
              src="/ai_avatar.png" 
              alt="Administrator" 
              className="h-8 w-8 rounded-lg border border-zinc-205 object-cover shrink-0" 
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-zinc-900 truncate">Administrator</p>
              <p className="text-[10px] text-zinc-500 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white hover:bg-red-500 hover:text-white hover:border-red-500 active:bg-red-650 active:scale-95 py-2.5 text-xs font-bold text-red-600 transition-all cursor-pointer shadow-sm"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Admin content area */}
      <div className="flex-grow flex flex-col min-w-0 z-10 lg:h-screen lg:overflow-y-auto">
        <header className="hidden lg:flex h-16 items-center justify-between px-8 border-b border-zinc-200/60 bg-white/40 shrink-0">
          <span className="text-xs text-zinc-500 font-semibold">Admin Workspace</span>
          <div className="flex items-center gap-2 text-zinc-600 text-xs bg-white border border-zinc-200 px-3.5 py-1.5 rounded-full shadow-sm">
            <Shield className="h-3.5 w-3.5 text-indigo-500" />
            <span>Authenticated Administrator Workspace</span>
          </div>
        </header>

        <main className="flex-grow p-4 sm:p-8 flex flex-col justify-between">
          <div className="flex-grow pb-8 relative z-20">
            {children}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
