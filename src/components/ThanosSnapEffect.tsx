'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Zap, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';

export function ThanosSnapEffect() {
  const [isSnapped, setIsSnapped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSnapToggle = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    if (!isSnapped) {
      // THANOS SNAP ACTION
      // Flash audio/visual shockwave
      confetti({
        particleCount: 100,
        spread: 120,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#3b82f6', '#ef4444', '#eab308', '#10b981', '#f97316'],
        disableForReducedMotion: true
      });

      // Apply snap particle effect to DOM cards by adding a temporary class
      document.querySelectorAll('.glass-card').forEach((el, idx) => {
        if (idx % 2 === 0) {
          el.classList.add('thanos-disintegrated');
        }
      });

      setTimeout(() => {
        setIsSnapped(true);
        setIsAnimating(false);
      }, 800);
    } else {
      // REVERSE SNAP / TIME STONE HEIST
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10b981', '#34d399', '#a7f3d0', '#ffffff'],
        disableForReducedMotion: true
      });

      document.querySelectorAll('.glass-card').forEach((el) => {
        el.classList.remove('thanos-disintegrated');
      });

      setTimeout(() => {
        setIsSnapped(false);
        setIsAnimating(false);
      }, 800);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      <AnimatePresence>
        {isSnapped && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="bg-black/90 border border-emerald-500/40 px-3 py-1.5 rounded-lg text-emerald-400 font-mono text-[11px] flex items-center gap-1.5 shadow-2xl backdrop-blur-md"
          >
            <AlertTriangle size={14} className="text-amber-400 animate-bounce" />
            <span>50% Timeline Disintegrated! Activate Time Stone to Restore.</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={handleSnapToggle}
        disabled={isAnimating}
        className={`px-5 py-3 rounded-full font-mono text-xs font-extrabold flex items-center gap-2.5 shadow-[0_0_30px_rgba(0,0,0,0.8)] border transition-all cursor-pointer ${
          isSnapped
            ? 'bg-gradient-to-r from-emerald-600 to-teal-500 border-emerald-400 text-white shadow-emerald-500/30'
            : 'bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 border-amber-400/50 text-white shadow-purple-500/40 hover:shadow-purple-500/70'
        }`}
      >
        {isSnapped ? (
          <>
            <RefreshCw size={16} className={`text-emerald-300 ${isAnimating ? 'animate-spin' : ''}`} />
            <span>TIME STONE: UNDO SNAP</span>
          </>
        ) : (
          <>
            <Zap size={16} className="text-amber-300 animate-pulse" />
            <span>THANOS GAUNTLET: SNAP</span>
          </>
        )}
      </motion.button>
    </div>
  );
}
