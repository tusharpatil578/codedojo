'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Play, 
  Video, 
  BookOpen, 
  FileText, 
  Calendar, 
  Trophy, 
  Users, 
  Award, 
  ArrowRight,
  TrendingUp,
  CirclePlay,
  CheckCircle,
  ExternalLink,
  GraduationCap
} from 'lucide-react';

interface DashboardData {
  nextClass: {
    id: string;
    title: string;
    description: string;
    date: string;
    startTime: string;
    endTime: string;
    zoomLink: string;
    status: string;
    instructorName: string;
  } | null;
  todayLearning: {
    classId: string | null;
    classTitle: string;
    classStatus: string;
    preRead: any;
    postRead: any;
    assignment: {
      id: string;
      title: string;
      totalQuestions: number;
      solvedQuestions: number;
    } | null;
  };
  progress: {
    overall: number;
    modulesCompleted: number;
    totalModules: number;
    classesAttended: number;
    totalClasses: number;
    assignmentScore: number;
    contestScore: number;
  };
  attendance: {
    percentage: number;
    attended: number;
    missed: number;
    total: number;
  };
  leaderboardPreview: any[];
  myRank: {
    rank: number;
    score: number;
  };
  upcomingMentorSession: {
    id: string;
    mentorName: string;
    date: string;
    time: string;
    topic: string;
    zoomLink: string;
    status: string;
  } | null;
}

export default function StudentDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await fetch('/api/student/dashboard');
        if (res.ok) {
          const d = await res.json();
          setData(d);
          
          // Initialize countdown if upcoming class exists
          if (d.nextClass && d.nextClass.status === 'UPCOMING') {
            calculateCountdown(d.nextClass.date, d.nextClass.startTime);
          }
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  // Update countdown every minute
  useEffect(() => {
    if (!data?.nextClass || data.nextClass.status !== 'UPCOMING') return;
    const interval = setInterval(() => {
      calculateCountdown(data.nextClass!.date, data.nextClass!.startTime);
    }, 60000);
    return () => clearInterval(interval);
  }, [data]);

  const calculateCountdown = (classDate: string, startTime: string) => {
    const classDateTime = new Date(`${classDate}T${startTime}:00`);
    const diffMs = classDateTime.getTime() - new Date().getTime();
    if (diffMs <= 0) {
      setCountdown('Starts now');
      return;
    }
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    setCountdown(`Starts in ${diffHrs}h ${diffMins}m`);
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-white/5 rounded-lg w-1/4" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-44 bg-white/5 rounded-xl" />
            <div className="h-44 bg-white/5 rounded-xl" />
          </div>
          <div className="space-y-6">
            <div className="h-40 bg-white/5 rounded-xl" />
            <div className="h-40 bg-white/5 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-gray-400">Failed to load dashboard parameters. Please reload.</p>
      </div>
    );
  }

  const { nextClass, todayLearning, progress, attendance, leaderboardPreview, upcomingMentorSession, myRank } = data;

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-white">Classroom Dashboard</h2>
          <p className="text-xs text-gray-400 font-semibold mt-0.5">Welcome back! Review today\'s learning pathway activities.</p>
        </div>
        
        {/* Short Performance Metrics */}
        <div className="flex gap-4 text-xs font-semibold">
          <div className="bg-white/5 border border-white/5 px-3 py-1.5 rounded-lg">
            <span className="text-[10px] text-gray-500 block uppercase tracking-wider">Overall Score</span>
            <span className="text-white font-bold">{progress.overall}%</span>
          </div>
          <div className="bg-white/5 border border-white/5 px-3 py-1.5 rounded-lg">
            <span className="text-[10px] text-gray-500 block uppercase tracking-wider">Leaderboard Rank</span>
            <span className="text-[#808000] font-bold">#{myRank.rank}</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Next Class & Today's learning path */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* A. NEXT CLASS CARD */}
          <div className="glass-card p-5 relative overflow-hidden border-l-4 border-l-[#808000]">
            <div className="absolute top-0 right-0 h-24 w-24 bg-[#808000]/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-start justify-between flex-wrap gap-2 mb-4">
              <div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Next Class Lecture</span>
                <h3 className="text-base font-extrabold text-white mt-1">
                  {nextClass ? nextClass.title : 'No Upcoming Lectures scheduled'}
                </h3>
              </div>
              <div>
                {nextClass?.status === 'LIVE' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] font-extrabold text-red-500 animate-pulse">
                    ● LIVE NOW
                  </span>
                ) : nextClass?.status === 'UPCOMING' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#808000]/10 border border-[#808000]/20 text-[10px] font-extrabold text-[#808000]">
                    {countdown}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-extrabold text-gray-400">
                    CLASS COMPLETED
                  </span>
                )}
              </div>
            </div>

            {nextClass && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-white/5 pt-4 text-xs font-semibold text-gray-400">
                <div>
                  <span className="text-[10px] text-gray-500 block uppercase tracking-wider">Instructor</span>
                  <span className="text-white mt-0.5 block">{nextClass.instructorName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 block uppercase tracking-wider">Schedule</span>
                  <span className="text-white mt-0.5 block">{nextClass.date} ({nextClass.startTime} – {nextClass.endTime})</span>
                </div>
                
                {/* Action button */}
                <div className="md:col-span-1 flex items-center justify-start md:justify-end">
                  {nextClass.status === 'LIVE' ? (
                    <a
                      href={nextClass.zoomLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-[0_4px_12px_rgba(239,68,68,0.3)] transition-all animate-bounce"
                    >
                      <Video size={14} /> Join Zoom Class
                    </a>
                  ) : nextClass.status === 'UPCOMING' ? (
                    <button
                      disabled
                      className="bg-[#808000]/30 text-white/50 cursor-not-allowed font-extrabold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all"
                    >
                      <Video size={14} /> Locked till class starts
                    </button>
                  ) : (
                    <Link
                      href={`/student/classes/${nextClass.id}`}
                      className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-extrabold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all"
                    >
                      <CirclePlay size={14} /> Watch Recording
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* B. TODAY'S LEARNING */}
          <div className="glass-card p-5 space-y-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Today's Learning Syllabus Pathway</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* 1. Pre-read */}
              <div className="bg-[#0D1321] border border-white/5 rounded-xl p-4 flex items-start gap-3 justify-between">
                <div className="flex gap-3">
                  <div className="h-9 w-9 rounded-lg bg-[#808000]/10 border border-[#808000]/20 flex items-center justify-center text-[#808000] shrink-0 mt-0.5">
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">1. Pre-read prep</h4>
                    <p className="text-[10px] text-gray-400 mt-1 leading-normal font-medium">
                      {todayLearning.preRead ? 'Required reading objectives and files available.' : 'No pre-read scheduled for this lecture.'}
                    </p>
                  </div>
                </div>
                {todayLearning.classId && todayLearning.preRead && (
                  <Link 
                    href={`/student/classes/${todayLearning.classId}?tab=pre-read`}
                    className="text-[10px] bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold px-2.5 py-1 rounded-md transition-all self-start"
                  >
                    Open
                  </Link>
                )}
              </div>

              {/* 2. Live Class */}
              <div className="bg-[#0D1321] border border-white/5 rounded-xl p-4 flex items-start gap-3 justify-between">
                <div className="flex gap-3">
                  <div className="h-9 w-9 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0 mt-0.5">
                    <Video size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">2. Live lecture session</h4>
                    <p className="text-[10px] text-gray-400 mt-1 leading-normal font-medium">
                      {todayLearning.classTitle} ({todayLearning.classStatus})
                    </p>
                  </div>
                </div>
                {todayLearning.classId && (
                  <Link 
                    href={`/student/classes/${todayLearning.classId}`}
                    className="text-[10px] bg-[#808000] hover:bg-[#666600] text-white font-bold px-2.5 py-1 rounded-md shadow-[0_2px_8px_rgba(128,128,0,0.2)] transition-all self-start"
                  >
                    Enter
                  </Link>
                )}
              </div>

              {/* 3. Assignment */}
              <div className="bg-[#0D1321] border border-white/5 rounded-xl p-4 flex items-start gap-3 justify-between">
                <div className="flex gap-3">
                  <div className="h-9 w-9 rounded-lg bg-[#808000]/10 border border-[#808000]/20 flex items-center justify-center text-[#808000] shrink-0 mt-0.5">
                    <FileText size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">3. Coding assignment practice</h4>
                    <p className="text-[10px] text-gray-400 mt-1 leading-normal font-medium">
                      {todayLearning.assignment 
                        ? `${todayLearning.assignment.solvedQuestions}/${todayLearning.assignment.totalQuestions} Questions solved` 
                        : 'No pending questions for this session.'}
                    </p>
                  </div>
                </div>
                {todayLearning.classId && todayLearning.assignment && (
                  <Link 
                    href={`/student/classes/${todayLearning.classId}?tab=assignment`}
                    className="text-[10px] bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold px-2.5 py-1 rounded-md transition-all self-start"
                  >
                    Continue
                  </Link>
                )}
              </div>

              {/* 4. Post-read */}
              <div className="bg-[#0D1321] border border-white/5 rounded-xl p-4 flex items-start gap-3 justify-between">
                <div className="flex gap-3">
                  <div className="h-9 w-9 rounded-lg bg-[#808000]/10 border border-[#808000]/20 flex items-center justify-center text-[#808000] shrink-0 mt-0.5">
                    <GraduationCap size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">4. Post-read interview prep</h4>
                    <p className="text-[10px] text-gray-400 mt-1 leading-normal font-medium">
                      {todayLearning.postRead ? 'Deepen understanding with extra documentation.' : 'Post-read content locked.'}
                    </p>
                  </div>
                </div>
                {todayLearning.classId && todayLearning.postRead && (
                  <Link 
                    href={`/student/classes/${todayLearning.classId}?tab=post-read`}
                    className="text-[10px] bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold px-2.5 py-1 rounded-md transition-all self-start"
                  >
                    Read
                  </Link>
                )}
              </div>

            </div>
          </div>

        </div>

        {/* Right Column: Progress metrics, attendance logs */}
        <div className="space-y-6">
          
          {/* C. PROGRESS CARD */}
          <div className="glass-card p-5 space-y-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Syllabus Progress</h3>
            
            <div className="space-y-3.5">
              {/* Ring or Progress bar */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="text-gray-400">Average Grade Score</span>
                  <span className="text-[#808000]">{progress.overall}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#808000] rounded-full transition-all" style={{ width: `${progress.overall}%` }} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-white/5 font-semibold text-gray-400">
                <div>
                  <span className="text-[9px] text-gray-500 block uppercase tracking-wider">Modules Completed</span>
                  <span className="text-white mt-0.5 block">{progress.modulesCompleted} / {progress.totalModules}</span>
                </div>
                <div>
                  <span className="text-[9px] text-gray-500 block uppercase tracking-wider">Attendance Rate</span>
                  <span className="text-white mt-0.5 block">{attendance.percentage}%</span>
                </div>
                <div>
                  <span className="text-[9px] text-gray-500 block uppercase tracking-wider">Coding Score</span>
                  <span className="text-white mt-0.5 block">{progress.assignmentScore}%</span>
                </div>
                <div>
                  <span className="text-[9px] text-gray-500 block uppercase tracking-wider">Contest Rank</span>
                  <span className="text-white mt-0.5 block">{progress.contestScore}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* D. ATTENDANCE CARD */}
          <div className="glass-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Attendance Logger</h3>
              <span className="text-xs font-extrabold text-[#808000]">{attendance.percentage}%</span>
            </div>
            
            <div className="flex items-center gap-4 text-xs font-semibold justify-between bg-white/5 p-3 rounded-lg border border-white/5">
              <div className="text-center">
                <span className="text-green-400 font-bold block text-sm">{attendance.attended}</span>
                <span className="text-[9px] text-gray-500 uppercase tracking-wider">Attended</span>
              </div>
              <div className="h-6 w-[1px] bg-white/10" />
              <div className="text-center">
                <span className="text-red-400 font-bold block text-sm">{attendance.missed}</span>
                <span className="text-[9px] text-gray-500 uppercase tracking-wider">Missed</span>
              </div>
              <div className="h-6 w-[1px] bg-white/10" />
              <div className="text-center">
                <span className="text-white font-bold block text-sm">{attendance.total}</span>
                <span className="text-[9px] text-gray-500 uppercase tracking-wider">Total</span>
              </div>
            </div>

            <Link
              href="/student/attendance"
              className="w-full text-center block text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/10 text-white py-2 rounded-lg transition-all"
            >
              View Detailed Log
            </Link>
          </div>

        </div>

      </div>

      {/* Second Row: Leaderboard Preview & Mentor sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* E. LEADERBOARD PREVIEW */}
        <div className="lg:col-span-2 glass-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Batch Leaderboard rankings</h3>
            <Link href="/student/leaderboard" className="text-xs font-bold text-[#808000] hover:underline flex items-center gap-1 group/btn">
              View Full rankings <ArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="overflow-x-auto border border-white/5 rounded-lg">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/5 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="p-3 text-[10px]">Rank</th>
                  <th className="p-3 text-[10px]">Student Name</th>
                  <th className="p-3 text-[10px] text-center">Assignment</th>
                  <th className="p-3 text-[10px] text-center">Contests</th>
                  <th className="p-3 text-[10px] text-right">Overall Grade</th>
                </tr>
              </thead>
              <tbody className="font-semibold text-gray-300">
                {leaderboardPreview.map((row) => (
                  <tr 
                    key={row.email} 
                    className={`border-b border-white/5 hover:bg-white/5 transition-all ${
                      row.email === 'aarav@codedojo.com' 
                        ? 'bg-[#808000]/10 border-y border-[#808000]/30 text-white' 
                        : ''
                    }`}
                  >
                    <td className="p-3">
                      {row.rank === 1 ? '🥇 1' : row.rank === 2 ? '🥈 2' : row.rank === 3 ? '🥉 3' : row.rank}
                    </td>
                    <td className="p-3 truncate max-w-40">{row.name} {row.email === 'aarav@codedojo.com' && '(You)'}</td>
                    <td className="p-3 text-center">{row.assignmentScore}%</td>
                    <td className="p-3 text-center">{row.contestScore}%</td>
                    <td className="p-3 text-right text-[#808000]">{row.overallScore}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* F. UPCOMING MENTOR SESSION */}
        <div className="glass-card p-5 space-y-4">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Mentor Sessions Log</h3>

          {upcomingMentorSession ? (
            <div className="bg-[#0D1321] border border-[#808000]/20 rounded-xl p-4 space-y-3 relative">
              <span className="absolute top-3 right-3 text-[9px] font-bold text-[#808000] uppercase tracking-wider px-2 py-0.5 bg-[#808000]/10 border border-[#808000]/25 rounded">
                Upcoming
              </span>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-[#808000]/20 flex items-center justify-center font-bold text-[#808000]">
                  {upcomingMentorSession.mentorName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{upcomingMentorSession.mentorName}</h4>
                  <p className="text-[10px] text-gray-500">Tech Mentor / Advisor</p>
                </div>
              </div>

              <div className="space-y-1.5 text-xs pt-1">
                <div>
                  <span className="text-[9px] text-gray-500 block uppercase tracking-wider">Topic</span>
                  <span className="text-white font-bold leading-normal block">{upcomingMentorSession.topic}</span>
                </div>
                <div className="flex gap-4">
                  <div>
                    <span className="text-[9px] text-gray-500 block uppercase tracking-wider">Date</span>
                    <span className="text-white block">{upcomingMentorSession.date}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-500 block uppercase tracking-wider">Time</span>
                    <span className="text-white block">{upcomingMentorSession.time} PM</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={upcomingMentorSession.zoomLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center bg-[#808000] hover:bg-[#666600] text-white font-bold text-xs py-2 rounded-lg transition-all flex items-center justify-center gap-1 shadow-[0_2px_8px_rgba(128,128,0,0.2)]"
                >
                  Join Meeting <ExternalLink size={12} />
                </a>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 bg-white/5 rounded-xl border border-white/5 space-y-2">
              <p className="text-xs text-gray-400">No upcoming mentor slots booked.</p>
              <Link
                href="/student/mentor"
                className="inline-flex text-xs font-bold text-[#808000] hover:underline"
              >
                Book Session Now
              </Link>
            </div>
          )}

          <Link
            href="/student/mentor"
            className="w-full text-center block text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/10 text-white py-2 rounded-lg transition-all"
          >
            Manage Sessions notes & feedback
          </Link>
        </div>

      </div>
    </div>
  );
}
