'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HelpCircle, AlertCircle, CheckCircle2, Clock, Send, Plus, ArrowRight } from 'lucide-react';

interface Ticket {
  id: string;
  title: string;
  category: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
}

export default function StudentSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Technical Issue');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [ticketRaised, setTicketRaised] = useState(false);

  useEffect(() => {
    async function loadTickets() {
      try {
        const res = await fetch('/api/student/tickets');
        if (res.ok) {
          const data = await res.json();
          setTickets(data.tickets || []);
        }
      } catch (err) {
        console.error('Failed to load tickets:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTickets();
  }, []);

  const handleRaiseTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;
    setSubmitting(true);
    setTicketRaised(false);

    try {
      const res = await fetch('/api/student/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, category })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit ticket');

      setTickets(prev => [data.ticket, ...prev]);
      setTitle('');
      setDescription('');
      setTicketRaised(true);
      setTimeout(() => setTicketRaised(false), 4000);
    } catch (err) {
      alert('Error raising ticket. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const categories = [
    'Technical Issue', 'Class Issue', 'Attendance', 'Assignment', 'Payment', 'Certificate', 'Mentor', 'Other'
  ];

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-white/5 rounded-lg w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-64 bg-white/5 rounded-xl" />
          <div className="md:col-span-2 h-64 bg-white/5 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-in text-white">
      <div>
        <span className="text-[10px] bg-[#808000]/10 text-[#808000] border border-[#808000]/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
          Student Helpdesk
        </span>
        <h2 className="text-xl md:text-2xl font-extrabold mt-2">Raise Support Ticket</h2>
        <p className="text-xs text-gray-400 font-semibold mt-0.5">Submit query tickets regarding class recordings, scores, certificates, or technical loops.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Form to raise ticket */}
        <div className="glass-card p-5 space-y-4">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
            <Plus size={14} className="text-[#808000]" /> Log a New Ticket
          </h3>

          <form onSubmit={handleRaiseTicket} className="space-y-4">
            {ticketRaised && (
              <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-xs flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>Ticket logged successfully! Our advisors will reply.</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#0A0F1A] border border-white/5 focus:border-[#808000] rounded-lg px-3 py-2 text-xs text-white focus:outline-none transition-all appearance-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-[#0D1321]">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Short Subject</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="BigQuery partition limits..."
                className="w-full bg-[#0A0F1A] border border-white/5 focus:border-[#808000] rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Elaborate Issue</label>
              <textarea
                rows={5}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your issue or upload relevant GCP error codes..."
                className="w-full bg-[#0A0F1A] border border-white/5 focus:border-[#808000] rounded-lg p-3 text-xs text-white focus:outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#808000] hover:bg-[#666600] disabled:bg-[#808000]/30 text-white font-extrabold text-xs py-2.5 rounded-lg shadow-[0_2px_8px_rgba(128,128,0,0.15)] transition-all flex items-center justify-center gap-1"
            >
              {submitting ? 'Logging Ticket...' : 'File Ticket'}
            </button>
          </form>
        </div>

        {/* Right Column: Ticket history list */}
        <div className="lg:col-span-2 glass-card p-5 space-y-4">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Active Filed Tickets</h3>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {tickets.length === 0 ? (
              <div className="text-center py-10 bg-white/5 rounded-xl border border-white/5">
                <p className="text-xs text-gray-500 italic">No tickets raised. Your log is empty.</p>
              </div>
            ) : (
              tickets.map((t) => {
                let statusColor = 'text-gray-400 bg-white/5 border-white/10';
                let StatusIcon = Clock;

                if (t.status === 'OPEN') {
                  statusColor = 'text-green-400 bg-green-500/10 border-green-500/20';
                  StatusIcon = CheckCircle2;
                } else if (t.status === 'IN_PROGRESS') {
                  statusColor = 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
                  StatusIcon = Clock;
                } else if (t.status === 'RESOLVED') {
                  statusColor = 'text-gray-400 bg-white/5 border-white/10';
                  StatusIcon = CheckCircle2;
                } else {
                  statusColor = 'text-gray-500 bg-white/5 border-white/5';
                  StatusIcon = AlertCircle;
                }

                return (
                  <div
                    key={t.id}
                    className="bg-[#0D1321]/40 border border-white/5 p-4 rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-[#808000]/40 transition-all group"
                  >
                    <div className="space-y-1.5 text-xs font-semibold">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[9px] bg-white/5 border border-white/5 px-2 py-0.5 rounded text-gray-400 uppercase font-extrabold tracking-wider">
                          {t.category}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[9px] font-extrabold tracking-wider ${statusColor}`}>
                          <StatusIcon size={10} /> {t.status}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-sm text-white pt-1">{t.title}</h4>
                      <p className="text-[10px] text-gray-500 font-medium">Logged on {new Date(t.createdAt).toLocaleDateString()}</p>
                    </div>

                    <Link
                      href={`/student/support/${t.id}`}
                      className="text-xs text-white bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 px-4 py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1 group/btn self-start sm:self-center"
                    >
                      Open Chat Thread <ArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
