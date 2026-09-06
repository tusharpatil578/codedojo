'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  BookOpen, 
  HelpCircle, 
  GraduationCap, 
  ShieldCheck, 
  Server, 
  ArrowRight,
  ClipboardList,
  CalendarDays,
  Plus
} from 'lucide-react';

interface Stats {
  totalStudents: number;
  totalCourses: number;
  totalBatches: number;
  unresolvedTickets: number;
  averageGrade: number;
  dataSource: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch('/api/admin/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats);
        }
      } catch (err) {
        console.error('Failed to fetch admin stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-white/5 rounded-lg w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-28 bg-white/5 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6 animate-slide-in text-white">
      <div>
        <h2 className="text-xl md:text-2xl font-extrabold">Console Overview</h2>
        <p className="text-xs text-gray-400 font-semibold mt-0.5">Monitor school enrollment cohorts, query analytical metrics, and resolve support logs.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="glass-card p-5 space-y-2 border-l-4 border-l-[#808000]">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Enrolled Students</span>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-extrabold text-white">{stats.totalStudents}</p>
            <Users size={24} className="text-[#808000] opacity-80" />
          </div>
        </div>

        <div className="glass-card p-5 space-y-2">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Academic Courses</span>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-extrabold text-white">{stats.totalCourses}</p>
            <BookOpen size={24} className="text-[#808000] opacity-80" />
          </div>
        </div>

        <div className="glass-card p-5 space-y-2">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Pending Support Tickets</span>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-extrabold text-white">{stats.unresolvedTickets}</p>
            <HelpCircle size={24} className="text-[#808000] opacity-80" />
          </div>
        </div>

        <div className="glass-card p-5 space-y-2">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Average Course Grade</span>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-extrabold text-white">{stats.averageGrade}%</p>
            <GraduationCap size={24} className="text-[#808000] opacity-80" />
          </div>
        </div>

      </div>

      {/* GCP and BigQuery Analytics Connection Details */}
      <div className="glass-card p-6 flex flex-col md:flex-row items-center justify-between gap-6 border border-[#808000]/20 bg-[#808000]/5">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-full bg-[#808000]/10 flex items-center justify-center border border-[#808000]/30 text-[#808000] shrink-0 mt-0.5">
            <Server size={22} />
          </div>
          <div className="space-y-1">
            <h4 className="font-extrabold text-sm text-white">Big Data Analytical Warehouse Connection</h4>
            <p className="text-xs text-gray-400 font-semibold leading-relaxed">
              Google Cloud Platform (GCP) BigQuery integration is configured for streaming user grades, student attendance, and submission logs.
            </p>
            <span className="text-[10px] text-white font-mono bg-white/5 border border-white/5 px-2 py-0.5 rounded inline-block mt-2 font-bold">
              Active Connection Source: <span className="text-[#808000]">{stats.dataSource}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Backoffice Shortcuts */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Backoffice Operations</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/admin/attendance" className="glass-card p-5 space-y-3 block hover:border-[#808000]/40">
            <div className="h-9 w-9 rounded-lg bg-[#808000]/10 border border-[#808000]/20 flex items-center justify-center text-[#808000]">
              <CalendarDays size={18} />
            </div>
            <h4 className="font-extrabold text-sm text-white">Mark Bulk Attendance</h4>
            <p className="text-xs text-gray-400 font-medium leading-relaxed">
              Check off cohort present students from class logs and stream records to BigQuery.
            </p>
          </Link>

          <Link href="/admin/classes" className="glass-card p-5 space-y-3 block hover:border-[#808000]/40">
            <div className="h-9 w-9 rounded-lg bg-[#808000]/10 border border-[#808000]/20 flex items-center justify-center text-[#808000]">
              <Plus size={18} />
            </div>
            <h4 className="font-extrabold text-sm text-white">Schedule Lectures</h4>
            <p className="text-xs text-gray-400 font-medium leading-relaxed">
              Create upcoming classes, attach Zoom meeting parameters, and publish pre-read summaries.
            </p>
          </Link>

          <Link href="/admin/students" className="glass-card p-5 space-y-3 block hover:border-[#808000]/40">
            <div className="h-9 w-9 rounded-lg bg-[#808000]/10 border border-[#808000]/20 flex items-center justify-center text-[#808000]">
              <Users size={18} />
            </div>
            <h4 className="font-extrabold text-sm text-white">Manage Student Batches</h4>
            <p className="text-xs text-gray-400 font-medium leading-relaxed">
              Change cohort batches, link tech mentors, or toggle student suspended statuses.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
