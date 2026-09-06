'use client';

import React from 'react';
import { motion, Variant } from 'framer-motion';

interface Props {
  children: React.ReactNode;
  animation?: 'fade-up' | 'scale-up' | 'slide-left' | 'slide-right' | 'flip-3d' | 'glow-pop';
  delay?: number;
  className?: string;
}

export function MarvelScrollReveal({ 
  children, 
  animation = 'fade-up', 
  delay = 0,
  className = '' 
}: Props) {

  const variants = {
    'fade-up': {
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0 }
    },
    'scale-up': {
      hidden: { opacity: 0, scale: 0.85 },
      visible: { opacity: 1, scale: 1 }
    },
    'slide-left': {
      hidden: { opacity: 0, x: -60 },
      visible: { opacity: 1, x: 0 }
    },
    'slide-right': {
      hidden: { opacity: 0, x: 60 },
      visible: { opacity: 1, x: 0 }
    },
    'flip-3d': {
      hidden: { opacity: 0, rotateX: 30, y: 40 },
      visible: { opacity: 1, rotateX: 0, y: 0 }
    },
    'glow-pop': {
      hidden: { opacity: 0, scale: 0.9, filter: 'brightness(0.5)' },
      visible: { opacity: 1, scale: 1, filter: 'brightness(1)' }
    }
  };

  const selectedVariant = variants[animation];

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, margin: '-80px' }}
      transition={{
        duration: 0.6,
        delay: delay,
        ease: [0.22, 1, 0.36, 1]
      }}
      variants={selectedVariant}
      className={className}
    >
      {children}
    </motion.div>
  );
}
