import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { 
  ArrowLeft, 
  Clock, 
  BookOpen, 
  Layers, 
  Award, 
  Terminal, 
  ArrowRight, 
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  Briefcase,
  Users,
  Target,
  FileText
} from 'lucide-react';
import CurriculumAccordion from './CurriculumAccordion';

interface PageProps {
  params: Promise<{ courseId: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { courseId } = await params;
  const course = await prisma.course.findFirst({
    where: {
      OR: [
        { id: courseId },
        { slug: courseId }
      ]
    }
  });

  if (!course) {
    return {
      title: 'Course Not Found | doomsday.courses'
    };
  }

  return {
    title: `${course.title} — Career Program | doomsday.courses`,
    description: course.description
  };
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { courseId } = await params;

  const course = await prisma.course.findFirst({
    where: {
      OR: [
        { id: courseId },
        { slug: courseId }
      ]
    },
    include: {
      modules: {
        orderBy: { order: 'asc' },
        include: {
          lessons: {
            orderBy: { order: 'asc' }
          }
        }
      },
      features: true,
      projects: true,
      prerequisites: true,
      outcomes: true,
      faqs: true
    }
  });

  if (!course) {
    notFound();
  }

  const displayPrice = `₹${course.price.toLocaleString('en-IN')}`;
  const crossedPrice = course.priceOriginal ? `₹${course.priceOriginal.toLocaleString('en-IN')}` : null;

  return (
    <div className="min-h-screen bg-[#060913] text-white flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-emerald-500/10 bg-[#070B16]/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-all">
            <ArrowLeft size={16} /> Back to Catalog
          </Link>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-emerald-500 flex items-center justify-center font-bold text-white text-xs">
              DC
            </div>
            <span className="font-extrabold text-xs tracking-wider text-white font-mono uppercase">
              doomsday<span className="text-emerald-400 font-light">.courses</span>
            </span>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="border-b border-emerald-500/5 bg-gradient-to-b from-[#070B16] to-[#060913] py-16">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
            <Terminal size={12} className="animate-pulse" /> Live Program Pathway
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
            {course.title}
          </h1>
          <p className="text-sm md:text-base text-gray-400 leading-relaxed font-medium">
            {course.description}
          </p>

          <div className="flex flex-wrap gap-4 pt-2 text-xs font-semibold">
            <div className="bg-white/5 border border-white/5 px-4 py-2.5 rounded-lg flex items-center gap-2">
              <Clock size={16} className="text-emerald-400" />
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Duration</p>
                <p className="text-white mt-0.5">{course.duration}</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/5 px-4 py-2.5 rounded-lg flex items-center gap-2">
              <Layers size={16} className="text-emerald-400" />
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Curriculum Modules</p>
                <p className="text-white mt-0.5">{course.modules.length} Modules</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/5 px-4 py-2.5 rounded-lg flex items-center gap-2">
              <Award size={16} className="text-emerald-400" />
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Certification</p>
                <p className="text-white mt-0.5">Yes, DC Issued</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <main className="max-w-4xl mx-auto px-4 py-12 flex-1 space-y-16">
        
        {/* What You Will Learn */}
        {course.outcomes.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2">
              <Target className="text-emerald-400" size={20} /> What You Will Learn
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {course.outcomes.map((out) => (
                <div key={out.id} className="flex gap-3 bg-white/5 p-4 rounded-xl border border-white/5 text-xs md:text-sm font-medium">
                  <CheckCircle className="text-emerald-400 shrink-0 mt-0.5" size={16} />
                  <span className="text-gray-300 leading-relaxed">{out.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Prerequisites & Requirements */}
        {course.prerequisites.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2">
              <ShieldCheck className="text-emerald-400" size={20} /> Program Prerequisites
            </h2>
            <div className="bg-white/5 p-5 rounded-xl border border-white/5 space-y-3">
              {course.prerequisites.map((prereq) => (
                <div key={prereq.id} className="flex items-center gap-3 text-xs md:text-sm font-semibold text-gray-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>{prereq.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Expandable Curriculum */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2">
              <BookOpen className="text-emerald-400" size={20} /> Program Syllabus
            </h2>
            <p className="text-xs text-gray-400 font-medium">
              Click on any module to review detailed lesson schedules and topics.
            </p>
          </div>
          <CurriculumAccordion modules={course.modules as any} />
        </div>

        {/* Dynamic Project Cards */}
        {course.projects.length > 0 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2">
                <Briefcase className="text-emerald-400" size={20} /> Real-World Capstone Projects
              </h2>
              <p className="text-xs text-gray-400 font-medium">
                Build enterprise grade platforms to display on your developer resume.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {course.projects.map((proj) => (
                <div key={proj.id} className="glass-card p-6 flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(16,185,129,0.06)]">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                      <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                        {proj.difficulty} Project
                      </span>
                    </div>
                    <h3 className="font-extrabold text-lg text-white">{proj.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed font-medium">
                      <span className="text-white block font-bold mb-1">Problem Statement:</span>
                      {proj.problemStatement}
                    </p>
                    <p className="text-xs text-gray-400 leading-relaxed font-medium">
                      <span className="text-white block font-bold mb-1">Outcome:</span>
                      {proj.outcome}
                    </p>
                  </div>
                  <div className="mt-5 border-t border-white/5 pt-3 space-y-2 font-mono text-[10px]">
                    <p className="text-gray-500">
                      <span className="text-emerald-400 font-bold uppercase tracking-wider">Tech:</span> {proj.technologies}
                    </p>
                    <p className="text-gray-500">
                      <span className="text-emerald-400 font-bold uppercase tracking-wider">Skills:</span> {proj.skillsCovered}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQs */}
        {course.faqs.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2">
              <HelpCircle className="text-emerald-400" size={20} /> Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {course.faqs.map((faq) => (
                <div key={faq.id} className="bg-white/5 border border-white/5 rounded-xl p-5 space-y-2">
                  <h4 className="font-bold text-xs md:text-sm text-white">{faq.question}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed font-medium">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic CTA */}
        <div className="glass-card p-8 flex flex-col md:flex-row items-center justify-between gap-6 border-l-4 border-l-emerald-500">
          <div className="space-y-2">
            <h3 className="font-extrabold text-lg flex items-center gap-1.5">
              Secure Your Program Cohort Seat <ShieldCheck size={20} className="text-emerald-400 animate-pulse" />
            </h3>
            <p className="text-xs text-gray-400 max-w-md font-medium leading-relaxed">
              Start learning immediately, attend interactive sessions, get mock resume reviews, and query GCP BigQuery/AI sandboxes.
            </p>
          </div>
          
          <div className="text-right shrink-0 w-full md:w-auto">
            <div className="mb-3 text-center md:text-right">
              <span className="text-[10px] text-gray-500 block uppercase tracking-wider font-bold">Standard Tuition Fee</span>
              <span className="text-xl md:text-2xl font-mono font-extrabold text-white">{displayPrice}</span>
              {crossedPrice && (
                <span className="text-xs text-gray-500 line-through font-mono block">{crossedPrice}</span>
              )}
            </div>
            <Link
              href="/register"
              className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-8 py-3 rounded-lg flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(16,185,129,0.3)] transition-all"
            >
              Enroll in Cohort <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
