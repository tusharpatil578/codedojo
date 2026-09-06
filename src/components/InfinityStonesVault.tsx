'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, Zap, Shield, Eye, Flame, Clock } from 'lucide-react';

export interface StoneInfo {
  id: string;
  name: string;
  hero: string;
  color: string;
  glow: string;
  bgGlow: string;
  border: string;
  icon: React.ElementType;
  power: string;
  quote: string;
}

export const INFINITY_STONES: StoneInfo[] = [
  {
    id: 'space',
    name: 'Space Stone (Tesseract)',
    hero: 'Captain America & Captain Marvel',
    color: '#00d2ff',
    glow: 'rgba(0, 210, 255, 0.8)',
    bgGlow: 'rgba(0, 210, 255, 0.15)',
    border: 'rgba(0, 210, 255, 0.4)',
    icon: Sparkles,
    power: 'Instant Teleportation & Cloud Network Pipelines',
    quote: '"The Tesseract has awakened. It is on a little world, a human world."'
  },
  {
    id: 'mind',
    name: 'Mind Stone (Scepter)',
    hero: 'Vision & Iron Man (JARVIS)',
    color: '#ffea00',
    glow: 'rgba(255, 234, 0, 0.8)',
    bgGlow: 'rgba(255, 234, 0, 0.15)',
    border: 'rgba(255, 234, 0, 0.4)',
    icon: Eye,
    power: 'Artificial Intelligence & Neural LLM Architectures',
    quote: '"I am on the side of life. Vision is born from the Mind Stone."'
  },
  {
    id: 'reality',
    name: 'Reality Stone (Aether)',
    hero: 'Thor & Guardians',
    color: '#ff0055',
    glow: 'rgba(255, 0, 85, 0.8)',
    bgGlow: 'rgba(255, 0, 85, 0.15)',
    border: 'rgba(255, 0, 85, 0.4)',
    icon: Flame,
    power: 'Dynamic UI Realities & Microservice Simulation',
    quote: '"Reality can be whatever I want."'
  },
  {
    id: 'power',
    name: 'Power Stone (Orb)',
    hero: 'Star-Lord & Ronan',
    color: '#a855f7',
    glow: 'rgba(168, 85, 247, 0.8)',
    bgGlow: 'rgba(168, 85, 247, 0.15)',
    border: 'rgba(168, 85, 247, 0.4)',
    icon: Zap,
    power: 'High-Throughput BigQuery Streaming & PySpark Cluster',
    quote: '"It has the power to destroy entire planets!"'
  },
  {
    id: 'time',
    name: 'Time Stone (Eye of Agamotto)',
    hero: 'Doctor Strange',
    color: '#10b981',
    glow: 'rgba(16, 185, 129, 0.8)',
    bgGlow: 'rgba(16, 185, 129, 0.15)',
    border: 'rgba(16, 185, 129, 0.4)',
    icon: Clock,
    power: 'Chronal Time Loops, Git Reverts & Time-Travel Debugging',
    quote: '"Dormammu, I\'ve come to bargain!"'
  },
  {
    id: 'soul',
    name: 'Soul Stone (Vormir)',
    hero: 'Black Widow & Hawkeye',
    color: '#f97316',
    glow: 'rgba(249, 115, 22, 0.8)',
    bgGlow: 'rgba(249, 115, 22, 0.15)',
    border: 'rgba(249, 115, 22, 0.4)',
    icon: Shield,
    power: '1-on-1 Mentorship & Career Transformation Soul',
    quote: '"A soul for a soul. Master your true potential."'
  }
];

// Web Audio synthesizer for cosmic sound effects
function playStoneSound(colorHex: string) {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    const freq = 220 + parseInt(colorHex.replace('#', '').slice(0, 2), 16) * 1.5;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.8, ctx.currentTime + 0.4);
    
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch (e) {
    // Web audio fallback
  }
}

export function InfinityStonesVault({ onStoneSelect }: { onStoneSelect?: (stone: StoneInfo) => void }) {
  const [activeStone, setActiveStone] = useState<StoneInfo | null>(INFINITY_STONES[4]); // default Time Stone

  const handleStoneClick = (stone: StoneInfo, event: React.MouseEvent) => {
    setActiveStone(stone);
    playStoneSound(stone.color);

    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 35,
      spread: 60,
      origin: { x, y },
      colors: [stone.color, '#ffffff', stone.color],
      disableForReducedMotion: true
    });

    if (onStoneSelect) {
      onStoneSelect(stone);
    }
  };

  return (
    <div className="w-full bg-[#080d1a]/90 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-6 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden my-8">
      {/* Background glow matrix */}
      <div 
        className="absolute inset-0 transition-all duration-700 pointer-events-none opacity-20"
        style={{
          background: activeStone 
            ? `radial-gradient(circle at 50% 50%, ${activeStone.glow} 0%, transparent 70%)`
            : 'none'
        }}
      />

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 relative z-10">
        <div>
          <span className="text-[10px] font-mono text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded uppercase tracking-widest bg-emerald-500/10 font-bold">
            INFINITY GAUNTLET MATRIX
          </span>
          <h3 className="text-xl md:text-2xl font-extrabold text-white mt-1 flex items-center gap-2">
            The 6 Infinity Tech Stones <Sparkles size={18} className="text-amber-400 animate-pulse" />
          </h3>
          <p className="text-xs text-gray-400 font-medium mt-0.5">
            Click any stone to harness its MCU superpower and alter the course learning realm!
          </p>
        </div>

        {/* Selected Stone Status Pill */}
        {activeStone && (
          <motion.div 
            key={activeStone.id}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="px-4 py-2 rounded-xl border flex items-center gap-3 backdrop-blur-md"
            style={{
              borderColor: activeStone.border,
              backgroundColor: activeStone.bgGlow
            }}
          >
            <div 
              className="w-4 h-4 rounded-full animate-ping"
              style={{ backgroundColor: activeStone.color }}
            />
            <div>
              <p className="text-[10px] uppercase font-mono font-bold text-gray-300">ACTIVE STONE POWER</p>
              <p className="text-xs font-bold font-mono" style={{ color: activeStone.color }}>
                {activeStone.name}
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* 6 Infinity Stones Grid Buttons */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 relative z-10">
        {INFINITY_STONES.map((stone) => {
          const isSelected = activeStone?.id === stone.id;
          const Icon = stone.icon;

          return (
            <motion.button
              key={stone.id}
              whileHover={{ scale: 1.08, y: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => handleStoneClick(stone, e)}
              className={`relative flex flex-col items-center justify-center p-4 rounded-xl border transition-all cursor-pointer group ${
                isSelected ? 'ring-2 ring-white/50 shadow-2xl' : 'hover:border-white/30'
              }`}
              style={{
                backgroundColor: isSelected ? stone.bgGlow : 'rgba(10, 15, 26, 0.7)',
                borderColor: isSelected ? stone.color : 'rgba(255, 255, 255, 0.08)',
                boxShadow: isSelected ? `0 0 25px ${stone.glow}` : 'none'
              }}
            >
              {/* Gem Particle Pulsing Aura */}
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-transform duration-300 ${
                  isSelected ? 'scale-110' : 'group-hover:scale-105'
                }`}
                style={{
                  background: `radial-gradient(circle at 30% 30%, #ffffff 0%, ${stone.color} 60%, #000000 100%)`,
                  boxShadow: `0 0 15px ${stone.glow}`
                }}
              >
                <Icon size={18} className="text-black font-bold" />
              </div>

              <span className="text-[11px] font-bold font-mono text-gray-200 text-center leading-tight">
                {stone.name.split(' ')[0]}
              </span>
              <span className="text-[9px] text-gray-400 font-mono mt-0.5 opacity-80">
                {stone.name.match(/\(([^)]+)\)/)?.[1] || ''}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Dynamic Active Stone Lore & Skill Power Banner */}
      <AnimatePresence mode="wait">
        {activeStone && (
          <motion.div
            key={activeStone.id}
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -15, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-6 p-4 rounded-xl border bg-black/60 relative z-10 flex flex-col md:flex-row items-center justify-between gap-4"
            style={{ borderColor: activeStone.border }}
          >
            <div className="space-y-1 text-left">
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider" style={{ color: activeStone.color }}>
                {activeStone.hero} Matrix Unlocked
              </span>
              <p className="text-sm font-semibold text-white">
                <span className="font-bold font-mono" style={{ color: activeStone.color }}>Skill Power: </span>
                {activeStone.power}
              </p>
              <p className="text-xs text-gray-400 italic">
                {activeStone.quote}
              </p>
            </div>

            <a
              href="#courses"
              className="w-full md:w-auto px-5 py-2.5 rounded-lg text-xs font-extrabold text-black font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-transform hover:scale-105"
              style={{
                backgroundColor: activeStone.color,
                boxShadow: `0 0 20px ${activeStone.glow}`
              }}
            >
              Master {activeStone.name.split(' ')[0]} Track →
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
