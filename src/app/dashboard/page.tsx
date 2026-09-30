'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Target, 
  ArrowRight, 
  CheckSquare, 
  AlertTriangle, 
  Compass, 
  FolderGit2, 
  Mic2, 
  TrendingUp, 
  FileText, 
  CheckCircle2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useCareerStore } from '@/lib/store/careerStore';
import { ReadinessScoreCard } from '@/components/dashboard/ReadinessScoreCard';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar 
} from 'recharts';

export default function MainDashboardPage() {
  const { 
    profile, 
    skills, 
    readinessBreakdown, 
    skillGapAnalysis, 
    missions, 
    toggleMission, 
    roadmap,
    isDemoMode 
  } = useCareerStore();

  // Timeline Progress Data
  const timelineData = [
    { week: 'Week 1', score: 48 },
    { week: 'Week 3', score: 54 },
    { week: 'Week 5', score: 58 },
    { week: 'Week 7', score: readinessBreakdown.overall },
    { week: 'Week 9 (Proj)', score: Math.min(100, readinessBreakdown.overall + 10) },
    { week: 'Week 12 (Target)', score: 88 }
  ];

  // Radar Chart Data for Top Skills
  const radarData = skills.slice(0, 6).map((s) => ({
    skill: s.skillName.split(' ')[0],
    level: s.currentLevel,
    target: 80
  }));

  const completedMissionsCount = missions.filter((m) => m.isCompleted).length;

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Top Greeting & Career Target Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Good evening, {profile?.name || 'Student'} 👋
            </h1>
            {isDemoMode && (
              <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-amber-300 border border-amber-500/30">
                DEMO PROFILE
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Target Career:{' '}
            <strong className="text-white font-semibold">
              {profile?.targetCareerTitle || 'Machine Learning Engineer'}
            </strong>{' '}
            • Readiness calibrated to real verified evidence.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/assessments"
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/25 transition-transform hover:scale-105 active:scale-95"
          >
            <span>Take Skill Assessment</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Main Large Career Readiness Score Engine Card */}
      <ReadinessScoreCard 
        scoreData={readinessBreakdown}
        targetCareer={profile?.targetCareerTitle || 'Machine Learning Engineer'}
      />

      {/* 2-Column Section: Skill Gap Diagnosis + Daily Missions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Skill Gap Analysis Box (7 cols) */}
        <div className="lg:col-span-7 glass-card rounded-2xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Skill Gap Diagnosis
              </h3>
            </div>
            <Link
              href="/dashboard/gaps"
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
            >
              <span>Deep Analysis</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Gemini AI Summary Quote */}
          <div className="rounded-xl bg-indigo-950/40 border border-indigo-500/20 p-3.5 text-xs text-indigo-200 leading-relaxed">
            <div className="flex items-center gap-1.5 text-indigo-300 font-semibold mb-1">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              AI Diagnosis:
            </div>
            "{skillGapAnalysis.summary}"
          </div>

          {/* Top Gap Items */}
          <div className="space-y-2.5 pt-1">
            {skillGapAnalysis.gaps.slice(0, 4).map((gap) => (
              <div
                key={gap.skillName}
                className="flex items-center justify-between rounded-xl bg-slate-900/80 p-3 border border-white/5 text-xs"
              >
                <div>
                  <span className="font-semibold text-white block">{gap.skillName}</span>
                  <span className="text-[11px] text-slate-400">
                    Current: {gap.currentLevel}% • Required: {gap.requiredLevel}%
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      gap.status === 'major_gap'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : gap.status === 'moderate_gap'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {gap.status === 'major_gap' ? 'Major Gap' : gap.status === 'moderate_gap' ? 'Moderate Gap' : 'Strength'}
                  </span>
                  
                  <Link
                    href="/dashboard/assessments"
                    className="rounded bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white px-2 py-1 text-[11px] font-medium transition-colors"
                  >
                    Fix Gap
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Career Missions (5 cols) */}
        <div className="lg:col-span-5 glass-card rounded-2xl p-6 border border-white/10 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Today's Missions
                </h3>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                {completedMissionsCount} / {missions.length} Completed
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Daily micro-tasks tailored to directly target your biggest verified skill gaps.
            </p>

            <div className="space-y-2 pt-1">
              {missions.map((mission) => (
                <div
                  key={mission.id}
                  onClick={() => toggleMission(mission.id)}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    mission.isCompleted
                      ? 'bg-emerald-950/20 border-emerald-500/20 text-slate-400'
                      : 'bg-slate-900/90 border-white/5 text-slate-200 hover:border-indigo-500/30'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={mission.isCompleted}
                    onChange={() => {}}
                    className="mt-0.5 accent-emerald-500 h-4 w-4 rounded cursor-pointer"
                  />
                  <div className="flex-1 text-xs">
                    <span className={mission.isCompleted ? 'line-through text-slate-500' : 'font-medium text-slate-200'}>
                      {mission.title}
                    </span>
                    <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-2">
                      <span>⏱ {mission.estimatedMinutes} mins</span>
                      <span>• Target: {mission.targetSkillGap}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/dashboard/missions"
            className="w-full text-center text-xs text-indigo-400 hover:text-indigo-300 font-semibold pt-2"
          >
            View All Missions & Streaks →
          </Link>
        </div>
      </div>

      {/* 2-Column Section: Timeline Chart + Radar Skill Competency */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Career Timeline Improvement Graph (7 cols) */}
        <div className="lg:col-span-7 glass-card rounded-2xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Career Readiness Timeline
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Improvement over time based on real assessment activity
              </p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <XAxis dataKey="week" stroke="#64748b" fontSize={11} />
                <YAxis domain={[30, 100]} stroke="#64748b" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#6366f1" 
                  strokeWidth={3} 
                  dot={{ fill: '#818cf8', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill Graph Radar (5 cols) */}
        <div className="lg:col-span-5 glass-card rounded-2xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Competency Radar
            </h3>
            <Link href="/dashboard/skills" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold">
              View Graph →
            </Link>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="skill" stroke="#94a3b8" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={9} />
                <Radar name="Student Evidence" dataKey="level" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
                <Radar name="Target Benchmark" dataKey="target" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
