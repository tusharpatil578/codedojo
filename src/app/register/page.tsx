'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  BookOpen, 
  ArrowRight,
  AlertCircle 
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [courseId, setCourseId] = useState('');
  const [courses, setCourses] = useState<any[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await fetch('/api/public/courses');
        if (res.ok) {
          const data = await res.json();
          setCourses(data.courses || []);
          if (data.courses && data.courses.length > 0) {
            setCourseId(data.courses[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load courses:', err);
      }
    }
    loadCourses();
  }, []);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password, courseId }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      router.push('/student/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Something went wrong during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060913] flex items-center justify-center p-4">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]">
              DC
            </div>
            <span className="font-extrabold text-lg tracking-wider text-white">
              doomsday<span className="text-emerald-400 font-light">.courses</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold text-white">Create your student account</h2>
          <p className="text-xs text-gray-400 font-medium">Join over 20+ students on the batch leaderboards today.</p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleRegisterSubmit} className="glass-card p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              Full Name
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Amit Sharma"
                className="w-full bg-[#0A0F1A] border border-white/5 focus:border-emerald-500 rounded-lg pl-10 pr-4 py-2 text-xs text-white focus:outline-none transition-all focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="amit@codedojo.com"
                className="w-full bg-[#0A0F1A] border border-white/5 focus:border-emerald-500 rounded-lg pl-10 pr-4 py-2 text-xs text-white focus:outline-none transition-all focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              Phone Number
            </label>
            <div className="relative">
              <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9900000021"
                className="w-full bg-[#0A0F1A] border border-white/5 focus:border-emerald-500 rounded-lg pl-10 pr-4 py-2 text-xs text-white focus:outline-none transition-all focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              Select Program Pathway
            </label>
            <div className="relative">
              <BookOpen size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <select
                required
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full bg-[#0A0F1A] border border-white/5 focus:border-emerald-500 rounded-lg pl-10 pr-4 py-2 text-xs text-white focus:outline-none transition-all focus:ring-1 focus:ring-emerald-500 appearance-none"
              >
                {courses.length === 0 ? (
                  <option>Loading courses...</option>
                ) : (
                  courses.map((c) => (
                    <option key={c.id} value={c.id} className="bg-[#0D1321] text-white">
                      {c.title}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              Choose Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0A0F1A] border border-white/5 focus:border-emerald-500 rounded-lg pl-10 pr-4 py-2 text-xs text-white focus:outline-none transition-all focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-white font-bold text-xs py-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 mt-2"
          >
            {loading ? 'Creating Account...' : 'Register & Enter'} <ArrowRight size={14} />
          </button>
        </form>

        {/* Login redirect */}
        <div className="text-center text-xs text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="text-emerald-400 hover:underline font-bold">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
