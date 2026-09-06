'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Flame, Clock, Award, Terminal, Cpu, Sparkles } from 'lucide-react';
import { MarvelScrollReveal } from './MarvelScrollReveal';

export function AvengersTimelineHeist() {
  const timelineEvents = [
    {
      year: '2011 (PHASE 1)',
      movie: 'The First Avenger',
      title: 'Foundational Shield Mechanics',
      description: 'Master core programming logic, Python structures, and relational SQL query foundations. Build your Vibranium armor defense.',
      icon: Shield,
      color: '#00d2ff',
      tag: 'Core Syntax & Logic'
    },
    {
      year: '2012 (PHASE 1)',
      movie: 'The Avengers (Battle of NY)',
      title: 'Data Platform Assembly',
      description: 'Assemble multi-threaded web servers, PostgreSQL schemas, and big data streaming endpoints capable of handling millions of records.',
      icon: Terminal,
      color: '#10b981',
      tag: 'Distributed Systems'
    },
    {
      year: '2018 (PHASE 3)',
      movie: 'Infinity War',
      title: 'Neural Networks & Deep Learning',
      description: 'Train PyTorch deep learning models, compute matrix transformations, and evaluate non-linear multi-layered neural perceptrons.',
      icon: Cpu,
      color: '#a855f7',
      tag: 'Machine Learning'
    },
    {
      year: '2023 (PHASE 4)',
      movie: 'Endgame Time Heist',
      title: 'LLMs, RAG & Vector Databases',
      description: 'Execute Time Heist retrieval pipelines. Build Retrieval-Augmented Generation (RAG) loops with Qdrant, Pinecone, and LangChain.',
      icon: Clock,
      color: '#ffea00',
      tag: 'Generative AI'
    },
    {
      year: '2026 (PHASE 6)',
      movie: 'Avengers: Doomsday',
      title: 'Autonomous Agentic Systems',
      description: 'Deploy multi-agent swarms with tool-calling capabilities, BigQuery data streams, and automated production self-healing code loops.',
      icon: Sparkles,
      color: '#ff0055',
      tag: 'Agentic AI Mastery'
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden bg-[#06091b] border-b border-emerald-500/10">
      {/* Background timeline energy grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <MarvelScrollReveal animation="fade-up">
          <div className="text-center space-y-4 mb-16">
            <span className="text-[10px] font-mono text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full uppercase tracking-widest bg-emerald-500/10 font-bold">
              THE SACRED CAREER TIMELINE
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
              Avengers Time Heist: <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-green-400 bg-clip-text text-transparent">
                Your Path to Tech Supremacy
              </span>
            </h2>
            <p className="text-xs md:text-sm text-gray-400 max-w-2xl mx-auto font-medium">
              From foundational code syntax to autonomous AI agent swarms — travel through the MCU timeline to build production skills.
            </p>
          </div>
        </MarvelScrollReveal>

        {/* Timeline Path Container */}
        <div className="relative">
          {/* Vertical connecting line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 bg-gradient-to-b from-blue-500 via-emerald-500 to-pink-500 opacity-30" />

          <div className="space-y-12">
            {timelineEvents.map((item, index) => {
              const Icon = item.icon;
              const isEven = index % 2 === 0;

              return (
                <MarvelScrollReveal
                  key={index}
                  animation={isEven ? 'slide-left' : 'slide-right'}
                  delay={index * 0.1}
                  className="relative flex flex-col md:flex-row items-start md:items-center"
                >
                  {/* Left Content (or right depending on odd/even) */}
                  <div className={`w-full md:w-1/2 ${isEven ? 'md:pr-12 md:text-right' : 'md:pl-12 md:ml-auto'}`}>
                    <div className="glass-card p-6 border transition-all duration-300 hover:border-emerald-500/40 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] relative">
                      <div className="flex items-center gap-2 mb-2 justify-start md:justify-end">
                        <span 
                          className="text-[10px] font-mono px-2.5 py-0.5 rounded font-extrabold uppercase border"
                          style={{
                            color: item.color,
                            borderColor: `${item.color}40`,
                            backgroundColor: `${item.color}15`
                          }}
                        >
                          {item.year} // {item.movie}
                        </span>
                      </div>

                      <h3 className="text-xl font-extrabold text-white tracking-wide">{item.title}</h3>
                      <p className="text-xs text-gray-400 mt-2 leading-relaxed font-medium">
                        {item.description}
                      </p>

                      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono">
                        <span className="text-emerald-400 font-semibold">{item.tag}</span>
                        <span className="text-gray-500">LEVEL {index + 1} MASTERY</span>
                      </div>
                    </div>
                  </div>

                  {/* Center Node Icon Badge */}
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 top-6 md:top-auto w-10 h-10 rounded-full bg-[#060913] border-2 flex items-center justify-center shadow-xl z-10 transition-transform duration-300 hover:scale-125"
                    style={{
                      borderColor: item.color,
                      boxShadow: `0 0 20px ${item.color}80`
                    }}
                  >
                    <Icon size={18} style={{ color: item.color }} />
                  </div>
                </MarvelScrollReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
