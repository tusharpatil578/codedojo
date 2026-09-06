'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, LogOut, Menu, BookOpen, Clock } from 'lucide-react';

interface InstructorSession {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<InstructorSession | null>(null);
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
        if (data.authenticated && data.user.role === 'INSTRUCTOR') {
          setUser(data.user);
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
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#090D16] text-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-transparent border-[#808000]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090D16] flex text-white font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0D1321] border-r border-white/5 flex flex-col justify-between hidden md:flex shrink-0">
        <div className="p-6 space-y-6">
          <Link href="/" className="text-lg font-extrabold tracking-wider text-white">
            CODE<span className="text-[#808000]">DOJO</span> <span className="text-[10px] font-bold bg-[#808000]/15 text-[#808000] px-1.5 py-0.5 rounded ml-1">INSTRUCTOR</span>
          </Link>
          
          <nav className="space-y-1.5 pt-4">
            <Link 
              href="/instructor/dashboard" 
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
                pathname === '/instructor/dashboard' ? 'bg-[#808000] text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Home size={16} /> Teacher Dashboard
            </Link>
          </nav>
        </div>

        <div className="p-6 border-t border-white/5 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-[#808000]/10 flex items-center justify-center font-bold text-xs text-[#808000] border border-[#808000]/25">
              {user?.name ? user.name[0] : 'T'}
            </div>
            <div className="truncate text-xs font-semibold">
              <p className="text-white">{user?.name}</p>
              <p className="text-gray-500 text-[10px] truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={16} /> Log Out
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-white/5 bg-[#0D1321]/40 flex items-center justify-between px-6 md:justify-end">
          <button className="p-2 md:hidden text-white hover:bg-white/5 rounded-lg">
            <Menu size={20} />
          </button>
          
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-gray-400">Teacher Portal Live</span>
          </div>
        </header>

        <main className="p-6 md:p-8 overflow-y-auto flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
