'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Target, 
  GitCommit, 
  ClipboardCheck, 
  AlertTriangle, 
  Compass, 
  CheckSquare, 
  FolderGit2, 
  FileText, 
  Briefcase, 
  Mic2, 
  Bot, 
  GraduationCap, 
  Settings, 
  User,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useCareerStore } from '@/lib/store/careerStore';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
}

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { profile, readinessBreakdown, isDemoMode } = useCareerStore();

  const mainNavItems: NavItem[] = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'My Career', href: '/dashboard/career', icon: Target },
    { label: 'Skills Graph', href: '/dashboard/skills', icon: GitCommit },
    { label: 'Skill Assessments', href: '/dashboard/assessments', icon: ClipboardCheck, badge: 'Live' },
    { label: 'Skill Gaps', href: '/dashboard/gaps', icon: AlertTriangle, badge: 'AI' },
    { label: 'Roadmap', href: '/dashboard/roadmap', icon: Compass },
    { label: 'Daily Missions', href: '/dashboard/missions', icon: CheckSquare },
    { label: 'Project Analyzer', href: '/dashboard/projects', icon: FolderGit2 },
    { label: 'AI Resume', href: '/dashboard/resume', icon: FileText },
    { label: 'Job Analyzer', href: '/dashboard/jobs', icon: Briefcase },
    { label: 'AI Mock Interview', href: '/dashboard/interview', icon: Mic2, badge: 'Voice/Text' },
    { label: 'Career Copilot', href: '/dashboard/copilot', icon: Bot, badge: 'Gemini' }
  ];

  const bottomNavItems: NavItem[] = [
    { label: 'College Analytics', href: '/dashboard/college', icon: GraduationCap },
    { label: 'Settings & API Key', href: '/dashboard/settings', icon: Settings },
    { label: 'Student Profile', href: '/dashboard/profile', icon: User }
  ];

  return (
    <aside className="hidden lg:flex w-64 flex-col justify-between border-r border-white/10 bg-slate-950/60 p-4 shrink-0 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
      
      {/* Top User Micro Card */}
      <div className="space-y-4">
        {profile && (
          <div className="rounded-xl border border-white/10 bg-slate-900/80 p-3 shadow-inner">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/30 text-indigo-300 font-bold border border-indigo-500/30">
                {profile.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold text-white truncate">{profile.name}</p>
                  {isDemoMode && (
                    <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 py-0.5 rounded font-mono border border-amber-500/30">
                      DEMO
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 truncate">{profile.targetCareerTitle || 'Career Ready'}</p>
              </div>
            </div>

            {/* Micro Readiness Gauge */}
            <div className="mt-3 border-t border-white/5 pt-2">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Readiness Score</span>
                <span className="font-bold text-indigo-400">{readinessBreakdown.overall}/100</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-500 rounded-full"
                  style={{ width: `${readinessBreakdown.overall}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation List */}
        <nav className="space-y-1">
          <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-300">
            Platform Modules
          </div>
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-300'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="rounded bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-medium text-indigo-300 border border-indigo-500/20">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Nav */}
      <div className="pt-4 border-t border-white/10 space-y-1">
        <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-300">
          Management & Admin
        </div>
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
};
