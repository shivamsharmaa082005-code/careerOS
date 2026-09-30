'use client';

import React, { useState } from 'react';
import { useCareerStore } from '@/lib/store/careerStore';
import { 
  Settings, 
  Key, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Sliders, 
  RefreshCw,
  ExternalLink,
  Database,
  Lock
} from 'lucide-react';

export default function SettingsPage() {
  const { isDemoMode, switchToDemo, resetToFresh, profile } = useCareerStore();
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  return (
    <div className="space-y-8 max-w-4xl animate-fadeIn">
      
      {/* Header */}
      <div className="border-b border-white/10 pb-6">
        <div className="flex items-center gap-2">
          <Settings className="h-6 w-6 text-indigo-400" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Settings & API Key Configuration
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Configure your Google Gemini API key and switch between live and demo profile modes.
        </p>
      </div>

      {/* Gemini API Key Card */}
      <div className="glass-card rounded-2xl p-6 md:p-8 border border-indigo-500/30 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Key className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Google Gemini API Key</h3>
              <p className="text-xs text-slate-400">
                Powers real-time Voice Profile extraction, ATS resume creation, and AI mock interviews.
              </p>
            </div>
          </div>

          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
          >
            <span>Get Free API Key</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="rounded-xl bg-slate-950 p-4 border border-white/5 space-y-2 text-xs text-slate-300">
          <p>
            <strong className="text-white">Where to configure:</strong> For security and to protect keys server-side, add your key to <code className="text-indigo-400 font-mono bg-slate-900 px-1.5 py-0.5 rounded">.env.local</code>:
          </p>
          <pre className="p-2.5 rounded bg-slate-900 text-indigo-300 font-mono text-xs overflow-x-auto">
            GEMINI_API_KEY=your_gemini_api_key_here
          </pre>
        </div>
      </div>

      {/* Demo vs Real Profile Switcher */}
      <div className="glass-card rounded-2xl p-6 md:p-8 border border-white/10 space-y-6 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
            <Sliders className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Explore Modes & Data State</h3>
            <p className="text-xs text-slate-400">
              Switch between the pre-configured Demo Profile (Rahul Verma) and a fresh real student profile.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => switchToDemo()}
            className={`p-5 rounded-2xl border text-left transition-all ${
              isDemoMode
                ? 'border-indigo-500 bg-indigo-950/40 text-white ring-1 ring-indigo-500'
                : 'border-white/10 bg-slate-950/60 text-slate-300 hover:border-white/20'
            }`}
          >
            <div className="flex justify-between items-center font-bold text-sm">
              <span>Demo Profile (Rahul Verma)</span>
              {isDemoMode && <CheckCircle2 className="h-4 w-4 text-indigo-400" />}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Includes pre-populated Machine Learning Engineer assessments, projects, skill gaps, and roadmap.
            </p>
          </button>

          <button
            onClick={() => resetToFresh('Alex Chen', 'alex.chen@university.edu', 'Software Developer (Full Stack)')}
            className={`p-5 rounded-2xl border text-left transition-all ${
              !isDemoMode
                ? 'border-indigo-500 bg-indigo-950/40 text-white ring-1 ring-indigo-500'
                : 'border-white/10 bg-slate-950/60 text-slate-300 hover:border-white/20'
            }`}
          >
            <div className="flex justify-between items-center font-bold text-sm">
              <span>Fresh Real Profile</span>
              {!isDemoMode && <CheckCircle2 className="h-4 w-4 text-indigo-400" />}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Start with a clean slate to record your own voice introduction and take live assessments.
            </p>
          </button>
        </div>
      </div>

      {/* Database & Security Info */}
      <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-3 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <Database className="h-4 w-4 text-emerald-400" />
          Database & Persistence Architecture
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          CareerOS is configured with dual persistence: browser local storage for instant zero-config evaluation, and full PostgreSQL/Supabase schema support defined in <code className="text-indigo-400 font-mono">src/lib/db/schema.sql</code>.
        </p>
      </div>
    </div>
  );
}
