'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Terminal, 
  Code2, 
  Users, 
  Award, 
  ArrowRight, 
  HelpCircle, 
  ShieldCheck, 
  Briefcase, 
  BarChart,
  MessageSquare,
  Sparkles,
  Play,
  Cpu,
  Layers,
  Activity,
  Check,
  Minus,
  AlertTriangle,
  Clock,
  Tv,
  Workflow
} from 'lucide-react';

import { MultiverseScrollProgress } from '@/components/MultiverseScrollProgress';
import { InfinityStonesVault, StoneInfo } from '@/components/InfinityStonesVault';
import { ThanosSnapEffect } from '@/components/ThanosSnapEffect';
import { MarvelScrollReveal } from '@/components/MarvelScrollReveal';
import { AvengersTimelineHeist } from '@/components/AvengersTimelineHeist';
import { MjolnirThorLightning } from '@/components/MjolnirThorLightning';
import { CaptainAmericaShield } from '@/components/CaptainAmericaShield';
import { MarvelHeroesGallery } from '@/components/MarvelHeroesGallery';

// Swirling Canvas Portal Component (Marvel Avengers: Doomsday themed)
function DoomsdayPortal() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = 450);

    // Re-adjust size on window resize
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || 800;
      height = canvas.height = 450;
    };
    window.addEventListener('resize', handleResize);

    // Particle class
    interface Particle {
      angle: number;
      radius: number;
      speed: number;
      size: number;
      color: string;
      alpha: number;
      z: number;
    }

    interface Spark {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
      life: number;
    }

    interface Shockwave {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      alpha: number;
      speed: number;
    }

    const particles: Particle[] = [];
    const sparks: Spark[] = [];
    const shockwaves: Shockwave[] = [];
    const maxParticles = 250;

    // Initialize swirling particles
    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        angle: Math.random() * Math.PI * 2,
        radius: Math.random() * 150 + 20,
        speed: (Math.random() * 0.015 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
        size: Math.random() * 2 + 1,
        color: i % 5 === 0 ? '#00ff66' : i % 3 === 0 ? '#10b981' : '#34d399',
        alpha: Math.random() * 0.6 + 0.2,
        z: Math.random() * 0.5 + 0.5,
      });
    }

    // Interactive mouse coordinates
    let mouse = { x: width / 2, y: height / 2, active: false };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Spawn Chronal Rift Shockwave
      shockwaves.push({
        x,
        y,
        radius: 0,
        maxRadius: 180,
        alpha: 1,
        speed: 4
      });

      // Spawn sparks
      for (let i = 0; i < 40; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 2;
        sparks.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 3 + 1,
          color: Math.random() > 0.5 ? '#00ff66' : '#6ee7b7',
          alpha: 1,
          life: Math.random() * 30 + 20
        });
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('mousedown', handleClick);

    // Loop
    const draw = () => {
      ctx.fillStyle = 'rgba(6, 9, 19, 0.25)'; // trail effect
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Draw dimensional gateway borders (visual Doom platform representation)
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 150, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(16, 185, 129, 0.04)';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 170, 0, Math.PI * 2);
      ctx.stroke();

      // Render & Update Swirling Portal particles
      particles.forEach((p) => {
        p.angle += p.speed;
        
        // Swirl pull logic
        let targetX = centerX + Math.cos(p.angle) * p.radius;
        let targetY = centerY + Math.sin(p.angle) * p.radius;

        // If mouse is active, drift particles toward mouse
        if (mouse.active) {
          const dx = mouse.x - targetX;
          const dy = mouse.y - targetY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            targetX += (dx / dist) * 25 * p.z;
            targetY += (dy / dist) * 25 * p.z;
          }
        }

        // Draw particle
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(targetX, targetY, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Pulsate speed and radius slightly for dynamic cosmic feel
        p.radius -= 0.15;
        if (p.radius < 5) {
          p.radius = Math.random() * 150 + 20;
          p.angle = Math.random() * Math.PI * 2;
        }
      });

      // Render & Update shockwaves
      shockwaves.forEach((sw, idx) => {
        sw.radius += sw.speed;
        sw.alpha = 1 - sw.radius / sw.maxRadius;

        ctx.strokeStyle = `rgba(0, 255, 102, ${sw.alpha})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.stroke();

        if (sw.radius >= sw.maxRadius) {
          shockwaves.splice(idx, 1);
        }
      });

      // Render & Update sparks
      sparks.forEach((sp, idx) => {
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.vy += 0.05; // gravity pulls sparks down
        sp.life--;
        sp.alpha = sp.life / 50;

        ctx.fillStyle = sp.color;
        ctx.globalAlpha = sp.alpha;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
        ctx.fill();

        if (sp.life <= 0) {
          sparks.splice(idx, 1);
        }
      });

      ctx.globalAlpha = 1.0;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
        canvas.removeEventListener('mousedown', handleClick);
      }
    };
  }, []);

  return (
    <div className="relative w-full rounded-xl overflow-hidden bg-[#060913] border border-emerald-500/10 shadow-[0_0_50px_rgba(16,185,129,0.05)]">
      <canvas ref={canvasRef} className="block w-full cursor-crosshair h-[450px]" />
      <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1 bg-black/60 border border-emerald-500/20 rounded-md text-[10px] text-emerald-400 font-mono">
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
        CHRONAL RIFT INTERACTIVE: CLICK OR HOVER TO TRIGGER INFLUX
      </div>
      <div className="absolute bottom-4 right-4 text-right pointer-events-none z-10">
        <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">LATVERIAN CLOUD MATRIX</p>
        <p className="text-[14px] text-emerald-400 font-mono font-bold">doomsday.courses Platform v2026.8</p>
      </div>
    </div>
  );
}

// Simulated Chronal Telemetry Terminal Box
function ChronalTelemetry() {
  const [incursionRisk, setIncursionRisk] = useState(99.71);
  const [chronalOffset, setChronalOffset] = useState('+1.240s');
  const [portalStability, setPortalStability] = useState('89.4%');
  const [logs, setLogs] = useState<string[]>([
    'Initializing chronal coordinates for Earth-616...',
    'Latveria-Standard telemetry sync complete.',
    'System standby: Time-travel portal matrix holding.'
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      // Random updates to make it feel alive
      const risk = (99.70 + Math.random() * 0.09).toFixed(2);
      setIncursionRisk(parseFloat(risk));
      setChronalOffset(`${(1.23 + Math.random() * 0.05).toFixed(3)}s`);
      setPortalStability(`${(88.0 + Math.random() * 3.5).toFixed(1)}%`);

      const eventLogList = [
        'Warning: Subtle chronal displacement flux detected.',
        'Pruning timeline log outputs...',
        'Re-calibrating BigQuery analytical streaming node...',
        'Syncing docker clusters in Latveria Sector 4...',
        'AI code review agent dispatched to verify RAG portal node.',
        'Establishing secure connection: doomsday.courses gateway.',
        'Stabilizing portal subnets...'
      ];
      const randomLog = eventLogList[Math.floor(Math.random() * eventLogList.length)];
      setLogs(prev => [randomLog, prev[0], prev[1]].slice(0, 3));
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="glass-card p-6 incursion-grid scanline relative border border-emerald-500/10">
      <div className="flex items-center justify-between mb-4 border-b border-emerald-500/20 pb-2">
        <span className="font-mono text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase">
          <Activity size={14} className="animate-pulse" /> Chronal Telemetry Monitor
        </span>
        <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold tracking-widest uppercase">
          SYSTEM ACTIVE
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4 text-center">
        <div className="bg-black/40 p-2.5 rounded-lg border border-white/5">
          <p className="text-[9px] text-gray-500 uppercase tracking-wider font-semibold">Incursion Risk</p>
          <p className="text-sm md:text-lg font-mono font-extrabold text-emerald-400 mt-1">{incursionRisk}%</p>
        </div>
        <div className="bg-black/40 p-2.5 rounded-lg border border-white/5">
          <p className="text-[9px] text-gray-500 uppercase tracking-wider font-semibold">Chronal Offset</p>
          <p className="text-sm md:text-lg font-mono font-extrabold text-emerald-400 mt-1">{chronalOffset}</p>
        </div>
        <div className="bg-black/40 p-2.5 rounded-lg border border-white/5">
          <p className="text-[9px] text-gray-500 uppercase tracking-wider font-semibold">Portal Stability</p>
          <p className="text-sm md:text-lg font-mono font-extrabold text-emerald-400 mt-1">{portalStability}</p>
        </div>
      </div>

      <div className="bg-black/70 p-3 rounded-lg border border-emerald-500/10 font-mono text-[10px] space-y-1 text-gray-400">
        <p className="text-emerald-500/60">// LIVE STREAM DECODER:</p>
        {logs.map((log, index) => (
          <p key={index} className="truncate">
            <span className="text-emerald-500 font-bold">{`>`}</span> {log}
          </p>
        ))}
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await fetch('/api/public/courses');
        if (res.ok) {
          const data = await res.json();
          setCourses(data.courses || []);
        }
      } catch (e) {
        console.error('Failed to load courses from API:', e);
      }
    }
    loadCourses();
  }, []);

  const coursesListStatic = [
    {
      title: 'Data Analyst with Gen AI',
      slug: 'data-analyst-with-gen-ai',
      duration: '24 Weeks',
      price: 15999,
      priceOriginal: 29999,
      description: 'Analyze faster with AI-powered analytics. Master Excel, SQL, Python, Statistics, and Power BI while learning to implement real-world AI-assisted analytics workflows.',
      modules: Array(8).fill(null),
      projects: Array(3).fill(null)
    },
    {
      title: 'Data Engineer with Gen AI',
      slug: 'data-engineer-with-gen-ai',
      duration: '32 Weeks',
      price: 19999,
      priceOriginal: 34999,
      description: 'Build modern data platforms and AI-ready pipelines. Master Advanced SQL, Data Warehousing, Airflow Orchestration, PySpark Big Data, and GCP cloud frameworks with agentic data tools.',
      modules: Array(9).fill(null),
      projects: Array(3).fill(null)
    },
    {
      title: 'Data Science & Machine Learning with Gen AI',
      slug: 'data-science-ml-gen-ai',
      duration: '40 Weeks',
      price: 25999,
      priceOriginal: 44999,
      description: 'Build predictive models, LLM applications, and intelligent systems. Cover classical machine learning, Deep Learning via PyTorch, NLP, RAG architecture, and Multi-Agent structures.',
      modules: Array(12).fill(null),
      projects: Array(3).fill(null)
    },
    {
      title: 'Software Development & AI Engineering',
      slug: 'software-development-ai-engineering',
      duration: '36 Weeks',
      price: 22999,
      priceOriginal: 39999,
      description: 'Build production software, AI applications, and autonomous agents. Combine DSA, Next.js Full Stack development, Microservices, and Devops with AI-assisted software engineering.',
      modules: Array(9).fill(null),
      projects: Array(3).fill(null)
    }
  ];

  const displayCourses = courses.length > 0 ? courses : coursesListStatic;

  const faqs = [
    { 
      q: 'Is there a job placement guarantee at doomsday.courses?', 
      a: 'We offer robust career guidance, profile optimization, and placement assistance through our network of partner tech companies. Our structured mentorship prepares you to pass technical coding and systems architecture loops.' 
    },
    { 
      q: 'Who are the instructors at doomsday.courses?', 
      a: 'Our instructors are senior tech leaders and software architects with years of experience at top companies like Google, Meta, and Amazon. They lead live, interactive coding lectures.' 
    },
    { 
      q: 'Can I study part-time while working?', 
      a: 'Yes! All live classes are scheduled on weekday evenings (7:00 PM – 8:30 PM) and weekends. Live recordings are uploaded within hours of class completion so you never miss a lecture.' 
    },
    { 
      q: 'What is the GCP and BigQuery integration in classes?', 
      a: 'For data engineering and science courses, students write optimized analytical SQL queries that stream logs directly to Google BigQuery, gaining hands-on enterprise database experience.' 
    }
  ];

  // Course comparison rows setup
  const comparisonRows = [
    { name: 'Duration', da: '24 Weeks', de: '32 Weeks', ds: '40 Weeks', sd: '36 Weeks' },
    { name: 'Price', da: '₹15,999', de: '₹19,999', ds: '₹25,999', sd: '₹22,999' },
    { name: 'Live Classes', da: true, de: true, ds: true, sd: true },
    { name: 'Python Programming', da: true, de: true, ds: true, sd: true },
    { name: 'SQL Querying & DBs', da: true, de: true, ds: true, sd: true },
    { name: 'Statistics & Math', da: true, de: false, ds: true, sd: false },
    { name: 'Power BI / Dashboards', da: true, de: false, ds: false, sd: false },
    { name: 'Machine Learning', da: false, de: false, ds: true, sd: false },
    { name: 'Deep Learning / PyTorch', da: false, de: false, ds: true, sd: false },
    { name: 'Data Engineering / dbt', da: false, de: true, ds: false, sd: false },
    { name: 'GCP / Cloud Storage', da: false, de: true, ds: false, sd: true },
    { name: 'GenAI Tools / API Integration', da: 'AI-assisted analysis', de: 'AI data pipelines', ds: 'LLMs & Evaluation', sd: 'AI Engineering' },
    { name: 'RAG Retrieval System', da: false, de: true, ds: true, sd: true },
    { name: 'AI Agents / Tool Calling', da: false, de: true, ds: true, sd: true },
    { name: 'Full Stack Dev / Next.js', da: false, de: false, ds: false, sd: true },
    { name: 'Data Structures & Algorithms', da: false, de: false, ds: true, sd: true },
    { name: 'Projects Count', da: '3 Flagships', de: '3 Flagships', ds: '3 Flagships', sd: '3 Career Projects' },
    { name: '1-on-1 Mentorship', da: true, de: true, ds: true, sd: true },
    { name: 'Verified Certification', da: true, de: true, ds: true, sd: true },
  ];

  return (
    <div className="min-h-screen bg-[#060913] text-white flex flex-col selection:bg-emerald-500 selection:text-white relative">
      {/* MCU Multiverse Top Scroll Progress Bar */}
      <MultiverseScrollProgress />

      {/* Thanos Snap Interactive Gauntlet Button */}
      <ThanosSnapEffect />

      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 border-b border-emerald-500/10 bg-[#060913]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(16,185,129,0.45)]">
              DC
            </div>
            <span className="font-extrabold text-lg tracking-wider text-white flex items-center">
              doomsday<span className="text-emerald-400 font-light">.courses</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-300">
            <a href="#portal" className="hover:text-emerald-400 transition-colors">Portal</a>
            <a href="#courses" className="hover:text-emerald-400 transition-colors">Career Catalogs</a>
            <a href="#comparison" className="hover:text-emerald-400 transition-colors">Compare Syllabus</a>
            <a href="#why-us" className="hover:text-emerald-400 transition-colors">Mentorship</a>
            <a href="#faq" className="hover:text-emerald-400 transition-colors">FAQs</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-sm font-bold text-gray-300 hover:text-white px-4 py-2 transition-all"
            >
              Sign In
            </Link>
            <Link 
              href="/register" 
              className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold px-4 py-2 rounded-lg shadow-[0_4px_12px_rgba(16,185,129,0.35)] transition-all"
            >
              Explore Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-12 md:py-24 overflow-hidden border-b border-emerald-500/5">
        {/* Glow indicators */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
                <Sparkles size={12} className="animate-spin" /> Tech Education Redefined
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Master Technology. <br/>
                <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                  Rule Your Future.
                </span>
              </h1>
              <p className="text-sm md:text-base text-gray-400 max-w-xl font-medium leading-relaxed">
                doomsday.courses is a premium career sandbox. Master relational database queries, 
                stream real-time cloud data pipelines, deploy deep learning networks, or write secure tool-calling agents. 
                Attend live lectures, track leaderboard benchmarks, and earn professional qualifications.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <a 
                  href="#courses" 
                  className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-3.5 rounded-lg flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(16,185,129,0.4)] transition-all"
                >
                  Explore Catalog <ArrowRight size={18} />
                </a>
                <Link 
                  href="/login" 
                  className="w-full sm:w-auto bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold px-8 py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all"
                >
                  Login to Classroom
                </Link>
              </div>
            </div>

            {/* Hero Right Interactive Section */}
            <div id="portal" className="lg:col-span-6 space-y-6">
              <DoomsdayPortal />
              <ChronalTelemetry />
            </div>
          </div>
        </div>
      </section>

      {/* Infinity Stones Vault Section */}
      <section className="py-8 bg-[#070b16]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MarvelScrollReveal animation="glow-pop">
            <InfinityStonesVault />
          </MarvelScrollReveal>
        </div>
      </section>

      {/* Multiverse Character Mentors Gallery */}
      <MarvelHeroesGallery />

      {/* Courses Catalog Section */}
      <section id="courses" className="py-20 border-b border-emerald-500/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
          <MarvelScrollReveal animation="fade-up">
            <div className="text-center space-y-4">
              <span className="text-[10px] font-mono text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full uppercase tracking-widest bg-emerald-500/10 font-bold">
                MULTIVERSE CAREER MATRIX
              </span>
              <h2 className="text-2xl md:text-4xl font-extrabold text-white">Flagship Career Programs</h2>
              <p className="text-xs md:text-sm text-gray-400 max-w-xl mx-auto font-medium">
                Join our comprehensive, industry-aligned career tracks designed for direct employability in advanced software, AI, and big data systems.
              </p>
            </div>
          </MarvelScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {displayCourses.map((c: any, index: number) => {
              const displayPrice = c.price ? `₹${c.price.toLocaleString('en-IN')}` : '₹15,999';
              const crossedPrice = c.priceOriginal ? `₹${c.priceOriginal.toLocaleString('en-IN')}` : null;
              
              // Custom badge texts mapping the differentiation criteria requested
              let aiFocusText = "Generative AI Systems";
              const isSoftwareTrack = c.slug?.includes('software');

              if (c.slug?.includes('analyst')) aiFocusText = "Analyze faster with AI-powered analytics";
              else if (c.slug?.includes('engineer')) aiFocusText = "Build modern data platforms & AI-ready pipelines";
              else if (c.slug?.includes('science')) aiFocusText = "Build predictive models, LLMs, and RAG systems";
              else if (isSoftwareTrack) aiFocusText = "Build production software, AI apps, and autonomous agents";

              return (
                <MarvelScrollReveal 
                  key={index}
                  animation={index % 2 === 0 ? 'slide-left' : 'slide-right'}
                  delay={index * 0.1}
                >
                  <div className="glass-card p-6 flex flex-col justify-between hover:shadow-[0_8px_30px_rgb(16,185,129,0.15)] relative overflow-hidden group">
                    {/* Thor's Lightning Effect for Software Track */}
                    {isSoftwareTrack && <MjolnirThorLightning />}

                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded font-bold uppercase tracking-wider flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> {c.mode || 'LIVE'} PROGRAM
                        </span>
                        <span className="text-xs text-gray-400 font-semibold font-mono">{c.duration || '24 Weeks'}</span>
                      </div>

                    <h3 className="font-extrabold text-xl text-white tracking-wide">{c.title}</h3>
                    
                    {/* Unique positioning tagline */}
                    <p className="text-xs text-emerald-400 font-mono mt-1.5 uppercase tracking-wider">{aiFocusText}</p>
                    
                    <p className="text-xs text-gray-400 mt-3.5 leading-relaxed font-medium">
                      {c.description || 'Learn advanced concepts, coding logic, frameworks, and practical database schemas.'}
                    </p>

                    {/* Features list */}
                    <div className="grid grid-cols-2 gap-2.5 mt-5 border-t border-white/5 pt-4 text-[11px] text-gray-300 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Layers size={12} className="text-emerald-500" />
                        <span>{c.modules?.length || 8} Modules Curriculum</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Terminal size={12} className="text-emerald-500" />
                        <span>{c.projects?.length || 3} Capstone Projects</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users size={12} className="text-emerald-500" />
                        <span>1-on-1 Mentor Reviews</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Award size={12} className="text-emerald-500" />
                        <span>Verified Certification</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 border-t border-white/5 pt-4">
                    {/* Pricing Display */}
                    <div className="flex items-baseline justify-between mb-4">
                      <div>
                        <span className="text-[10px] text-gray-500 block uppercase tracking-wider font-bold">Standard Tuition Fee</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xl md:text-2xl font-mono font-extrabold text-white">{displayPrice}</span>
                          {crossedPrice && (
                            <span className="text-xs text-gray-500 line-through font-mono">{crossedPrice}</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-gray-500 block uppercase tracking-wider font-bold">No-cost EMI</span>
                        <span className="text-xs font-mono font-semibold text-emerald-400">From ₹2,499/mo</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Link
                        href={`/courses/${c.slug || c.id}`}
                        className="text-xs font-bold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-3 rounded-lg flex items-center justify-center gap-1 transition-all"
                      >
                        View Syllabus
                      </Link>
                      <Link
                        href="/register"
                        className="text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 px-4 py-3 rounded-lg flex items-center justify-center gap-1 shadow-[0_4px_12px_rgba(16,185,129,0.2)] transition-all"
                      >
                        Enroll Now <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                  </div>
                </MarvelScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Course Comparison Grid Section */}
      <section id="comparison" className="py-20 border-b border-emerald-500/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <MarvelScrollReveal animation="fade-up">
            <div className="text-center space-y-4">
              <span className="text-[10px] font-mono text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full uppercase tracking-widest bg-emerald-500/10 font-bold">
                JARVIS SYLLABUS MATRIX
              </span>
              <h2 className="text-2xl md:text-4xl font-extrabold text-white">Compare Program Specifications</h2>
              <p className="text-xs md:text-sm text-gray-400 max-w-xl mx-auto font-medium">
                Evaluate course details side-by-side to choose the track matching your targeted tech career stack.
              </p>
            </div>
          </MarvelScrollReveal>

          <MarvelScrollReveal animation="flip-3d">
            <div className="overflow-x-auto rounded-xl border border-white/5 bg-[#0A0F1A] shadow-2xl">
              <table className="w-full min-w-[700px] border-collapse text-left text-xs text-gray-300">
                <thead>
                  <tr className="border-b border-white/5 bg-black/40 text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                    <th className="p-4 font-mono">Curriculum Syllabus Stack</th>
                    <th className="p-4 font-mono text-center">Data Analyst</th>
                    <th className="p-4 font-mono text-center">Data Engineer</th>
                    <th className="p-4 font-mono text-center">Data Science & ML</th>
                    <th className="p-4 font-mono text-center">Software & AI Eng.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {comparisonRows.map((row, index) => (
                    <tr key={index} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 font-semibold text-white">{row.name}</td>
                      
                      {/* Data Analyst Column */}
                      <td className="p-4 text-center">
                        {typeof row.da === 'boolean' ? (
                          row.da ? <Check size={16} className="text-emerald-500 mx-auto" /> : <Minus size={14} className="text-gray-600 mx-auto" />
                        ) : (
                          <span className="font-semibold text-gray-300">{row.da}</span>
                        )}
                      </td>

                      {/* Data Engineer Column */}
                      <td className="p-4 text-center">
                        {typeof row.de === 'boolean' ? (
                          row.de ? <Check size={16} className="text-emerald-500 mx-auto" /> : <Minus size={14} className="text-gray-600 mx-auto" />
                        ) : (
                          <span className="font-semibold text-gray-300">{row.de}</span>
                        )}
                      </td>

                      {/* Data Science Column */}
                      <td className="p-4 text-center">
                        {typeof row.ds === 'boolean' ? (
                          row.ds ? <Check size={16} className="text-emerald-500 mx-auto" /> : <Minus size={14} className="text-gray-600 mx-auto" />
                        ) : (
                          <span className="font-semibold text-gray-300">{row.ds}</span>
                        )}
                      </td>

                      {/* Software Engineering Column */}
                      <td className="p-4 text-center">
                        {typeof row.sd === 'boolean' ? (
                          row.sd ? <Check size={16} className="text-emerald-500 mx-auto" /> : <Minus size={14} className="text-gray-600 mx-auto" />
                        ) : (
                          <span className="font-semibold text-gray-300">{row.sd}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </MarvelScrollReveal>
        </div>
      </section>

      {/* MCU Avengers Time Heist Interactive Timeline */}
      <AvengersTimelineHeist />

      {/* Why Mentorship Section */}
      <section id="why-us" className="py-20 bg-[#0A0F1A] border-b border-emerald-500/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <MarvelScrollReveal animation="fade-up">
            <div className="text-center space-y-4">
              <span className="text-[10px] font-mono text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full uppercase tracking-widest bg-emerald-500/10 font-bold">
                AVENGERS MENTORSHIP PROTOCOL
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white">Personal 1-on-1 Mentorship</h2>
              <p className="text-xs md:text-sm text-gray-400 max-w-xl mx-auto font-medium">
                We design structured feedback loops that turn students into production-ready specialists.
              </p>
            </div>
          </MarvelScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <MarvelScrollReveal animation="scale-up" delay={0.1}>
              <div className="glass-card p-6 space-y-4 h-full">
                <div className="h-12 w-12 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                  <Code2 size={24} />
                </div>
                <h3 className="font-extrabold text-lg">Structured Curriculum</h3>
                <p className="text-xs text-gray-400 leading-relaxed font-medium">
                  Detailed modules containing pre-reads, live lectures, post-reads, and coding sandboxes that track score outcomes.
                </p>
              </div>
            </MarvelScrollReveal>

            <MarvelScrollReveal animation="scale-up" delay={0.2}>
              <div className="glass-card p-6 space-y-4 h-full">
                <div className="h-12 w-12 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                  <Users size={24} />
                </div>
                <h3 className="font-extrabold text-lg">1-on-1 Mentorship</h3>
                <p className="text-xs text-gray-400 leading-relaxed font-medium">
                  Book personal sessions with technical leaders to review mock assignments, build profiles, and practice live mock interview loops.
                </p>
              </div>
            </MarvelScrollReveal>

            <MarvelScrollReveal animation="scale-up" delay={0.3}>
              <div className="glass-card p-6 space-y-4 h-full">
                <div className="h-12 w-12 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                  <Cpu size={24} />
                </div>
                <h3 className="font-extrabold text-lg">Agentic Coding Sandbox</h3>
                <p className="text-xs text-gray-400 leading-relaxed font-medium">
                  Test your models, stream logs directly to cloud databases, and verify context sizes with AI coding assistants in real time.
                </p>
              </div>
            </MarvelScrollReveal>
          </div>

          {/* Captain America Shield Interactive Widget Showcase */}
          <MarvelScrollReveal animation="glow-pop" delay={0.4}>
            <div className="mt-12 max-w-xl mx-auto">
              <CaptainAmericaShield />
            </div>
          </MarvelScrollReveal>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 border-t border-emerald-500/5">
        <div className="max-w-3xl mx-auto px-4 space-y-8">
          <MarvelScrollReveal animation="fade-up">
            <div className="text-center space-y-2">
              <span className="text-[10px] font-mono text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full uppercase tracking-widest bg-emerald-500/10 font-bold">
                TIMELINE QUERY ARCHIVE
              </span>
              <h2 className="text-2xl font-extrabold text-white">Frequently Asked Questions</h2>
              <p className="text-xs text-gray-400 font-medium">Find answers to quick queries about our platform.</p>
            </div>
          </MarvelScrollReveal>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <MarvelScrollReveal key={index} animation="slide-left" delay={index * 0.08}>
                <div className="border border-white/5 bg-white/5 rounded-lg overflow-hidden transition-all hover:border-emerald-500/30">
                  <button
                    onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                    className="w-full text-left p-4 font-bold text-xs md:text-sm flex justify-between items-center"
                  >
                    <span>{faq.q}</span>
                    <HelpCircle size={16} className="text-emerald-400" />
                  </button>
                  {activeFaq === index && (
                    <div className="p-4 pt-0 text-xs text-gray-400 leading-relaxed border-t border-white/5">
                      {faq.a}
                    </div>
                  )}
                </div>
              </MarvelScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-[#060913] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-emerald-500 flex items-center justify-center font-bold text-white text-sm">
              DC
            </div>
            <span className="font-bold text-sm tracking-wider text-white">
              doomsday<span className="text-emerald-400 font-light">.courses</span>
            </span>
          </div>
          <p className="text-xs text-gray-500 font-medium">
            &copy; {new Date().getFullYear()} doomsday.courses Education. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
