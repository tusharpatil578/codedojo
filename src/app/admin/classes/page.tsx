'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Plus, CheckCircle2, AlertCircle, Video, Calendar, User } from 'lucide-react';

interface ClassRow {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  zoomLink: string;
  status: 'UPCOMING' | 'LIVE' | 'COMPLETED';
  batchName: string;
  instructorName: string;
  moduleTitle: string;
}

export default function AdminClassesPage() {
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [instructors, setInstructors] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('2026-08-31');
  const [startTime, setStartTime] = useState('19:00');
  const [endTime, setEndTime] = useState('20:30');
  const [zoomLink, setZoomLink] = useState('https://zoom.us/j/10000000005');
  const [instructorId, setInstructorId] = useState('');
  const [moduleId, setModuleId] = useState('');
  const [batchId, setBatchId] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/admin/classes');
        if (res.ok) {
          const data = await res.json();
          setClasses(data.classes || []);
          setInstructors(data.instructors || []);
          setBatches(data.batches || []);
          setModules(data.modules || []);
          
          if (data.instructors?.length > 0) setInstructorId(data.instructors[0].id);
          if (data.modules?.length > 0) setModuleId(data.modules[0].id);
          if (data.batches?.length > 0) setBatchId(data.batches[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !zoomLink) return;
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/admin/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title, description, date, startTime, endTime, zoomLink, instructorId, moduleId, batchId
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to schedule class');

      // Append class dynamically
      const matchingBatch = batches.find(b => b.id === batchId);
      const matchingInstructor = instructors.find(i => i.id === instructorId);
      const matchingModule = modules.find(m => m.id === moduleId);

      const newCls: ClassRow = {
        id: data.class.id,
        title,
        description,
        date,
        startTime,
        endTime,
        zoomLink,
        status: 'UPCOMING',
        batchName: matchingBatch ? matchingBatch.name : 'Unknown',
        instructorName: matchingInstructor ? matchingInstructor.name : 'Unknown',
        moduleTitle: matchingModule ? matchingModule.title : 'Unknown'
      };

      setClasses(prev => [newCls, ...prev]);
      setTitle('');
      setDescription('');
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert('Error scheduling class. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-white/5 rounded-lg w-1/4" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-64 bg-white/5 rounded-xl animate-pulse" />
          <div className="lg:col-span-2 h-64 bg-white/5 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-in text-white">
      <div>
        <h2 className="text-xl md:text-2xl font-extrabold">Schedule Lectures</h2>
        <p className="text-xs text-gray-400 font-semibold mt-0.5">Publish live upcoming classes, link zoom meetings, and assign cohort instructors.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Form to create class */}
        <div className="glass-card p-5 space-y-4">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
            <Plus size={14} className="text-[#808000]" /> Publish Class Schedule
          </h3>

          <form onSubmit={handleCreateClass} className="space-y-3.5">
            {saveSuccess && (
              <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-xs flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>Class schedule published and students notified!</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Lecture Subject Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Partitioning structures in BQ..."
                className="w-full bg-[#0A0F1A] border border-white/5 focus:border-[#808000] rounded-lg px-3 py-2 text-xs text-white focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Short Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Pruning query scans..."
                className="w-full bg-[#0A0F1A] border border-white/5 focus:border-[#808000] rounded-lg px-3 py-2 text-xs text-white focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Select Batch</label>
              <select
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
                className="w-full bg-[#0A0F1A] border border-white/5 focus:border-[#808000] rounded-lg px-3 py-2 text-xs text-white focus:outline-none transition-all appearance-none"
              >
                {batches.map((b) => (
                  <option key={b.id} value={b.id} className="bg-[#0D1321]">
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Syllabus Module</label>
              <select
                value={moduleId}
                onChange={(e) => setModuleId(e.target.value)}
                className="w-full bg-[#0A0F1A] border border-white/5 focus:border-[#808000] rounded-lg px-3 py-2 text-xs text-white focus:outline-none transition-all appearance-none"
              >
                {modules.map((m) => (
                  <option key={m.id} value={m.id} className="bg-[#0D1321]">
                    [{m.courseTitle.substring(0, 8)}...] {m.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Assigned Instructor</label>
              <select
                value={instructorId}
                onChange={(e) => setInstructorId(e.target.value)}
                className="w-full bg-[#0A0F1A] border border-white/5 focus:border-[#808000] rounded-lg px-3 py-2 text-xs text-white focus:outline-none transition-all appearance-none"
              >
                {instructors.map((ins) => (
                  <option key={ins.id} value={ins.id} className="bg-[#0D1321]">
                    {ins.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Scheduled Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#0A0F1A] border border-white/5 focus:border-[#808000] rounded-lg px-3 py-2 text-xs text-white focus:outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Start Time</label>
                <input
                  type="text"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  placeholder="19:00"
                  className="w-full bg-[#0A0F1A] border border-white/5 focus:border-[#808000] rounded-lg px-3 py-2 text-xs text-white focus:outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">End Time</label>
                <input
                  type="text"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  placeholder="20:30"
                  className="w-full bg-[#0A0F1A] border border-white/5 focus:border-[#808000] rounded-lg px-3 py-2 text-xs text-white focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Zoom Meeting URL</label>
              <input
                type="url"
                required
                value={zoomLink}
                onChange={(e) => setZoomLink(e.target.value)}
                className="w-full bg-[#0A0F1A] border border-white/5 focus:border-[#808000] rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#808000] hover:bg-[#666600] text-white font-extrabold text-xs py-2.5 rounded-lg shadow-[0_2px_8px_rgba(128,128,0,0.15)] transition-all flex items-center justify-center gap-1"
            >
              Publish & Notify
            </button>
          </form>
        </div>

        {/* Right Column: Scheduled classes list table */}
        <div className="lg:col-span-2 glass-card p-5 space-y-4">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Active Schedule Log</h3>

          <div className="overflow-x-auto border border-white/5 rounded-lg">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/5 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="p-3.5 text-[10px]">Date & Time</th>
                  <th className="p-3.5 text-[10px]">Lecture Topic</th>
                  <th className="p-3.5 text-[10px]">Instructor</th>
                  <th className="p-3.5 text-[10px]">Module / Batch</th>
                  <th className="p-3.5 text-[10px] text-right">Status</th>
                </tr>
              </thead>
              <tbody className="font-semibold text-gray-300">
                {classes.map((c) => (
                  <tr key={c.id} className="border-b border-white/5 hover:bg-white/5 transition-all">
                    <td className="p-3.5 space-y-0.5">
                      <p className="text-white font-bold flex items-center gap-1"><Calendar size={12} className="text-gray-500" /> {c.date}</p>
                      <p className="text-gray-500 text-[10px] flex items-center gap-1"><Clock size={10} /> {c.startTime} - {c.endTime}</p>
                    </td>
                    <td className="p-3.5 space-y-0.5 max-w-44">
                      <p className="text-white font-extrabold truncate">{c.title}</p>
                      <p className="text-gray-500 text-[10px] truncate flex items-center gap-1"><Video size={10} /> {c.zoomLink}</p>
                    </td>
                    <td className="p-3.5 flex items-center gap-1.5 pt-4">
                      <div className="h-6 w-6 rounded-full bg-white/5 flex items-center justify-center font-bold text-[10px] text-[#808000] border border-white/10 shrink-0">
                        {c.instructorName[0]}
                      </div>
                      <span className="truncate max-w-24">{c.instructorName}</span>
                    </td>
                    <td className="p-3.5 space-y-0.5">
                      <p className="text-gray-400 truncate max-w-32">{c.moduleTitle}</p>
                      <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">{c.batchName}</p>
                    </td>
                    <td className="p-3.5 text-right">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[9px] font-extrabold tracking-wider ${
                        c.status === 'LIVE' 
                          ? 'text-red-400 bg-red-500/10 border-red-500/20' 
                          : c.status === 'COMPLETED' 
                            ? 'text-gray-400 bg-white/5 border-white/10'
                            : 'text-[#808000] bg-[#808000]/10 border-[#808000]/20'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
