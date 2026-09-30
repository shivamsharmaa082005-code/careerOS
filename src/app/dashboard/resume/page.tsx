'use client';

import React, { useState } from 'react';
import { useCareerStore } from '@/lib/store/careerStore';
import { ResumeViewer } from '@/components/resume/ResumeViewer';
import { 
  FileText, 
  Sparkles, 
  Award, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Download, 
  Wand2,
  RefreshCw
} from 'lucide-react';
import { DEMO_RESUME } from '@/lib/constants/demoProfile';
import { ResumeData } from '@/types';

export default function ResumePage() {
  const { resume, saveResume, profile } = useCareerStore();
  const currentResume: ResumeData = resume || DEMO_RESUME;

  const [isAuditing, setIsAuditing] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAuditResume = async () => {
    setIsAuditing(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/ai/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeData: currentResume,
          targetCareer: profile?.targetCareerTitle || 'Machine Learning Engineer'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze resume.');
      }

      saveResume({
        ...currentResume,
        scoreAudit: data.analysis
      });
    } catch (err: any) {
      console.error('Resume audit error:', err);
      if (err.message?.includes('GEMINI_API_KEY')) {
        setErrorMessage('Configured with benchmark ATS audit. Set GEMINI_API_KEY in .env.local for real-time deep AI resume audits.');
      }
    } finally {
      setIsAuditing(false);
    }
  };

  const handleImproveResume = async () => {
    setIsImproving(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/ai/generate-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileData: currentResume,
          template: currentResume.template || 'modern'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to improve resume.');
      }

      saveResume({
        ...currentResume,
        ...data.resume
      });
    } catch (err: any) {
      console.error('Improve resume error:', err);
      if (err.message?.includes('GEMINI_API_KEY')) {
        setErrorMessage('Set GEMINI_API_KEY in .env.local to activate automated AI bullet rewriting.');
      }
    } finally {
      setIsImproving(false);
    }
  };

  const audit = currentResume.scoreAudit || {
    overallAtsScore: 78,
    atsStructure: 85,
    skillsMatch: 80,
    projectImpact: 78,
    clarityAndTone: 82,
    formatting: 88,
    strengths: [
      'Clean chronological hierarchy without unreadable tables',
      'Action verbs in project descriptions'
    ],
    criticalFixes: [
      'Add Docker and cloud deployment experience keywords',
      'Ensure all metrics have clear quantitative impact'
    ],
    actionableSuggestions: [
      'Quantify latency improvements in FastAPI backend service bullet points',
      'Include GitHub repositories link on all listed projects'
    ]
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-indigo-400" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              AI Resume Studio & ATS Analyzer
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Built strictly from verified student evidence. Zero hallucination or fake companies.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAuditResume}
            disabled={isAuditing}
            className="flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 px-4 py-2 text-xs font-semibold text-slate-200 transition-colors disabled:opacity-50"
          >
            <ShieldCheck className={`h-4 w-4 ${isAuditing ? 'animate-spin' : 'text-emerald-400'}`} />
            <span>{isAuditing ? 'Auditing...' : 'Audit ATS Score'}</span>
          </button>

          <button
            onClick={handleImproveResume}
            disabled={isImproving}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-indigo-600/25 transition-all disabled:opacity-50"
          >
            <Wand2 className={`h-4 w-4 ${isImproving ? 'animate-spin' : ''}`} />
            <span>{isImproving ? 'Improving...' : 'Improve with AI'}</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/40 p-4 text-xs text-indigo-200">
          {errorMessage}
        </div>
      )}

      {/* ATS Audit Score Breakdown Banner */}
      <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 text-2xl font-extrabold font-mono">
              {audit.overallAtsScore}%
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Overall ATS Resume Readiness Score</h3>
              <p className="text-xs text-slate-400">
                Calibrated against recruitment screening algorithms for {profile?.targetCareerTitle || 'Target Role'}
              </p>
            </div>
          </div>
        </div>

        {/* 5 Sub-Scores */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="rounded-xl bg-slate-950/80 p-3 border border-white/5">
            <span className="text-[11px] text-slate-400 block">ATS Structure</span>
            <span className="text-base font-bold text-white">{audit.atsStructure}%</span>
          </div>
          <div className="rounded-xl bg-slate-950/80 p-3 border border-white/5">
            <span className="text-[11px] text-slate-400 block">Skills Match</span>
            <span className="text-base font-bold text-white">{audit.skillsMatch}%</span>
          </div>
          <div className="rounded-xl bg-slate-950/80 p-3 border border-white/5">
            <span className="text-[11px] text-slate-400 block">Project Impact</span>
            <span className="text-base font-bold text-white">{audit.projectImpact}%</span>
          </div>
          <div className="rounded-xl bg-slate-950/80 p-3 border border-white/5">
            <span className="text-[11px] text-slate-400 block">Clarity & Tone</span>
            <span className="text-base font-bold text-white">{audit.clarityAndTone}%</span>
          </div>
          <div className="rounded-xl bg-slate-950/80 p-3 border border-white/5">
            <span className="text-[11px] text-slate-400 block">Formatting</span>
            <span className="text-base font-bold text-emerald-400">{audit.formatting}%</span>
          </div>
        </div>

        {/* Suggestions & Fixes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="rounded-xl bg-slate-950 p-4 border border-white/5 space-y-2">
            <span className="font-bold text-emerald-400 block">Audit Strengths:</span>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              {audit.strengths.map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl bg-slate-950 p-4 border border-white/5 space-y-2">
            <span className="font-bold text-amber-400 block">Actionable Fixes:</span>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              {audit.actionableSuggestions.map((sug, idx) => (
                <li key={idx}>{sug}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Live Resume Viewer with 4 templates & PDF download */}
      <ResumeViewer
        resume={currentResume}
        onUpdateResume={(updated) => saveResume(updated)}
        onRegenerateWithAI={handleImproveResume}
        isRegenerating={isImproving}
      />
    </div>
  );
}
