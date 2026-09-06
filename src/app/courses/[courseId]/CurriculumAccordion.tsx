'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, Clock, FileText } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  order: number;
}

interface Module {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

interface AccordionProps {
  modules: Module[];
}

export default function CurriculumAccordion({ modules }: AccordionProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggleModule = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {modules.map((m, idx) => {
        const isExpanded = expandedIndex === idx;
        return (
          <div 
            key={m.id || idx} 
            className="border border-white/5 bg-[#0A0F1A] rounded-xl overflow-hidden transition-all duration-300"
          >
            {/* Module Trigger Header */}
            <button
              onClick={() => toggleModule(idx)}
              className="w-full text-left p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
            >
              <div className="space-y-1 pr-4">
                <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase tracking-widest">
                  Module {idx + 1}
                </span>
                <h3 className="font-extrabold text-base md:text-lg text-white">
                  {m.title}
                </h3>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold text-gray-400 shrink-0">
                <span className="hidden sm:inline-flex items-center gap-1">
                  <BookOpen size={12} className="text-emerald-400" /> {m.lessons?.length || 0} Lessons
                </span>
                {isExpanded ? (
                  <ChevronUp size={18} className="text-emerald-400" />
                ) : (
                  <ChevronDown size={18} className="text-gray-400" />
                )}
              </div>
            </button>

            {/* Module Content */}
            {isExpanded && (
              <div className="p-5 pt-0 border-t border-white/5 bg-black/20 divide-y divide-white/5 animate-slide-in">
                {m.lessons && m.lessons.length > 0 ? (
                  m.lessons.map((lesson, lIdx) => (
                    <div 
                      key={lesson.id || lIdx} 
                      className="py-4 flex gap-4 text-xs md:text-sm items-start"
                    >
                      <div className="h-6 w-6 rounded bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center font-mono font-bold text-emerald-400 shrink-0">
                        {(lIdx + 1).toString().padStart(2, '0')}
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-white leading-tight">{lesson.title}</p>
                        {lesson.description && (
                          <p className="text-gray-400 text-xs leading-relaxed font-medium">
                            {lesson.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="py-4 text-xs text-gray-500 font-medium italic">
                    Lesson curriculum details will be updated shortly.
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
