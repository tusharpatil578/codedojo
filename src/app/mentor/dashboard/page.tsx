'use client';

import React, { useState, useEffect } from 'react';
import { Users, Calendar, Video, Clock, CheckCircle2, User, Mail, Award } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  batchName: string;
}

interface Session {
  id: string;
  studentName: string;
  studentEmail: string;
  date: string;
  time: string;
  topic: string;
  zoomLink: string;
  status: string;
  notes: string | null;
  actionItems: string | null;
}

export default function MentorDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/mentor/stats');
        if (res.ok) {
          const data = await res.json();
          setStudents(data.students || []);
          setSessions(data.sessions || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const upcomingCalls = sessions.filter(s => s.status === 'SCHEDULED');
  const pastCalls = sessions.filter(s => s.status === 'COMPLETED');

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-white/5 rounded-lg w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(n => (
            <div key={n} className="h-28 bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-in text-white">
      <div>
        <h2 className="text-xl md:text-2xl font-extrabold">Mentor Console</h2>
        <p className="text-xs text-gray-400 font-semibold mt-0.5">Manage your assigned student cohort list, scheduled call bookings, and advice action logs.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-5 space-y-2 border-l-4 border-l-[#808000]">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Assigned Students</span>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-extrabold">{students.length}</p>
            <Users size={20} className="text-[#808000] opacity-80" />
          </div>
        </div>

        <div className="glass-card p-5 space-y-2">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Upcoming Bookings</span>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-extrabold">{upcomingCalls.length}</p>
            <Calendar size={20} className="text-[#808000] opacity-80" />
          </div>
        </div>

        <div className="glass-card p-5 space-y-2">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Completed Calls</span>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-extrabold">{pastCalls.length}</p>
            <CheckCircle2 size={20} className="text-[#808000] opacity-80" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: List of assigned students */}
        <div className="glass-card p-5 space-y-4">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Assigned Students</h3>
          
          <div className="space-y-3.5">
            {students.length === 0 ? (
              <p className="text-xs text-gray-500 italic">No students linked to your advisor profile.</p>
            ) : (
              students.map(s => (
                <div key={s.id} className="bg-white/5 border border-white/5 p-3 rounded-xl space-y-1.5 font-semibold text-xs">
                  <div className="flex items-center gap-1.5 text-white font-extrabold">
                    <User size={14} className="text-[#808000]" /> {s.name}
                  </div>
                  <div className="text-gray-400 font-medium space-y-1 pl-5">
                    <p className="flex items-center gap-1"><Mail size={12} /> {s.email}</p>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Cohort: {s.batchName}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Scheduled slots */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-5 space-y-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Upcoming Session Bookings</h3>
            
            <div className="space-y-3">
              {upcomingCalls.length === 0 ? (
                <p className="text-xs text-gray-500 italic py-2">No upcoming mentor calls scheduled.</p>
              ) : (
                upcomingCalls.map(c => (
                  <div key={c.id} className="bg-white/5 border border-white/5 p-4 rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="space-y-1.5 text-xs font-semibold">
                      <span className="text-[9px] bg-[#808000]/10 border border-[#808000]/20 px-2 py-0.5 rounded text-[#808000] uppercase font-extrabold tracking-wider">
                        {c.topic}
                      </span>
                      <h4 className="font-extrabold text-sm text-white pt-1">Call with {c.studentName}</h4>
                      <p className="text-gray-500 flex items-center gap-1 text-[11px]"><Clock size={12} /> {c.date} at {c.time} PM</p>
                    </div>

                    <a
                      href={c.zoomLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#808000] hover:bg-[#666600] text-white font-bold text-[10px] px-4 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all self-start sm:self-center"
                    >
                      <Video size={12} /> Join Call
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Past logs list */}
          <div className="glass-card p-5 space-y-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Completed Sessions Log</h3>

            <div className="space-y-3">
              {pastCalls.length === 0 ? (
                <p className="text-xs text-gray-500 italic">No past sessions logged.</p>
              ) : (
                pastCalls.map(c => (
                  <div key={c.id} className="bg-[#0D1321]/45 border border-white/5 p-4 rounded-xl space-y-2 text-xs">
                    <div className="flex justify-between items-start border-b border-white/5 pb-2">
                      <div>
                        <span className="text-[9px] text-[#808000] font-bold uppercase tracking-wider">{c.topic}</span>
                        <h4 className="font-bold text-white mt-0.5">Session with {c.studentName}</h4>
                      </div>
                      <span className="text-[10px] text-gray-400 font-semibold">{c.date}</span>
                    </div>
                    {c.notes && (
                      <div className="space-y-1">
                        <span className="text-[9px] text-gray-500 block uppercase tracking-wider">Advisor Notes</span>
                        <p className="text-gray-300 font-medium leading-relaxed">{c.notes}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
