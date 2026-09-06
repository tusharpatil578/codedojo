'use client';

import React, { useState, useEffect } from 'react';
import { UserCheck, ShieldAlert, CheckCircle2, User, Mail, Tag, Settings } from 'lucide-react';

interface StudentRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'COMPLETED';
  courseTitle: string;
  batchName: string;
  batchId: string;
  mentorName: string;
  mentorId: string;
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [mentors, setMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit states
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [selBatchId, setSelBatchId] = useState('');
  const [selMentorId, setSelMentorId] = useState('');
  const [selStatus, setSelStatus] = useState<'ACTIVE' | 'SUSPENDED'>('ACTIVE');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    async function loadStudents() {
      try {
        const res = await fetch('/api/admin/students');
        if (res.ok) {
          const data = await res.json();
          setStudents(data.students || []);
          setBatches(data.batches || []);
          setMentors(data.mentors || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadStudents();
  }, []);

  const handleEditClick = (student: StudentRow) => {
    setEditingUserId(student.id);
    setSelBatchId(student.batchId || '');
    setSelMentorId(student.mentorId || '');
    setSelStatus(student.status === 'SUSPENDED' ? 'SUSPENDED' : 'ACTIVE');
  };

  const handleSaveUpdate = async (studentId: string) => {
    try {
      const res = await fetch('/api/admin/students', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentUserId: studentId,
          batchId: selBatchId || null,
          mentorId: selMentorId || null,
          status: selStatus
        })
      });

      if (!res.ok) throw new Error('Update failed');

      // Update local state
      setStudents(prev => prev.map(s => {
        if (s.id === studentId) {
          const matchingBatch = batches.find(b => b.id === selBatchId);
          const matchingMentor = mentors.find(m => m.id === selMentorId);
          return {
            ...s,
            batchId: selBatchId,
            batchName: matchingBatch ? matchingBatch.name : 'Unassigned',
            mentorId: selMentorId,
            mentorName: matchingMentor ? matchingMentor.name : 'Unassigned',
            status: selStatus
          } as StudentRow;
        }
        return s;
      }));

      setEditingUserId(null);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      alert('Error updating student profile. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-white/5 rounded-lg w-1/4" />
        <div className="h-64 bg-white/5 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-in text-white">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold">Manage Student Profiles</h2>
          <p className="text-xs text-gray-400 font-semibold mt-0.5">Control batch allocation, change tech mentors, or suspend student profiles.</p>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-xs flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>Student profile updated successfully in operational SQLite database.</span>
        </div>
      )}

      {/* Students list */}
      <div className="glass-card p-5 space-y-4">
        <div className="overflow-x-auto border border-white/5 rounded-lg">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5 text-gray-400 font-bold uppercase tracking-wider">
                <th className="p-3.5 text-[10px]">Name & Email</th>
                <th className="p-3.5 text-[10px]">Active Program</th>
                <th className="p-3.5 text-[10px]">Assigned Cohort Batch</th>
                <th className="p-3.5 text-[10px]">Tech Mentor</th>
                <th className="p-3.5 text-[10px]">Status</th>
                <th className="p-3.5 text-[10px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="font-semibold text-gray-300">
              {students.map((s) => {
                const isEditing = editingUserId === s.id;
                
                return (
                  <tr key={s.id} className="border-b border-white/5 hover:bg-white/5 transition-all">
                    <td className="p-3.5 space-y-0.5">
                      <p className="text-white font-extrabold text-sm flex items-center gap-1.5"><User size={14} className="text-gray-500" /> {s.name}</p>
                      <p className="text-gray-500 text-[10px] truncate max-w-40 flex items-center gap-1.5"><Mail size={12} /> {s.email}</p>
                    </td>
                    
                    <td className="p-3.5 text-gray-400 font-medium">
                      {s.courseTitle}
                    </td>

                    <td className="p-3.5">
                      {isEditing ? (
                        <select
                          value={selBatchId}
                          onChange={(e) => setSelBatchId(e.target.value)}
                          className="bg-[#0A0F1A] border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none"
                        >
                          <option value="">Unassigned</option>
                          {batches.map(b => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-white">{s.batchName}</span>
                      )}
                    </td>

                    <td className="p-3.5">
                      {isEditing ? (
                        <select
                          value={selMentorId}
                          onChange={(e) => setSelMentorId(e.target.value)}
                          className="bg-[#0A0F1A] border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none"
                        >
                          <option value="">Unassigned</option>
                          {mentors.map(m => (
                            <option key={m.id} value={m.id}>{m.name}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-white">{s.mentorName}</span>
                      )}
                    </td>

                    <td className="p-3.5">
                      {isEditing ? (
                        <select
                          value={selStatus}
                          onChange={(e: any) => setSelStatus(e.target.value)}
                          className="bg-[#0A0F1A] border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none"
                        >
                          <option value="ACTIVE">ACTIVE</option>
                          <option value="SUSPENDED">SUSPENDED</option>
                        </select>
                      ) : (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[9px] font-extrabold ${
                          s.status === 'ACTIVE' 
                            ? 'text-green-400 bg-green-500/10 border-green-500/20' 
                            : 'text-red-400 bg-red-500/10 border-red-500/20'
                        }`}>
                          {s.status}
                        </span>
                      )}
                    </td>

                    <td className="p-3.5 text-right">
                      {isEditing ? (
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => setEditingUserId(null)}
                            className="bg-white/5 border border-white/10 hover:bg-white/10 text-white text-[10px] px-2.5 py-1 rounded"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveUpdate(s.id)}
                            className="bg-[#808000] hover:bg-[#666600] text-white text-[10px] px-2.5 py-1 rounded font-bold"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEditClick(s)}
                          className="bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 text-gray-400 hover:text-white p-1 rounded transition-all"
                        >
                          <Settings size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
