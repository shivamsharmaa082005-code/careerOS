'use client';

import React, { useState } from 'react';
import { useCareerStore } from '@/lib/store/careerStore';
import { 
  ClipboardCheck, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Code, 
  Check, 
  X, 
  ArrowRight,
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { AssessmentAttempt, AssessmentQuestion } from '@/types';
import confetti from 'canvas-confetti';

export default function AssessmentsPage() {
  const { saveAssessmentResult, assessments, profile } = useCareerStore();

  const availableSkills = [
    { name: 'Data Structures & Algorithms (DSA)', icon: '🌲', topic: 'Trees, Graphs & DP', difficulty: 'intermediate' },
    { name: 'Python', icon: '🐍', topic: 'OOP, Concurrency & NumPy', difficulty: 'intermediate' },
    { name: 'Machine Learning & Scikit-Learn', icon: '🤖', topic: 'Supervised, Unsupervised & Metrics', difficulty: 'intermediate' },
    { name: 'SQL & Database Architecture', icon: '🗄️', topic: 'Joins, Window Functions & Indexing', difficulty: 'intermediate' },
    { name: 'Model Deployment (Docker/FastAPI)', icon: '🐳', topic: 'Dockerfiles & REST APIs', difficulty: 'intermediate' },
    { name: 'Technical Communication', icon: '💬', topic: 'System Design & Articulation', difficulty: 'intermediate' }
  ];

  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [attemptResult, setAttemptResult] = useState<AssessmentAttempt | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const startAssessment = async (skillName: string, topic: string, difficulty: string) => {
    setSelectedSkill(skillName);
    setIsGenerating(true);
    setErrorMessage(null);
    setQuizCompleted(false);
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);

    try {
      const response = await fetch('/api/ai/generate-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skillName, topic, difficulty, count: 5 })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate assessment.');
      }

      setQuestions(data.data.questions);
    } catch (err: any) {
      console.error('Assessment generation error:', err);
      // Fallback pre-crafted question set if Gemini key is omitted
      const fallbackQuestions = getFallbackQuestions(skillName);
      setQuestions(fallbackQuestions);
      if (err.message?.includes('GEMINI_API_KEY')) {
        setErrorMessage('Loaded standard calibrated questions. Set GEMINI_API_KEY in .env.local for endless dynamic AI questions.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectOption = (optionIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: optionIndex
    });
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    const totalQuestions = questions.length;

    questions.forEach((q, idx) => {
      const chosen = selectedAnswers[idx];
      const correct = Array.isArray(q.correctAnswerIndex) ? q.correctAnswerIndex[0] : q.correctAnswerIndex;
      if (chosen === correct) {
        correctCount += 1;
      }
    });

    const scorePercentage = Math.round((correctCount / totalQuestions) * 100);

    if (scorePercentage >= 70) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    const attempt: AssessmentAttempt = {
      id: `attempt-${Date.now()}`,
      studentId: profile?.id || 'default-user',
      skillName: selectedSkill || 'Technical Skill',
      totalQuestions,
      correctCount,
      scorePercentage,
      timeSpentSeconds: 180,
      topicBreakdown: [
        { topic: 'Core Principles', score: Math.ceil(correctCount * 0.6), total: Math.ceil(totalQuestions * 0.6), percentage: scorePercentage },
        { topic: 'Problem Solving & Scenarios', score: Math.floor(correctCount * 0.4), total: Math.floor(totalQuestions * 0.4), percentage: scorePercentage }
      ],
      strengths: scorePercentage >= 60 ? ['Fundamental theory', 'Code execution analysis'] : ['Initial baseline effort'],
      weaknesses: scorePercentage < 80 ? ['Edge-case debugging', 'Advanced optimization'] : [],
      recommendedTopics: scorePercentage < 80 ? ['Review standard patterns and time-complexity trade-offs'] : ['Ready for advanced mock interview challenges'],
      aiSummary: `You scored ${scorePercentage}% in ${selectedSkill}. Your verified skill level and Career Readiness Score have been automatically updated!`,
      completedAt: new Date().toISOString()
    };

    setAttemptResult(attempt);
    saveAssessmentResult(attempt);
    setQuizCompleted(true);
  };

  const getFallbackQuestions = (skill: string): AssessmentQuestion[] => {
    if (skill.includes('DSA')) {
      return [
        {
          id: 'q1',
          question: 'What is the worst-case time complexity of searching in a Balanced Binary Search Tree (AVL / Red-Black Tree)?',
          type: 'mcq',
          options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
          correctAnswerIndex: 1,
          explanation: 'Balanced BSTs maintain a height of O(log N), bounding worst-case search to O(log N).',
          topic: 'Trees & BSTs',
          difficulty: 'intermediate'
        },
        {
          id: 'q2',
          question: 'Which algorithm is optimal for finding the shortest path in a weighted graph with non-negative edge weights?',
          type: 'mcq',
          options: ['Bellman-Ford', 'Dijkstra’s Algorithm', 'Depth First Search (DFS)', 'Kruskal’s Algorithm'],
          correctAnswerIndex: 1,
          explanation: 'Dijkstra’s algorithm using a min-heap priority queue runs in O((V + E) log V).',
          topic: 'Graph Algorithms',
          difficulty: 'intermediate'
        },
        {
          id: 'q3',
          question: 'Consider this Python snippet. What is the output?',
          type: 'code_snippet',
          codeSnippet: 'def memo_fib(n, memo={}):\n    if n in memo: return memo[n]\n    if n <= 1: return n\n    memo[n] = memo_fib(n-1, memo) + memo_fib(n-2, memo)\n    return memo[n]\nprint(memo_fib(6))',
          options: ['5', '8', '13', 'RuntimeError'],
          correctAnswerIndex: 1,
          explanation: 'Fibonacci sequence: F(0)=0, F(1)=1, F(2)=1, F(3)=2, F(4)=3, F(5)=5, F(6)=8.',
          topic: 'Dynamic Programming',
          difficulty: 'intermediate'
        },
        {
          id: 'q4',
          question: 'What is the primary trade-off when using an adjacency matrix instead of an adjacency list for a sparse graph?',
          type: 'scenario',
          options: ['Matrix uses O(V^2) space regardless of edges', 'Matrix cannot represent directed graphs', 'Matrix is slower for checking if an edge exists', 'Matrix requires more pointer overhead'],
          correctAnswerIndex: 0,
          explanation: 'Adjacency matrices consume O(V^2) memory, which is wasteful for sparse graphs where E << V^2.',
          topic: 'Graph Representations',
          difficulty: 'intermediate'
        }
      ];
    }

    return [
      {
        id: 'q-py-1',
        question: 'In Python, how does the Global Interpreter Lock (GIL) affect multithreading for CPU-bound tasks?',
        type: 'mcq',
        options: ['It accelerates parallel threads', 'It prevents multiple native threads from executing Python bytecode simultaneously', 'It automatically offloads computation to GPUs', 'It disables memory garbage collection'],
        correctAnswerIndex: 1,
        explanation: 'CPython GIL ensures only one thread executes bytecode at a time, making multiprocessing preferable for CPU-bound tasks.',
        topic: 'Python Concurrency',
        difficulty: 'intermediate'
      },
      {
        id: 'q-py-2',
        question: 'What is the output of the following list comprehension?',
        type: 'code_snippet',
        codeSnippet: 'data = [x * 2 for x in range(5) if x % 2 == 0]\nprint(data)',
        options: ['[0, 2, 4]', '[0, 4, 8]', '[2, 6]', '[0, 2, 4, 6, 8]'],
        correctAnswerIndex: 1,
        explanation: 'Even numbers in range(5) are 0, 2, 4. Multiplied by 2 -> [0, 4, 8].',
        topic: 'Core Syntax',
        difficulty: 'beginner'
      }
    ];
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <ClipboardCheck className="h-6 w-6 text-indigo-400" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Skill Assessments
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Dynamic, AI-calibrated competency tests. Scores directly calibrate your Career Readiness Score.
          </p>
        </div>
      </div>

      {/* ERROR / STATUS BANNER */}
      {errorMessage && (
        <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/40 p-4 text-xs text-indigo-200">
          {errorMessage}
        </div>
      )}

      {/* MODE 1: Pick an Assessment */}
      {!selectedSkill && !quizCompleted && (
        <div className="space-y-6">
          <h2 className="text-base font-bold text-white uppercase tracking-wider">
            Available Skill Competency Exams
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableSkills.map((s) => (
              <div
                key={s.name}
                className="glass-card rounded-2xl p-6 border border-white/10 hover:border-indigo-500/40 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="text-3xl mb-2">{s.icon}</div>
                  <h3 className="text-base font-bold text-white">{s.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">Topics: {s.topic}</p>
                </div>

                <button
                  onClick={() => startAssessment(s.name, s.topic, s.difficulty)}
                  disabled={isGenerating}
                  className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 transition-transform active:scale-95"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Start Assessment (5 Questions)</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODE 2: Taking the Assessment */}
      {selectedSkill && !quizCompleted && questions.length > 0 && (
        <div className="max-w-3xl mx-auto glass-card rounded-3xl border border-white/10 p-6 sm:p-10 shadow-2xl space-y-6">
          
          {/* Quiz Top Bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">
                {selectedSkill}
              </span>
              <span className="text-sm font-semibold text-white">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-white/5">
              <Clock className="h-3.5 w-3.5 text-indigo-400" />
              <span>Untimed / Practice</span>
            </div>
          </div>

          {/* Current Question Body */}
          {(() => {
            const currentQ = questions[currentQuestionIndex];
            if (!currentQ) return null;

            return (
              <div className="space-y-6">
                <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
                  {currentQ.question}
                </h3>

                {/* Code Snippet if present */}
                {currentQ.codeSnippet && (
                  <div className="rounded-xl bg-slate-950 p-4 border border-white/10 font-mono text-xs text-indigo-200 overflow-x-auto">
                    <pre>{currentQ.codeSnippet}</pre>
                  </div>
                )}

                {/* Options */}
                <div className="space-y-3">
                  {currentQ.options.map((opt, idx) => {
                    const isSelected = selectedAnswers[currentQuestionIndex] === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        className={`w-full text-left p-4 rounded-xl border text-xs font-medium transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-indigo-500 bg-indigo-950/40 text-white ring-1 ring-indigo-500'
                            : 'border-white/10 bg-slate-950/60 text-slate-300 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md font-mono text-xs ${
                            isSelected ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{opt}</span>
                        </div>
                        {isSelected && <Check className="h-4 w-4 text-indigo-400" />}
                      </button>
                    );
                  })}
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-white/10">
                  <button
                    onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                    disabled={currentQuestionIndex === 0}
                    className="text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30"
                  >
                    Previous Question
                  </button>

                  {currentQuestionIndex < questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                      className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/25"
                    >
                      Next Question
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitQuiz}
                      className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/25"
                    >
                      Submit Assessment
                    </button>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* MODE 3: Assessment Completed & Review */}
      {quizCompleted && attemptResult && (
        <div className="max-w-3xl mx-auto glass-card rounded-3xl border border-white/10 p-8 sm:p-10 shadow-2xl space-y-6 animate-fadeIn">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 text-2xl font-bold font-mono">
              {attemptResult.scorePercentage}%
            </div>
            <h2 className="text-2xl font-extrabold text-white">
              Assessment Completed!
            </h2>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              {attemptResult.aiSummary}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10 text-xs">
            <div className="rounded-xl bg-slate-950 p-4 border border-white/5 space-y-2">
              <span className="font-bold text-emerald-400 block">Demonstrated Strengths:</span>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                {attemptResult.strengths.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl bg-slate-950 p-4 border border-white/5 space-y-2">
              <span className="font-bold text-amber-400 block">Recommended Topics:</span>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                {attemptResult.recommendedTopics.map((r, idx) => (
                  <li key={idx}>{r}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex justify-center gap-4 pt-4">
            <button
              onClick={() => {
                setSelectedSkill(null);
                setQuizCompleted(false);
              }}
              className="rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 px-5 py-2.5 text-xs font-semibold"
            >
              Back to Assessment List
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
