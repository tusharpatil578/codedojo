'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  BookOpen,
  Calendar,
  FileText,
  Trophy,
  Award,
  Users,
  HelpCircle,
  Menu,
  X,
  Search,
  Bell,
  LogOut,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  LifeBuoy
} from 'lucide-react';

interface UserSession {
  id: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
  avatarUrl?: string;
  studentProfile?: {
    course?: {
      title: string;
      id: string;
    };
    batch?: {
      name: string;
      id: string;
    };
  };
}

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    // Fetch logged-in user profile
    async function fetchUser() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.status === 401) {
          router.push('/login');
          return;
        }
        const data = await res.json();
        if (data.authenticated) {
          setUser(data.user);
          // Fetch notifications as well
          const notifRes = await fetch('/api/student/notifications');
          if (notifRes.ok) {
            const notifData = await notifRes.json();
            setNotifications(notifData.notifications || []);
          }
        } else {
          router.push('/login');
        }
      } catch (err) {
        console.error('Error fetching session:', err);
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

  const navItems = [
    { label: 'Dashboard', path: '/student/dashboard', icon: Home, category: 'Main' },
    { label: 'AI Sandbox', path: '/student/sandbox', icon: Sparkles, category: 'Main' },
    { label: 'Curriculum', path: '/student/curriculum', icon: BookOpen, category: 'Learn & Practice' },
    { label: 'Leaderboard', path: '/student/leaderboard', icon: Trophy, category: 'Learn & Practice' },
    { label: 'Attendance', path: '/student/attendance', icon: Calendar, category: 'Learn & Practice' },
    { label: 'Mentor Sessions', path: '/student/mentor', icon: Users, category: 'Career & Growth' },
    { label: 'Certificates', path: '/student/certificates', icon: Award, category: 'Career & Growth' },
    { label: 'Raise Ticket', path: '/student/support', icon: HelpCircle, category: 'Support' },
  ];

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#060913]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-t-transparent border-emerald-500" />
          <p className="text-sm font-semibold tracking-wider text-gray-400">LOADING DOOMSDAY.COURSES...</p>
        </div>
      </div>
    );
  }

  const courseTitle = user?.studentProfile?.course?.title || 'Data Science & Machine Learning';
  const batchName = user?.studentProfile?.batch?.name || 'DSML Aug 2026';

  const unreadNotifs = notifications.filter(n => !n.isRead).length;

  return (
    <div className="flex h-screen bg-[#060913] text-white overflow-hidden">
      {/* Sidebar for Desktop */}
      <aside
        className={`hidden md:flex flex-col bg-[#070B16] border-r border-white/5 transition-all duration-300 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/5">
          <Link href="/student/dashboard" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]">
              DC
            </div>
            {!sidebarCollapsed && (
              <span className="font-extrabold text-lg tracking-wider bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
                DOOMSDAY
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

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {['Main', 'Learn & Practice', 'Career & Growth', 'Support'].map((cat) => {
            const catItems = navItems.filter((i) => i.category === cat);
            return (
              <div key={cat} className="space-y-1">
                {!sidebarCollapsed && (
                  <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 mb-2">
                    {cat}
                  </h4>
                )}
                {catItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname.startsWith(item.path);
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm group ${
                        isActive
                          ? 'bg-emerald-500 text-white font-medium shadow-[0_4px_12px_rgba(16,185,129,0.2)]'
                          : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Icon size={18} className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'} />
                      {!sidebarCollapsed && <span>{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer User Detail */}
        <div className="p-3 border-t border-white/5 bg-[#0A0E1A]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center font-bold text-emerald-400">
              {user?.name.split(' ').map(n => n[0]).join('') || 'S'}
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate text-white">{user?.name}</p>
                <p className="text-[10px] text-gray-400 truncate uppercase tracking-widest font-bold">
                  {user?.role}
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

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 border-b border-white/5 bg-[#0D1321]/60 backdrop-blur-md flex items-center justify-between px-4 z-20">
          <div className="flex items-center gap-3">
            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 hover:bg-white/5 rounded-lg text-gray-400"
            >
              <Menu size={20} />
            </button>

            {/* Course Batch Information */}
            <div className="hidden sm:flex flex-col">
              <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase">
                {courseTitle}
              </span>
              <span className="text-[10px] text-gray-400 font-medium">
                Active Batch: {batchName}
              </span>
            </div>
          </div>

          {/* Search, Notifications and Profile Dropdown */}
          <div className="flex items-center gap-4">
            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white relative"
              >
                <Bell size={18} />
                {unreadNotifs > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 animate-ping" />
                )}
              </button>
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 glass-card p-4 space-y-3 z-30 animate-slide-in">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="font-bold text-xs">Notifications</span>
                    <button
                      onClick={async () => {
                        await fetch('/api/student/notifications/read', { method: 'POST' });
                        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
                      }}
                      className="text-[10px] text-emerald-400 hover:underline"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-gray-400 text-center py-4">No notifications yet</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-2 rounded-lg text-xs border ${
                            n.isRead ? 'bg-transparent border-transparent' : 'bg-emerald-500/10 border-emerald-500/20'
                          }`}
                        >
                          <p className="text-gray-200">{n.message}</p>
                          <span className="text-[9px] text-gray-500 mt-1 block">
                            {new Date(n.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 hover:bg-white/5 rounded-lg text-left"
              >
                <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center font-bold text-emerald-400 border border-emerald-500/30">
                  {user?.name.split(' ').map(n => n[0]).join('')}
                </div>
                <span className="hidden sm:inline text-xs font-semibold text-gray-300">{user?.name}</span>
              </button>
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 glass-card py-1.5 z-30 animate-slide-in">
                  <div className="px-3 py-2 border-b border-white/5">
                    <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
                    <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
                  </div>
                  <Link
                    href="/student/profile"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:bg-white/5 hover:text-white"
                  >
                    <User size={14} /> My Profile
                  </Link>
                  <Link
                    href="/student/support"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:bg-white/5 hover:text-white"
                  >
                    <LifeBuoy size={14} /> Help Support
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 text-left border-t border-white/5"
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#060913]">
          {children}
        </main>
      </div>

      {/* Drawer for Mobile Devices */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden bg-[#060913]/80 backdrop-blur-sm">
          <div className="w-64 bg-[#0D1321] h-full flex flex-col animate-slide-in">
            <div className="h-16 flex items-center justify-between px-4 border-b border-white/5">
              <span className="font-extrabold text-lg tracking-wider text-emerald-400">DOOMSDAY</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
              {['Main', 'Learn & Practice', 'Career & Growth', 'Support'].map((cat) => {
                const catItems = navItems.filter((i) => i.category === cat);
                return (
                  <div key={cat} className="space-y-1">
                    <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 mb-2">
                      {cat}
                    </h4>
                    {catItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname.startsWith(item.path);
                      return (
                        <Link
                          key={item.path}
                          href={item.path}
                          onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm group ${
                            isActive
                              ? 'bg-emerald-500 text-white font-medium shadow-[0_4px_12px_rgba(16,185,129,0.2)]'
                              : 'text-gray-400 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <Icon size={18} />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                );
              })}
            </div>
            <div className="p-4 border-t border-white/5 bg-[#0A0E1A]">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center font-bold text-emerald-400">
                  {user?.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate text-white">{user?.name}</p>
                  <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
