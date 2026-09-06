'use client';

import React, { useState, useEffect } from 'react';
import { Award, ShieldCheck, Download, ExternalLink, Printer } from 'lucide-react';

interface Certificate {
  id: string;
  courseTitle: string;
  issuedDate: string;
  certificateId: string;
  status: string;
}

export default function StudentCertificatesPage() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [studentName, setStudentName] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeCert, setActiveCert] = useState<Certificate | null>(null);

  useEffect(() => {
    async function loadCerts() {
      try {
        const res = await fetch('/api/student/certificates');
        if (res.ok) {
          const data = await res.json();
          setCerts(data.certificates || []);
          setStudentName(data.studentName || '');
          if (data.certificates && data.certificates.length > 0) {
            setActiveCert(data.certificates[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load certificates:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCerts();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-white/5 rounded-lg w-1/3" />
        <div className="h-96 bg-white/5 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-in text-white print:p-0 print:bg-white print:text-black">
      {/* Hide on print */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div>
          <span className="text-[10px] bg-[#808000]/10 text-[#808000] border border-[#808000]/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
            Academic Credentials
          </span>
          <h2 className="text-xl md:text-2xl font-extrabold mt-2">Earned Certificates</h2>
          <p className="text-xs text-gray-400 font-semibold mt-0.5">View and download your dynamically generated course completion certificates.</p>
        </div>
        
        {activeCert && (
          <button
            onClick={handlePrint}
            className="bg-[#808000] hover:bg-[#666600] text-white font-extrabold text-xs px-5 py-2.5 rounded-lg flex items-center gap-1.5 shadow-[0_2px_8px_rgba(128,128,0,0.15)] transition-all"
          >
            <Printer size={14} /> Print Certificate
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Certificates list (hidden on print) */}
        <div className="space-y-4 print:hidden">
          <div className="glass-card p-5 space-y-3.5">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Credentials earned</h3>
            
            {certs.length === 0 ? (
              <div className="text-center py-8 bg-[#0D1321]/40 rounded-xl border border-white/5 space-y-2">
                <p className="text-xs text-gray-400">No certificates earned yet.</p>
                <p className="text-[9px] text-gray-500 max-w-[180px] mx-auto leading-normal">
                  Solve assignment coding questions and maintain attendance above 80% to qualify automatically.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {certs.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveCert(c)}
                    className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between group ${
                      activeCert?.id === c.id 
                        ? 'bg-[#808000]/10 border-[#808000]/40' 
                        : 'bg-white/5 border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="space-y-1 pr-2">
                      <h4 className="font-extrabold text-xs text-white truncate max-w-[160px]">{c.courseTitle}</h4>
                      <span className="text-[9px] text-gray-500 block">ID: {c.certificateId}</span>
                    </div>
                    <Award size={18} className={activeCert?.id === c.id ? 'text-[#808000]' : 'text-gray-500 group-hover:text-white'} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-[#808000]/5 border border-[#808000]/25 rounded-xl p-5 space-y-3">
            <h4 className="text-[10px] font-extrabold text-[#808000] uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck size={14} /> Eligibility Checklist
            </h4>
            <div className="space-y-2 text-xs font-semibold text-gray-300">
              <div className="flex items-center justify-between text-[11px]">
                <span>Assignment score average &gt;= 80%</span>
                <span className="text-green-400">✓ Pass</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span>Class Attendance rate &gt;= 80%</span>
                <span className="text-green-400">✓ Pass</span>
              </div>
            </div>
            <span className="text-[9px] text-gray-500 block leading-normal border-t border-[#808000]/20 pt-2.5 mt-2">
              If criteria weights are matched, the system generates your certificate ID automatically.
            </span>
          </div>
        </div>

        {/* Right Column: Visual Certificate Preview */}
        <div className="lg:col-span-2 print:col-span-3">
          {activeCert ? (
            <div 
              id="certificate-print-area" 
              className="bg-[#0D1321] border-8 border-double border-[#808000]/30 rounded-xl p-8 md:p-12 relative text-center space-y-8 flex flex-col items-center justify-center min-h-[460px] shadow-2xl overflow-hidden print:border-black print:border-4 print:p-8 print:bg-white print:text-black"
            >
              {/* Background watermark seals */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] scale-150 pointer-events-none print:opacity-[0.05]">
                <Award size={200} />
              </div>

              {/* Logo / Badge header */}
              <div className="space-y-1 flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-[#808000]/10 flex items-center justify-center border border-[#808000]/20 text-[#808000] print:border-black print:text-black">
                  <Award size={24} />
                </div>
                <span className="text-xs font-bold tracking-widest text-[#808000] uppercase mt-2 block">
                  CODEDOJO EDUCATION
                </span>
              </div>

              <div className="space-y-3 max-w-lg">
                <h3 className="text-xl md:text-3xl font-extrabold text-white tracking-wide font-serif print:text-black">
                  Certificate of Excellence
                </h3>
                <div className="h-[2px] w-24 bg-[#808000] mx-auto print:bg-black" />
                <p className="text-[10px] text-gray-500 uppercase tracking-widest pt-2">
                  This completion credential is proudly awarded to
                </p>
                <h4 className="text-xl md:text-2xl font-extrabold text-white underline decoration-[#808000] decoration-2 print:text-black print:decoration-black">
                  {studentName}
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed pt-2 font-medium px-4 print:text-gray-700">
                  for successfully finishing all modular course objectives, solving core coding sandboxes, and meeting attendance benchmarks for
                </p>
                <h5 className="text-base font-extrabold text-[#808000] print:text-black">
                  {activeCert.courseTitle}
                </h5>
              </div>

              <div className="grid grid-cols-2 gap-8 border-t border-white/5 pt-6 w-full max-w-md text-xs font-semibold text-gray-500 print:border-black print:text-gray-800">
                <div className="space-y-1">
                  <p className="text-[10px] text-gray-400 print:text-gray-800">DATE ISSUED</p>
                  <p className="text-white font-bold print:text-black">{activeCert.issuedDate}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-gray-400 print:text-gray-800">CERTIFICATE ID</p>
                  <p className="text-white font-mono font-bold print:text-black">{activeCert.certificateId}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[9px] text-green-400 font-extrabold tracking-wider uppercase border border-green-500/20 bg-green-500/10 px-3 py-1 rounded-full pointer-events-none mt-4 print:border-black print:text-black">
                <ShieldCheck size={12} /> SECURED & VERIFIED CD-BLOCK
              </div>
            </div>
          ) : (
            <div className="h-[460px] glass-card flex flex-col items-center justify-center text-center p-8 space-y-2">
              <Award size={48} className="text-gray-600 animate-pulse" />
              <h3 className="font-extrabold text-gray-400">No Credentials Selected</h3>
              <p className="text-xs text-gray-500 max-w-xs font-medium">
                Your credentials list is empty. Select a course certificate once you qualify.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
