'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Clock, Tag, ArrowRight, Layers, Award, Terminal } from 'lucide-react';

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await fetch('/api/public/courses');
        if (res.ok) {
          const data = await res.json();
          if (data.courses && data.courses.length > 0) {
            setCourses(data.courses);
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        console.error('Failed to load catalog courses:', e);
      }
      setLoading(false);
    }
    loadCourses();
  }, []);

  const categories = ['All', ...Array.from(new Set(courses.map(c => c.category || 'Career Programs')))];

  const filteredCourses = activeFilter === 'All'
    ? courses
    : courses.filter(c => (c.category || 'Career Programs') === activeFilter);

  return (
    <div className="min-h-screen bg-[#060913] text-white flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-emerald-500/10 bg-[#070B16]/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-emerald-500 flex items-center justify-center font-bold text-white text-xs">
              DC
            </div>
            <span className="font-extrabold text-xs tracking-wider text-white font-mono uppercase">
              doomsday<span className="text-emerald-400 font-light">.courses</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 py-12 flex-1 space-y-8">
        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Choose Your Learning Pathway
          </h1>
          <p className="text-sm text-gray-400 font-medium leading-relaxed max-w-xl">
            Select one of our four professional career programs. Learn live from industry leaders, work on real sandbox assignments, and secure your career outcomes.
          </p>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent border-emerald-500" />
              <p className="text-xs font-semibold tracking-wider text-gray-500">LOADING CURRICULUMS...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Catalog list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredCourses.map((c) => {
                const displayPrice = `₹${c.price.toLocaleString('en-IN')}`;
                
                // Custom badge texts mapping the differentiation criteria requested
                let aiFocusText = "Generative AI Systems";
                if (c.slug?.includes('analyst')) aiFocusText = "Analyze faster with AI-powered analytics";
                else if (c.slug?.includes('engineer')) aiFocusText = "Build modern data platforms & AI-ready pipelines";
                else if (c.slug?.includes('science')) aiFocusText = "Build predictive models, LLMs, and RAG systems";
                else if (c.slug?.includes('software')) aiFocusText = "Build production software, AI apps, and autonomous agents";

                return (
                  <div key={c.id} className="glass-card p-6 flex flex-col justify-between hover:shadow-[0_8px_30px_rgb(16,185,129,0.08)]">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded">
                          <Tag size={10} /> {c.mode || 'Live'} Cohort
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-gray-400 font-semibold">
                          <Clock size={12} className="text-emerald-400" /> {c.duration}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-xl text-white tracking-wide">{c.title}</h3>
                      <p className="text-xs text-emerald-400 font-mono mt-1.5 uppercase tracking-wider">{aiFocusText}</p>
                      
                      <p className="text-xs text-gray-400 mt-4 leading-relaxed font-medium">
                        {c.description || 'Learn advanced concepts, coding logic, frameworks, and practical database schemas.'}
                      </p>

                      {/* Details specs */}
                      <div className="grid grid-cols-2 gap-3 mt-6 border-t border-white/5 pt-4 text-xs font-semibold text-gray-300">
                        <div className="flex items-center gap-1.5">
                          <Layers size={14} className="text-emerald-400" />
                          <span>{c.modules?.length || 8} Modules</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Terminal size={14} className="text-emerald-400" />
                          <span>{c.projects?.length || 3} Capstones</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-8">
                      <div>
                        <span className="text-[9px] text-gray-500 block uppercase tracking-wider font-bold">Standard Tuition Fee</span>
                        <span className="text-lg md:text-xl font-mono font-extrabold text-white">{displayPrice}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/courses/${c.slug || c.id}`}
                          className="text-xs text-gray-300 font-bold bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-lg border border-white/10 transition-all"
                        >
                          Syllabus
                        </Link>
                        <Link
                          href="/register"
                          className="text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 px-4 py-2.5 rounded-lg flex items-center gap-1 shadow-[0_4px_10px_rgba(16,185,129,0.2)] transition-all"
                        >
                          Enroll <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
