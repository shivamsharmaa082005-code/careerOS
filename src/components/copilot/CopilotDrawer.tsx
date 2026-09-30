'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  User, 
  Layers, 
  AlertTriangle, 
  Target, 
  ArrowRight,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { useCareerStore } from '@/lib/store/careerStore';

interface Message {
  id: string;
  sender: 'user' | 'copilot';
  content: string;
  timestamp: string;
}

export const CopilotDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ 
  isOpen, 
  onClose 
}) => {
  const { profile, skills, readinessBreakdown, skillGapAnalysis, projects, roadmap } = useCareerStore();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      sender: 'copilot',
      content: `Hello ${profile?.name || 'there'}! 👋 I am your CareerOS AI Copilot.\n\nI have real-time access to your target career (${profile?.targetCareerTitle || 'Machine Learning Engineer'}), your verified skill gaps, and your readiness score (${readinessBreakdown.overall}/100).\n\nHow can I help you accelerate your career preparation today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const quickPrompts = [
    'What should I learn this week?',
    'Why is my readiness score at its current level?',
    'How can I improve my resume?',
    'Analyze my biggest skill gap.',
    'Prepare me for a technical interview question.'
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSendMessage = async (customMessage?: string) => {
    const textToSend = (customMessage || inputPrompt).trim();
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
        projects: projects.map(p => ({ title: p.title, techStack: p.techStack, score: p.aiEvaluation?.overallScore })),
        recentRoadmapWeek: roadmap?.weeks.find(w => !w.isCompleted)?.title
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
        throw new Error(data.error || 'Failed to get Copilot response.');
      }

      const copilotMessage: Message = {
        id: `msg-ai-${Date.now()}`,
        sender: 'copilot',
        content: data.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, copilotMessage]);
    } catch (err: any) {
      console.error('Copilot error:', err);
      // Helpful fallback response grounded in user's profile
      const fallbackMsg = generateFallbackResponse(textToSend, profile, readinessBreakdown, skillGapAnalysis);
      setMessages(prev => [...prev, {
        id: `msg-ai-${Date.now()}`,
        sender: 'copilot',
        content: fallbackMsg,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateFallbackResponse = (
    query: string,
    p: any,
    score: any,
    gaps: any
  ) => {
    const target = p?.targetCareerTitle || 'Machine Learning Engineer';
    const topGap = gaps.gaps.find((g: any) => g.status === 'major_gap')?.skillName || 'DSA & System Design';

    if (query.toLowerCase().includes('score') || query.toLowerCase().includes('why')) {
      return `Your Career Readiness Score is currently **${score.overall}/100** for **${target}**.\n\nHere is what is currently impacting your score:\n- **Technical Skills:** ${score.technicalSkills}%\n- **DSA & Problem Solving:** ${score.dsa}%\n- **Project Evidence:** ${score.projects}%\n\nTo jump by +12 to 15 points, prioritize verifying **${topGap}** through our Skill Assessment module and add a containerized backend project!`;
    }

    if (query.toLowerCase().includes('week') || query.toLowerCase().includes('learn')) {
      return `For this week, your top focus should be **${topGap}**.\n\nRecommended actions:\n1. Complete 5 practice problems targeting this specific gap.\n2. Take the live assessment on the Assessments tab.\n3. Complete today's daily mission!`;
    }

    return `Based on your profile aiming for **${target}**, your biggest current lever is closing the **${topGap}** gap and practicing structured mock interviews on our Interview simulator.`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className={`flex flex-col h-full bg-slate-950 border-l border-white/10 shadow-2xl transition-all duration-300 ${
          isExpanded ? 'w-full md:w-[750px]' : 'w-full md:w-[480px]'
        }`}
      >
        
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/20">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                Career Copilot
                <span className="rounded bg-indigo-500/20 px-1.5 py-0.2 text-[10px] font-medium text-indigo-300 border border-indigo-500/30">
                  Gemini AI
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Grounded in your real profile & readiness data
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="hidden sm:flex rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              title={isExpanded ? 'Contract' : 'Expand'}
            >
              {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Quick Profile Summary Strip */}
        <div className="bg-indigo-950/40 border-b border-indigo-500/20 px-6 py-2.5 flex items-center justify-between text-xs text-indigo-200">
          <div className="flex items-center gap-2">
            <Target className="h-3.5 w-3.5 text-indigo-400" />
            <span>Target: <strong>{profile?.targetCareerTitle}</strong></span>
          </div>
          <div className="font-semibold text-white">
            Score: <span className="text-indigo-400">{readinessBreakdown.overall}/100</span>
          </div>
        </div>

        {/* Chat Message Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/20'
                      : 'bg-slate-900 border border-white/10 text-slate-200 rounded-bl-none shadow-sm'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{m.content}</div>
                  <div
                    className={`mt-1.5 text-[10px] ${
                      isUser ? 'text-indigo-200' : 'text-slate-500'
                    }`}
                  >
                    {m.timestamp}
                  </div>
                </div>

                {isUser && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-300 border border-white/10 text-xs">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 items-center text-xs text-indigo-300">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600/30 text-indigo-300 border border-indigo-500/30">
                <Sparkles className="h-4 w-4 animate-spin" />
              </div>
              <span>Copilot is analyzing your profile & synthesizing response...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompt Pills */}
        <div className="px-6 py-2 border-t border-white/5 bg-slate-950/60 overflow-x-auto">
          <div className="flex gap-1.5 pb-1">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                disabled={isLoading}
                className="shrink-0 rounded-lg bg-slate-900 hover:bg-indigo-950/60 border border-white/10 hover:border-indigo-500/30 px-3 py-1.5 text-[11px] text-slate-300 hover:text-indigo-300 transition-colors disabled:opacity-50"
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
              placeholder="Ask anything about your readiness, gaps, or interview prep..."
              disabled={isLoading}
              className="flex-1 rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !inputPrompt.trim()}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 disabled:opacity-50 transition-transform active:scale-95"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
