'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HelpCircle, Clock, CheckCircle2, AlertCircle, ArrowRight, User } from 'lucide-react';

interface Ticket {
  id: string;
  title: string;
  category: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
  student: {
    name: string;
    email: string;
  };
}

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTickets() {
      try {
        const res = await fetch('/api/admin/tickets');
        if (res.ok) {
          const data = await res.json();
          setTickets(data.tickets || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadTickets();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-white/5 rounded-lg w-1/4" />
        <div className="h-64 bg-white/5 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-in text-white">
      <div>
        <h2 className="text-xl md:text-2xl font-extrabold">Student Support Helpdesk</h2>
        <p className="text-xs text-gray-400 font-semibold mt-0.5">Track, assign and resolve support tickets raised by students across course modules.</p>
      </div>

      {/* Tickets List */}
      <div className="glass-card p-5 space-y-4">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Active Filed Tickets</h3>

        <div className="overflow-x-auto border border-white/5 rounded-lg">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5 text-gray-400 font-bold uppercase tracking-wider">
                <th className="p-3.5 text-[10px]">Date Filed</th>
                <th className="p-3.5 text-[10px]">Student Name</th>
                <th className="p-3.5 text-[10px]">Ticket Subject</th>
                <th className="p-3.5 text-[10px]">Category</th>
                <th className="p-3.5 text-[10px]">Status</th>
                <th className="p-3.5 text-[10px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="font-semibold text-gray-300">
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-xs text-gray-500 italic">No tickets raised. Helpdesk queue is empty.</td>
                </tr>
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
                    <tr key={t.id} className="border-b border-white/5 hover:bg-white/5 transition-all">
                      <td className="p-3.5 text-gray-400">{new Date(t.createdAt).toLocaleDateString()}</td>
                      <td className="p-3.5">
                        <p className="text-white font-extrabold flex items-center gap-1.5"><User size={12} className="text-gray-500" /> {t.student.name}</p>
                        <p className="text-gray-500 text-[10px]">{t.student.email}</p>
                      </td>
                      <td className="p-3.5 font-bold text-white max-w-48 truncate">{t.title}</td>
                      <td className="p-3.5">
                        <span className="text-[9px] bg-white/5 border border-white/5 px-2 py-0.5 rounded text-gray-400 font-extrabold uppercase">
                          {t.category}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[9px] font-extrabold tracking-wider ${statusColor}`}>
                          <StatusIcon size={10} /> {t.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <Link
                          href={`/admin/support/${t.id}`}
                          className="bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 hover:text-white px-3.5 py-1.5 rounded-lg text-gray-400 font-bold transition-all inline-flex items-center gap-1 group/btn"
                        >
                          Answer Ticket <ArrowRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
