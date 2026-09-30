'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Target, 
  Mic, 
  FileText, 
  Layers, 
  Compass, 
  Bot, 
  ShieldCheck, 
  Zap, 
  ChevronRight,
  TrendingUp,
  BarChart3,
  Award
} from 'lucide-react';
import { useCareerStore } from '@/lib/store/careerStore';

export default function LandingPage() {
  const { readinessBreakdown, switchToDemo } = useCareerStore();

  return (
    <div className="relative overflow-hidden">
      
      {/* Background ambient lighting effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* HERO SECTION */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          
          {/* Tagline Pill */}
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 px-4 py-1.5 text-xs sm:text-sm font-semibold text-indigo-300 backdrop-blur-md shadow-sm">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <span>From “I want this career” to “I’m ready for this career.”</span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
            Know where you stand. <br className="hidden sm:inline" />
            <span className="gradient-text">Know what to do next.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            An AI-powered career readiness platform that analyzes your real skills, projects, resume, and interview performance to create a personalized path toward your target career.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/onboarding"
              className="flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-8 py-4 text-base font-bold text-white shadow-xl shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all"
            >
              <span>Check My Career Readiness</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/dashboard"
              onClick={() => switchToDemo()}
              className="flex items-center gap-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-white/10 px-6 py-4 text-base font-semibold text-slate-200 transition-colors shadow-lg"
            >
              <span>Explore Platform (Demo)</span>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </Link>
          </div>

          {/* Social Proof / Safety guarantee banner */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Evidence-based scoring</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Real Google Gemini AI integration</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Zero-Resume Voice Profile AI</span>
            </div>
          </div>
        </div>

        {/* HERO INTERACTIVE DASHBOARD PREVIEW */}
        <div className="mt-14 max-w-5xl mx-auto rounded-3xl p-1.5 bg-gradient-to-b from-indigo-500/30 via-white/10 to-transparent shadow-2xl">
          <div className="rounded-[22px] bg-slate-950 border border-white/10 p-6 md:p-8 space-y-6">
            
            {/* Top Preview Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/30 text-indigo-400 font-bold border border-indigo-500/30">
                  RV
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-white">Rahul Verma</span>
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-mono">
                      DEMO BENCHMARK
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">Targeting: <strong>Machine Learning Engineer</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="text-right">
                  <span className="text-slate-400 block text-[11px]">Calculated Readiness</span>
                  <span className="text-xl font-extrabold text-indigo-400">{readinessBreakdown.overall}/100</span>
                </div>
              </div>
            </div>

            {/* Dashboard Cards Preview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Card 1: Score & Breakdown */}
              <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span>Skill Alignment</span>
                  <span className="text-emerald-400 font-mono">Top 25%</span>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>Python & Scikit-Learn</span>
                      <span className="font-semibold text-white">82%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '82%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>DSA & Graph Algorithms</span>
                      <span className="font-semibold text-amber-400">52% (Gap)</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '52%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>Docker & Model Deployment</span>
                      <span className="font-semibold text-rose-400">38% (Critical)</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-rose-500 rounded-full" style={{ width: '38%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: AI Roadmap Step */}
              <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span>Next Action Step</span>
                  <span className="text-indigo-400 text-[11px]">Week 3 of 12</span>
                </div>
                <div className="rounded-xl bg-slate-950 p-3 border border-white/5 space-y-1">
                  <span className="text-xs font-semibold text-white block">Dynamic Programming & Tree Inversion</span>
                  <p className="text-[11px] text-slate-400">
                    Fix your LeetCode tree and graph gap before starting full-loop ML mock interviews.
                  </p>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Estimated: 12 hrs</span>
                  <span className="text-indigo-400 font-medium">1 Assessment ready</span>
                </div>
              </div>

              {/* Card 3: Voice Profile AI */}
              <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-2">
                    <span className="flex items-center gap-1.5">
                      <Mic className="h-3.5 w-3.5 text-indigo-400" />
                      Voice-to-Resume AI
                    </span>
                    <span className="text-xs text-purple-400">Gemini</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    "I am Shivam, studying CSE. Built a logistics risk engine LogiSafe using React and Python..."
                  </p>
                </div>
                <div className="rounded-lg bg-indigo-500/10 border border-indigo-500/20 p-2.5 text-[11px] text-indigo-300 flex items-center justify-between">
                  <span>Extracted 5 skills & 1 project</span>
                  <span className="font-semibold text-emerald-400">✓ Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE VALUE PROPOSITION / PILLARS */}
      <section className="py-20 bg-slate-950/70 border-t border-white/5 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            The Evidence-Based Employability Engine
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Why traditional career tests fail, and how CareerOS delivers verifiable career outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Feature 1 */}
          <div className="glass-card rounded-2xl p-6 space-y-4 border border-white/10 hover:border-indigo-500/30 transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Mic className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Voice Profile to ATS Resume</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              No resume? Speak naturally for 60 seconds. Gemini extracts verified skills, projects, and achievements without hallucinating fake companies, and formats a clean ATS resume.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="glass-card rounded-2xl p-6 space-y-4 border border-white/10 hover:border-indigo-500/30 transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <Layers className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Precise Skill Gap Diagnosis</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Compare your exact assessment evidence and code depth against the actual requirements of roles like ML Engineer, Full Stack Developer, or Data Scientist.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glass-card rounded-2xl p-6 space-y-4 border border-white/10 hover:border-indigo-500/30 transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
              <Compass className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Dynamic 12-Week Roadmap</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Receive a personalized week-by-week curriculum and daily missions that directly target your biggest verified weaknesses and increase your Readiness score.
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="glass-card rounded-3xl p-10 md:p-14 border border-indigo-500/30 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Ready to calculate your career score?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Join students using CareerOS to turn their aspirations into structured, verifiable evidence.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/onboarding"
              className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-indigo-600/30 transition-all hover:scale-105"
            >
              Start Free Assessment
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
