'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShieldAlert,
  Users,
  BookOpen,
  Calendar,
  Clock,
  ClipboardList,
  Trophy,
  Award,
  HelpCircle,
  LogOut,
  Bell,
  User,
  Activity,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

interface UserSession {
  id: string;
  email: string;
  name: string;
  role: string;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.status === 401) {
          router.push('/login');
          return;
        }
        const data = await res.json();
        if (data.authenticated && data.user.role === 'ADMIN') {
          setUser(data.user);
        } else {
          // If authenticated but not admin, redirect to student dashboard
          router.push('/student/dashboard');
        }
      } catch (err) {
        console.error('Admin layout session check error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [pathname, router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  const adminNavItems = [
    { label: 'Overview', path: '/admin/dashboard', icon: Activity },
    { label: 'Manage Students', path: '/admin/students', icon: Users },
    { label: 'Manage Courses', path: '/admin/courses', icon: BookOpen },
    { label: 'Manage Batches', path: '/admin/batches', icon: ClipboardList },
    { label: 'Class Scheduler', path: '/admin/classes', icon: Clock },
    { label: 'Mark Attendance', path: '/admin/attendance', icon: UserCheck },
    { label: 'Manage Assignments', path: '/admin/assignments', icon: ClipboardList },
    { label: 'Contest Designer', path: '/admin/contests', icon: Trophy },
    { label: 'Mentor Logs', path: '/admin/mentors', icon: Users },
    { label: 'Certificates Manager', path: '/admin/certificates', icon: Award },
    { label: 'Support Tickets', path: '/admin/support', icon: HelpCircle },
  ];

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#090D16]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-t-transparent border-[#808000]" />
          <p className="text-sm font-semibold tracking-wider text-gray-400">LOADING CONTROL PANEL...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#090D16] text-white overflow-hidden">
      {/* Sidebar for Desktop */}
      <aside
        className={`hidden md:flex flex-col bg-[#0D1321] border-r border-white/5 transition-all duration-300 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/5">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-[#808000] flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(128,128,0,0.5)]">
              CD
            </div>
            {!sidebarCollapsed && (
              <span className="font-extrabold text-sm tracking-wider text-white flex items-center gap-1.5">
                ADMIN <ShieldAlert size={14} className="text-[#808000]" />
              </span>
            )}
          </Link>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white"
          >
            {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Links */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm group ${
                  isActive
                    ? 'bg-[#808000] text-white font-medium shadow-[0_4px_12px_rgba(128,128,0,0.2)]'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'} />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-white/5 bg-[#0A0E1A]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center font-bold text-red-500 border border-red-500/20">
              AD
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate text-white">{user?.name}</p>
                <p className="text-[10px] text-red-400 truncate tracking-widest font-bold">
                  CONTROL PANEL
                </p>
              </div>
            )}
            {!sidebarCollapsed && (
              <button
                onClick={handleLogout}
                className="p-1.5 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header navbar */}
        <header className="h-16 border-b border-white/5 bg-[#0D1321]/60 backdrop-blur-md flex items-center justify-between px-6 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 hover:bg-white/5 rounded-lg text-gray-400"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-sm font-bold tracking-wider text-gray-400 uppercase">
              CODEDOJO Management Console
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/student/dashboard"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold bg-[#808000]/10 border border-[#808000]/30 hover:bg-[#808000]/20 text-[#808000] px-3 py-1.5 rounded-lg transition-all"
            >
              Switch to Student View
            </Link>
            <div className="flex items-center gap-2 p-1 border-l border-white/10 pl-4">
              <div className="h-8 w-8 rounded-full bg-red-500/10 flex items-center justify-center font-bold text-red-500">
                A
              </div>
              <span className="text-xs font-semibold text-gray-300">{user?.name}</span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#090D16]">
          {children}
        </main>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden bg-[#090D16]/80 backdrop-blur-sm">
          <div className="w-64 bg-[#0D1321] h-full flex flex-col animate-slide-in">
            <div className="h-16 flex items-center justify-between px-4 border-b border-white/5">
              <span className="font-extrabold text-sm tracking-wider text-white flex items-center gap-1.5">
                CODEDOJO ADMIN <ShieldAlert size={14} className="text-[#808000]" />
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
              {adminNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm group ${
                      isActive
                        ? 'bg-[#808000] text-white font-medium'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
            <div className="p-4 border-t border-white/5 bg-[#0A0E1A] space-y-3">
              <Link
                href="/student/dashboard"
                className="w-full text-center block text-xs font-semibold bg-[#808000]/10 border border-[#808000]/30 hover:bg-[#808000]/20 text-[#808000] py-2 rounded-lg"
              >
                Student View
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 text-left border-t border-white/5"
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
