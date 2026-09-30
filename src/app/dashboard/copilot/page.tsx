'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useCareerStore } from '@/lib/store/careerStore';
import { 
  Bot, 
  Sparkles, 
  Send, 
  User, 
  Target, 
  CheckCircle2, 
  Layers, 
  ArrowRight,
  TrendingUp,
  Compass
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'copilot';
  content: string;
  timestamp: string;
}

export default function CopilotPage() {
  const { profile, skills, readinessBreakdown, skillGapAnalysis, projects, roadmap } = useCareerStore();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-copilot-full',
      sender: 'copilot',
      content: `Welcome to your dedicated Career Copilot workspace, ${profile?.name || 'Student'}! 🚀\n\nI am analyzing your target career as a **${profile?.targetCareerTitle || 'Machine Learning Engineer'}** with an overall readiness score of **${readinessBreakdown.overall}/100**.\n\nAsk me anything about tailoring your resume, tackling your biggest DSA & system design gaps, or preparing for upcoming technical rounds.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const quickPrompts = [
    'What should I learn this week?',
    'Why is my readiness score at its current level?',
    'How can I improve my resume for Tier-1 companies?',
    'Analyze my biggest skill gap and provide a 3-day action plan.',
    'Simulate a high-frequency ML technical interview question.'
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputPrompt).trim();
    if (!textToSend || isLoading) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const studentContext = {
        profile,
        skills,
        readinessBreakdown,
        skillGaps: skillGapAnalysis.gaps,
        projects: projects.map(p => ({ title: p.title, techStack: p.techStack })),
        roadmapMilestones: roadmap?.keyMilestones
      };

      const history = messages.map(m => ({
        role: m.sender === 'user' ? ('user' as const) : ('model' as const),
        parts: m.content
      }));

      const response = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          studentContext,
          history
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to communicate with Copilot.');
      }

      const copilotMessage: Message = {
        id: `msg-ai-${Date.now()}`,
        sender: 'copilot',
        content: data.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, copilotMessage]);
    } catch (err: any) {
      console.error('Copilot page error:', err);
      // Helpful fallback grounded in user profile
      const fallback = `Based on your profile aiming for **${profile?.targetCareerTitle || 'Machine Learning Engineer'}** and current readiness score (**${readinessBreakdown.overall}/100**):\n\nYour highest priority should be verifying your **DSA Trees & Graphs** and containerizing your **LogiSafe** project with Docker. Complete today's daily mission to increase your score!`;
      setMessages(prev => [...prev, {
        id: `msg-ai-${Date.now()}`,
        sender: 'copilot',
        content: fallback,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col glass-card rounded-3xl border border-white/10 overflow-hidden shadow-2xl animate-fadeIn">
      
      {/* Copilot Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/90">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/20">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              Career Copilot & AI Mentor
              <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-[10px] font-mono text-indigo-300 border border-indigo-500/30">
                Gemini 1.5 Flash
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Personalized guidance calibrated to your target career: <strong className="text-slate-200">{profile?.targetCareerTitle}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div key={m.id} className={`flex gap-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
              {!isUser && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/20'
                    : 'bg-slate-900 border border-white/10 text-slate-200 rounded-bl-none shadow-sm'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>
                <div className={`mt-2 text-[10px] ${isUser ? 'text-indigo-200' : 'text-slate-500'}`}>
                  {m.timestamp}
                </div>
              </div>

              {isUser && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-slate-300 border border-white/10 text-xs">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-indigo-300 p-2">
            <Sparkles className="h-4 w-4 animate-spin" />
            <span>Copilot is formulating advice based on your profile evidence...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="px-6 py-2.5 border-t border-white/5 bg-slate-950/60 overflow-x-auto">
        <div className="flex gap-2 pb-1">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              disabled={isLoading}
              className="shrink-0 rounded-xl bg-slate-900 hover:bg-indigo-950/60 border border-white/10 hover:border-indigo-500/30 px-3.5 py-1.5 text-xs text-slate-300 hover:text-indigo-300 transition-colors disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-white/10 bg-slate-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Ask your AI Career Copilot anything..."
            disabled={isLoading}
            className="flex-1 rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !inputPrompt.trim()}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 disabled:opacity-50 transition-transform active:scale-95"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
