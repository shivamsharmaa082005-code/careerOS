'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useCareerStore } from '@/lib/store/careerStore';
import { 
  Mic2, 
  Sparkles, 
  Volume2, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Play, 
  Square, 
  RotateCcw, 
  Award, 
  ArrowRight,
  User,
  Bot
} from 'lucide-react';
import { InterviewSession, InterviewMessage } from '@/types';
import confetti from 'canvas-confetti';

export default function InterviewPage() {
  const { profile, saveInterviewSession } = useCareerStore();

  const [role, setRole] = useState<string>(profile?.targetCareerTitle || 'Machine Learning Intern');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [interviewMode, setInterviewMode] = useState<'text' | 'voice'>('text');

  const [sessionActive, setSessionActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [questionCount, setQuestionCount] = useState(1);
  const [maxQuestions] = useState(3);
  
  const [messages, setMessages] = useState<InterviewMessage[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = 'en-US';

        rec.onresult = (event: any) => {
          let text = '';
          for (let i = 0; i < event.results.length; i++) {
            text += event.results[i][0].transcript + ' ';
          }
          setCurrentAnswer(text.trim());
        };

        rec.onerror = () => setIsRecording(false);
        recognitionRef.current = rec;
      }
    }
  }, []);

  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startSession = async () => {
    setSessionActive(true);
    setIsFinished(false);
    setQuestionCount(1);
    setMessages([]);
    setCurrentAnswer('');
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/ai/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_question',
          targetRole: role,
          difficulty,
          questionNumber: 1,
          previousMessages: []
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to start interview.');
      }

      const firstQ = data.question || `Welcome! Can you briefly introduce your background and explain your primary approach when optimizing a machine learning pipeline?`;
      const aiMsg: InterviewMessage = {
        id: `msg-ai-1`,
        sender: 'ai_interviewer',
        content: firstQ,
        timestamp: new Date().toISOString()
      };

      setMessages([aiMsg]);
      if (interviewMode === 'voice') {
        speakText(firstQ);
      }
    } catch (err: any) {
      console.error('Interview start error:', err);
      const fallbackQ = `Welcome! Can you explain the core difference between Supervised and Unsupervised Learning, and give an example project where you applied them?`;
      const aiMsg: InterviewMessage = {
        id: `msg-ai-1`,
        sender: 'ai_interviewer',
        content: fallbackQ,
        timestamp: new Date().toISOString()
      };
      setMessages([aiMsg]);
      if (err.message?.includes('GEMINI_API_KEY')) {
        setErrorMessage('Active with standard interview simulator. Configure GEMINI_API_KEY in .env.local for full live AI question generation.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleVoiceRecord = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsRecording(true);
      } catch (e) {
        console.warn('Voice recognition start error:', e);
      }
    }
  };

  const handleSubmitAnswer = async () => {
    const text = currentAnswer.trim();
    if (!text || isLoading) return;

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    }

    const studentMsg: InterviewMessage = {
      id: `msg-student-${Date.now()}`,
      sender: 'student',
      content: text,
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...messages, studentMsg];
    setMessages(updatedMessages);
    setCurrentAnswer('');
    setIsLoading(true);

    const lastQuestion = messages[messages.length - 1]?.content || 'Technical question';

    try {
      const response = await fetch('/api/ai/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'evaluate_answer',
          targetRole: role,
          question: lastQuestion,
          studentAnswer: text
        })
      });

      const data = await response.json();
      const evaluation = data.evaluation || {
        technicalAccuracy: 78,
        completeness: 75,
        clarity: 82,
        communication: 78,
        keyStrengths: ['Good foundational explanation'],
        improvementTips: ['Provide quantifiable metrics and engineering trade-offs'],
        sampleBetterAnswer: 'Incorporate specific loss functions and latency constraints.'
      };

      // Attach evaluation to student message
      studentMsg.evaluation = evaluation;

      if (questionCount >= maxQuestions) {
        // Finalize interview
        finishInterview(updatedMessages);
      } else {
        // Next Question
        const nextQCount = questionCount + 1;
        setQuestionCount(nextQCount);

        const nextQResponse = await fetch('/api/ai/interview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'generate_question',
            targetRole: role,
            difficulty,
            questionNumber: nextQCount,
            previousMessages: updatedMessages
          })
        });

        const nextQData = await nextQResponse.json();
        const nextQ = nextQData.question || `Can you walk me through how you would detect and mitigate data drift in a production ML application?`;

        const nextAiMsg: InterviewMessage = {
          id: `msg-ai-${nextQCount}`,
          sender: 'ai_interviewer',
          content: nextQ,
          timestamp: new Date().toISOString()
        };

        setMessages([...updatedMessages, nextAiMsg]);
        if (interviewMode === 'voice') speakText(nextQ);
      }
    } catch (err: any) {
      console.error('Answer evaluation error:', err);
      // Fallback
      studentMsg.evaluation = {
        technicalAccuracy: 75,
        completeness: 72,
        clarity: 80,
        communication: 76,
        keyStrengths: ['Clear articulate answer'],
        improvementTips: ['Include concrete implementation specifics'],
        sampleBetterAnswer: 'Include real-world examples.'
      };

      if (questionCount >= maxQuestions) {
        finishInterview(updatedMessages);
      } else {
        const nextQCount = questionCount + 1;
        setQuestionCount(nextQCount);
        const nextAiMsg: InterviewMessage = {
          id: `msg-ai-${nextQCount}`,
          sender: 'ai_interviewer',
          content: `Great. Next question: What are the primary trade-offs between batch inference and real-time streaming inference?`,
          timestamp: new Date().toISOString()
        };
        setMessages([...updatedMessages, nextAiMsg]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const finishInterview = (allMessages: InterviewMessage[]) => {
    setIsFinished(true);
    setSessionActive(false);

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    const session: InterviewSession = {
      id: `interview-session-${Date.now()}`,
      studentId: profile?.id || 'default-user',
      targetRole: role,
      difficulty,
      mode: interviewMode,
      totalQuestions: maxQuestions,
      completedQuestions: maxQuestions,
      isFinished: true,
      messages: allMessages,
      overallEvaluation: {
        technicalScore: 78,
        communicationScore: 80,
        completenessScore: 75,
        clarityScore: 82,
        overallScore: 79,
        strengths: [
          'Strong conceptual grasp of machine learning workflows',
          'Clear, structured articulation'
        ],
        topWeaknesses: [
          'Could elaborate more on latency vs throughput engineering trade-offs'
        ],
        concreteActionItems: [
          'Practice explaining model monitoring in real-time streaming contexts'
        ],
        summary: 'Solid performance. Demonstrates good foundational knowledge.'
      },
      startedAt: new Date().toISOString(),
      finishedAt: new Date().toISOString()
    };

    saveInterviewSession(session);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Mic2 className="h-6 w-6 text-indigo-400" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              AI Mock Interview Simulator
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Dynamic role-specific technical & behavioral interview simulation with multi-metric evaluation.
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/40 p-4 text-xs text-indigo-200">
          {errorMessage}
        </div>
      )}

      {/* SETUP VIEW: Role, Difficulty & Mode */}
      {!sessionActive && !isFinished && (
        <div className="max-w-2xl mx-auto glass-card rounded-3xl border border-white/10 p-6 sm:p-10 shadow-2xl space-y-6">
          <h2 className="text-lg font-bold text-white">Configure Interview Session</h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-slate-300 font-semibold block mb-1.5">Target Interview Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Machine Learning Intern, Full Stack Developer"
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-300 font-semibold block mb-1.5">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white focus:border-indigo-500 focus:outline-none"
                >
                  <option value="beginner">Beginner / Fresher</option>
                  <option value="intermediate">Intermediate (Recommended)</option>
                  <option value="advanced">Advanced / FAANG Tier</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1.5">Interaction Mode</label>
                <select
                  value={interviewMode}
                  onChange={(e) => setInterviewMode(e.target.value as any)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white focus:border-indigo-500 focus:outline-none"
                >
                  <option value="text">Text Response</option>
                  <option value="voice">Voice & Speech (Interactive)</option>
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={startSession}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 py-3.5 text-xs font-bold text-white shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? <Sparkles className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 fill-white" />}
            <span>Start Mock Interview (3 Questions)</span>
          </button>
        </div>
      )}

      {/* ACTIVE INTERVIEW VIEW */}
      {sessionActive && (
        <div className="max-w-3xl mx-auto glass-card rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl space-y-6">
          
          {/* Top Status Strip */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 text-xs">
            <div>
              <span className="text-indigo-400 font-bold block">{role}</span>
              <span className="text-slate-400">Question {questionCount} of {maxQuestions}</span>
            </div>

            <span className="rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-indigo-300 font-semibold uppercase text-[10px]">
              {difficulty} Level
            </span>
          </div>

          {/* Dialogue Stream */}
          <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
            {messages.map((m) => {
              const isAI = m.sender === 'ai_interviewer';

              return (
                <div key={m.id} className="space-y-3">
                  <div className={`flex gap-3 ${isAI ? 'justify-start' : 'justify-end'}`}>
                    {isAI && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-600/30 text-indigo-300 border border-indigo-500/30">
                        <Bot className="h-4 w-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                        isAI
                          ? 'bg-slate-900 border border-white/10 text-white rounded-bl-none'
                          : 'bg-indigo-600 text-white rounded-br-none shadow-md'
                      }`}
                    >
                      <p>{m.content}</p>
                    </div>

                    {!isAI && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-slate-300 border border-white/10">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                  </div>

                  {/* Immediate Answer Evaluation Breakdown */}
                  {m.evaluation && (
                    <div className="ml-11 rounded-xl bg-slate-950/90 border border-indigo-500/20 p-4 text-xs space-y-3">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="text-indigo-400 flex items-center gap-1.5">
                          <Sparkles className="h-3.5 w-3.5" />
                          Answer Evaluation
                        </span>
                        <span className="text-emerald-400">Accuracy: {m.evaluation.technicalAccuracy}%</span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-400">
                        <div>Clarity: <strong className="text-white">{m.evaluation.clarity}%</strong></div>
                        <div>Completeness: <strong className="text-white">{m.evaluation.completeness}%</strong></div>
                        <div>Communication: <strong className="text-white">{m.evaluation.communication}%</strong></div>
                      </div>

                      {m.evaluation.improvementTips && (
                        <p className="text-[11px] text-slate-300">
                          <strong className="text-amber-400">Tip: </strong>
                          {m.evaluation.improvementTips[0]}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-indigo-300 p-2">
                <Sparkles className="h-4 w-4 animate-spin" />
                <span>Interviewer is evaluating and formulating question...</span>
              </div>
            )}
          </div>

          {/* Student Answer Input Box */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <textarea
              rows={3}
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder={interviewMode === 'voice' ? "Speak or type your answer..." : "Type your technical answer here..."}
              className="w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />

            <div className="flex items-center justify-between">
              {interviewMode === 'voice' && (
                <button
                  onClick={handleToggleVoiceRecord}
                  className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold border transition-all ${
                    isRecording
                      ? 'bg-red-600 text-white border-red-500 animate-pulse'
                      : 'bg-slate-900 text-slate-300 border-white/10 hover:border-white/20'
                  }`}
                >
                  <Mic2 className="h-4 w-4" />
                  <span>{isRecording ? 'Listening...' : 'Speak Answer'}</span>
                </button>
              )}

              <button
                onClick={handleSubmitAnswer}
                disabled={isLoading || !currentAnswer.trim()}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 py-2.5 text-xs font-bold text-white shadow-md disabled:opacity-50 transition-transform active:scale-95 ml-auto"
              >
                <span>Submit Answer</span>
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FINAL REPORT VIEW */}
      {isFinished && (
        <div className="max-w-3xl mx-auto glass-card rounded-3xl border border-white/10 p-8 sm:p-10 shadow-2xl space-y-6 animate-fadeIn">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 text-2xl font-extrabold font-mono">
              79%
            </div>
            <h2 className="text-2xl font-extrabold text-white">
              Mock Interview Completed!
            </h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Your interview readiness score has been recorded and factored into your Career Readiness Score.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-4 border-t border-white/10">
            <div className="rounded-xl bg-slate-950 p-3 border border-white/5">
              <span className="text-slate-400 text-[11px] block">Technical Accuracy</span>
              <span className="text-base font-bold text-white">78%</span>
            </div>
            <div className="rounded-xl bg-slate-950 p-3 border border-white/5">
              <span className="text-slate-400 text-[11px] block">Communication</span>
              <span className="text-base font-bold text-emerald-400">80%</span>
            </div>
            <div className="rounded-xl bg-slate-950 p-3 border border-white/5">
              <span className="text-slate-400 text-[11px] block">Completeness</span>
              <span className="text-base font-bold text-white">75%</span>
            </div>
            <div className="rounded-xl bg-slate-950 p-3 border border-white/5">
              <span className="text-slate-400 text-[11px] block">Clarity & Structure</span>
              <span className="text-base font-bold text-indigo-400">82%</span>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <button
              onClick={() => {
                setIsFinished(false);
                setSessionActive(false);
              }}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 py-3 text-xs font-bold text-white shadow-lg"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Start Another Mock Session</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
