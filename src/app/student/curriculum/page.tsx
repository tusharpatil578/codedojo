'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Lock, 
  PlayCircle, 
  Clock, 
  ArrowRight,
  BookOpen,
  FileCode,
  Tag
} from 'lucide-react';

interface ClassData {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'UPCOMING' | 'LOCKED';
  hasAttended: boolean;
  assignment: {
    id: string;
    title: string;
    solved: number;
    total: number;
  } | null;
}

interface ModuleData {
  id: string;
  title: string;
  order: number;
  progressPercent: number;
  completedClasses: number;
  totalClasses: number;
  classes: ClassData[];
}

export default function CurriculumPage() {
  const [courseTitle, setCourseTitle] = useState('');
  const [modules, setModules] = useState<ModuleData[]>([]);
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCurriculum() {
      try {
        const res = await fetch('/api/student/curriculum');
        if (res.ok) {
          const data = await res.json();
          setCourseTitle(data.courseTitle);
          setModules(data.modules || []);
          if (data.modules && data.modules.length > 0) {
            // Expand the first module by default
            setExpandedModuleId(data.modules[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load curriculum:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCurriculum();
  }, []);

  const toggleExpand = (modId: string) => {
    setExpandedModuleId(expandedModuleId === modId ? null : modId);
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-white/5 rounded-lg w-1/3" />
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-20 bg-white/5 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-in">
      <div>
        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
          Course Syllabus
        </span>
        <h2 className="text-xl md:text-2xl font-extrabold text-white mt-2">{courseTitle}</h2>
        <p className="text-xs text-gray-400 font-semibold mt-0.5">Explore your modules, watch lectures, and solve coding sandboxes.</p>
      </div>

      <div className="space-y-4">
        {modules.map((mod) => {
          const isExpanded = expandedModuleId === mod.id;
          return (
            <div key={mod.id} className="glass-card overflow-hidden">
              {/* Accordion Trigger Header */}
              <button
                onClick={() => toggleExpand(mod.id)}
                className="w-full p-5 flex items-center justify-between text-left hover:bg-white/5 transition-all"
              >
                <div className="flex-1 min-w-0 pr-4 space-y-1">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block">
                    MODULE {mod.order}
                  </span>
                  <h3 className="font-extrabold text-base text-white truncate">{mod.title}</h3>
                  
                  {/* Progress Indicators */}
                  <div className="flex items-center gap-4 text-xs font-semibold text-gray-400 pt-1">
                    <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden shrink-0">
                      <div 
                        className="h-full bg-emerald-500 rounded-full transition-all" 
                        style={{ width: `${mod.progressPercent}%` }} 
                      />
                    </div>
                    <span>{mod.completedClasses}/{mod.totalClasses} classes completed</span>
                    <span>• {mod.progressPercent}%</span>
                  </div>
                </div>

                <div className="p-1.5 bg-white/5 border border-white/5 rounded-lg text-gray-400 group-hover:text-white">
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </button>

              {/* Accordion Expand Panel */}
              {isExpanded && (
                <div className="border-t border-white/5 bg-[#0D1321]/40 p-4 space-y-3">
                  {mod.classes.length === 0 ? (
                    <p className="text-xs text-gray-500 italic py-2 px-3">No classes published for this module yet.</p>
                  ) : (
                    mod.classes.map((cls) => {
                      const isLocked = cls.status === 'LOCKED';
                      
                      return (
                        <div
                          key={cls.id}
                          className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl border transition-all ${
                            isLocked 
                              ? 'bg-transparent border-transparent opacity-50' 
                              : 'bg-white/5 border-white/5 hover:border-emerald-500/40'
                          }`}
                        >
                          <div className="flex gap-3 min-w-0">
                            {/* Icon status indicator */}
                             <div className="shrink-0 mt-0.5">
                              {cls.status === 'COMPLETED' ? (
                                <div className="h-7 w-7 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
                                  <CheckCircle2 size={16} />
                                </div>
                              ) : cls.status === 'IN_PROGRESS' ? (
                                <div className="h-7 w-7 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 animate-pulse">
                                  <PlayCircle size={16} />
                                </div>
                              ) : cls.status === 'UPCOMING' ? (
                                <div className="h-7 w-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                  <Clock size={16} />
                                </div>
                              ) : (
                                <div className="h-7 w-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-500">
                                  <Lock size={16} />
                                </div>
                              )}
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-extrabold text-sm text-white">{cls.title}</h4>
                                {cls.status === 'IN_PROGRESS' && (
                                  <span className="text-[9px] font-extrabold text-red-500 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                                    LIVE NOW
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-400 line-clamp-1 font-medium">{cls.description}</p>
                              
                              {/* Short stats: assignment completion */}
                              {!isLocked && cls.assignment && (
                                <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold tracking-wide uppercase pt-1">
                                  <FileCode size={12} className="text-gray-600" />
                                  <span>Assignment: {cls.assignment.solved}/{cls.assignment.total} Solved</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Action Button */}
                          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                            <span className="text-[10px] text-gray-500 font-semibold hidden sm:inline">
                              {cls.date}
                            </span>
                            {isLocked ? (
                              <button
                                disabled
                                className="w-full md:w-auto text-[10px] bg-white/5 text-gray-500 border border-white/5 cursor-not-allowed font-bold px-4 py-2 rounded-lg"
                              >
                                Locked
                              </button>
                            ) : (
                              <Link
                                href={`/student/classes/${cls.id}`}
                                className="w-full md:w-auto text-[10px] bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold px-4 py-2 rounded-lg flex items-center justify-center gap-1 group/btn shadow-[0_2px_8px_rgba(16,185,129,0.15)] transition-all"
                              >
                                View Lecture <ArrowRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
                              </Link>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
