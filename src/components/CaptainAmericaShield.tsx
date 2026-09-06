'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Shield, Sparkles } from 'lucide-react';

export function CaptainAmericaShield() {
  const [deflectCount, setDeflectCount] = useState(0);

  const handleDeflect = (e: React.MouseEvent) => {
    setDeflectCount(prev => prev + 1);

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 25,
      spread: 70,
      origin: { x, y },
      colors: ['#ef4444', '#3b82f6', '#ffffff'],
      disableForReducedMotion: true
    });
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-6 bg-black/40 border border-blue-500/20 rounded-2xl backdrop-blur-md">
      <motion.div
        whileHover={{ rotate: 360, scale: 1.1 }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
        onClick={handleDeflect}
        className="w-24 h-24 md:w-32 md:h-32 rounded-full relative cursor-pointer shadow-[0_0_40px_rgba(59,130,246,0.5)] border-4 border-blue-500/30 flex items-center justify-center group"
        style={{
          background: 'radial-gradient(circle, #00d2ff 0%, #1e40af 35%, #ef4444 65%, #b91c1c 85%, #1e3a8a 100%)'
        }}
      >
        {/* Star Icon in center */}
        <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-inner">
          <span className="text-xl md:text-2xl text-blue-900 font-extrabold">★</span>
        </div>

        <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping opacity-25" />
      </motion.div>

      <div className="mt-4 text-center">
        <span className="text-[10px] font-mono text-blue-400 uppercase font-bold tracking-widest bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
          VIBRANIUM SHIELD MATRIX
        </span>
        <p className="text-xs font-bold text-white mt-1">
          Captain America Defense Protocols
        </p>
        <p className="text-[11px] text-gray-400 font-mono mt-0.5">
          Click Shield to deflect chronal beams! Deflections: <span className="text-blue-400 font-bold">{deflectCount}</span>
        </p>
      </div>
    </div>
  );
}
