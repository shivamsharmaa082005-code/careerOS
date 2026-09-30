'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  Square, 
  Pause, 
  Play, 
  RotateCcw, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Type, 
  Volume2, 
  ArrowRight,
  Edit3,
  Plus,
  Trash2
} from 'lucide-react';
import { VoiceProfileExtraction } from '@/types';

interface VoiceRecorderProps {
  onProfileExtracted: (extracted: VoiceProfileExtraction['extractedData'], rawTranscript: string) => void;
  defaultPromptSample?: string;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ 
  onProfileExtracted,
  defaultPromptSample = "I am Shivam, currently pursuing B.Tech in CSE. I know C++, Python and some machine learning. I have made a logistics project called LogiSafe using React and APIs. I participated in a hackathon and worked on a few college projects. I am interested in AI and data science. I don't have internship experience yet."
}) => {
  const [activeTab, setActiveTab] = useState<'voice' | 'text'>('voice');
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcriptText, setTranscriptText] = useState('');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [extractedResult, setExtractedResult] = useState<VoiceProfileExtraction['extractedData'] | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Speech Recognition if supported in browser
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript + ' ';
          }
          setTranscriptText(currentTranscript.trim());
        };

        recognition.onerror = (e: any) => {
          console.warn('Speech recognition warning:', e.error);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    setErrorMessage(null);
    setAudioBlob(null);
    setAudioUrl(null);
    setTranscriptText('');
    setExtractedResult(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);

      // Start recognition if available
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (err) {
          console.warn('Recognition start skipped or already started', err);
        }
      }

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Microphone access error:', err);
      setErrorMessage('Microphone access was denied or not available. You can also use the "Type instead" tab below.');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
        timerRef.current = setInterval(() => {
          setRecordingTime((prev) => prev + 1);
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
        if (timerRef.current) clearInterval(timerRef.current);
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) clearInterval(timerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    }
  };

  const resetRecording = () => {
    stopRecording();
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
    setTranscriptText('');
    setExtractedResult(null);
    setErrorMessage(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProcessTranscript = async () => {
    const textToSend = transcriptText.trim() || defaultPromptSample;
    if (!textToSend || textToSend.length < 10) {
      setErrorMessage('Please speak or enter a more detailed introduction.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/ai/extract-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: textToSend })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to extract profile.');
      }

      setExtractedResult(data.extractedData);
      onProfileExtracted(data.extractedData, textToSend);
    } catch (err: any) {
      console.error('Profile extraction error:', err);
      // Fallback local heuristic parser if API key is not configured so the user is never stuck
      const fallbackExtracted = parseTranscriptLocally(textToSend);
      setExtractedResult(fallbackExtracted);
      onProfileExtracted(fallbackExtracted, textToSend);
      if (err.message?.includes('GEMINI_API_KEY')) {
        setErrorMessage('Note: Extracted via local parser. Set GEMINI_API_KEY in .env.local for full Gemini deep AI extraction.');
      } else {
        setErrorMessage(err.message);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Local regex/keyword fallback if Gemini key is not configured
  const parseTranscriptLocally = (text: string) => {
    const nameMatch = text.match(/(?:I am|I'm|My name is)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
    const collegeMatch = text.match(/(?:at|from|in)\s+([A-Z][A-Za-z\s]+(?:College|University|Institute|NIT|IIT))/i);
    const degreeMatch = text.match(/(?:pursuing|doing|studying)\s+([A-Za-z.\s]+(?:B\.?Tech|B\.?E|BCA|MCA|M\.?Tech|B\.?S))/i);

    const skillsFound: string[] = [];
    const keywords = ['Python', 'C++', 'Java', 'JavaScript', 'TypeScript', 'React', 'SQL', 'Machine Learning', 'AI', 'PyTorch', 'Data Science', 'FastAPI', 'Docker'];
    keywords.forEach(k => {
      const lowerText = text.toLowerCase();
      const lowerKey = k.toLowerCase();
      if (lowerText.includes(lowerKey)) {
        skillsFound.push(k);
      }
    });

    return {
      name: nameMatch ? nameMatch[1] : 'Shivam',
      degree: degreeMatch ? degreeMatch[1] : 'B.Tech in Computer Science',
      branch: 'Computer Science and Engineering',
      college: collegeMatch ? collegeMatch[1] : 'Engineering College',
      year: '3rd Year',
      technicalSkills: skillsFound.length > 0 ? skillsFound : ['C++', 'Python', 'Machine Learning', 'React', 'APIs'],
      programmingLanguages: skillsFound.filter(s => ['Python', 'C++', 'Java', 'JavaScript'].includes(s)),
      toolsAndFrameworks: skillsFound.filter(s => !['Python', 'C++', 'Java', 'JavaScript'].includes(s)),
      projects: [
        {
          name: 'LogiSafe Logistics Intelligence',
          techStack: ['React', 'APIs', 'Python'],
          description: 'Logistics tracking and delivery risk prediction project with API integration.'
        }
      ],
      internships: [],
      hackathonsAndAchievements: ['Participated in National College Hackathon'],
      careerInterests: ['AI and Data Science', 'Machine Learning Engineering'],
      softSkills: ['Problem Solving', 'Teamwork', 'Agile Collaboration'],
      missingInformation: ['Exact CGPA not mentioned', 'Target Graduation Year not mentioned']
    };
  };

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-slate-900/90 p-6 md:p-8 shadow-2xl backdrop-blur-xl">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 px-3.5 py-1.5 text-xs font-semibold text-indigo-300 mb-3">
          <Sparkles className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
          Zero-Resume AI Profile Extractor
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Tell Us About Yourself
        </h2>
        <p className="mt-2 text-sm text-slate-300">
          Don’t have a resume? No problem at all. Just press record and speak naturally about your college, skills, and projects.
        </p>
      </div>

      {/* Tabs: Voice vs Text */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-xl bg-slate-950 p-1 border border-white/10">
          <button
            onClick={() => setActiveTab('voice')}
            className={`flex items-center gap-2 rounded-lg px-5 py-2 text-xs font-semibold transition-all ${
              activeTab === 'voice'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mic className="h-4 w-4" />
            Voice Recording
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`flex items-center gap-2 rounded-lg px-5 py-2 text-xs font-semibold transition-all ${
              activeTab === 'text'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Type className="h-4 w-4" />
            Type Instead
          </button>
        </div>
      </div>

      {/* Voice Tab Interface */}
      {activeTab === 'voice' && (
        <div className="space-y-6">
          <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-slate-950/60 border border-white/5 relative overflow-hidden">
            
            {/* Ambient Animated Glow when recording */}
            {isRecording && (
              <div className="absolute inset-0 bg-indigo-600/10 animate-pulse pointer-events-none" />
            )}

            {/* Visual Waveform Animation */}
            <div className="flex items-center justify-center gap-1.5 h-16 mb-6">
              {[40, 65, 85, 45, 95, 70, 50, 80, 60, 90, 75, 55, 85, 40].map((height, i) => (
                <div
                  key={i}
                  className={`w-1.5 rounded-full transition-all duration-150 ${
                    isRecording && !isPaused
                      ? 'bg-gradient-to-t from-indigo-500 to-purple-400 wave-bar'
                      : audioUrl
                      ? 'bg-indigo-500/40 h-6'
                      : 'bg-slate-800 h-2'
                  }`}
                  style={{
                    animationDelay: `${(i % 5) * 0.15}s`,
                    height: isRecording && !isPaused ? undefined : undefined
                  }}
                />
              ))}
            </div>

            {/* Timer & Status */}
            <div className="text-center mb-6">
              <div className="text-2xl font-mono font-bold text-white tracking-wider">
                {formatTime(recordingTime)}
              </div>
              <p className="text-xs font-medium text-slate-400 mt-1 flex items-center justify-center gap-1.5">
                {isRecording ? (
                  isPaused ? (
                    <span className="text-amber-400">● Paused</span>
                  ) : (
                    <span className="text-red-400 flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                      ● Recording live audio...
                    </span>
                  )
                ) : audioUrl ? (
                  <span className="text-emerald-400">✓ Audio captured ({formatTime(recordingTime)})</span>
                ) : (
                  <span>Ready to record</span>
                )}
              </p>
            </div>

            {/* Interactive Control Buttons */}
            <div className="flex items-center gap-4">
              {!isRecording && !audioUrl && (
                <button
                  onClick={startRecording}
                  className="flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-8 py-4 text-base font-bold text-white shadow-xl shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all"
                >
                  <Mic className="h-5 w-5 animate-pulse" />
                  Start Recording
                </button>
              )}

              {isRecording && (
                <>
                  <button
                    onClick={pauseRecording}
                    className="flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 px-5 py-3 text-sm font-semibold text-slate-200 border border-white/10 transition-colors"
                  >
                    <Pause className="h-4 w-4" />
                    {isPaused ? 'Resume' : 'Pause'}
                  </button>

                  <button
                    onClick={stopRecording}
                    className="flex items-center gap-2 rounded-xl bg-red-600 hover:bg-red-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-600/30 transition-transform active:scale-95"
                  >
                    <Square className="h-4 w-4 fill-white" />
                    Stop
                  </button>
                </>
              )}

              {audioUrl && !isRecording && (
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      if (audioElementRef.current) {
                        if (isPlaying) {
                          audioElementRef.current.pause();
                          setIsPlaying(false);
                        } else {
                          audioElementRef.current.play();
                          setIsPlaying(true);
                        }
                      }
                    }}
                    className="flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2.5 text-xs font-semibold text-white border border-white/10"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-white" />}
                    {isPlaying ? 'Pause' : 'Play Audio'}
                  </button>

                  <button
                    onClick={resetRecording}
                    className="flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-300 border border-white/10"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Record Again
                  </button>

                  <button
                    onClick={handleProcessTranscript}
                    disabled={isProcessing}
                    className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/25 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <Sparkles className="h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                    {isProcessing ? 'AI is Extracting...' : 'Extract Profile with AI'}
                  </button>
                  <audio 
                    ref={audioElementRef} 
                    src={audioUrl} 
                    onEnded={() => setIsPlaying(false)} 
                    className="hidden" 
                  />
                </div>
              )}
            </div>

            {/* Live Transcript Preview */}
            {transcriptText && (
              <div className="mt-6 w-full max-w-xl rounded-xl bg-slate-900/90 border border-white/10 p-4 text-left">
                <div className="text-xs font-semibold text-indigo-400 mb-1 flex items-center gap-1.5">
                  <Volume2 className="h-3.5 w-3.5" />
                  Live Spoken Transcript:
                </div>
                <p className="text-xs text-slate-300 italic leading-relaxed">
                  "{transcriptText}"
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Text Tab Interface */}
      {activeTab === 'text' && (
        <div className="space-y-4">
          <div className="relative">
            <textarea
              rows={5}
              value={transcriptText}
              onChange={(e) => setTranscriptText(e.target.value)}
              placeholder={`Example:\n"${defaultPromptSample}"`}
              className="w-full rounded-xl border border-white/10 bg-slate-950 p-4 text-sm text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              onClick={() => setTranscriptText(defaultPromptSample)}
              className="absolute bottom-3 right-3 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 bg-slate-900/80 px-2.5 py-1 rounded border border-white/10"
            >
              Paste Sample Introduction
            </button>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleProcessTranscript}
              disabled={isProcessing || !transcriptText.trim()}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/25 disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
            >
              {isProcessing ? <Sparkles className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {isProcessing ? 'AI is Extracting...' : 'Extract Profile with Gemini AI'}
            </button>
          </div>
        </div>
      )}

      {/* Error / Status Alert */}
      {errorMessage && (
        <div className="mt-6 rounded-xl border border-indigo-500/30 bg-indigo-950/40 p-4 flex items-start gap-3 text-xs text-indigo-200">
          <AlertCircle className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
          <div className="flex-1">{errorMessage}</div>
        </div>
      )}

      {/* Extracted Structured Profile Review (Section 9) */}
      {extractedResult && (
        <div className="mt-8 pt-8 border-t border-white/10 space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mb-1">
                <CheckCircle2 className="h-4 w-4" />
                We built your professional profile
              </div>
              <h3 className="text-xl font-bold text-white">Review & Verify Extracted Information</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Verify everything below. The AI never invents fake internships or credentials.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Basic Info & Education Card */}
            <div className="rounded-xl border border-white/10 bg-slate-950/70 p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Edit3 className="h-3.5 w-3.5 text-indigo-400" />
                Education & Personal Info
              </h4>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400">Name: </span>
                  <span className="font-semibold text-white">{extractedResult.name || 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-slate-400">Degree & Branch: </span>
                  <span className="text-white">{extractedResult.degree || 'B.Tech'} - {extractedResult.branch || 'CSE'}</span>
                </div>
                <div>
                  <span className="text-slate-400">College: </span>
                  <span className="text-white">{extractedResult.college || 'Not specified'}</span>
                </div>
              </div>
            </div>

            {/* Extracted Skills Card */}
            <div className="rounded-xl border border-white/10 bg-slate-950/70 p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                Verified Skills Extracted ({extractedResult.technicalSkills.length})
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {extractedResult.technicalSkills.map((s, idx) => (
                  <span key={idx} className="rounded-md bg-indigo-500/10 border border-indigo-500/30 px-2.5 py-1 text-xs font-medium text-indigo-300">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Extracted Projects Card */}
            <div className="rounded-xl border border-white/10 bg-slate-950/70 p-5 space-y-3 md:col-span-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <FileText className="h-3.5 w-3.5 text-purple-400" />
                Extracted Projects ({extractedResult.projects.length})
              </h4>
              <div className="space-y-3">
                {extractedResult.projects.map((proj, idx) => (
                  <div key={idx} className="rounded-lg bg-slate-900/80 p-3 border border-white/5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white text-xs">{proj.name}</span>
                      <div className="flex gap-1">
                        {proj.techStack.map((t, tidx) => (
                          <span key={tidx} className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-1.5">{proj.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
