'use client';

import React from 'react';
import { useCareerStore } from '@/lib/store/careerStore';
import { CAREER_BENCHMARKS } from '@/lib/constants/careerBenchmarks';
import { 
  Target, 
  Sparkles, 
  Check, 
  DollarSign, 
  TrendingUp, 
  Layers, 
  CheckCircle2 
} from 'lucide-react';

export default function CareerPage() {
  const { profile, updateTargetCareer } = useCareerStore();

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Target className="h-6 w-6 text-indigo-400" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              My Career Target & Benchmarks
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Currently targeting: <strong className="text-white">{profile?.targetCareerTitle || 'Machine Learning Engineer'}</strong>. Change target role to recalibrate readiness scores.
          </p>
        </div>
      </div>

      {/* Career Benchmarks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CAREER_BENCHMARKS.map((career) => {
          const isCurrent = profile?.targetCareerTitle === career.title;

          return (
            <div
              key={career.id}
              className={`glass-card rounded-2xl p-6 border transition-all flex flex-col justify-between space-y-4 ${
                isCurrent
                  ? 'border-indigo-500 bg-indigo-950/20 ring-1 ring-indigo-500 shadow-xl'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block mb-1">
                      {career.category}
                    </span>
                    <h3 className="text-lg font-bold text-white">{career.title}</h3>
                  </div>
                  {isCurrent && (
                    <span className="rounded-full bg-indigo-500/20 text-indigo-300 p-1">
                      <Check className="h-4 w-4" />
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {career.description}
                </p>

                <div className="rounded-xl bg-slate-950/80 p-3 border border-white/5 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Avg Market Compensation:</span>
                  </div>
                  <div className="font-semibold text-emerald-400 font-mono">
                    {career.avgSalary}
                  </div>
                </div>

                {/* Top Required Skills */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] font-semibold text-slate-400 block">Benchmark Requirements:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {career.requiredSkills.slice(0, 4).map((req, idx) => (
                      <span key={idx} className="rounded-md bg-slate-900 border border-white/10 px-2 py-0.5 text-[10px] text-slate-300 font-medium">
                        {req.name} ({req.requiredLevel}%)
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => updateTargetCareer(career.title)}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isCurrent
                    ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
                }`}
              >
                {isCurrent ? 'Current Target Active' : 'Set as My Target Career'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
