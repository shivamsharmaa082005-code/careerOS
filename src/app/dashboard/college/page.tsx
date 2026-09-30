'use client';

import React from 'react';
import { 
  GraduationCap, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  BarChart3, 
  Award, 
  CheckCircle2,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';

export default function CollegeDashboardPage() {
  const readinessCohortData = [
    { range: '0-40% (At Risk)', count: 180 },
    { range: '41-60% (Developing)', count: 480 },
    { range: '61-80% (Ready)', count: 420 },
    { range: '81-100% (Top Tier)', count: 160 }
  ];

  const topGapsData = [
    { skill: 'DSA Trees & Graphs', gapRate: '43%', affected: 530 },
    { skill: 'Model Containerization (Docker)', gapRate: '51%', affected: 632 },
    { skill: 'Technical Communication & System Design', gapRate: '38%', affected: 471 },
    { skill: 'Cloud Deployment (AWS/GCP)', gapRate: '46%', affected: 570 }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-indigo-400" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              College & Admin Readiness Analytics
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Aggregated institutional employability telemetry and department-wide skill gap detection.
          </p>
        </div>

        <div className="rounded-xl bg-slate-900 border border-white/10 px-4 py-2 text-xs">
          <span className="text-slate-400 block text-[10px]">Cohort Size</span>
          <span className="text-base font-bold text-white font-mono">1,240 Enrolled Students</span>
        </div>
      </div>

      {/* 4 Macro Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Avg Skill Readiness</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">61 / 100</div>
          <span className="text-[11px] text-emerald-400 font-medium">+6.4% from last month</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Assessment Rate</span>
            <CheckCircle2 className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">78%</div>
          <span className="text-[11px] text-slate-400">967 students verified</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Project Portfolio Rate</span>
            <Layers className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">64%</div>
          <span className="text-[11px] text-slate-400">794 verified repositories</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Interview Practice Rate</span>
            <Award className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">42%</div>
          <span className="text-[11px] text-amber-400 font-medium">Campus hiring priority</span>
        </div>
      </div>

      {/* Cohort Score Distribution Histogram */}
      <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Department Readiness Distribution
          </h3>
          <span className="text-xs text-slate-400">1,240 Total Students</span>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={readinessCohortData}>
              <XAxis dataKey="range" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
              />
              <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Departmental Skill Gaps */}
      <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-400" />
          Most Common Institutional Skill Gaps
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topGapsData.map((gap, idx) => (
            <div key={idx} className="rounded-xl bg-slate-950 p-4 border border-white/5 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white text-sm">{gap.skill}</span>
                <span className="text-rose-400 font-bold font-mono">{gap.gapRate} Gap Rate</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Impacts <strong>{gap.affected}</strong> students across Computer Science & Data Science tracks.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
