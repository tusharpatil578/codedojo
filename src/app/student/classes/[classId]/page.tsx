'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  BookOpen, 
  Video, 
  PlayCircle, 
  FileCode, 
  CheckCircle, 
  AlertCircle,
  HelpCircle,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Code
} from 'lucide-react';

interface Question {
  id: string;
  text: string;
  type: string;
  options: string[] | null;
  points: number;
  myAnswer: string | null;
  isCorrect: boolean | null;
  score: number;
  correctAnswer?: string;
  explanation?: string;
}

interface Assignment {
  id: string;
  title: string;
  difficulty: string;
  questions: Question[];
}

interface ClassDetails {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  zoomLink: string;
  recordingUrl: string | null;
  status: string;
  instructorName: string;
  preRead: any;
  postRead: any;
  attendanceStatus: string;
  assignments: Assignment[];
}

function LectureDetailsInner() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const classId = params.classId as string;
  const initialTab = searchParams.get('tab') || 'overview';

  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [loading, setLoading] = useState(true);
  const [lecture, setLecture] = useState<ClassDetails | null>(null);
  
  // Assignment State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submittingAnswers, setSubmittingAnswers] = useState<Record<string, boolean>>({});
  const [postReadCompleted, setPostReadCompleted] = useState(false);

  useEffect(() => {
    async function loadLecture() {
      try {
        const res = await fetch(`/api/student/classes/${classId}`);
        if (!res.ok) throw new Error('Failed to load class details');
        const data = await res.json();
        setLecture(data.class);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadLecture();
  }, [classId]);

  // Sync state if initial tab changes in search params
  useEffect(() => {
    if (searchParams.get('tab')) {
      setActiveTab(searchParams.get('tab')!);
    }
  }, [searchParams]);

  const handleAnswerChange = (qId: string, val: string) => {
    setSelectedAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const handleQuestionSubmit = async (qId: string) => {
    const answer = selectedAnswers[qId];
    if (!answer || answer.trim() === '') return;

    setSubmittingAnswers(prev => ({ ...prev, [qId]: true }));
    try {
      const res = await fetch('/api/student/submit-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId: qId, answer, timeSpent: 45 })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');

      // Update local state dynamically
      if (lecture) {
        const updatedAssignments = lecture.assignments.map(a => ({
          ...a,
          questions: a.questions.map(q => {
            if (q.id === qId) {
              return {
                ...q,
                myAnswer: answer,
                isCorrect: data.submission.isCorrect,
                score: data.submission.score,
                correctAnswer: data.submission.correctAnswer,
                explanation: data.submission.explanation
              };
            }
            return q;
          })
        }));
        setLecture({ ...lecture, assignments: updatedAssignments });
      }
    } catch (e) {
      console.error(e);
      alert('Failed to submit solution. Try again.');
    } finally {
      setSubmittingAnswers(prev => ({ ...prev, [qId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center bg-[#090D16]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-transparent border-[#808000]" />
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Loading classroom...</p>
        </div>
      </div>
    );
  }

  if (!lecture) {
    return (
      <div className="text-center py-12 glass-card">
        <p className="text-sm text-gray-400">Class schedule not found or access denied.</p>
        <Link href="/student/curriculum" className="text-xs text-[#808000] hover:underline font-bold mt-2 inline-block">
          Return to Curriculum
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'pre-read', label: 'Pre-Read', icon: BookOpen },
    { id: 'live-class', label: 'Live Class', icon: Video },
    { id: 'recording', label: 'Recording', icon: PlayCircle },
    { id: 'assignment', label: 'Assignment', icon: FileCode },
    { id: 'post-read', label: 'Post-Read', icon: GraduationCap }
  ];

  function GraduationCap(props: any) {
    return <BookOpen {...props} />;
  }

  return (
    <div className="space-y-6 animate-slide-in text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Link href="/student/curriculum" className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={16} /> Back to Curriculum
        </Link>
        <div className="flex gap-2 text-[10px] font-bold tracking-wider uppercase">
          <span className="bg-white/5 border border-white/5 px-2.5 py-1 rounded text-gray-400">
            Attendance: {lecture.attendanceStatus}
          </span>
          <span className="bg-[#808000]/10 border border-[#808000]/25 px-2.5 py-1 rounded text-[#808000]">
            {lecture.status}
          </span>
        </div>
      </div>

      {/* Title */}
      <div className="space-y-1">
        <h2 className="text-xl md:text-2xl font-extrabold text-white">{lecture.title}</h2>
        <p className="text-xs text-gray-400 font-semibold">Led by {lecture.instructorName} • {lecture.date}</p>
      </div>

      {/* Tabs Menu */}
      <div className="flex flex-wrap border-b border-white/5 gap-1.5 pb-0.5">
        {tabs.map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-t-lg text-xs font-bold transition-all border-b-2 ${
                isActive 
                  ? 'border-[#808000] bg-[#808000]/5 text-white' 
                  : 'border-transparent text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={14} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Dynamic Tab Pane content */}
      <div className="glass-card p-6 min-h-[300px] bg-[#0D1321]/45">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-extrabold text-base">Lecture Summary & Objectives</h3>
              <p className="text-xs text-gray-400 leading-relaxed font-medium">
                {lecture.description || 'This session covers advanced optimization, structuring schemas, and writing performant analytical queries.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/5 pt-6 text-xs font-semibold text-gray-400">
              <div className="space-y-3">
                <div>
                  <span className="text-[10px] text-gray-500 block uppercase tracking-wider">Instructor Details</span>
                  <span className="text-white mt-1 block">{lecture.instructorName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 block uppercase tracking-wider">Date & Duration</span>
                  <span className="text-white mt-1 block">{lecture.date} ({lecture.startTime} – {lecture.endTime})</span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-[10px] text-gray-500 block uppercase tracking-wider">Attendance Status</span>
                  <span className={`inline-flex items-center gap-1 mt-1 font-bold ${
                    lecture.attendanceStatus === 'PRESENT' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {lecture.attendanceStatus}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 block uppercase tracking-wider">Assignments Included</span>
                  <span className="text-white mt-1 block">
                    {lecture.assignments.length > 0 ? lecture.assignments[0].title : 'None'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PRE-READ TAB */}
        {activeTab === 'pre-read' && (
          <div className="space-y-6">
            {lecture.preRead ? (
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="font-extrabold text-sm text-[#808000] uppercase tracking-wider">Before attending this class you should understand:</h3>
                  <ul className="space-y-2 text-xs font-semibold text-gray-300">
                    {lecture.preRead.objectives?.map((obj: string, i: number) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#808000]" />
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3 border-t border-white/5 pt-6">
                  <h3 className="font-extrabold text-sm text-white">Preparation Resources</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {lecture.preRead.resources?.map((res: any, i: number) => (
                      <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-xl flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-white">{res.name}</p>
                          <span className="text-[9px] text-[#808000] font-extrabold tracking-wide uppercase mt-1 block">{res.type}</span>
                        </div>
                        <a
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] bg-white/5 hover:bg-white/10 text-white font-bold px-3 py-1.5 rounded-lg border border-white/10 transition-all flex items-center gap-1"
                        >
                          Access <ExternalLink size={10} />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-500 italic">No pre-reads loaded for this lecture.</p>
            )}
          </div>
        )}

        {/* LIVE CLASS TAB */}
        {activeTab === 'live-class' && (
          <div className="space-y-6 text-center py-6">
            {lecture.status === 'LIVE' ? (
              <div className="space-y-4">
                <span className="h-3.5 w-3.5 bg-red-500 rounded-full inline-block animate-ping mr-1" />
                <h3 className="font-extrabold text-lg text-red-500">CLASS IS LIVE NOW!</h3>
                <p className="text-xs text-gray-400 max-w-md mx-auto">
                  Click below to join the live Zoom session. Attend to log present status.
                </p>
                <a
                  href={lecture.zoomLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-8 py-3 rounded-lg gap-2 shadow-[0_4px_15px_rgba(239,68,68,0.3)] transition-all animate-bounce"
                >
                  Join Meeting <ExternalLink size={14} />
                </a>
              </div>
            ) : lecture.status === 'UPCOMING' ? (
              <div className="space-y-4">
                <h3 className="font-extrabold text-lg">Class is Upcoming</h3>
                <p className="text-xs text-gray-400 max-w-md mx-auto">
                  This class is scheduled for {lecture.date} at {lecture.startTime} PM. The Zoom connection link will become active here.
                </p>
                <button
                  disabled
                  className="bg-white/5 text-gray-500 border border-white/5 font-extrabold text-xs px-8 py-3 rounded-lg cursor-not-allowed"
                >
                  Zoom Link Locked
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="font-extrabold text-lg text-gray-400">Class Session Completed</h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  This lecture has ended. Please watch the recording playback and solve the active coding practice set.
                </p>
                <button
                  onClick={() => setActiveTab('recording')}
                  className="bg-[#808000]/15 border border-[#808000]/30 text-[#808000] hover:bg-[#808000]/25 font-bold text-xs px-6 py-2 rounded-lg transition-all"
                >
                  Switch to Recording Tab
                </button>
              </div>
            )}
          </div>
        )}

        {/* RECORDING TAB */}
        {activeTab === 'recording' && (
          <div className="space-y-6">
            {lecture.recordingUrl ? (
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-gray-200">Watch Lecture Playback Recording</h3>
                
                {/* Embedded Video Frame */}
                <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-white/5 shadow-2xl">
                  <iframe
                    src={lecture.recordingUrl}
                    title={lecture.title}
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 font-semibold">
                  <span>Duration: 1h 32m</span>
                  <span>Hosted on Cloud Storage</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 space-y-2">
                <p className="text-xs text-gray-400 italic">No recording available yet for this lecture.</p>
                <p className="text-[10px] text-gray-500">Recordings are typically posted within 2 hours of class end.</p>
              </div>
            )}
          </div>
        )}

        {/* ASSIGNMENT TAB */}
        {activeTab === 'assignment' && (
          <div className="space-y-6">
            {lecture.assignments.length === 0 ? (
              <p className="text-xs text-gray-500 italic">No practice assignments linked to this lecture.</p>
            ) : (
              lecture.assignments.map((asg) => (
                <div key={asg.id} className="space-y-6">
                  <div className="border-b border-white/5 pb-4">
                    <span className="text-[10px] bg-[#808000]/10 border border-[#808000]/20 px-2 py-0.5 rounded font-extrabold text-[#808000] uppercase tracking-wider">
                      Practice Set Difficulty: {asg.difficulty}
                    </span>
                    <h3 className="font-extrabold text-lg mt-2">{asg.title}</h3>
                  </div>

                  <div className="space-y-8">
                    {asg.questions.map((q, qIndex) => {
                      const isSolved = q.myAnswer !== null;
                      const userAns = selectedAnswers[q.id] || '';
                      
                      return (
                        <div key={q.id} className="bg-[#090D16]/60 border border-white/5 rounded-xl p-5 space-y-4">
                          <div className="flex items-start justify-between border-b border-white/5 pb-2 flex-wrap gap-2 text-xs">
                            <span className="font-extrabold text-white">Question {qIndex + 1} of {asg.questions.length}</span>
                            <span className="text-gray-500 font-bold">{q.points} Points</span>
                          </div>

                          <p className="text-xs text-gray-200 leading-relaxed font-semibold">{q.text}</p>

                          {/* Render Inputs dynamically based on question type */}
                          {isSolved ? (
                            /* Submissions logged - show correct / incorrect feedback */
                            <div className="space-y-4">
                              <div className="p-3 bg-white/5 border border-white/5 rounded-lg text-xs space-y-2 font-medium">
                                <p className="text-gray-400">Your Submission:</p>
                                <pre className="text-white bg-[#0A0F1A] p-2.5 rounded border border-white/5 overflow-x-auto text-[11px] font-mono whitespace-pre-wrap">
                                  {q.myAnswer}
                                </pre>
                                
                                <div className="flex items-center gap-1.5 text-xs font-bold pt-1">
                                  {q.isCorrect ? (
                                    <span className="text-green-400 flex items-center gap-1">
                                      <CheckCircle size={14} /> Correct Answer (+{q.points} pts)
                                    </span>
                                  ) : (
                                    <span className="text-red-400 flex items-center gap-1">
                                      <AlertCircle size={14} /> Incorrect Answer (0 pts)
                                    </span>
                                  )}
                                </div>
                              </div>

                              {q.correctAnswer && (
                                <div className="p-3 border border-green-500/10 bg-green-500/5 rounded-lg text-xs space-y-2 font-semibold">
                                  <p className="text-green-400">Correct Answer Reference:</p>
                                  <pre className="text-white bg-[#0A0F1A] p-2.5 rounded border border-white/5 overflow-x-auto text-[11px] font-mono whitespace-pre-wrap">
                                    {q.correctAnswer}
                                  </pre>
                                  {q.explanation && (
                                    <p className="text-xs text-gray-400 leading-relaxed font-medium pt-1">
                                      <strong className="text-gray-300">Explanation:</strong> {q.explanation}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          ) : (
                            /* Render Interactive Inputs */
                            <div className="space-y-3">
                              {q.type === 'MCQ' && q.options && (
                                <div className="space-y-2">
                                  {q.options.map((opt, oIdx) => (
                                    <label key={oIdx} className="flex items-center gap-2 text-xs text-gray-300 hover:text-white cursor-pointer bg-[#0D1321] p-3 rounded-lg border border-white/5 hover:border-white/10 transition-all font-semibold">
                                      <input
                                        type="radio"
                                        name={`question-${q.id}`}
                                        value={opt}
                                        checked={userAns === opt}
                                        onChange={() => handleAnswerChange(q.id, opt)}
                                        className="accent-[#808000] h-4 w-4"
                                      />
                                      {opt}
                                    </label>
                                  ))}
                                </div>
                              )}

                              {q.type === 'SQL' && (
                                <div className="space-y-2">
                                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">BigQuery Standard SQL Syntax Editor</label>
                                  <textarea
                                    rows={4}
                                    value={userAns}
                                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                    placeholder="SELECT * FROM dataset.table WHERE..."
                                    className="w-full bg-[#0A0F1A] border border-white/5 focus:border-[#808000] rounded-lg p-3 text-xs text-white focus:outline-none transition-all font-mono"
                                  />
                                </div>
                              )}

                              {q.type === 'CODING' && (
                                <div className="space-y-2">
                                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Python Code Editor</label>
                                  <textarea
                                    rows={5}
                                    value={userAns}
                                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                    placeholder="def solve(n):&#10;    # Write code here"
                                    className="w-full bg-[#0A0F1A] border border-white/5 focus:border-[#808000] rounded-lg p-3 text-xs text-white focus:outline-none transition-all font-mono"
                                  />
                                </div>
                              )}

                              {q.type !== 'MCQ' && q.type !== 'SQL' && q.type !== 'CODING' && (
                                <input
                                  type="text"
                                  value={userAns}
                                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                  placeholder="Type your answer here..."
                                  className="w-full bg-[#0A0F1A] border border-white/5 focus:border-[#808000] rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none transition-all"
                                />
                              )}

                              <button
                                type="button"
                                disabled={submittingAnswers[q.id] || !userAns}
                                onClick={() => handleQuestionSubmit(q.id)}
                                className="bg-[#808000] hover:bg-[#666600] disabled:bg-gray-500/20 disabled:text-gray-500 text-white font-extrabold text-xs px-5 py-2 rounded-lg transition-all shadow-[0_2px_8px_rgba(128,128,0,0.15)] flex items-center gap-1.5"
                              >
                                {submittingAnswers[q.id] ? 'Compiling/Running...' : 'Submit Answer'}
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* POST-READ TAB */}
        {activeTab === 'post-read' && (
          <div className="space-y-6">
            {lecture.postRead ? (
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="font-extrabold text-sm text-[#808000] uppercase tracking-wider">Post-Class Reading</h3>
                  <p className="text-xs text-gray-300 leading-relaxed font-semibold bg-white/5 p-4 rounded-xl border border-white/5">
                    {lecture.postRead.reading}
                  </p>
                </div>

                {lecture.postRead.links && lecture.postRead.links.length > 0 && (
                  <div className="space-y-3 border-t border-white/5 pt-6">
                    <h3 className="font-extrabold text-sm text-white">Recommended References</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {lecture.postRead.links.map((link: any, i: number) => (
                        <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-xl flex items-center justify-between">
                          <p className="text-xs font-bold text-white">{link.name}</p>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] bg-white/5 hover:bg-white/10 text-white font-bold px-3 py-1.5 rounded-lg border border-white/10 transition-all flex items-center gap-1"
                          >
                            Read Article <ExternalLink size={10} />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t border-white/5 pt-6 flex justify-end">
                  {postReadCompleted ? (
                    <button
                      disabled
                      className="bg-green-500/10 border border-green-500/20 text-green-400 font-extrabold text-xs px-6 py-2.5 rounded-lg flex items-center gap-1.5"
                    >
                      <CheckCircle size={14} /> Completed
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setPostReadCompleted(true);
                        // Notify
                        alert('Marked as complete! Analytics record updated.');
                      }}
                      className="bg-[#808000] hover:bg-[#666600] text-white font-extrabold text-xs px-6 py-2.5 rounded-lg transition-all"
                    >
                      Mark as Complete
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-500 italic">No post-read material uploaded yet.</p>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default function LectureDetails() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-[#090D16]">
        <div className="text-center text-xs text-gray-400 font-bold uppercase tracking-wider">Loading classroom...</div>
      </div>
    }>
      <LectureDetailsInner />
    </Suspense>
  );
}
