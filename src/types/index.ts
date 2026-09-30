// CareerOS Type Definitions

export type UserRole = 'student' | 'college_admin' | 'recruiter';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  age?: number;
  location?: string;
  college?: string;
  degree?: string;
  branch?: string;
  year?: string;
  cgpa?: number;
  avatarUrl?: string;
  bio?: string;
  targetCareerId?: string;
  targetCareerTitle?: string;
  isDemo?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CareerGoal {
  id: string;
  title: string;
  category: string;
  description: string;
  requiredSkills: {
    name: string;
    requiredLevel: number; // 0 - 100
    importance: 'critical' | 'high' | 'medium';
    category: 'technical' | 'dsa' | 'framework' | 'tools' | 'soft';
  }[];
  avgSalary?: string;
  marketDemand?: 'very_high' | 'high' | 'moderate';
}

export interface StudentSkill {
  id: string;
  studentId: string;
  skillName: string;
  category: 'technical' | 'dsa' | 'framework' | 'tools' | 'soft';
  currentLevel: number; // 0 - 100
  verifiedByAssessment: boolean;
  lastAssessedAt?: string;
  assessmentScore?: number;
  subSkills?: {
    name: string;
    level: number;
  }[];
}

export interface ReadinessScoreBreakdown {
  overall: number; // 0 - 100
  technicalSkills: number;
  dsa: number;
  projects: number;
  communication: number;
  resumeQuality: number;
  interviewReadiness: number;
  scoreFormulaExplanation: string;
}

export interface SkillGapItem {
  skillName: string;
  category: string;
  requiredLevel: number;
  currentLevel: number;
  gap: number; // required - current
  status: 'strength' | 'moderate_gap' | 'major_gap';
  recommendation: string;
  learningResource?: string;
}

export interface SkillGapAnalysisResult {
  targetCareer: string;
  overallAlignment: number;
  summary: string;
  majorGapsCount: number;
  moderateGapsCount: number;
  strengthsCount: number;
  gaps: SkillGapItem[];
  aiActionPlan: string[];
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  type: 'mcq' | 'multiple' | 'code_snippet' | 'scenario';
  codeSnippet?: string;
  options: string[];
  correctAnswerIndex: number | number[];
  explanation: string;
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface AssessmentAttempt {
  id: string;
  studentId: string;
  skillName: string;
  totalQuestions: number;
  correctCount: number;
  scorePercentage: number;
  timeSpentSeconds: number;
  topicBreakdown: {
    topic: string;
    score: number;
    total: number;
    percentage: number;
  }[];
  strengths: string[];
  weaknesses: string[];
  recommendedTopics: string[];
  aiSummary: string;
  completedAt: string;
}

export interface ProjectEvidence {
  id: string;
  studentId: string;
  title: string;
  tagline: string;
  description: string;
  githubUrl?: string;
  liveUrl?: string;
  techStack: string[];
  highlights: string[];
  aiEvaluation?: {
    technicalDepth: number; // 0 - 100
    projectComplexity: number;
    practicalValue: number;
    documentation: number;
    aiMlImplementation: number;
    codeQualityEstimate: number;
    resumeValue: number;
    overallScore: number;
    strengths: string[];
    improvements: string[];
    resumeBulletSuggestions: string[];
    summary: string;
  };
  createdAt: string;
}

export interface ResumeData {
  id: string;
  studentId: string;
  template: 'modern' | 'minimal_ats' | 'technical' | 'fresher';
  personalInfo: {
    fullName: string;
    email: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  professionalSummary: string;
  education: {
    institution: string;
    degree: string;
    branch: string;
    startYear: string;
    endYear: string;
    cgpa?: string;
    achievements?: string[];
  }[];
  technicalSkills: {
    category: string;
    skills: string[];
  }[];
  projects: {
    title: string;
    role?: string;
    techStack: string[];
    link?: string;
    bulletPoints: string[];
  }[];
  experience: {
    title: string;
    company: string;
    location?: string;
    startDate: string;
    endDate: string;
    bulletPoints: string[];
  }[];
  certifications: {
    title: string;
    issuer: string;
    year: string;
    link?: string;
  }[];
  achievements: string[];
  hackathons: {
    name: string;
    position?: string;
    year: string;
    description: string;
  }[];
  scoreAudit?: {
    overallAtsScore: number;
    atsStructure: number;
    skillsMatch: number;
    projectImpact: number;
    clarityAndTone: number;
    formatting: number;
    strengths: string[];
    criticalFixes: string[];
    actionableSuggestions: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface JobAnalysisResult {
  id: string;
  jobTitle: string;
  companyName?: string;
  rawJobDescription: string;
  extractedRequirements: {
    requiredSkills: string[];
    preferredSkills: string[];
    experienceLevel: string;
    educationRequired: string;
    keyResponsibilities: string[];
    coreTools: string[];
  };
  skillAlignment: {
    skill: string;
    status: 'matched' | 'moderate' | 'missing';
    studentLevel: number;
    requiredLevel: number;
    importance: 'required' | 'preferred';
  }[];
  matchScore: number; // 0 - 100 alignment percentage
  missingCriticalSkills: string[];
  recommendedPreparation: {
    step: string;
    estimatedDays: number;
    focusArea: string;
  }[];
  resumeTailoringTips: string[];
  aiAnalysisSummary: string;
  analyzedAt: string;
}

export interface RoadmapWeek {
  weekNumber: number;
  title: string;
  focusArea: string;
  objective: string;
  estimatedHours: number;
  isCompleted: boolean;
  tasks: {
    id: string;
    title: string;
    description: string;
    resourceName: string;
    resourceUrl?: string;
    type: 'learn' | 'build' | 'assess' | 'interview';
    isCompleted: boolean;
  }[];
}

export interface CareerRoadmap {
  id: string;
  studentId: string;
  targetCareer: string;
  durationWeeks: number;
  overallProgress: number; // 0 - 100
  weeks: RoadmapWeek[];
  keyMilestones: string[];
  generatedAt: string;
}

export interface DailyMission {
  id: string;
  studentId: string;
  title: string;
  category: 'dsa' | 'assessment' | 'project' | 'interview' | 'resume' | 'learn';
  estimatedMinutes: number;
  isCompleted: boolean;
  targetSkillGap: string;
  actionUrl: string;
  date: string;
}

export interface InterviewMessage {
  id: string;
  sender: 'ai_interviewer' | 'student';
  content: string;
  audioUrl?: string;
  timestamp: string;
  evaluation?: {
    technicalAccuracy: number; // 0 - 100
    completeness: number;
    clarity: number;
    communication: number;
    keyStrengths: string[];
    improvementTips: string[];
    sampleBetterAnswer: string;
  };
}

export interface InterviewSession {
  id: string;
  studentId: string;
  targetRole: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  mode: 'text' | 'voice';
  totalQuestions: number;
  completedQuestions: number;
  isFinished: boolean;
  messages: InterviewMessage[];
  overallEvaluation?: {
    technicalScore: number;
    communicationScore: number;
    completenessScore: number;
    clarityScore: number;
    overallScore: number;
    strengths: string[];
    topWeaknesses: string[];
    concreteActionItems: string[];
    summary: string;
  };
  startedAt: string;
  finishedAt?: string;
}

export interface VoiceProfileExtraction {
  rawTranscript: string;
  extractedData: {
    name?: string;
    degree?: string;
    branch?: string;
    college?: string;
    year?: string;
    technicalSkills: string[];
    programmingLanguages: string[];
    toolsAndFrameworks: string[];
    projects: {
      name: string;
      techStack: string[];
      description: string;
    }[];
    internships: {
      role: string;
      company: string;
      description: string;
    }[];
    hackathonsAndAchievements: string[];
    careerInterests: string[];
    softSkills: string[];
    missingInformation: string[];
  };
}

export interface CollegeDashboardStats {
  totalStudents: number;
  avgReadinessScore: number;
  topTargetCareers: { career: string; count: number; avgReadiness: number }[];
  topSkillGaps: { skill: string; gapPercentage: number; affectedStudents: number }[];
  assessmentParticipationRate: number;
  projectParticipationRate: number;
  interviewPracticeRate: number;
  readinessDistribution: { range: string; count: number }[];
}
