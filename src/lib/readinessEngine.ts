import { 
  StudentProfile, 
  StudentSkill, 
  ProjectEvidence, 
  ResumeData, 
  InterviewSession, 
  AssessmentAttempt,
  ReadinessScoreBreakdown,
  SkillGapAnalysisResult,
  SkillGapItem
} from '@/types';
import { getCareerBenchmark } from './constants/careerBenchmarks';

export interface ReadinessEvaluationInput {
  profile: StudentProfile;
  skills: StudentSkill[];
  projects: ProjectEvidence[];
  resume?: ResumeData | null;
  interviews: InterviewSession[];
  assessments: AssessmentAttempt[];
}

export function calculateReadinessScore(input: ReadinessEvaluationInput): ReadinessScoreBreakdown {
  const { profile, skills, projects, resume, interviews, assessments } = input;
  const benchmark = getCareerBenchmark(profile.targetCareerTitle || 'Machine Learning Engineer');

  // 1. Technical Skills Score (Max 100)
  let techScore = 0;
  if (skills.length > 0) {
    const techSkills = skills.filter(s => s.category === 'technical' || s.category === 'framework' || s.category === 'tools');
    if (techSkills.length > 0) {
      const avgLevel = techSkills.reduce((sum, s) => sum + s.currentLevel, 0) / techSkills.length;
      const verifiedBonus = (techSkills.filter(s => s.verifiedByAssessment).length / techSkills.length) * 15;
      techScore = Math.min(100, Math.round(avgLevel * 0.85 + verifiedBonus));
    } else {
      techScore = 40;
    }
  } else {
    techScore = 30; // base initialization
  }

  // 2. DSA & Problem Solving Score (Max 100)
  let dsaScore = 0;
  const dsaSkill = skills.find(s => s.category === 'dsa' || s.skillName.toLowerCase().includes('dsa') || s.skillName.toLowerCase().includes('data structures'));
  const dsaAssessments = assessments.filter(a => a.skillName.toLowerCase().includes('dsa') || a.skillName.toLowerCase().includes('algorithm'));

  if (dsaAssessments.length > 0) {
    const latestDsa = dsaAssessments[dsaAssessments.length - 1];
    dsaScore = Math.round(latestDsa.scorePercentage);
  } else if (dsaSkill) {
    dsaScore = Math.round(dsaSkill.currentLevel * (dsaSkill.verifiedByAssessment ? 1.0 : 0.8));
  } else {
    dsaScore = 35;
  }

  // 3. Projects Score (Max 100)
  let projectScore = 0;
  if (projects.length > 0) {
    const evaluatedProjects = projects.filter(p => p.aiEvaluation);
    if (evaluatedProjects.length > 0) {
      const avgProjScore = evaluatedProjects.reduce((sum, p) => sum + (p.aiEvaluation?.overallScore || 70), 0) / evaluatedProjects.length;
      const countMultiplier = Math.min(1.15, 0.85 + projects.length * 0.1);
      projectScore = Math.min(100, Math.round(avgProjScore * countMultiplier));
    } else {
      projectScore = Math.min(90, Math.round(projects.length * 28));
    }
  } else {
    projectScore = 20;
  }

  // 4. Communication Score (Max 100)
  let commScore = 0;
  const commSkill = skills.find(s => s.category === 'soft' || s.skillName.toLowerCase().includes('communication'));
  const finishedInterviews = interviews.filter(i => i.isFinished && i.overallEvaluation);
  if (finishedInterviews.length > 0) {
    const latestInt = finishedInterviews[finishedInterviews.length - 1];
    commScore = Math.round(latestInt.overallEvaluation?.communicationScore || 65);
  } else if (commSkill) {
    commScore = commSkill.currentLevel;
  } else {
    commScore = 50;
  }

  // 5. Resume Score (Max 100)
  let resumeScore = 0;
  if (resume) {
    if (resume.scoreAudit?.overallAtsScore) {
      resumeScore = resume.scoreAudit.overallAtsScore;
    } else {
      let calc = 50;
      if (resume.education.length > 0) calc += 10;
      if (resume.projects.length > 0) calc += 15;
      if (resume.technicalSkills.length > 0) calc += 15;
      if (resume.professionalSummary) calc += 10;
      resumeScore = Math.min(95, calc);
    }
  } else {
    resumeScore = 25;
  }

  // 6. Interview Readiness Score (Max 100)
  let interviewScore = 0;
  if (finishedInterviews.length > 0) {
    const avgIntScore = finishedInterviews.reduce((sum, i) => sum + (i.overallEvaluation?.overallScore || 60), 0) / finishedInterviews.length;
    interviewScore = Math.round(avgIntScore);
  } else if (interviews.length > 0) {
    interviewScore = 45;
  } else {
    interviewScore = 25;
  }

  // Weighted Total Formula:
  // Technical Skills: 25%
  // Projects: 20%
  // DSA: 20%
  // Resume: 15%
  // Interview: 10%
  // Communication: 10%
  const overall = Math.round(
    techScore * 0.25 +
    projectScore * 0.20 +
    dsaScore * 0.20 +
    resumeScore * 0.15 +
    interviewScore * 0.10 +
    commScore * 0.10
  );

  return {
    overall: Math.max(5, Math.min(100, overall)),
    technicalSkills: techScore,
    dsa: dsaScore,
    projects: projectScore,
    communication: commScore,
    resumeQuality: resumeScore,
    interviewReadiness: interviewScore,
    scoreFormulaExplanation: 'Evidence-based calculation: 25% Technical Skills + 20% Projects + 20% DSA + 15% Resume ATS Quality + 10% Mock Interview Performance + 10% Communication & Verification.'
  };
}

export function analyzeSkillGaps(
  targetCareer: string,
  currentSkills: StudentSkill[]
): SkillGapAnalysisResult {
  const benchmark = getCareerBenchmark(targetCareer);
  const gaps: SkillGapItem[] = [];

  let totalRequired = 0;
  let totalAchieved = 0;

  benchmark.requiredSkills.forEach(req => {
    totalRequired += req.requiredLevel;
    const matchingSkill = currentSkills.find(
      s => s.skillName.toLowerCase() === req.name.toLowerCase() ||
           s.skillName.toLowerCase().includes(req.name.toLowerCase()) ||
           req.name.toLowerCase().includes(s.skillName.toLowerCase())
    );

    const currentLevel = matchingSkill ? matchingSkill.currentLevel : 0;
    totalAchieved += Math.min(req.requiredLevel, currentLevel);
    const gapDiff = req.requiredLevel - currentLevel;

    let status: 'strength' | 'moderate_gap' | 'major_gap' = 'strength';
    let recommendation = `Strong foundation in ${req.name}. Maintain practice.`;

    if (gapDiff > 35 || currentLevel === 0) {
      status = 'major_gap';
      recommendation = `Critical gap for ${benchmark.title}. Immediate structured study & project implementation required.`;
    } else if (gapDiff > 10) {
      status = 'moderate_gap';
      recommendation = `Moderate gap. Level up through dedicated assessments and hands-on mini-projects.`;
    }

    gaps.push({
      skillName: req.name,
      category: req.category,
      requiredLevel: req.requiredLevel,
      currentLevel: currentLevel,
      gap: Math.max(0, gapDiff),
      status,
      recommendation,
      learningResource: `https://roadmap.sh/${req.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
    });
  });

  const overallAlignment = totalRequired > 0 ? Math.round((totalAchieved / totalRequired) * 100) : 50;
  const majorGapsCount = gaps.filter(g => g.status === 'major_gap').length;
  const moderateGapsCount = gaps.filter(g => g.status === 'moderate_gap').length;
  const strengthsCount = gaps.filter(g => g.status === 'strength').length;

  const topGapNames = gaps
    .filter(g => g.status === 'major_gap' || g.status === 'moderate_gap')
    .slice(0, 3)
    .map(g => g.skillName)
    .join(', ');

  const summary = topGapNames.length > 0
    ? `Your biggest current gaps for ${benchmark.title} are ${topGapNames}. Closing these will give you the highest leap in career readiness.`
    : `Excellent alignment with ${benchmark.title} requirements! Focus on real-world portfolio depth and mock interview execution.`;

  const aiActionPlan = gaps
    .filter(g => g.status !== 'strength')
    .slice(0, 4)
    .map(g => `Prioritize ${g.skillName}: complete an assessment to verify proficiency and build 1 targeted project feature.`);

  return {
    targetCareer: benchmark.title,
    overallAlignment,
    summary,
    majorGapsCount,
    moderateGapsCount,
    strengthsCount,
    gaps,
    aiActionPlan: aiActionPlan.length > 0 ? aiActionPlan : ['Take advanced technical assessments to verify top percentile readiness.']
  };
}
