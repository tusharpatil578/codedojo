'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, Video, Clock, CheckCircle2, User, PlayCircle, Users } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
}

interface ClassItem {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  zoomLink: string;
  status: string;
  batchName: string;
}

export default function InstructorDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/instructor/stats');
        if (res.ok) {
          const data = await res.json();
          setCourses(data.courses || []);
          setClasses(data.classes || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const upcomingClasses = classes.filter(c => c.status === 'UPCOMING' || c.status === 'LIVE');
  const pastClasses = classes.filter(c => c.status === 'COMPLETED');

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
    <div className="space-y-6 animate-slide-in text-white font-sans">
      <div>
        <h2 className="text-xl md:text-2xl font-extrabold">Teacher Console</h2>
        <p className="text-xs text-gray-400 font-semibold mt-0.5 font-medium">Coordinate your technology courses, launch live Zoom classes, and trace curriculum logs.</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-5 space-y-2 border-l-4 border-l-[#808000]">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Courses Taught</span>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-extrabold">{courses.length}</p>
            <BookOpen size={20} className="text-[#808000] opacity-80" />
          </div>
        </div>

        <div className="glass-card p-5 space-y-2">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Upcoming Lectures</span>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-extrabold">{upcomingClasses.length}</p>
            <Calendar size={20} className="text-[#808000] opacity-80" />
          </div>
        </div>

        <div className="glass-card p-5 space-y-2">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Lectures Hosted</span>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-extrabold">{pastClasses.length}</p>
            <CheckCircle2 size={20} className="text-[#808000] opacity-80" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: List of courses */}
        <div className="glass-card p-5 space-y-4">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Active Curriculum Courses</h3>
          
          <div className="space-y-3.5">
            {courses.length === 0 ? (
              <p className="text-xs text-gray-500 italic">No courses mapped to your instructor profile.</p>
            ) : (
              courses.map(c => (
                <div key={c.id} className="bg-white/5 border border-white/5 p-4 rounded-xl space-y-1.5 font-semibold text-xs">
                  <h4 className="font-extrabold text-sm text-white">{c.title}</h4>
                  <p className="text-gray-400 font-medium leading-relaxed">{c.description || 'Technology curriculum pathway.'}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Classes scheduled */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Schedule */}
          <div className="glass-card p-5 space-y-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Host Upcoming Classes</h3>

            <div className="space-y-3">
              {upcomingClasses.length === 0 ? (
                <p className="text-xs text-gray-500 italic py-2">No upcoming lectures scheduled to host.</p>
              ) : (
                upcomingClasses.map(c => (
                  <div key={c.id} className="bg-white/5 border border-white/5 p-4 rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="space-y-1.5 text-xs font-semibold">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[9px] bg-[#808000]/10 border border-[#808000]/20 px-2 py-0.5 rounded text-[#808000] uppercase font-extrabold tracking-wider">
                          Cohort: {c.batchName}
                        </span>
                        {c.status === 'LIVE' && (
                          <span className="text-[9px] font-extrabold text-red-500 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 animate-pulse">
                            LIVE NOW
                          </span>
                        )}
                      </div>
                      <h4 className="font-extrabold text-sm text-white pt-0.5">{c.title}</h4>
                      <p className="text-gray-500 flex items-center gap-1 text-[11px]"><Clock size={12} /> {c.date} ({c.startTime} - {c.endTime} PM)</p>
                    </div>

                    <a
                      href={c.zoomLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-[10px] px-5 py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all self-start sm:self-center shadow-[0_2px_8px_rgba(239,68,68,0.2)]"
                    >
                      <Video size={12} /> Start Broadcast Class
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Past classes list */}
          <div className="glass-card p-5 space-y-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Completed Lectures History</h3>

            <div className="space-y-3">
              {pastClasses.length === 0 ? (
                <p className="text-xs text-gray-500 italic">No historical lectures logged.</p>
              ) : (
                pastClasses.map(c => (
                  <div key={c.id} className="bg-[#0D1321]/45 border border-white/5 p-4 rounded-xl flex items-center justify-between gap-4 text-xs font-semibold">
                    <div className="space-y-1">
                      <h4 className="font-bold text-white">{c.title}</h4>
                      <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">Cohort: {c.batchName}</p>
                    </div>
                    <span className="text-gray-400">{c.date}</span>
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
