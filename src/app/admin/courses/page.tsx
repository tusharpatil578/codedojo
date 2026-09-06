'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Save, 
  BookOpen, 
  Sparkles, 
  Award, 
  Layers, 
  Briefcase, 
  HelpCircle, 
  Terminal, 
  CheckCircle, 
  Eye, 
  EyeOff, 
  Undo,
  ListPlus,
  AlertCircle
} from 'lucide-react';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'basics' | 'curriculum' | 'projects'>('basics');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Fetch all courses on load
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/courses');
      if (res.ok) {
        const data = await res.json();
        setCourses(data.courses || []);
        if (data.courses && data.courses.length > 0) {
          // Keep current selection or select first
          if (selectedCourse) {
            const current = data.courses.find((c: any) => c.id === selectedCourse.id);
            setSelectedCourse(current || data.courses[0]);
          } else {
            setSelectedCourse(data.courses[0]);
          }
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreateCourse = async () => {
    try {
      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'New Flagship Program',
          slug: `new-flagship-${Date.now()}`,
          description: 'A comprehensive study program.',
          duration: '12 Weeks',
          price: 9999
        })
      });
      if (res.ok) {
        const data = await res.json();
        setMessage({ text: 'Course blueprint created successfully!', type: 'success' });
        await fetchCourses();
        setSelectedCourse(data.course);
        setActiveTab('basics');
      }
    } catch (e: any) {
      setMessage({ text: e.message || 'Failed to create course', type: 'error' });
    }
  };

  const handleSaveCourse = async () => {
    if (!selectedCourse) return;
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/courses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedCourse)
      });
      if (res.ok) {
        setMessage({ text: 'All program metrics saved successfully!', type: 'success' });
        await fetchCourses();
      } else {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save');
      }
    } catch (e: any) {
      setMessage({ text: e.message || 'Failed to save changes', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // Helper bindings to update selected course state fields
  const updateField = (field: string, value: any) => {
    setSelectedCourse((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  // Nested updates builders (Features, Prerequisites, Outcomes, FAQs, Projects, Modules, Lessons)
  const addFeature = () => {
    const list = [...(selectedCourse.features || []), { text: '', icon: 'Check' }];
    updateField('features', list);
  };
  const removeFeature = (idx: number) => {
    const list = (selectedCourse.features || []).filter((_: any, i: number) => i !== idx);
    updateField('features', list);
  };
  const updateFeatureText = (idx: number, text: string) => {
    const list = [...(selectedCourse.features || [])];
    list[idx].text = text;
    updateField('features', list);
  };

  const addPrereq = () => {
    const list = [...(selectedCourse.prerequisites || []), { text: '' }];
    updateField('prerequisites', list);
  };
  const removePrereq = (idx: number) => {
    const list = (selectedCourse.prerequisites || []).filter((_: any, i: number) => i !== idx);
    updateField('prerequisites', list);
  };
  const updatePrereqText = (idx: number, text: string) => {
    const list = [...(selectedCourse.prerequisites || [])];
    list[idx].text = text;
    updateField('prerequisites', list);
  };

  const addOutcome = () => {
    const list = [...(selectedCourse.outcomes || []), { text: '' }];
    updateField('outcomes', list);
  };
  const removeOutcome = (idx: number) => {
    const list = (selectedCourse.outcomes || []).filter((_: any, i: number) => i !== idx);
    updateField('outcomes', list);
  };
  const updateOutcomeText = (idx: number, text: string) => {
    const list = [...(selectedCourse.outcomes || [])];
    list[idx].text = text;
    updateField('outcomes', list);
  };

  const addFAQ = () => {
    const list = [...(selectedCourse.faqs || []), { question: '', answer: '' }];
    updateField('faqs', list);
  };
  const removeFAQ = (idx: number) => {
    const list = (selectedCourse.faqs || []).filter((_: any, i: number) => i !== idx);
    updateField('faqs', list);
  };
  const updateFAQ = (idx: number, key: 'question' | 'answer', value: string) => {
    const list = [...(selectedCourse.faqs || [])];
    list[idx][key] = value;
    updateField('faqs', list);
  };

  const addProject = () => {
    const list = [...(selectedCourse.projects || []), {
      title: '', problemStatement: '', technologies: '', skillsCovered: '', difficulty: 'MEDIUM', outcome: ''
    }];
    updateField('projects', list);
  };
  const removeProject = (idx: number) => {
    const list = (selectedCourse.projects || []).filter((_: any, i: number) => i !== idx);
    updateField('projects', list);
  };
  const updateProject = (idx: number, key: string, value: string) => {
    const list = [...(selectedCourse.projects || [])];
    list[idx][key] = value;
    updateField('projects', list);
  };

  // Modules & Lessons builders
  const addModule = () => {
    const nextOrder = (selectedCourse.modules || []).length + 1;
    const list = [...(selectedCourse.modules || []), { title: '', order: nextOrder, lessons: [] }];
    updateField('modules', list);
  };
  const removeModule = (mIdx: number) => {
    const list = (selectedCourse.modules || []).filter((_: any, i: number) => i !== mIdx);
    updateField('modules', list);
  };
  const updateModuleTitle = (mIdx: number, title: string) => {
    const list = [...(selectedCourse.modules || [])];
    list[mIdx].title = title;
    updateField('modules', list);
  };

  const addLesson = (mIdx: number) => {
    const mList = [...(selectedCourse.modules || [])];
    const lessons = [...(mList[mIdx].lessons || [])];
    lessons.push({ title: '', description: '', order: lessons.length + 1 });
    mList[mIdx].lessons = lessons;
    updateField('modules', mList);
  };
  const removeLesson = (mIdx: number, lIdx: number) => {
    const mList = [...(selectedCourse.modules || [])];
    mList[mIdx].lessons = mList[mIdx].lessons.filter((_: any, i: number) => i !== lIdx);
    updateField('modules', mList);
  };
  const updateLesson = (mIdx: number, lIdx: number, key: 'title' | 'description', value: string) => {
    const mList = [...(selectedCourse.modules || [])];
    mList[mIdx].lessons[lIdx][key] = value;
    updateField('modules', mList);
  };

  return (
    <div className="space-y-6 text-white font-sans max-w-6xl mx-auto">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-xl font-extrabold flex items-center gap-2">
            <BookOpen className="text-emerald-400" size={24} /> Program Curriculum Manager
          </h2>
          <p className="text-xs text-gray-400">
            Define flagship programs, set pricing, update syllabuses, and publish catalogs dynamically.
          </p>
        </div>
        <button
          onClick={handleCreateCourse}
          className="bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-[0_4px_12px_rgba(16,185,129,0.2)]"
        >
          <Plus size={14} /> Create Course Blueprint
        </button>
      </div>

      {/* Message Notifications */}
      {message && (
        <div className={`p-4 rounded-lg text-xs font-semibold flex items-center gap-2 border ${
          message.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span>{message.text}</span>
        </div>
      )}

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent border-emerald-500" />
            <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">Reading catalog datasets...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT SIDE: Course Selector list */}
          <div className="lg:col-span-4 space-y-3">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider font-mono">AVAILABLE PROGRAMS ({courses.length})</p>
            <div className="space-y-2.5">
              {courses.map((c) => {
                const isSelected = selectedCourse?.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedCourse(c);
                      setMessage(null);
                    }}
                    className={`w-full text-left p-4 rounded-xl border transition-all text-xs space-y-1.5 block ${
                      isSelected 
                        ? 'bg-emerald-500/10 border-emerald-500/35 shadow-[0_4px_20px_rgba(16,185,129,0.08)]' 
                        : 'bg-[#0A0F1A] border-white/5 hover:border-white/10 hover:bg-white/[0.01]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-white truncate max-w-[180px]">{c.title}</span>
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${
                        c.published 
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                          : 'bg-gray-500/10 border-white/10 text-gray-400'
                      }`}>
                        {c.published ? 'PUBLISHED' : 'DRAFT'}
                      </span>
                    </div>
                    <div className="flex justify-between font-mono text-[9px] text-gray-500 font-bold">
                      <span>{c.duration} | {c.mode}</span>
                      <span className="text-emerald-400">₹{c.price.toLocaleString('en-IN')}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT SIDE: Program Workspace Form */}
          {selectedCourse && (
            <div className="lg:col-span-8 space-y-6">
              
              {/* Toolbar & Tabs */}
              <div className="bg-[#0A0F1A] border border-white/5 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex border-b border-white/5 sm:border-0 pb-1 sm:pb-0 gap-2 shrink-0">
                  <button
                    onClick={() => setActiveTab('basics')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      activeTab === 'basics' ? 'bg-emerald-500 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Specifications
                  </button>
                  <button
                    onClick={() => setActiveTab('curriculum')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      activeTab === 'curriculum' ? 'bg-emerald-500 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Curriculum ({selectedCourse.modules?.length || 0} Modules)
                  </button>
                  <button
                    onClick={() => setActiveTab('projects')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      activeTab === 'projects' ? 'bg-emerald-500 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Projects & FAQs
                  </button>
                </div>
                
                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => updateField('published', !selectedCourse.published)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition-all ${
                      selectedCourse.published 
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20' 
                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    {selectedCourse.published ? <Eye size={14} /> : <EyeOff size={14} />}
                    {selectedCourse.published ? 'Published' : 'Draft'}
                  </button>
                  <button
                    onClick={handleSaveCourse}
                    disabled={saving}
                    className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all text-white shadow-[0_4px_12px_rgba(16,185,129,0.2)]"
                  >
                    <Save size={14} />
                    {saving ? 'Saving changes...' : 'Save Program'}
                  </button>
                </div>
              </div>

              {/* Tabs Content */}
              <div className="glass-card p-6 border border-white/5 space-y-6">
                
                {/* 1. Tab: Basics & Specs */}
                {activeTab === 'basics' && (
                  <div className="space-y-5">
                    <h3 className="font-extrabold text-sm border-b border-white/5 pb-2 uppercase tracking-wider text-emerald-400">Basic Configurations</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Course Title</label>
                        <input
                          type="text"
                          value={selectedCourse.title}
                          onChange={(e) => updateField('title', e.target.value)}
                          className="w-full bg-black/40 border border-white/5 focus:border-emerald-500 pl-3 pr-3 py-2 text-xs rounded-lg outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Course Slug (URL path)</label>
                        <input
                          type="text"
                          value={selectedCourse.slug}
                          onChange={(e) => updateField('slug', e.target.value)}
                          className="w-full bg-black/40 border border-white/5 focus:border-emerald-500 pl-3 pr-3 py-2 text-xs rounded-lg outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Short Description</label>
                      <textarea
                        rows={3}
                        value={selectedCourse.description}
                        onChange={(e) => updateField('description', e.target.value)}
                        className="w-full bg-black/40 border border-white/5 focus:border-emerald-500 pl-3 pr-3 py-2 text-xs rounded-lg outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Duration</label>
                        <input
                          type="text"
                          value={selectedCourse.duration}
                          onChange={(e) => updateField('duration', e.target.value)}
                          className="w-full bg-black/40 border border-white/5 focus:border-emerald-500 pl-3 pr-3 py-2 text-xs rounded-lg outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Tuition Price (INR)</label>
                        <input
                          type="number"
                          value={selectedCourse.price}
                          onChange={(e) => updateField('price', e.target.value)}
                          className="w-full bg-black/40 border border-white/5 focus:border-emerald-500 pl-3 pr-3 py-2 text-xs rounded-lg outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Original Price (crossed)</label>
                        <input
                          type="number"
                          value={selectedCourse.priceOriginal || ''}
                          onChange={(e) => updateField('priceOriginal', e.target.value)}
                          className="w-full bg-black/40 border border-white/5 focus:border-emerald-500 pl-3 pr-3 py-2 text-xs rounded-lg outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Course Mode</label>
                        <input
                          type="text"
                          value={selectedCourse.mode}
                          onChange={(e) => updateField('mode', e.target.value)}
                          className="w-full bg-black/40 border border-white/5 focus:border-emerald-500 pl-3 pr-3 py-2 text-xs rounded-lg outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    {/* Features checklist manager */}
                    <div className="space-y-3 pt-3 border-t border-white/5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-gray-300">Course Feature Badges</h4>
                        <button
                          onClick={addFeature}
                          className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 hover:underline"
                        >
                          <Plus size={10} /> Add Feature
                        </button>
                      </div>
                      <div className="space-y-2">
                        {(selectedCourse.features || []).map((feat: any, idx: number) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <input
                              type="text"
                              placeholder="Feature text (e.g. Live Sessions)"
                              value={feat.text}
                              onChange={(e) => updateFeatureText(idx, e.target.value)}
                              className="flex-1 bg-black/40 border border-white/5 focus:border-emerald-500 pl-3 pr-3 py-1.5 text-xs rounded-lg outline-none"
                            />
                            <button
                              onClick={() => removeFeature(idx)}
                              className="p-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 rounded-lg transition-all"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Prerequisites and Outcomes */}
                    <div className="grid grid-cols-2 gap-6 pt-3 border-t border-white/5">
                      {/* Prerequisites */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-gray-300">Prerequisites</h4>
                          <button
                            onClick={addPrereq}
                            className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 hover:underline"
                          >
                            <Plus size={10} /> Add
                          </button>
                        </div>
                        <div className="space-y-2">
                          {(selectedCourse.prerequisites || []).map((p: any, idx: number) => (
                            <div key={idx} className="flex gap-2 items-center">
                              <input
                                type="text"
                                placeholder="Prerequisite criteria"
                                value={p.text}
                                onChange={(e) => updatePrereqText(idx, e.target.value)}
                                className="flex-1 bg-black/40 border border-white/5 focus:border-emerald-500 pl-3 pr-3 py-1.5 text-xs rounded-lg outline-none"
                              />
                              <button
                                onClick={() => removePrereq(idx)}
                                className="p-2 bg-red-500/10 text-red-400 rounded-lg"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Outcomes */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-gray-300">What You Will Learn</h4>
                          <button
                            onClick={addOutcome}
                            className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 hover:underline"
                          >
                            <Plus size={10} /> Add
                          </button>
                        </div>
                        <div className="space-y-2">
                          {(selectedCourse.outcomes || []).map((o: any, idx: number) => (
                            <div key={idx} className="flex gap-2 items-center">
                              <input
                                type="text"
                                placeholder="Outcome text"
                                value={o.text}
                                onChange={(e) => updateOutcomeText(idx, e.target.value)}
                                className="flex-1 bg-black/40 border border-white/5 focus:border-emerald-500 pl-3 pr-3 py-1.5 text-xs rounded-lg outline-none"
                              />
                              <button
                                onClick={() => removeOutcome(idx)}
                                className="p-2 bg-red-500/10 text-red-400 rounded-lg"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Tab: Modules & Lessons */}
                {activeTab === 'curriculum' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <h3 className="font-extrabold text-sm uppercase tracking-wider text-emerald-400">Curriculum Modules</h3>
                      <button
                        onClick={addModule}
                        className="bg-emerald-500/10 border border-emerald-500/25 hover:bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded text-[10px] font-bold flex items-center gap-1 transition-all"
                      >
                        <Plus size={10} /> Add Module Box
                      </button>
                    </div>

                    <div className="space-y-6">
                      {(selectedCourse.modules || []).map((mod: any, mIdx: number) => (
                        <div key={mIdx} className="bg-black/20 p-4 rounded-xl border border-white/5 space-y-4">
                          <div className="flex items-center gap-3 justify-between">
                            <div className="flex-1 flex gap-2 items-center">
                              <span className="text-[10px] text-gray-500 font-mono font-bold">ORD {mIdx + 1}:</span>
                              <input
                                type="text"
                                placeholder="Module Title (e.g. Intro to Python (Weeks 1-2))"
                                value={mod.title}
                                onChange={(e) => updateModuleTitle(mIdx, e.target.value)}
                                className="flex-1 bg-black/40 border border-white/5 focus:border-emerald-500 pl-3 pr-3 py-1 text-xs rounded-lg outline-none"
                              />
                            </div>
                            <button
                              onClick={() => removeModule(mIdx)}
                              className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg"
                              title="Delete Module"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>

                          {/* Nested Lessons lists */}
                          <div className="pl-6 border-l-2 border-emerald-500/20 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Lessons / Syllabus Topics ({mod.lessons?.length || 0})</span>
                              <button
                                onClick={() => addLesson(mIdx)}
                                className="text-[9px] text-emerald-400 font-bold flex items-center gap-1 hover:underline"
                              >
                                <Plus size={8} /> Add Lesson Topic
                              </button>
                            </div>

                            <div className="space-y-2">
                              {(mod.lessons || []).map((lesson: any, lIdx: number) => (
                                <div key={lIdx} className="flex gap-2 items-center bg-black/35 p-2 rounded-lg border border-white/5">
                                  <span className="text-[9px] font-mono text-emerald-400 font-bold shrink-0">{lIdx + 1}.</span>
                                  <input
                                    type="text"
                                    placeholder="Lesson title"
                                    value={lesson.title}
                                    onChange={(e) => updateLesson(mIdx, lIdx, 'title', e.target.value)}
                                    className="flex-1 bg-black/40 border border-white/5 pl-2 pr-2 py-1 text-xs rounded outline-none text-white focus:border-emerald-500"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Short description / subtopics"
                                    value={lesson.description || ''}
                                    onChange={(e) => updateLesson(mIdx, lIdx, 'description', e.target.value)}
                                    className="flex-[2] bg-black/40 border border-white/5 pl-2 pr-2 py-1 text-[11px] rounded outline-none text-gray-400 focus:border-emerald-500"
                                  />
                                  <button
                                    onClick={() => removeLesson(mIdx, lIdx)}
                                    className="p-1 text-red-400 hover:bg-red-500/10 rounded"
                                    title="Delete Lesson"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Tab: Projects & FAQs */}
                {activeTab === 'projects' && (
                  <div className="space-y-6">
                    {/* Projects list */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <h3 className="font-extrabold text-sm uppercase tracking-wider text-emerald-400">Industry Projects</h3>
                        <button
                          onClick={addProject}
                          className="bg-emerald-500/10 border border-emerald-500/25 hover:bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded text-[10px] font-bold flex items-center gap-1 transition-all"
                        >
                          <Plus size={10} /> Add Project Card
                        </button>
                      </div>

                      <div className="space-y-4">
                        {(selectedCourse.projects || []).map((proj: any, idx: number) => (
                          <div key={idx} className="bg-black/35 p-4 rounded-xl border border-white/5 space-y-3 relative">
                            <button
                              onClick={() => removeProject(idx)}
                              className="absolute top-4 right-4 p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg"
                              title="Remove Project"
                            >
                              <Trash2 size={12} />
                            </button>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">Project Title</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Sales Metrics Pipeline"
                                  value={proj.title}
                                  onChange={(e) => updateProject(idx, 'title', e.target.value)}
                                  className="w-full bg-black/40 border border-white/5 pl-3 pr-3 py-1.5 text-xs rounded-lg outline-none"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">Difficulty</label>
                                <select
                                  value={proj.difficulty}
                                  onChange={(e) => updateProject(idx, 'difficulty', e.target.value)}
                                  className="w-full bg-black/40 border border-white/5 pl-3 pr-3 py-1.5 text-xs rounded-lg outline-none text-white"
                                >
                                  <option value="EASY">EASY</option>
                                  <option value="MEDIUM">MEDIUM</option>
                                  <option value="HARD">HARD</option>
                                </select>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">Problem Statement</label>
                              <textarea
                                rows={2}
                                placeholder="Describe the problem students will solve"
                                value={proj.problemStatement}
                                onChange={(e) => updateProject(idx, 'problemStatement', e.target.value)}
                                className="w-full bg-black/40 border border-white/5 pl-3 pr-3 py-1.5 text-xs rounded-lg outline-none"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">Project Outcome / Output</label>
                              <input
                                type="text"
                                placeholder="e.g. Deployed AWS server with 99% uptime dashboard"
                                value={proj.outcome}
                                onChange={(e) => updateProject(idx, 'outcome', e.target.value)}
                                className="w-full bg-black/40 border border-white/5 pl-3 pr-3 py-1.5 text-xs rounded-lg outline-none"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">Technologies used</label>
                                <input
                                  type="text"
                                  placeholder="Next.js, Prisma, Stripe"
                                  value={proj.technologies}
                                  onChange={(e) => updateProject(idx, 'technologies', e.target.value)}
                                  className="w-full bg-black/40 border border-white/5 pl-3 pr-3 py-1.5 text-xs rounded-lg outline-none"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">Skills Covered</label>
                                <input
                                  type="text"
                                  placeholder="State management, APIs, Database indexing"
                                  value={proj.skillsCovered}
                                  onChange={(e) => updateProject(idx, 'skillsCovered', e.target.value)}
                                  className="w-full bg-black/40 border border-white/5 pl-3 pr-3 py-1.5 text-xs rounded-lg outline-none"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* FAQs list */}
                    <div className="space-y-4 pt-6 border-t border-white/5">
                      <div className="flex items-center justify-between">
                        <h3 className="font-extrabold text-sm uppercase tracking-wider text-emerald-400">Course Specific FAQs</h3>
                        <button
                          onClick={addFAQ}
                          className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 hover:underline"
                        >
                          <Plus size={10} /> Add FAQ Item
                        </button>
                      </div>

                      <div className="space-y-3">
                        {(selectedCourse.faqs || []).map((faq: any, idx: number) => (
                          <div key={idx} className="bg-black/35 p-3 rounded-lg border border-white/5 space-y-2 relative">
                            <button
                              onClick={() => removeFAQ(idx)}
                              className="absolute top-2 right-2 text-red-400 p-1 hover:bg-red-500/10 rounded"
                            >
                              <Trash2 size={12} />
                            </button>
                            <input
                              type="text"
                              placeholder="FAQ Question"
                              value={faq.question}
                              onChange={(e) => updateFAQ(idx, 'question', e.target.value)}
                              className="w-full bg-black/40 border border-white/5 pl-3 pr-10 py-1.5 text-xs rounded outline-none focus:border-emerald-500"
                            />
                            <textarea
                              rows={2}
                              placeholder="FAQ Answer"
                              value={faq.answer}
                              onChange={(e) => updateFAQ(idx, 'answer', e.target.value)}
                              className="w-full bg-black/40 border border-white/5 pl-3 pr-3 py-1.5 text-xs rounded outline-none focus:border-emerald-500"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
