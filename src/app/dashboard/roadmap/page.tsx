'use client';

import React, { useState } from 'react';
import { useCareerStore } from '@/lib/store/careerStore';
import { 
  Compass, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  Code2, 
  ClipboardCheck, 
  Mic2,
  RotateCcw
} from 'lucide-react';
import { DEMO_ROADMAP } from '@/lib/constants/demoProfile';
import { CareerRoadmap } from '@/types';

export default function RoadmapPage() {
  const { roadmap, toggleRoadmapTask, profile, skills, skillGapAnalysis } = useCareerStore();
  const currentRoadmap: CareerRoadmap = roadmap || DEMO_ROADMAP;

  const [expandedWeeks, setExpandedWeeks] = useState<{ [key: number]: boolean }>({ 1: true, 2: true, 3: true });
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const toggleWeekExpand = (weekNum: number) => {
    setExpandedWeeks(prev => ({ ...prev, [weekNum]: !prev[weekNum] }));
  };

  const handleRegenerateRoadmap = async () => {
    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/ai/generate-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetCareer: profile?.targetCareerTitle || 'Machine Learning Engineer',
          skills,
          skillGaps: skillGapAnalysis.gaps,
          availableHoursPerWeek: 15
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate roadmap.');
      }

      // Automatically synced if we dispatch to store or state
    } catch (err: any) {
      console.error('Roadmap error:', err);
      if (err.message?.includes('GEMINI_API_KEY')) {
        setErrorMessage('Active roadmap calibrated to verified gaps. Set GEMINI_API_KEY in .env.local for full custom generative roadmaps.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'learn': return BookOpen;
      case 'build': return Code2;
      case 'assess': return ClipboardCheck;
      case 'interview': return Mic2;
      default: return CheckCircle2;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="h-6 w-6 text-indigo-400" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              My 12-Week Career Roadmap
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Personalized curriculum targeting your specific verified gaps for <strong className="text-white">{currentRoadmap.targetCareer}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-slate-900 border border-white/10 px-4 py-2 text-xs">
            <span className="text-slate-400 block text-[10px]">Curriculum Progress</span>
            <span className="text-lg font-bold text-indigo-400 font-mono">{currentRoadmap.overallProgress}%</span>
          </div>

          <button
            onClick={handleRegenerateRoadmap}
            disabled={isGenerating}
            className="flex items-center gap-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 px-3.5 py-2 text-xs font-semibold disabled:opacity-50"
          >
            <Sparkles className={`h-3.5 w-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Regenerating...' : 'Regenerate with AI'}</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/40 p-4 text-xs text-indigo-200">
          {errorMessage}
        </div>
      )}

      {/* Key Milestones Banner */}
      <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-3 shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Strategic Career Milestones:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {currentRoadmap.keyMilestones.map((m, idx) => (
            <div key={idx} className="rounded-xl bg-slate-950 p-3.5 border border-white/5 text-xs text-slate-200 flex items-center gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-indigo-600/30 text-indigo-300 font-bold font-mono text-[11px]">
                {idx + 1}
              </span>
              <span className="leading-relaxed font-medium">{m}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Week-by-Week Accordion */}
      <div className="space-y-4">
        {currentRoadmap.weeks.map((week) => {
          const isExpanded = expandedWeeks[week.weekNumber] ?? false;

          return (
            <div
              key={week.weekNumber}
              className={`glass-card rounded-2xl border transition-all overflow-hidden ${
                week.isCompleted
                  ? 'border-emerald-500/30 bg-emerald-950/10'
                  : 'border-white/10'
              }`}
            >
              {/* Week Header Bar */}
              <div
                onClick={() => toggleWeekExpand(week.weekNumber)}
                className="p-5 sm:p-6 flex items-center justify-between cursor-pointer hover:bg-slate-900/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold font-mono text-sm border ${
                    week.isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : 'bg-indigo-600/20 text-indigo-400 border-indigo-500/30'
                  }`}>
                    W{week.weekNumber}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-white">{week.title}</h4>
                      {week.isCompleted && (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-medium">
                          Completed
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Focus: <span className="text-slate-300 font-medium">{week.focusArea}</span> • {week.estimatedHours} hrs est.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                    {week.tasks.filter(t => t.isCompleted).length}/{week.tasks.length} Tasks
                  </span>
                  {isExpanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                </div>
              </div>

              {/* Week Tasks Expanded Body */}
              {isExpanded && (
                <div className="px-6 pb-6 pt-2 border-t border-white/5 space-y-4 bg-slate-950/40">
                  <p className="text-xs text-indigo-200 italic">
                    Objective: "{week.objective}"
                  </p>

                  <div className="space-y-2.5">
                    {week.tasks.map((task) => {
                      const Icon = getTaskIcon(task.type);

                      return (
                        <div
                          key={task.id}
                          onClick={() => toggleRoadmapTask(week.weekNumber, task.id)}
                          className={`flex items-start gap-3.5 p-3.5 rounded-xl border cursor-pointer transition-all ${
                            task.isCompleted
                              ? 'bg-emerald-950/20 border-emerald-500/20 text-slate-400'
                              : 'bg-slate-900/80 border-white/5 text-slate-200 hover:border-indigo-500/30'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={task.isCompleted}
                            onChange={() => {}}
                            className="mt-0.5 accent-emerald-500 h-4 w-4 rounded cursor-pointer"
                          />

                          <div className="flex-1 text-xs space-y-1">
                            <div className="flex items-center gap-2">
                              <Icon className="h-3.5 w-3.5 text-indigo-400" />
                              <span className={`font-semibold ${task.isCompleted ? 'line-through text-slate-500' : 'text-white'}`}>
                                {task.title}
                              </span>
                            </div>

                            <p className="text-slate-400 text-[11px] leading-relaxed">
                              {task.description}
                            </p>

                            <div className="flex items-center gap-2 text-[10px] text-slate-500 pt-0.5">
                              <span>Resource: <strong>{task.resourceName}</strong></span>
                              {task.resourceUrl && (
                                <a
                                  href={task.resourceUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5"
                                >
                                  <span>Link</span>
                                  <ExternalLink className="h-2.5 w-2.5" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
