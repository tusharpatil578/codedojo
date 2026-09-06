'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, MessageSquare, Zap, Shield, Heart } from 'lucide-react';
import { MarvelScrollReveal } from './MarvelScrollReveal';

export function MarvelHeroesGallery() {
  const [selectedHero, setSelectedHero] = useState<number | null>(0);
  const [quoteIndex, setQuoteIndex] = useState<{ [key: number]: number }>({ 0: 0, 1: 0, 2: 0, 3: 0 });

  const heroes = [
    {
      id: 'spidey-ironman',
      name: 'Spider-Man & Iron Man',
      subtitle: 'Mentorship & Tech Legacy Loop',
      image: '/images/spidey_ironman.jpg',
      color: '#ef4444',
      badge: 'MENTOR & PROTÉGÉ',
      description: 'Master AI Engineering under senior tech leaders just like Peter Parker learning system architecture from Tony Stark.',
      quotes: [
        '"If you are nothing without the suit, then you shouldn\'t have it. Master the fundamentals!"',
        '"Hey kid, welcome to the big leagues of AI Engineering!"',
        '"Mr. Stark, this coding sandbox is unbelievable!"'
      ],
      skill: 'Full Stack & AI Agent Collaboration'
    },
    {
      id: 'avengers-trio',
      name: 'Spider-Man, Iron Man & Captain America',
      subtitle: 'Civil War to Doomsday Assembly',
      image: '/images/avengers_trio.jpg',
      color: '#3b82f6',
      badge: 'AVENGERS TRIO ASSEMBLY',
      description: 'Combine frontend design elegance, backend database scaling, and distributed cloud computing into one unified hero stack.',
      quotes: [
        '"Underoos! Time to deploy the production release!"',
        '"I can do this all day — 24/7 live class recordings and sandbox access!"',
        '"Genius, billionaire, playboy, senior data architect."'
      ],
      skill: 'Full-Stack Software Architecture'
    },
    {
      id: 'baby-groot',
      name: 'Baby Groot',
      subtitle: 'Growth & Continuous Learning',
      image: '/images/baby_groot.jpg',
      color: '#10b981',
      badge: 'GUARDIANS OF DATA',
      description: 'Start from seed-level basics and grow into an enterprise data engineering & machine learning powerhouse.',
      quotes: [
        '"I am Groot! 🌳 (Translation: Learn Python & Data Engineering step-by-step!)"',
        '"I am Groot! ⚡ (Translation: Build Airflow pipelines with automated retries!)"',
        '"I am Groot! 💚 (Translation: 1-on-1 mentor reviews guarantee your success!)"'
      ],
      skill: 'Data Engineering & Airflow Pipelines'
    },
    {
      id: 'deadpool',
      name: 'Deadpool (Merc with a Mouth)',
      subtitle: '4th Wall Breaking Code Review',
      image: '/images/deadpool.jpg',
      color: '#f43f5e',
      badge: 'UNSTABLE HERO / BUG HUNTER',
      description: 'Slash through complex syntax bugs and bypass system bottlenecks with high-frequency time-travel debugging.',
      quotes: [
        '"Maximum effort! Did somebody say 100% test coverage?"',
        '"Look, I am breaking the 4th wall to tell you: enrol in doomsday.courses now!"',
        '"With great power comes great need for clean unit tests!"'
      ],
      skill: 'Time-Travel Debugging & Code Auditing'
    }
  ];

  const handleHeroClick = (index: number, event: React.MouseEvent) => {
    setSelectedHero(index);
    setQuoteIndex(prev => ({
      ...prev,
      [index]: ((prev[index] || 0) + 1) % heroes[index].quotes.length
    }));

    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 30,
      spread: 65,
      origin: { x, y },
      colors: [heroes[index].color, '#ffffff', heroes[index].color],
      disableForReducedMotion: true
    });
  };

  return (
    <section className="py-20 relative overflow-hidden bg-[#070b18] border-b border-emerald-500/10">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-red-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        <MarvelScrollReveal animation="fade-up">
          <div className="text-center space-y-4">
            <span className="text-[10px] font-mono text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full uppercase tracking-widest bg-emerald-500/10 font-bold">
              MULTIVERSE HEROES GALLERY
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
              Meet Your Multiverse Mentors <br />
              <span className="bg-gradient-to-r from-red-500 via-emerald-400 to-blue-500 bg-clip-text text-transparent">
                Interactive Character Vault
              </span>
            </h2>
            <p className="text-xs md:text-sm text-gray-400 max-w-xl mx-auto font-medium">
              Click on any Marvel companion to hear their direct quotes, skill specialties, and interactive animations!
            </p>
          </div>
        </MarvelScrollReveal>

        {/* 4 Heroes Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {heroes.map((hero, index) => {
            const isSelected = selectedHero === index;
            const currentQuote = hero.quotes[quoteIndex[index] || 0];

            return (
              <MarvelScrollReveal
                key={hero.id}
                animation="scale-up"
                delay={index * 0.1}
              >
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={(e) => handleHeroClick(index, e)}
                  className={`glass-card p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden group ${
                    isSelected ? 'ring-2 ring-white/50 shadow-2xl' : 'hover:border-white/30'
                  }`}
                  style={{
                    borderColor: isSelected ? hero.color : 'rgba(255, 255, 255, 0.1)',
                    boxShadow: isSelected ? `0 0 35px ${hero.color}40` : 'none'
                  }}
                >
                  {/* Top Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span 
                      className="text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-wider"
                      style={{
                        color: hero.color,
                        borderColor: `${hero.color}40`,
                        backgroundColor: `${hero.color}15`
                      }}
                    >
                      {hero.badge}
                    </span>
                    <Sparkles size={14} style={{ color: hero.color }} className="animate-pulse" />
                  </div>

                  {/* Character Image Container */}
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-4 border border-white/10 group-hover:border-white/30 transition-all">
                    <img 
                      src={hero.image} 
                      alt={hero.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div 
                      className="absolute inset-0 opacity-20 pointer-events-none transition-opacity duration-300 group-hover:opacity-40"
                      style={{
                        background: `linear-gradient(to top, ${hero.color}, transparent)`
                      }}
                    />
                  </div>

                  {/* Character Info */}
                  <div>
                    <h3 className="font-extrabold text-lg text-white tracking-wide">{hero.name}</h3>
                    <p className="text-xs font-mono font-semibold mt-0.5" style={{ color: hero.color }}>
                      {hero.subtitle}
                    </p>
                    <p className="text-xs text-gray-400 mt-2 leading-relaxed font-medium">
                      {hero.description}
                    </p>
                  </div>

                  {/* Interactive Quote Box */}
                  <div className="mt-4 pt-3 border-t border-white/5">
                    <div className="bg-black/60 p-3 rounded-lg border border-white/5 text-[11px] font-mono text-gray-300 italic flex items-start gap-2">
                      <MessageSquare size={14} className="shrink-0 text-emerald-400 mt-0.5" />
                      <span>{currentQuote}</span>
                    </div>
                    <div className="mt-2 text-[10px] font-mono text-right text-gray-500 uppercase">
                      Click card to switch quote →
                    </div>
                  </div>
                </motion.div>
              </MarvelScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
