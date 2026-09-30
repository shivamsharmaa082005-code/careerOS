'use client';

import React from 'react';
import Link from 'next/link';
import { useCareerStore } from '@/lib/store/careerStore';
import { 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  ExternalLink,
  Target,
  BookOpen
} from 'lucide-react';

export default function SkillGapsPage() {
  const { skillGapAnalysis, profile } = useCareerStore();
  const { targetCareer, gaps, summary, overallAlignment, majorGapsCount, moderateGapsCount, strengthsCount, aiActionPlan } = skillGapAnalysis;

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-amber-400" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Skill Gap Analysis
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Evidence alignment between <strong className="text-white">{targetCareer}</strong> benchmarks and your verified skills.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-slate-900 px-4 py-2 border border-white/10 text-xs">
            <span className="text-slate-400 block text-[10px]">Benchmark Alignment</span>
            <span className="text-lg font-bold text-indigo-400 font-mono">{overallAlignment}%</span>
          </div>
        </div>
      </div>

      {/* Gemini AI Synthesis Banner */}
      <div className="glass-card rounded-2xl p-6 border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-slate-900 to-purple-950/30 shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wider">
          <Sparkles className="h-4 w-4 text-indigo-400" />
          Gemini AI Diagnostic Summary
        </div>
        <p className="text-sm text-slate-200 leading-relaxed font-medium">
          "{summary}"
        </p>

        {/* 3 Metric Pills */}
        <div className="flex flex-wrap gap-3 pt-2">
          <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 text-xs text-rose-300">
            <strong>{majorGapsCount}</strong> Major Gaps
          </div>
          <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 text-xs text-amber-300">
            <strong>{moderateGapsCount}</strong> Moderate Gaps
          </div>
          <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-xs text-emerald-300">
            <strong>{strengthsCount}</strong> Verified Strengths
          </div>
        </div>
      </div>

      {/* Detailed Skill Gap Comparison Table */}
      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-white/10 bg-slate-900/90 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Target Career Requirements vs Student Evidence
          </h3>
          <span className="text-xs text-slate-400">
            Sorted by priority
          </span>
        </div>

        <div className="divide-y divide-white/5">
          {gaps.map((gap) => (
            <div key={gap.skillName} className="p-6 hover:bg-slate-900/50 transition-colors space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    {gap.skillName}
                    <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                      gap.status === 'major_gap'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : gap.status === 'moderate_gap'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {gap.status === 'major_gap' ? 'Major Gap' : gap.status === 'moderate_gap' ? 'Moderate Gap' : 'Strength'}
                    </span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">{gap.recommendation}</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right text-xs">
                    <div className="text-slate-400">Current: <strong className="text-white">{gap.currentLevel}%</strong></div>
                    <div className="text-slate-500 text-[11px]">Required: {gap.requiredLevel}%</div>
                  </div>

                  <Link
                    href="/dashboard/assessments"
                    className="flex items-center gap-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-3.5 py-2 text-xs font-semibold text-white transition-all shadow-md"
                  >
                    <span>Assess</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* Progress Dual Bar Comparison */}
              <div className="space-y-1">
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden relative">
                  {/* Required Target Marker */}
                  <div 
                    className="absolute top-0 bottom-0 bg-white/30 z-10 w-0.5" 
                    style={{ left: `${gap.requiredLevel}%` }}
                    title={`Required: ${gap.requiredLevel}%`}
                  />
                  {/* Current Level Fill */}
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      gap.status === 'strength'
                        ? 'bg-emerald-500'
                        : gap.status === 'moderate_gap'
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${gap.currentLevel}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Action Plan Recommendations */}
      <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-indigo-400" />
          Recommended Action Plan
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {aiActionPlan.map((action, idx) => (
            <div key={idx} className="rounded-xl bg-slate-900/80 p-4 border border-white/5 text-xs text-slate-200 flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-indigo-600/30 text-indigo-300 font-bold font-mono text-[11px]">
                {idx + 1}
              </span>
              <span className="leading-relaxed">{action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
