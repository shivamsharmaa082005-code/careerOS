'use client';

import React, { useState } from 'react';
import { 
  Award, 
  HelpCircle, 
  TrendingUp, 
  Sparkles, 
  Info, 
  CheckCircle, 
  Code, 
  Layers, 
  FolderGit2, 
  MessageSquare, 
  FileText, 
  Mic2,
  X 
} from 'lucide-react';
import { ReadinessScoreBreakdown } from '@/types';

interface ReadinessScoreCardProps {
  scoreData: ReadinessScoreBreakdown;
  targetCareer: string;
}

export const ReadinessScoreCard: React.FC<ReadinessScoreCardProps> = ({ 
  scoreData,
  targetCareer
}) => {
  const [showFormulaModal, setShowFormulaModal] = useState(false);

  const {
    overall,
    technicalSkills,
    dsa,
    projects,
    communication,
    resumeQuality,
    interviewReadiness,
    scoreFormulaExplanation
  } = scoreData;

  // SVG Circular progress math
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overall / 100) * circumference;

  const getScoreTier = (score: number) => {
    if (score >= 80) return { label: 'Interview Ready', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' };
    if (score >= 60) return { label: 'Developing Fast', color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/30' };
    if (score >= 40) return { label: 'Early Foundation', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' };
    return { label: 'Beginner Phase', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30' };
  };

  const tier = getScoreTier(overall);

  const metrics = [
    { name: 'Technical Skills', score: technicalSkills, icon: Code, weight: '25%' },
    { name: 'DSA & Algorithms', score: dsa, icon: Layers, weight: '20%' },
    { name: 'Projects & Portfolio', score: projects, icon: FolderGit2, weight: '20%' },
    { name: 'Resume ATS Quality', score: resumeQuality, icon: FileText, weight: '15%' },
    { name: 'Interview Readiness', score: interviewReadiness, icon: Mic2, weight: '10%' },
    { name: 'Communication & Soft Skills', score: communication, icon: MessageSquare, weight: '10%' }
  ];

  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden border border-white/10 shadow-2xl">
      
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-tight">
              Career Skill Readiness
            </h2>
            <button
              onClick={() => setShowFormulaModal(true)}
              className="text-slate-400 hover:text-white transition-colors"
              title="How this score is calculated"
            >
              <HelpCircle className="h-4 w-4" />
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Evidence alignment against <span className="font-semibold text-slate-200">{targetCareer}</span> benchmarks
          </p>
        </div>

        <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${tier.bg} ${tier.color} ${tier.border}`}>
          {tier.label}
        </div>
      </div>

      {/* Main Score Center & Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Circular Progress Gauge */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-2">
          <div className="relative flex items-center justify-center">
            <svg className="w-44 h-44 transform -rotate-90">
              <circle
                cx="88"
                cy="88"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="12"
                fill="transparent"
              />
              <circle
                cx="88"
                cy="88"
                r={radius}
                className="transition-all duration-1000 ease-out"
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="url(#score-gradient)"
                fill="transparent"
              />
              <defs>
                <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="50%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>

            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-extrabold text-white tracking-tight">
                {overall}
              </span>
              <span className="text-xs font-medium text-slate-400">
                out of 100
              </span>
            </div>
          </div>

          <div className="mt-3 text-center">
            <p className="text-[11px] text-slate-400">
              Updates automatically as you complete assessments & projects
            </p>
          </div>
        </div>

        {/* 6 Sub-Score Progress Bars */}
        <div className="md:col-span-8 space-y-3">
          {metrics.map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-300 flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5 text-indigo-400" />
                    {m.name}
                    <span className="text-[10px] text-slate-300 font-mono">({m.weight})</span>
                  </span>
                  <span className="font-bold text-slate-200">
                    {m.score}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800/80 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      m.score >= 75
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                        : m.score >= 50
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500'
                        : 'bg-gradient-to-r from-amber-500 to-rose-500'
                    }`}
                    style={{ width: `${Math.max(5, m.score)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Formula Explanation Modal */}
      {showFormulaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Info className="h-5 w-5 text-indigo-400" />
                Evidence-Based Scoring Engine
              </h3>
              <button
                onClick={() => setShowFormulaModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              CareerOS does not guess or predict future hiring guarantees. Instead, it measures your <strong>verified current evidence</strong> against the standardized benchmark requirements of your target career.
            </p>

            <div className="rounded-xl bg-slate-950 p-4 border border-white/5 space-y-2 font-mono text-xs text-indigo-300">
              <div className="text-white font-bold mb-1">Score Weighting Formula:</div>
              <div>• 25% Technical Skills & Verified Assessments</div>
              <div>• 20% DSA & Problem Solving Verification</div>
              <div>• 20% Project Quality, Depth & Practical Value</div>
              <div>• 15% Resume ATS Structure & Quantified Impact</div>
              <div>• 10% AI Mock Interview Execution Score</div>
              <div>• 10% Technical Communication & Soft Skills</div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowFormulaModal(false)}
                className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-2 text-xs font-semibold text-white"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
