'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, XCircle, Clock, AlertTriangle, ArrowRight } from 'lucide-react';

interface AttendanceRecord {
  id: string;
  date: string;
  classTitle: string;
  instructorName: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
}

interface MonthlyReport {
  month: string;
  attended: number;
  total: number;
  percentage: number;
}

export default function StudentAttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [monthlyReport, setMonthlyReport] = useState<MonthlyReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAttendance() {
      try {
        const res = await fetch('/api/student/attendance');
        if (res.ok) {
          const data = await res.json();
          setRecords(data.records || []);
          setMonthlyReport(data.monthlyReport || []);
        }
      } catch (err) {
        console.error('Failed to load attendance records:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAttendance();
  }, []);

  const totalClasses = records.length;
  const attendedClasses = records.filter(r => r.status === 'PRESENT' || r.status === 'LATE').length;
  const overallPercentage = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 100;

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-white/5 rounded-lg w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-32 bg-white/5 rounded-xl" />
          <div className="h-32 bg-white/5 rounded-xl" />
          <div className="h-32 bg-white/5 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-in text-white">
      <div>
        <span className="text-[10px] bg-[#808000]/10 text-[#808000] border border-[#808000]/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
          Performance Logs
        </span>
        <h2 className="text-xl md:text-2xl font-extrabold mt-2">Attendance Summary</h2>
        <p className="text-xs text-gray-400 font-semibold mt-0.5">Track your class check-ins, monthly summaries, and total lectures.</p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Overall Percentage Card */}
        <div className="glass-card p-5 flex items-center justify-between border-l-4 border-l-[#808000]">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Overall Rate</span>
            <p className="text-3xl font-extrabold text-white">{overallPercentage}%</p>
            <span className="text-[10px] text-gray-400 font-semibold mt-1 block">Attended {attendedClasses} of {totalClasses} classes</span>
          </div>
          <div className="h-14 w-14 rounded-full border-4 border-[#808000] border-t-transparent flex items-center justify-center font-bold text-sm text-[#808000]">
            {overallPercentage}%
          </div>
        </div>

        {/* Monthly Breakdown */}
        <div className="md:col-span-2 glass-card p-5 space-y-4">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Monthly Performance Breakdown</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {monthlyReport.length === 0 ? (
              <p className="text-xs text-gray-500 italic">No historical logs available.</p>
            ) : (
              monthlyReport.map((m) => (
                <div key={m.month} className="bg-white/5 border border-white/5 p-3 rounded-lg text-center space-y-1">
                  <span className="text-[10px] text-gray-400 font-bold">{m.month}</span>
                  <p className="text-lg font-extrabold text-white">{m.percentage}%</p>
                  <span className="text-[9px] text-gray-500 font-semibold block">({m.attended}/{m.total} classes)</span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Detailed logs table */}
      <div className="glass-card p-5 space-y-4">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Lecture Check-in History</h3>

        <div className="overflow-x-auto border border-white/5 rounded-lg">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5 text-gray-400 font-bold uppercase tracking-wider">
                <th className="p-3 text-[10px]">Date</th>
                <th className="p-3 text-[10px]">Lecture Topic</th>
                <th className="p-3 text-[10px]">Instructor</th>
                <th className="p-3 text-[10px] text-right">Attendance Status</th>
              </tr>
            </thead>
            <tbody className="font-semibold text-gray-300">
              {records.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-xs text-gray-500 italic">No check-in logs present.</td>
                </tr>
              ) : (
                records.map((r) => {
                  let statusColor = 'text-gray-400 bg-white/5 border-white/10';
                  let StatusIcon = Clock;

                  if (r.status === 'PRESENT') {
                    statusColor = 'text-green-400 bg-green-500/10 border-green-500/20';
                    StatusIcon = CheckCircle2;
                  } else if (r.status === 'ABSENT') {
                    statusColor = 'text-red-400 bg-red-500/10 border-red-500/20';
                    StatusIcon = XCircle;
                  } else if (r.status === 'LATE') {
                    statusColor = 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
                    StatusIcon = AlertTriangle;
                  } else if (r.status === 'EXCUSED') {
                    statusColor = 'text-blue-400 bg-blue-500/10 border-blue-500/20';
                    StatusIcon = Clock;
                  }

                  return (
                    <tr key={r.id} className="border-b border-white/5 hover:bg-white/5 transition-all">
                      <td className="p-3 text-gray-400">{r.date}</td>
                      <td className="p-3 truncate max-w-64 text-white font-bold">{r.classTitle}</td>
                      <td className="p-3">{r.instructorName}</td>
                      <td className="p-3 text-right">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-bold ${statusColor}`}>
                          <StatusIcon size={12} /> {r.status}
                        </span>
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
