'use client';

import React, { useState, useEffect } from 'react';
import { UserCheck, CheckCircle2, AlertCircle, Save, FileSpreadsheet, Search, Check, X, ShieldAlert } from 'lucide-react';

interface ClassItem {
  id: string;
  title: string;
  date: string;
  batch: {
    name: string;
  };
}

interface StudentAttendanceRecord {
  userId: string;
  name: string;
  email: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
}

export default function AdminAttendancePage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [students, setStudents] = useState<StudentAttendanceRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load classes initially
  useEffect(() => {
    async function loadClasses() {
      try {
        const res = await fetch('/api/admin/attendance');
        if (res.ok) {
          const data = await res.json();
          setClasses(data.classes || []);
          if (data.classes && data.classes.length > 0) {
            setSelectedClassId(data.classes[0].id);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingClasses(false);
      }
    }
    loadClasses();
  }, []);

  // Load students when class selection changes
  useEffect(() => {
    if (!selectedClassId) return;
    setLoadingStudents(true);
    setSaveSuccess(false);

    async function loadCohort() {
      try {
        const res = await fetch(`/api/admin/attendance?classId=${selectedClassId}`);
        if (res.ok) {
          const data = await res.json();
          setStudents(data.students || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingStudents(false);
      }
    }
    loadCohort();
  }, [selectedClassId]);

  const handleStatusChange = (userId: string, newStatus: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED') => {
    setStudents(prev => prev.map(s => {
      if (s.userId === userId) {
        return { ...s, status: newStatus };
      }
      return s;
    }));
  };

  const handleBulkMark = (status: 'PRESENT' | 'ABSENT' | 'LATE') => {
    setStudents(prev => prev.map(s => ({ ...s, status })));
  };

  const handleSaveAttendance = async () => {
    setSaveSuccess(false);
    try {
      const res = await fetch('/api/admin/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId: selectedClassId,
          records: students.map(s => ({ userId: s.userId, status: s.status }))
        })
      });

      if (!res.ok) throw new Error('Save failed');

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      alert('Failed to save attendance check-ins. Try again.');
    }
  };

  const handleExportCSV = () => {
    const activeClass = classes.find(c => c.id === selectedClassId);
    if (!activeClass || students.length === 0) return;

    // Build CSV content
    const headers = ['Student Name', 'Email Address', 'Attendance Status'];
    const rows = students.map(s => [s.name, s.email, s.status]);
    const csvContent = [headers, ...rows].map(e => e.map(val => `"${val}"`).join(',')).join('\n');

    // Trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Attendance_${activeClass.title.replace(/\s+/g, '_')}_${activeClass.date}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loadingClasses) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-white/5 rounded-lg w-1/4" />
        <div className="h-64 bg-white/5 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-in text-white">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold">Mark Student Attendance</h2>
          <p className="text-xs text-gray-400 font-semibold mt-0.5 font-medium">Record check-in logs for batch lectures, run bulk inputs, and export analytics spreadsheets.</p>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-xs flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>Attendance logs synced to SQLite and streamed to Google BigQuery successfully!</span>
        </div>
      )}

      {/* Selector and filters */}
      <div className="glass-card p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          {/* Class Select Dropdown */}
          <div className="space-y-1.5 flex-1 max-w-md">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Choose Lecture Session</label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full bg-[#0A0F1A] border border-white/5 focus:border-[#808000] rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none transition-all appearance-none"
            >
              {classes.length === 0 ? (
                <option>No classes scheduled yet</option>
              ) : (
                classes.map((c) => (
                  <option key={c.id} value={c.id} className="bg-[#0D1321]">
                    [{c.date}] {c.title} — {c.batch.name}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-64">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search student by name..."
              className="w-full bg-[#0A0F1A] border border-white/5 focus:border-[#808000] rounded-lg pl-10 pr-4 py-2 text-xs text-white focus:outline-none transition-all focus:ring-1 focus:ring-[#808000]"
            />
          </div>
        </div>

        {/* Bulk tools */}
        {selectedClassId && students.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5 text-xs font-semibold text-gray-400">
            <span className="self-center pr-2">Bulk Controls:</span>
            <button
              onClick={() => handleBulkMark('PRESENT')}
              className="bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 px-3 py-1.5 rounded-lg transition-all"
            >
              Mark All Present
            </button>
            <button
              onClick={() => handleBulkMark('ABSENT')}
              className="bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition-all"
            >
              Mark All Absent
            </button>
            <button
              onClick={() => handleBulkMark('LATE')}
              className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20 px-3 py-1.5 rounded-lg transition-all"
            >
              Mark All Late
            </button>
          </div>
        )}
      </div>

      {/* Cohort Checklist Table */}
      {selectedClassId && (
        <div className="glass-card p-5 space-y-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Cohort checklist</h3>
            {students.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={handleExportCSV}
                  className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-extrabold text-[10px] px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all"
                >
                  <FileSpreadsheet size={14} /> Export CSV
                </button>
                <button
                  onClick={handleSaveAttendance}
                  className="bg-[#808000] hover:bg-[#666600] text-white font-extrabold text-[10px] px-4 py-1.5 rounded-lg flex items-center gap-1.5 shadow-[0_2px_8px_rgba(128,128,0,0.15)] transition-all"
                >
                  <Save size={14} /> Save Check-ins
                </button>
              </div>
            )}
          </div>

          {loadingStudents ? (
            <div className="text-center py-10">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-t-transparent border-[#808000] mx-auto" />
            </div>
          ) : students.length === 0 ? (
            <p className="text-xs text-gray-500 italic py-6 text-center">No students enrolled in this batch.</p>
          ) : (
            <div className="overflow-x-auto border border-white/5 rounded-lg">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/5 text-gray-400 font-bold uppercase tracking-wider">
                    <th className="p-3 text-[10px]">Student Name</th>
                    <th className="p-3 text-[10px]">Email Address</th>
                    <th className="p-3 text-[10px] text-right">Set Check-in status</th>
                  </tr>
                </thead>
                <tbody className="font-semibold text-gray-300">
                  {filteredStudents.map((s) => (
                    <tr key={s.userId} className="border-b border-white/5 hover:bg-white/5 transition-all">
                      <td className="p-3 text-white font-bold">{s.name}</td>
                      <td className="p-3 text-gray-500">{s.email}</td>
                      <td className="p-3 text-right">
                        <div className="inline-flex rounded-lg border border-white/5 bg-[#0A0F1A] p-0.5 gap-0.5">
                          {[
                            { id: 'PRESENT', label: 'Present', color: 'text-green-400 bg-green-500/10 border-green-500/20' },
                            { id: 'ABSENT', label: 'Absent', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
                            { id: 'LATE', label: 'Late', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' },
                            { id: 'EXCUSED', label: 'Excused', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' }
                          ].map(opt => {
                            const isSel = s.status === opt.id;
                            return (
                              <button
                                key={opt.id}
                                onClick={() => handleStatusChange(s.userId, opt.id as any)}
                                className={`text-[10px] font-bold px-2.5 py-1 rounded transition-all ${
                                  isSel 
                                    ? opt.color + ' border' 
                                    : 'text-gray-500 hover:text-white border border-transparent'
                                }`}
                              >
                                {opt.label}
                              </button>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
