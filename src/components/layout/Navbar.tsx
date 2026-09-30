'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCareerStore } from '@/lib/store/careerStore';
import { 
  Sparkles, 
  Bot, 
  Layers, 
  Menu, 
  X, 
  CheckCircle2, 
  Sliders, 
  User, 
  RefreshCw,
  ExternalLink,
  Target
} from 'lucide-react';

export const Navbar: React.FC<{ onOpenCopilot?: () => void }> = ({ onOpenCopilot }) => {
  const { profile, readinessBreakdown, isDemoMode, switchToDemo, resetToFresh } = useCareerStore();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);

  const isDashboardPage = pathname?.startsWith('/dashboard');

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo & Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
                <Sparkles className="h-5 w-5 text-indigo-400 animate-pulse" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                Career<span className="text-indigo-400">OS</span>
                <span className="rounded-md bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-medium text-indigo-300 border border-indigo-500/20">
                  AI
                </span>
              </span>
            </div>
          </Link>

          {/* Quick Target Career Badge */}
          {profile && isDashboardPage && (
            <div className="hidden lg:flex items-center gap-2 rounded-full bg-slate-900/90 px-3.5 py-1.5 border border-white/10 text-xs text-slate-300">
              <Target className="h-3.5 w-3.5 text-indigo-400" />
              <span className="text-slate-400">Target:</span>
              <span className="font-semibold text-white">{profile.targetCareerTitle || 'Machine Learning Engineer'}</span>
            </div>
          )}
        </div>

        {/* Right Action Items */}
        <div className="flex items-center gap-3">
          
          {/* Readiness Score Quick Pill */}
          {isDashboardPage && (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-500/30 px-3 py-1.5 text-xs transition-colors"
            >
              <div className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </div>
              <span className="text-slate-300 font-medium">Readiness:</span>
              <span className="font-bold text-indigo-300 text-sm">{readinessBreakdown.overall}%</span>
            </Link>
          )}

          {/* AI Copilot Button */}
          <button
            onClick={onOpenCopilot}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="Open AI Career Copilot"
          >
            <Bot className="h-4 w-4" />
            <span className="hidden sm:inline">Ask Copilot</span>
          </button>

          {/* Demo Profile Switcher Pill */}
          <button
            onClick={() => setShowDemoModal(true)}
            className={`hidden sm:flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium border transition-colors ${
              isDemoMode
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                : 'bg-slate-900 text-slate-300 border-white/10 hover:bg-slate-800'
            }`}
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>{isDemoMode ? 'Demo Profile (Rahul)' : 'Real Profile'}</span>
          </button>

          {/* Direct Link to Dashboard if on Landing */}
          {!isDashboardPage && (
            <Link
              href="/dashboard"
              className="rounded-lg bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all"
            >
              Go to Dashboard
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-900 hover:text-white lg:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Demo Switch Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sliders className="h-5 w-5 text-indigo-400" />
                Profile Mode Switcher
              </h3>
              <button 
                onClick={() => setShowDemoModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <p className="text-sm text-slate-300 mb-6">
              Switch between exploring the pre-populated demo profile (Rahul Verma) and starting fresh with your own verified evidence.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => {
                  switchToDemo();
                  setShowDemoModal(false);
                }}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  isDemoMode 
                    ? 'border-indigo-500 bg-indigo-950/40 text-white ring-1 ring-indigo-500' 
                    : 'border-white/10 bg-slate-950/60 text-slate-300 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between font-semibold">
                  <span>Explore Demo Profile (Rahul Verma)</span>
                  {isDemoMode && <CheckCircle2 className="h-4 w-4 text-indigo-400" />}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Target: Machine Learning Engineer. Includes realistic sample assessments, projects, skill gaps, and roadmap for judge review.
                </p>
              </button>

              <button
                onClick={() => {
                  resetToFresh('Alex Chen', 'alex.chen@university.edu', 'Software Developer (Full Stack)');
                  setShowDemoModal(false);
                }}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  !isDemoMode 
                    ? 'border-indigo-500 bg-indigo-950/40 text-white ring-1 ring-indigo-500' 
                    : 'border-white/10 bg-slate-950/60 text-slate-300 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between font-semibold">
                  <span>Reset to Fresh Real Profile</span>
                  {!isDemoMode && <CheckCircle2 className="h-4 w-4 text-indigo-400" />}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Start fresh with custom skills, real voice introduction recording, and clean evidence calculation.
                </p>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
