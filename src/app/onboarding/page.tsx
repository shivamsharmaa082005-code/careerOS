'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Target, 
  Code2, 
  FolderGit2, 
  FileText, 
  Mic, 
  Upload, 
  Check, 
  HelpCircle,
  Plus,
  Trash2
} from 'lucide-react';
import { useCareerStore } from '@/lib/store/careerStore';
import { CAREER_BENCHMARKS } from '@/lib/constants/careerBenchmarks';
import { StudentProfile, StudentSkill } from '@/types';

export default function OnboardingPage() {
  const router = useRouter();
  const { setProfile, addOrUpdateSkill, saveResume } = useCareerStore();

  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Basic Info
  const [basicInfo, setBasicInfo] = useState({
    name: '',
    age: 21,
    location: '',
    college: '',
    degree: 'B.Tech',
    branch: 'Computer Science and Engineering',
    year: '3rd Year',
    cgpa: 8.2
  });

  // Step 2: Target Career
  const [selectedCareer, setSelectedCareer] = useState<string>('Machine Learning Engineer');
  const [customCareer, setCustomCareer] = useState<string>('');

  // Step 3: Current Skills
  const defaultSkillOptions = [
    'Python', 'C++', 'Java', 'JavaScript', 'SQL', 
    'Data Structures & Algorithms (DSA)', 'Machine Learning', 
    'Cloud (AWS/GCP)', 'Git & GitHub', 'Technical Communication'
  ];

  const [selectedSkills, setSelectedSkills] = useState<{ [key: string]: number }>({
    'Python': 75,
    'Data Structures & Algorithms (DSA)': 50,
    'SQL': 65,
    'Machine Learning': 60
  });

  // Step 4: Projects & Experience
  const [projectsList, setProjectsList] = useState<string[]>([
    'Logistics Risk Predictor (React + Python FastAPI)',
    'E-Commerce Microservices Portfolio Project'
  ]);
  const [newProjectInput, setNewProjectInput] = useState('');

  // Step 5: Resume Choice
  const [resumeChoice, setResumeChoice] = useState<'upload' | 'voice' | null>(null);

  const handleNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      finalizeOnboarding();
    }
  };

  const finalizeOnboarding = () => {
    const targetTitle = customCareer.trim() || selectedCareer;

    const studentProfile: StudentProfile = {
      id: `profile-${Date.now()}`,
      userId: `user-${Date.now()}`,
      name: basicInfo.name || 'Student Candidate',
      email: `${(basicInfo.name || 'student').toLowerCase().replace(/\s+/g, '.')}@college.edu`,
      age: basicInfo.age,
      location: basicInfo.location || 'Bangalore, India',
      college: basicInfo.college || 'Engineering Institute of Technology',
      degree: basicInfo.degree,
      branch: basicInfo.branch,
      year: basicInfo.year,
      cgpa: basicInfo.cgpa,
      bio: `Aspiring ${targetTitle} looking to build verified skills and land high-impact opportunities.`,
      targetCareerTitle: targetTitle,
      isDemo: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setProfile(studentProfile);

    // Save initial skills
    Object.entries(selectedSkills).forEach(([skillName, level]) => {
      addOrUpdateSkill({
        skillName,
        currentLevel: level,
        category: skillName.includes('DSA') ? 'dsa' : skillName.includes('Communication') ? 'soft' : 'technical',
        verifiedByAssessment: false
      });
    });

    if (resumeChoice === 'voice') {
      router.push('/voice-profile');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative">
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-3xl glass-card rounded-3xl border border-white/10 p-6 sm:p-10 shadow-2xl relative">
        
        {/* Step Indicator Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
            <span>Step {currentStep} of 5</span>
            <span>
              {currentStep === 1 && 'Basic Information'}
              {currentStep === 2 && 'Career Target'}
              {currentStep === 3 && 'Skill Inventory'}
              {currentStep === 4 && 'Experience & Projects'}
              {currentStep === 5 && 'Resume Verification'}
            </span>
          </div>

          <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 rounded-full"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-bold text-white">Let’s start with the basics</h2>
              <p className="text-xs text-slate-400 mt-1">
                Your profile helps benchmark your readiness score against similar university cohorts.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Shivam Gupta"
                  value={basicInfo.name}
                  onChange={(e) => setBasicInfo({ ...basicInfo, name: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">College / University</label>
                <input
                  type="text"
                  placeholder="e.g. National Institute of Technology"
                  value={basicInfo.college}
                  onChange={(e) => setBasicInfo({ ...basicInfo, college: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Degree & Branch</label>
                <input
                  type="text"
                  placeholder="e.g. B.Tech Computer Science"
                  value={`${basicInfo.degree} in ${basicInfo.branch}`}
                  onChange={(e) => setBasicInfo({ ...basicInfo, branch: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Year of Study & CGPA</label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={basicInfo.year}
                    onChange={(e) => setBasicInfo({ ...basicInfo, year: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  >
                    <option>1st Year</option>
                    <option>2nd Year</option>
                    <option>3rd Year</option>
                    <option>Final Year (4th Year)</option>
                    <option>Graduate / Postgrad</option>
                  </select>

                  <input
                    type="number"
                    step="0.1"
                    placeholder="CGPA (e.g. 8.4)"
                    value={basicInfo.cgpa}
                    onChange={(e) => setBasicInfo({ ...basicInfo, cgpa: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Target Career */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-bold text-white">What career are you targeting?</h2>
              <p className="text-xs text-slate-400 mt-1">
                CareerOS will align your readiness calculation and skill benchmarks to this exact role.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CAREER_BENCHMARKS.map((career) => (
                <button
                  key={career.id}
                  onClick={() => {
                    setSelectedCareer(career.title);
                    setCustomCareer('');
                  }}
                  className={`flex flex-col text-left p-4 rounded-xl border transition-all ${
                    selectedCareer === career.title && !customCareer
                      ? 'border-indigo-500 bg-indigo-950/40 text-white ring-1 ring-indigo-500'
                      : 'border-white/10 bg-slate-950/60 text-slate-300 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-sm">
                    <span>{career.title}</span>
                    {selectedCareer === career.title && !customCareer && (
                      <Check className="h-4 w-4 text-indigo-400" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{career.description}</p>
                </button>
              ))}
            </div>

            {/* Custom Career Entry */}
            <div className="pt-2">
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                Or enter a specialized/custom career target:
              </label>
              <input
                type="text"
                placeholder="e.g. Quantitative Finance Developer, Robotics Engineer"
                value={customCareer}
                onChange={(e) => setCustomCareer(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* STEP 3: Current Skills */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-bold text-white">Your Current Skills</h2>
              <p className="text-xs text-slate-400 mt-1">
                Select your skills and estimate your current baseline (you can verify them with assessments later).
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {defaultSkillOptions.map((s) => {
                const isSelected = selectedSkills[s] !== undefined;
                return (
                  <button
                    key={s}
                    onClick={() => {
                      if (isSelected) {
                        const updated = { ...selectedSkills };
                        delete updated[s];
                        setSelectedSkills(updated);
                      } else {
                        setSelectedSkills({ ...selectedSkills, [s]: 60 });
                      }
                    }}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-slate-950 text-slate-300 border-white/10 hover:border-white/20'
                    }`}
                  >
                    {isSelected ? `✓ ${s}` : `+ ${s}`}
                  </button>
                );
              })}
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {Object.entries(selectedSkills).map(([skill, level]) => (
                <div key={skill} className="rounded-xl bg-slate-950/80 p-3 border border-white/5 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-white">{skill}</span>
                    <span className="text-indigo-400 font-mono font-bold">{level}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={level}
                    onChange={(e) => setSelectedSkills({ ...selectedSkills, [skill]: parseInt(e.target.value) })}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: Experience & Projects */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-bold text-white">Projects & Experience</h2>
              <p className="text-xs text-slate-400 mt-1">
                Add projects you’ve built in coursework, hackathons, or personal repositories.
              </p>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. AI Speech Assistant with Next.js and PyTorch"
                value={newProjectInput}
                onChange={(e) => setNewProjectInput(e.target.value)}
                className="flex-1 rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
              <button
                onClick={() => {
                  if (newProjectInput.trim()) {
                    setProjectsList([...projectsList, newProjectInput.trim()]);
                    setNewProjectInput('');
                  }
                }}
                className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 text-xs font-semibold text-white"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2">
              {projectsList.map((p, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-xl bg-slate-950/80 p-3 border border-white/5 text-xs text-slate-200">
                  <span>{p}</span>
                  <button
                    onClick={() => setProjectsList(projectsList.filter((_, i) => i !== idx))}
                    className="text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: Resume Choice */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-bold text-white">How would you like to build your profile?</h2>
              <p className="text-xs text-slate-400 mt-1">
                Choose how you want to verify your background and generate your ATS resume.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Option A: Upload Existing Resume */}
              <button
                onClick={() => setResumeChoice('upload')}
                className={`flex flex-col p-6 rounded-2xl border text-left transition-all ${
                  resumeChoice === 'upload'
                    ? 'border-indigo-500 bg-indigo-950/40 ring-1 ring-indigo-500'
                    : 'border-white/10 bg-slate-950/60 hover:border-white/20'
                }`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 mb-4 border border-indigo-500/30">
                  <Upload className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-white">Option A: Upload Existing Resume</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Upload your existing PDF/DOCX resume for instant ATS analysis, scoring, and skill extraction.
                </p>
              </button>

              {/* Option B: Voice Profile (The Core Feature) */}
              <button
                onClick={() => setResumeChoice('voice')}
                className={`flex flex-col p-6 rounded-2xl border text-left transition-all ${
                  resumeChoice === 'voice'
                    ? 'border-purple-500 bg-purple-950/40 ring-1 ring-purple-500'
                    : 'border-white/10 bg-slate-950/60 hover:border-white/20'
                }`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600/20 text-purple-400 mb-4 border border-purple-500/30">
                  <Mic className="h-6 w-6 animate-pulse" />
                </div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">Option B: “I don’t have a resume”</h3>
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-mono">
                    AI VOICE
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Just speak for 60 seconds. Gemini AI extracts your profile and builds an ATS-ready resume with zero fabrication.
                </p>
              </button>
            </div>
          </div>
        )}

        {/* Step Navigation Buttons */}
        <div className="flex items-center justify-between pt-8 mt-8 border-t border-white/10">
          {currentStep > 1 ? (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          ) : <div />}

          <button
            onClick={handleNextStep}
            disabled={currentStep === 5 && !resumeChoice}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/25 disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
          >
            <span>{currentStep === 5 ? 'Launch CareerOS' : 'Continue'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
