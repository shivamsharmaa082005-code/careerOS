'use client';

import React from 'react';
import { useCareerStore } from '@/lib/store/careerStore';
import { 
  GitCommit, 
  CheckCircle2, 
  AlertCircle, 
  Code, 
  Layers, 
  Database, 
  Cpu, 
  MessageSquare,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

export default function SkillsGraphPage() {
  const { skills, profile } = useCareerStore();

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <GitCommit className="h-6 w-6 text-indigo-400" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              My Skill Graph
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Visual competence tree tracking granular verified evidence rather than binary yes/no tags.
          </p>
        </div>

        <Link
          href="/dashboard/assessments"
          className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/25 transition-transform hover:scale-105"
        >
          Verify Skills with Assessment
        </Link>
      </div>

      {/* Skill Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill) => {
          return (
            <div 
              key={skill.id}
              className="glass-card rounded-2xl p-6 border border-white/10 space-y-4 relative overflow-hidden"
            >
              {/* Top Bar */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    {skill.skillName}
                  </h3>
                  <span className="text-[11px] text-slate-400 capitalize">
                    {skill.category} Category
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-xl font-extrabold text-indigo-400 font-mono">
                    {skill.currentLevel}%
                  </span>
                  <div className="text-[10px] text-slate-500">
                    {skill.verifiedByAssessment ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Verified
                      </span>
                    ) : (
                      <span className="text-amber-400">Self-estimated</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-700 ${
                    skill.currentLevel >= 75 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400' 
                      : skill.currentLevel >= 50 
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500' 
                      : 'bg-gradient-to-r from-amber-500 to-rose-500'
                  }`}
                  style={{ width: `${skill.currentLevel}%` }}
                />
              </div>

              {/* Nested Sub-Skill Tree Breakdown */}
              {skill.subSkills && skill.subSkills.length > 0 ? (
                <div className="pt-2 border-t border-white/5 space-y-2 font-mono text-xs">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-sans font-bold">
                    Sub-Competency Tree:
                  </span>
                  {skill.subSkills.map((sub, sidx) => (
                    <div key={sidx} className="flex items-center justify-between text-slate-300">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-slate-600">
                          {sidx === skill.subSkills!.length - 1 ? '└──' : '├──'}
                        </span>
                        <span className="truncate">{sub.name}</span>
                      </div>
                      <span className={`font-bold shrink-0 ml-2 ${
                        sub.level >= 75 ? 'text-emerald-400' : sub.level >= 50 ? 'text-indigo-300' : 'text-amber-400'
                      }`}>
                        {sub.level}%
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="pt-2 text-[11px] text-slate-500 italic">
                  Take assessment to generate granular sub-skill breakdown.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
