'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Shield, Sparkles, AlertTriangle, Compass } from 'lucide-react';

export function MultiverseScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [scrollPercent, setScrollPercent] = useState(0);
  const [universeRealm, setUniverseRealm] = useState('EARTH-616 // SACRED TIMELINE');

  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      const pct = Math.round(latest * 100);
      setScrollPercent(pct);

      if (pct < 25) {
        setUniverseRealm('EARTH-616 // AVENGERS HEADQUARTERS');
      } else if (pct < 50) {
        setUniverseRealm('EARTH-838 // ILLUMINATI DATA VAULT');
      } else if (pct < 75) {
        setUniverseRealm('QUANTUM REALM // CHRONAL SUB-SPACE');
      } else {
        setUniverseRealm('EARTH-199999 // DOOMSDAY INCURSION REALM');
      }
    });
  }, [scrollYProgress]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      {/* Scroll Progress Bar */}
      <motion.div
        className="h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-green-300 shadow-[0_0_15px_rgba(16,185,129,0.8)] origin-left"
        style={{ scaleX }}
      />

      {/* Floating HUD Indicator Badge */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2 flex justify-between items-center text-[10px] font-mono text-emerald-400">
        <div className="bg-[#060913]/90 border border-emerald-500/30 px-3 py-1 rounded-md flex items-center gap-2 backdrop-blur-md pointer-events-auto shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="font-bold tracking-wider">{universeRealm}</span>
        </div>

        <div className="hidden md:flex bg-[#060913]/90 border border-emerald-500/30 px-3 py-1 rounded-md items-center gap-3 backdrop-blur-md pointer-events-auto shadow-lg">
          <span className="flex items-center gap-1 text-gray-400 font-semibold">
            <Compass size={12} className="text-emerald-400 animate-spin" style={{ animationDuration: '8s' }} />
            INCURSION PROGRESS:
          </span>
          <span className="font-bold text-emerald-400 font-mono text-xs">{scrollPercent}%</span>
        </div>
      </div>
    </div>
  );
}
