'use client';

import React, { useState, useEffect } from 'react';
import { Users, Calendar, Video, Clock, CheckCircle2, ChevronRight, AlertCircle, FileText } from 'lucide-react';

interface MentorSession {
  id: string;
  mentor: {
    name: string;
    email: string;
  };
  date: string;
  time: string;
  topic: string;
  zoomLink: string | null;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  notes: string | null;
  feedback: string | null;
  actionItems: string | null;
}

interface AssignedMentor {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export default function StudentMentorPage() {
  const [sessions, setSessions] = useState<MentorSession[]>([]);
  const [mentor, setMentor] = useState<AssignedMentor | null>(null);
  const [loading, setLoading] = useState(true);

  // Booking states
  const [date, setDate] = useState('2026-08-31');
  const [time, setTime] = useState('18:00');
  const [topic, setTopic] = useState('Resume Review');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    async function loadMentorData() {
      try {
        const res = await fetch('/api/student/mentor');
        if (res.ok) {
          const data = await res.json();
          setSessions(data.sessions || []);
          setMentor(data.assignedMentor);
        }
      } catch (err) {
        console.error('Failed to load mentor logs:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMentorData();
  }, []);

  const handleBookSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(false);

    try {
      const res = await fetch('/api/student/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, time, topic })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Booking failed');

      setSessions(prev => [data.session, ...prev]);
      setBookingSuccess(true);
      setTimeout(() => setBookingSuccess(false), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to book slot.');
    }
  };

  const upcomingSessions = sessions.filter(s => s.status === 'SCHEDULED');
  const pastSessions = sessions.filter(s => s.status === 'COMPLETED' || s.status === 'CANCELLED');

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-white/5 rounded-lg w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-44 bg-white/5 rounded-xl" />
          <div className="md:col-span-2 h-44 bg-white/5 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-in text-white">
      <div>
        <span className="text-[10px] bg-[#808000]/10 text-[#808000] border border-[#808000]/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
          Mentorship Network
        </span>
        <h2 className="text-xl md:text-2xl font-extrabold mt-2">1-on-1 Mentorship</h2>
        <p className="text-xs text-gray-400 font-semibold mt-0.5">Book doubt-solving slots, resume review checklists, and mock placement interviews.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Assigned Mentor & Booking */}
        <div className="space-y-6">
          {/* Assigned Advisor Info */}
          <div className="glass-card p-5 space-y-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Your Assigned Tech Advisor</h3>
            
            {mentor ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-[#808000]/15 flex items-center justify-center font-bold text-[#808000] text-sm border border-[#808000]/30">
                    {mentor.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm">{mentor.name}</h4>
                    <p className="text-[10px] text-gray-400 font-medium">SDE Architect @ CODEDOJO</p>
                  </div>
                </div>
                <div className="text-[11px] text-gray-400 font-medium space-y-1 bg-white/5 p-3 rounded-lg border border-white/5">
                  <p>Email: <span className="text-white font-semibold">{mentor.email}</span></p>
                  <p>Contact: <span className="text-white font-semibold">+{mentor.phone}</span></p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-500 italic">No mentor assigned yet.</p>
            )}
          </div>

          {/* Booking Slots form */}
          <div className="glass-card p-5 space-y-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Book 1-on-1 session</h3>

            <form onSubmit={handleBookSession} className="space-y-3.5">
              {bookingSuccess && (
                <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-xs flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>Session booked successfully! Check notification.</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Choose Topic</label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full bg-[#0A0F1A] border border-white/5 focus:border-[#808000] rounded-lg px-3 py-2 text-xs text-white focus:outline-none transition-all appearance-none"
                >
                  <option className="bg-[#0D1321]" value="Resume Review">Resume Review & Profile Building</option>
                  <option className="bg-[#0D1321]" value="Technical Doubt Solving">GCP / BigQuery Doubt Solving</option>
                  <option className="bg-[#0D1321]" value="Mock Interview Loop">Mock coding/SQL Interview Loop</option>
                  <option className="bg-[#0D1321]" value="Project Architecture Review">Capstone project architecture review</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Select Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-[#0A0F1A] border border-white/5 focus:border-[#808000] rounded-lg px-3 py-2 text-xs text-white focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Time Slot</label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-[#0A0F1A] border border-white/5 focus:border-[#808000] rounded-lg px-3 py-2 text-xs text-white focus:outline-none transition-all appearance-none"
                >
                  <option className="bg-[#0D1321]" value="16:00">04:00 PM</option>
                  <option className="bg-[#0D1321]" value="17:00">05:00 PM</option>
                  <option className="bg-[#0D1321]" value="18:00">06:00 PM</option>
                  <option className="bg-[#0D1321]" value="19:00">07:00 PM</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={!mentor}
                className="w-full bg-[#808000] hover:bg-[#666600] disabled:bg-[#808000]/30 disabled:text-white/50 text-white font-extrabold text-xs py-2 rounded-lg shadow-[0_2px_8px_rgba(128,128,0,0.15)] transition-all"
              >
                Confirm Booking Slot
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Sessions log (upcoming & past) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Sessions list */}
          <div className="glass-card p-5 space-y-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Upcoming Booked Sessions</h3>

            <div className="space-y-3">
              {upcomingSessions.length === 0 ? (
                <p className="text-xs text-gray-500 italic py-2">No upcoming mentor calls booked.</p>
              ) : (
                upcomingSessions.map((s) => (
                  <div key={s.id} className="bg-white/5 border border-white/5 p-4 rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 relative">
                    <div className="space-y-1.5 text-xs font-semibold">
                      <span className="text-[9px] bg-[#808000]/10 border border-[#808000]/25 px-2 py-0.5 rounded text-[#808000] uppercase tracking-wider">
                        {s.topic}
                      </span>
                      <h4 className="font-extrabold text-sm text-white pt-1">Call with {s.mentor.name}</h4>
                      <p className="text-gray-400 flex items-center gap-1.5 text-[11px]">
                        <Clock size={12} className="text-[#808000]" /> {s.date} at {s.time} PM
                      </p>
                    </div>
                    {s.zoomLink && (
                      <a
                        href={s.zoomLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#808000] hover:bg-[#666600] text-white font-bold text-[10px] px-4 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all self-start sm:self-center shadow-[0_2px_8px_rgba(128,128,0,0.15)]"
                      >
                        <Video size={12} /> Join Call
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Past Sessions Checklist and comments */}
          <div className="glass-card p-5 space-y-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Past Session History & Reviews</h3>

            <div className="space-y-4">
              {pastSessions.length === 0 ? (
                <p className="text-xs text-gray-500 italic py-2">No completed sessions logs recorded.</p>
              ) : (
                pastSessions.map((s) => (
                  <div key={s.id} className="bg-white/5 border border-white/5 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2 text-xs">
                      <div>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{s.topic}</span>
                        <h4 className="font-bold text-white mt-0.5">Completed Call with {s.mentor.name}</h4>
                      </div>
                      <span className="text-[10px] text-gray-400 font-semibold">{s.date}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium text-gray-300">
                      {s.notes && (
                        <div className="space-y-1 bg-white/5 p-3 rounded-lg border border-white/5">
                          <span className="text-[9px] text-[#808000] font-bold uppercase tracking-wider">Advisor internal Notes</span>
                          <p className="leading-relaxed">{s.notes}</p>
                        </div>
                      )}

                      {s.feedback && (
                        <div className="space-y-1 bg-[#808000]/5 p-3 rounded-lg border border-[#808000]/15">
                          <span className="text-[9px] text-[#808000] font-bold uppercase tracking-wider">Student Feedback</span>
                          <p className="leading-relaxed text-gray-200">{s.feedback}</p>
                        </div>
                      )}
                    </div>

                    {s.actionItems && (
                      <div className="space-y-2 border-t border-white/5 pt-3">
                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">Assigned Action Items Checklist</span>
                        <div className="space-y-1 text-xs text-gray-300 font-semibold whitespace-pre-line pl-1 leading-normal">
                          {s.actionItems}
                        </div>
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
