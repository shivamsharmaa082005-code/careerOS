'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  StudentProfile, 
  StudentSkill, 
  ProjectEvidence, 
  ResumeData, 
  AssessmentAttempt, 
  DailyMission, 
  CareerRoadmap,
  InterviewSession,
  ReadinessScoreBreakdown,
  SkillGapAnalysisResult
} from '@/types';
import { 
  DEMO_PROFILE, 
  DEMO_SKILLS, 
  DEMO_PROJECTS, 
  DEMO_RESUME, 
  DEMO_ASSESSMENTS, 
  DEMO_ROADMAP, 
  DEMO_MISSIONS, 
  DEMO_INTERVIEW 
} from '../constants/demoProfile';
import { calculateReadinessScore, analyzeSkillGaps } from '../readinessEngine';
import { getCareerBenchmark } from '../constants/careerBenchmarks';

interface CareerStoreContextType {
  profile: StudentProfile | null;
  skills: StudentSkill[];
  projects: ProjectEvidence[];
  resume: ResumeData | null;
  assessments: AssessmentAttempt[];
  roadmap: CareerRoadmap | null;
  missions: DailyMission[];
  interviews: InterviewSession[];
  isDemoMode: boolean;
  isLoaded: boolean;
  
  // Actions
  setProfile: (profile: StudentProfile) => void;
  updateTargetCareer: (careerTitle: string) => void;
  addOrUpdateSkill: (skill: Partial<StudentSkill> & { skillName: string }) => void;
  saveAssessmentResult: (result: AssessmentAttempt) => void;
  addProject: (project: Omit<ProjectEvidence, 'id' | 'createdAt'>) => ProjectEvidence;
  updateProjectEvaluation: (projectId: string, evaluation: any) => void;
  saveResume: (resume: ResumeData) => void;
  toggleMission: (missionId: string) => void;
  toggleRoadmapTask: (weekNumber: number, taskId: string) => void;
  saveInterviewSession: (session: InterviewSession) => void;
  switchToDemo: () => void;
  resetToFresh: (name?: string, email?: string, targetCareer?: string) => void;
  
  // Calculated Getters
  readinessBreakdown: ReadinessScoreBreakdown;
  skillGapAnalysis: SkillGapAnalysisResult;
}

const CareerStoreContext = createContext<CareerStoreContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'careeros_user_data_v2';

export const CareerStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfileState] = useState<StudentProfile | null>(null);
  const [skills, setSkillsState] = useState<StudentSkill[]>([]);
  const [projects, setProjectsState] = useState<ProjectEvidence[]>([]);
  const [resume, setResumeState] = useState<ResumeData | null>(null);
  const [assessments, setAssessmentsState] = useState<AssessmentAttempt[]>([]);
  const [roadmap, setRoadmapState] = useState<CareerRoadmap | null>(null);
  const [missions, setMissionsState] = useState<DailyMission[]>([]);
  const [interviews, setInterviewsState] = useState<InterviewSession[]>([]);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Initialize from LocalStorage or default demo
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setProfileState(parsed.profile);
        setSkillsState(parsed.skills || []);
        setProjectsState(parsed.projects || []);
        setResumeState(parsed.resume || null);
        setAssessmentsState(parsed.assessments || []);
        setRoadmapState(parsed.roadmap || null);
        setMissionsState(parsed.missions || []);
        setInterviewsState(parsed.interviews || []);
        setIsDemoMode(parsed.isDemoMode ?? false);
      } else {
        // Default initialize with Demo for judges to immediately explore, or fresh state
        loadDemoData();
      }
    } catch (e) {
      console.error('Error loading CareerOS state:', e);
      loadDemoData();
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync to LocalStorage on changes
  useEffect(() => {
    if (!isLoaded || !profile) return;
    try {
      const dataToSave = {
        profile,
        skills,
        projects,
        resume,
        assessments,
        roadmap,
        missions,
        interviews,
        isDemoMode
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (e) {
      console.error('Error saving CareerOS state:', e);
    }
  }, [profile, skills, projects, resume, assessments, roadmap, missions, interviews, isDemoMode, isLoaded]);

  const loadDemoData = () => {
    setProfileState(DEMO_PROFILE);
    setSkillsState(DEMO_SKILLS);
    setProjectsState(DEMO_PROJECTS);
    setResumeState(DEMO_RESUME);
    setAssessmentsState(DEMO_ASSESSMENTS);
    setRoadmapState(DEMO_ROADMAP);
    setMissionsState(DEMO_MISSIONS);
    setInterviewsState([DEMO_INTERVIEW]);
    setIsDemoMode(true);
  };

  const switchToDemo = () => {
    loadDemoData();
  };

  const resetToFresh = (
    name: string = 'Alex Chen',
    email: string = 'alex.chen@university.edu',
    targetCareer: string = 'Software Developer (Full Stack)'
  ) => {
    const benchmark = getCareerBenchmark(targetCareer);
    const initialSkills: StudentSkill[] = benchmark.requiredSkills.map((req, idx) => ({
      id: `skill-init-${idx}`,
      studentId: 'user-fresh',
      skillName: req.name,
      category: req.category,
      currentLevel: Math.floor(Math.random() * 25) + 30, // baseline level
      verifiedByAssessment: false
    }));

    const newProfile: StudentProfile = {
      id: 'profile-fresh-' + Date.now(),
      userId: 'user-fresh-' + Date.now(),
      name,
      email,
      age: 20,
      location: 'San Francisco, CA / Hybrid',
      college: 'State University',
      degree: 'B.S. Computer Science',
      branch: 'Computer Science',
      year: '3rd Year',
      cgpa: 3.8,
      bio: `Enthusiastic student aiming to become a top-tier ${targetCareer}.`,
      targetCareerId: benchmark.id,
      targetCareerTitle: benchmark.title,
      isDemo: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setProfileState(newProfile);
    setSkillsState(initialSkills);
    setProjectsState([]);
    setResumeState(null);
    setAssessmentsState([]);
    setRoadmapState(null);
    setMissionsState([
      {
        id: 'mission-fresh-1',
        studentId: newProfile.id,
        title: `Take your first ${benchmark.requiredSkills[0]?.name || 'Python'} skill assessment to verify current level`,
        category: 'assessment',
        estimatedMinutes: 15,
        isCompleted: false,
        targetSkillGap: benchmark.requiredSkills[0]?.name || 'Core Skills',
        actionUrl: '/dashboard/assessments',
        date: new Date().toISOString().split('T')[0]
      },
      {
        id: 'mission-fresh-2',
        studentId: newProfile.id,
        title: 'Add your first project or GitHub repository for AI quality evaluation',
        category: 'project',
        estimatedMinutes: 10,
        isCompleted: false,
        targetSkillGap: 'Project Evidence',
        actionUrl: '/dashboard/projects',
        date: new Date().toISOString().split('T')[0]
      }
    ]);
    setInterviewsState([]);
    setIsDemoMode(false);
  };

  const setProfile = (updatedProfile: StudentProfile) => {
    setProfileState(updatedProfile);
  };

  const updateTargetCareer = (careerTitle: string) => {
    if (!profile) return;
    const benchmark = getCareerBenchmark(careerTitle);
    setProfileState({
      ...profile,
      targetCareerId: benchmark.id,
      targetCareerTitle: benchmark.title,
      updatedAt: new Date().toISOString()
    });
  };

  const addOrUpdateSkill = (skillData: Partial<StudentSkill> & { skillName: string }) => {
    setSkillsState(prev => {
      const index = prev.findIndex(s => s.skillName.toLowerCase() === skillData.skillName.toLowerCase());
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = { ...updated[index], ...skillData };
        return updated;
      } else {
        const newSkill: StudentSkill = {
          id: `skill-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          studentId: profile?.id || 'default-student',
          category: 'technical',
          currentLevel: 50,
          verifiedByAssessment: false,
          ...skillData
        };
        return [...prev, newSkill];
      }
    });
  };

  const saveAssessmentResult = (result: AssessmentAttempt) => {
    setAssessmentsState(prev => [result, ...prev]);

    // Update or verify matching student skill
    setSkillsState(prev => {
      const matchIndex = prev.findIndex(
        s => s.skillName.toLowerCase() === result.skillName.toLowerCase() ||
             result.skillName.toLowerCase().includes(s.skillName.toLowerCase()) ||
             s.skillName.toLowerCase().includes(result.skillName.toLowerCase())
      );

      if (matchIndex >= 0) {
        const updated = [...prev];
        const existing = updated[matchIndex];
        // Blend previous level with verified assessment score
        const newLevel = Math.round(existing.currentLevel * 0.3 + result.scorePercentage * 0.7);
        updated[matchIndex] = {
          ...existing,
          currentLevel: newLevel,
          verifiedByAssessment: true,
          lastAssessedAt: result.completedAt,
          assessmentScore: Math.round(result.scorePercentage)
        };
        return updated;
      } else {
        const newSkill: StudentSkill = {
          id: `skill-assessed-${Date.now()}`,
          studentId: profile?.id || 'default-student',
          skillName: result.skillName,
          category: 'technical',
          currentLevel: Math.round(result.scorePercentage),
          verifiedByAssessment: true,
          lastAssessedAt: result.completedAt,
          assessmentScore: Math.round(result.scorePercentage)
        };
        return [...prev, newSkill];
      }
    });
  };

  const addProject = (projectData: Omit<ProjectEvidence, 'id' | 'createdAt'>): ProjectEvidence => {
    const newProj: ProjectEvidence = {
      ...projectData,
      id: `proj-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      studentId: profile?.id || 'default-student',
      createdAt: new Date().toISOString()
    };
    setProjectsState(prev => [newProj, ...prev]);
    return newProj;
  };

  const updateProjectEvaluation = (projectId: string, evaluation: any) => {
    setProjectsState(prev => prev.map(p => {
      if (p.id === projectId) {
        return { ...p, aiEvaluation: evaluation };
      }
      return p;
    }));
  };

  const saveResume = (resumeData: ResumeData) => {
    setResumeState(resumeData);
  };

  const toggleMission = (missionId: string) => {
    setMissionsState(prev => prev.map(m => {
      if (m.id === missionId) {
        return { ...m, isCompleted: !m.isCompleted };
      }
      return m;
    }));
  };

  const toggleRoadmapTask = (weekNumber: number, taskId: string) => {
    if (!roadmap) return;
    const updatedWeeks = roadmap.weeks.map(week => {
      if (week.weekNumber === weekNumber) {
        const updatedTasks = week.tasks.map(t => {
          if (t.id === taskId) {
            return { ...t, isCompleted: !t.isCompleted };
          }
          return t;
        });
        const allCompleted = updatedTasks.every(t => t.isCompleted);
        return { ...week, tasks: updatedTasks, isCompleted: allCompleted };
      }
      return week;
    });

    // Recalculate progress
    const totalTasks = updatedWeeks.reduce((sum, w) => sum + w.tasks.length, 0);
    const completedTasks = updatedWeeks.reduce((sum, w) => sum + w.tasks.filter(t => t.isCompleted).length, 0);
    const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    setRoadmapState({
      ...roadmap,
      weeks: updatedWeeks,
      overallProgress
    });
  };

  const saveInterviewSession = (session: InterviewSession) => {
    setInterviewsState(prev => {
      const idx = prev.findIndex(i => i.id === session.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = session;
        return updated;
      }
      return [session, ...prev];
    });
  };

  // Live Calculated Outputs
  const readinessBreakdown = calculateReadinessScore({
    profile: profile || DEMO_PROFILE,
    skills,
    projects,
    resume,
    interviews,
    assessments
  });

  const skillGapAnalysis = analyzeSkillGaps(
    profile?.targetCareerTitle || 'Machine Learning Engineer',
    skills
  );

  return (
    <CareerStoreContext.Provider
      value={{
        profile,
        skills,
        projects,
        resume,
        assessments,
        roadmap,
        missions,
        interviews,
        isDemoMode,
        isLoaded,
        setProfile,
        updateTargetCareer,
        addOrUpdateSkill,
        saveAssessmentResult,
        addProject,
        updateProjectEvaluation,
        saveResume,
        toggleMission,
        toggleRoadmapTask,
        saveInterviewSession,
        switchToDemo,
        resetToFresh,
        readinessBreakdown,
        skillGapAnalysis
      }}
    >
      {children}
    </CareerStoreContext.Provider>
  );
};

export function useCareerStore() {
  const context = useContext(CareerStoreContext);
  if (!context) {
    throw new Error('useCareerStore must be used within a CareerStoreProvider');
  }
  return context;
}
