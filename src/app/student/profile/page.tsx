'use client';

import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, BookOpen, Layers, Award, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

interface StudentProfile {
  name: string;
  email: string;
  phone: string;
  courseTitle: string;
  batchName: string;
  enrollmentDate: string;
  achievements: any[];
  certificatesCount: number;
}

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            const user = data.user;
            
            // Query student achievements and certificates counts
            const certRes = await fetch('/api/student/certificates');
            let certsCount = 0;
            if (certRes.ok) {
              const certData = await certRes.ok ? await certRes.json() : { certificates: [] };
              certsCount = certData.certificates?.length || 0;
            }

            setProfile({
              name: user.name,
              email: user.email,
              phone: user.phone || '9900000000',
              courseTitle: user.studentProfile?.course?.title || 'Data Engineering',
              batchName: user.studentProfile?.batch?.name || 'GCP Cloud Batch Aug 2026',
              enrollmentDate: user.studentProfile?.enrollmentDate 
                ? new Date(user.studentProfile.enrollmentDate).toLocaleDateString() 
                : 'August 20, 2026',
              achievements: [
                { title: 'Perfect Attendance', desc: 'Attended all live classes in Module 1.', icon: 'Award' },
                { title: 'BigQuery Expert', desc: 'Scored 100% on BigQuery query optimization practice set.', icon: 'Zap' }
              ],
              certificatesCount: certsCount
            });
          }
        }
      } catch (err) {
        console.error('Failed to load student profile:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-white/5 rounded-lg w-1/3" />
        <div className="h-64 bg-white/5 rounded-xl" />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="space-y-6 animate-slide-in text-white max-w-4xl mx-auto">
      <div>
        <span className="text-[10px] bg-[#808000]/10 text-[#808000] border border-[#808000]/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
          Student Profile
        </span>
        <h2 className="text-xl md:text-2xl font-extrabold mt-2">Academic Summary</h2>
        <p className="text-xs text-gray-400 font-semibold mt-0.5">Manage your personal details, enrolled batch details, and tech achievements.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Avatar & Basic Details */}
        <div className="glass-card p-6 flex flex-col items-center text-center space-y-4">
          <div className="h-20 w-20 rounded-full bg-[#808000]/15 flex items-center justify-center font-bold text-3xl text-[#808000] border border-[#808000]/30 shadow-2xl">
            {profile.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-lg">{profile.name}</h3>
            <span className="text-[9px] bg-[#808000]/10 border border-[#808000]/25 text-[#808000] px-2.5 py-0.5 rounded font-extrabold uppercase tracking-widest block">
              STUDENT ROLE
            </span>
          </div>

          <div className="w-full text-xs font-semibold text-gray-400 space-y-2 border-t border-white/5 pt-4 text-left">
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-gray-500 shrink-0" />
              <span className="truncate text-white">{profile.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-gray-500 shrink-0" />
              <span className="text-white">+{profile.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-gray-500 shrink-0" />
              <span className="text-white">Joined: {profile.enrollmentDate}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Course batch details & achievements list */}
        <div className="md:col-span-2 space-y-6">
          {/* Batch info */}
          <div className="glass-card p-5 space-y-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Enrolled Program Details</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-gray-400">
              <div className="bg-white/5 border border-white/5 p-4 rounded-xl space-y-1">
                <span className="text-[9px] text-gray-500 block uppercase tracking-wider">Active Course</span>
                <span className="text-white font-bold leading-normal block">{profile.courseTitle}</span>
              </div>
              
              <div className="bg-white/5 border border-white/5 p-4 rounded-xl space-y-1">
                <span className="text-[9px] text-gray-500 block uppercase tracking-wider">Enrolled Batch</span>
                <span className="text-white font-bold leading-normal block">{profile.batchName}</span>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="glass-card p-5 space-y-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Tech Badge Achievements</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profile.achievements.map((ach, idx) => (
                <div key={idx} className="bg-white/5 border border-white/5 p-4 rounded-xl flex gap-3">
                  <div className="h-8 w-8 rounded-lg bg-[#808000]/10 border border-[#808000]/25 flex items-center justify-center text-[#808000] shrink-0 mt-0.5">
                    <Sparkles size={16} />
                  </div>
                  <div className="space-y-0.5 text-xs">
                    <h4 className="font-extrabold text-white">{ach.title}</h4>
                    <p className="text-gray-400 font-medium leading-relaxed text-[11px]">{ach.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
