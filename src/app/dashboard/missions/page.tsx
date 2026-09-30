'use client';

import React from 'react';
import Link from 'next/link';
import { useCareerStore } from '@/lib/store/careerStore';
import { 
  CheckSquare, 
  Flame, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  Award,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function DailyMissionsPage() {
  const { missions, toggleMission, profile, readinessBreakdown } = useCareerStore();

  const completedCount = missions.filter(m => m.isCompleted).length;
  const progressPercent = missions.length > 0 ? Math.round((completedCount / missions.length) * 100) : 0;

  const handleToggle = (id: string) => {
    toggleMission(id);
    const mission = missions.find(m => m.id === id);
    if (mission && !mission.isCompleted) {
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.7 }
      });
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <CheckSquare className="h-6 w-6 text-emerald-400" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Daily Career Missions
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Consistent 20-minute daily micro-habits specifically curated to eliminate your biggest skill gaps.
          </p>
        </div>

        {/* Streak Counter */}
        <div className="flex items-center gap-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 px-4 py-2 text-amber-300">
          <Flame className="h-5 w-5 text-amber-400 fill-amber-400 animate-pulse" />
          <div className="text-left">
            <span className="text-[10px] text-amber-400/80 block uppercase font-bold">Daily Streak</span>
            <span className="text-base font-extrabold font-mono">4 Days Active</span>
          </div>
        </div>
      </div>

      {/* Daily Progress Gauge */}
      <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4 shadow-xl">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-white uppercase tracking-wider">
            Today’s Progress: {completedCount} of {missions.length} Missions Completed
          </span>
          <span className="text-emerald-400 font-mono text-sm">{progressPercent}%</span>
        </div>

        <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Missions Checklist */}
      <div className="space-y-3">
        {missions.map((mission) => (
          <div
            key={mission.id}
            onClick={() => handleToggle(mission.id)}
            className={`glass-card rounded-2xl p-5 border transition-all cursor-pointer flex items-start justify-between gap-4 ${
              mission.isCompleted
                ? 'border-emerald-500/30 bg-emerald-950/10 text-slate-400'
                : 'border-white/10 hover:border-indigo-500/40 text-slate-200'
            }`}
          >
            <div className="flex items-start gap-4">
              <input
                type="checkbox"
                checked={mission.isCompleted}
                onChange={() => {}}
                className="mt-1 accent-emerald-500 h-5 w-5 rounded cursor-pointer shrink-0"
              />

              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${mission.isCompleted ? 'line-through text-slate-500' : 'text-white'}`}>
                    {mission.title}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-indigo-400" />
                    {mission.estimatedMinutes} mins
                  </span>
                  <span>• Target Gap: <strong className="text-slate-300">{mission.targetSkillGap}</strong></span>
                  <span className="uppercase text-[9px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-mono">
                    {mission.category}
                  </span>
                </div>
              </div>
            </div>

            <Link
              href={mission.actionUrl}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 shrink-0 bg-slate-900 px-3 py-1.5 rounded-lg border border-white/5 hover:border-white/20 transition-all"
            >
              <span>Launch</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
