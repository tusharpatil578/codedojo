'use client';

import React, { useRef, useEffect } from 'react';

export function MjolnirThorLightning() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 300);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 200);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Draw procedural electric lightning bolt
    const drawLightning = (x1: number, y1: number, x2: number, y2: number, opacity: number) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);

      let currX = x1;
      let currY = y1;
      const steps = 12;

      for (let i = 0; i < steps; i++) {
        const targetX = x1 + ((x2 - x1) * i) / steps;
        const targetY = y1 + ((y2 - y1) * i) / steps;

        const jitterX = (Math.random() - 0.5) * 18;
        const jitterY = (Math.random() - 0.5) * 18;

        currX = targetX + jitterX;
        currY = targetY + jitterY;

        ctx.lineTo(currX, currY);
      }

      ctx.lineTo(x2, y2);
      ctx.strokeStyle = `rgba(0, 210, 255, ${opacity})`;
      ctx.lineWidth = Math.random() * 2 + 1;
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#00d2ff';
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Random lightning discharge
      if (Math.random() > 0.82) {
        const startX = Math.random() * width;
        const startY = 0;
        const endX = Math.random() * width;
        const endY = height;
        const opacity = Math.random() * 0.8 + 0.2;

        drawLightning(startX, startY, endX, endY, opacity);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-70"
    />
  );
}
