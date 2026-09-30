import { GoogleGenerativeAI } from '@google/generative-ai';

// Server-side Gemini service
export function getGeminiClient(): GoogleGenerativeAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_real_key_here') {
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
}

// Clean JSON response from Gemini markdown codeblocks
export function cleanJsonResponse(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return cleaned.trim();
}

/**
 * AI Safety Rules for CareerOS:
 * 1. Never fabricate companies, internships, degrees, or marks
 * 2. Only use verified information provided by the student
 * 3. Mark missing items clearly
 */
export const GEMINI_SAFETY_SYSTEM_INSTRUCTION = `
You are the CareerOS Career Readiness AI Engine.
Strict Safety Rules:
1. NEVER invent or fabricate degrees, colleges, companies, internships, marks/CGPA, certifications, or achievements.
2. If the user has not mentioned a detail, do not hallucinate one. Leave it empty or mark it missing.
3. Provide objective, evidence-based feedback. Never claim guaranteed job placement.
4. Output strictly valid JSON unless requested otherwise.
`;

// Live verified active models for this API key
const CANDIDATE_MODELS = [
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-3-flash-preview',
  'gemini-3.7-flash',
  'gemini-3.6-flash',
  'gemini-3.1-flash-lite',
  'gemini-flash-latest',
  'gemini-flash-lite-latest',
];

/**
 * Robust Multi-Model Fallback Generator
 */
export async function generateWithGeminiCascade(prompt: string, customInstruction?: string): Promise<string> {
  const client = getGeminiClient();
  if (!client) {
    throw new Error('GEMINI_API_KEY is not configured. Please set your Gemini API key in .env.local.');
  }

  let lastError: any = null;

  for (const modelName of CANDIDATE_MODELS) {
    try {
      const model = client.getGenerativeModel({
        model: modelName,
        systemInstruction: customInstruction || GEMINI_SAFETY_SYSTEM_INSTRUCTION
      });

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      if (text) {
        return text;
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`Model ${modelName} attempt failed, trying fallback model...`, err?.message);
    }
  }

  throw lastError || new Error('All Gemini model candidates failed to generate content.');
}

/**
 * 1. Extract Structured Profile from Voice/Text Transcript
 */
export async function extractProfileFromTranscript(transcript: string) {
  const prompt = `
Extract structured professional profile information from the following student voice introduction transcript.
Transcript:
"""${transcript}"""

Return STRICT JSON with the following schema:
{
  "name": string or null,
  "degree": string or null,
  "branch": string or null,
  "college": string or null,
  "year": string or null,
  "technicalSkills": string[],
  "programmingLanguages": string[],
  "toolsAndFrameworks": string[],
  "projects": [
    {
      "name": string,
      "techStack": string[],
      "description": string
    }
  ],
  "internships": [
    {
      "role": string,
      "company": string,
      "description": string
    }
  ],
  "hackathonsAndAchievements": string[],
  "careerInterests": string[],
  "softSkills": string[],
  "missingInformation": string[]
}

Rules:
- DO NOT invent details not mentioned in the transcript.
- If the student mentions "no internships" or hasn't done an internship, internships must be an empty array [].
- List missing essentials in missingInformation (e.g. "CGPA not specified", "Target location not specified").
`;

  const responseText = await generateWithGeminiCascade(prompt);
  const parsed = JSON.parse(cleanJsonResponse(responseText));
  return parsed;
}

/**
 * 2. Generate Professional ATS-Friendly Resume from Verified Profile
 */
export async function generateResumeWithAI(profileData: any, template: string = 'modern') {
  const prompt = `
Generate a professional, ATS-optimized fresher/student resume structure using ONLY the verified data provided.
Template: ${template}
Student Verified Data:
${JSON.stringify(profileData, null, 2)}

Return STRICT JSON matching this ResumeData schema:
{
  "personalInfo": {
    "fullName": string,
    "email": string,
    "phone": string,
    "location": string,
    "linkedin": string,
    "github": string,
    "portfolio": string
  },
  "professionalSummary": string (1-3 sentences highlighting real skills & career objective, NO fake experience),
  "education": [
    {
      "institution": string,
      "degree": string,
      "branch": string,
      "startYear": string,
      "endYear": string,
      "cgpa": string,
      "achievements": string[]
    }
  ],
  "technicalSkills": [
    {
      "category": string,
      "skills": string[]
    }
  ],
  "projects": [
    {
      "title": string,
      "role": string,
      "techStack": string[],
      "link": string,
      "bulletPoints": string[] (Action-verb driven, impact focused based on their real project details)
    }
  ],
  "experience": [
    {
      "title": string,
      "company": string,
      "location": string,
      "startDate": string,
      "endDate": string,
      "bulletPoints": string[]
    }
  ],
  "certifications": [
    {
      "title": string,
      "issuer": string,
      "year": string,
      "link": string
    }
  ],
  "achievements": string[],
  "hackathons": [
    {
      "name": string,
      "position": string,
      "year": string,
      "description": string
    }
  ]
}

CRITICAL:
- ONLY include sections where real data exists. If the student has no experience, keep experience as [].
- Never fabricate companies or metrics not provided.
`;

  const responseText = await generateWithGeminiCascade(prompt);
  const parsed = JSON.parse(cleanJsonResponse(responseText));
  return parsed;
}

/**
 * 3. Analyze Resume & Score ATS Compatibility
 */
export async function analyzeResumeWithAI(resumeTextOrData: any, targetCareer: string) {
  const prompt = `
Analyze this resume for target career: "${targetCareer}".
Resume Content:
"""${typeof resumeTextOrData === 'string' ? resumeTextOrData : JSON.stringify(resumeTextOrData, null, 2)}"""

Evaluate ATS compatibility, impact verbs, clarity, project evidence, and skill alignment.
Return STRICT JSON:
{
  "overallAtsScore": number (0 - 100),
  "atsStructure": number (0 - 100),
  "skillsMatch": number (0 - 100),
  "projectImpact": number (0 - 100),
  "clarityAndTone": number (0 - 100),
  "formatting": number (0 - 100),
  "strengths": string[],
  "criticalFixes": string[],
  "actionableSuggestions": string[],
  "improvedSummary": string,
  "missingKeywordsForCareer": string[]
}
`;

  const responseText = await generateWithGeminiCascade(prompt);
  return JSON.parse(cleanJsonResponse(responseText));
}

/**
 * 4. Analyze Job Description & Compute Skill Alignment
 */
export async function analyzeJobDescriptionWithAI(jobDescription: string, studentSkills: any[]) {
  const prompt = `
Analyze this Job Description and compare it with the student's verified skills.
Job Description:
"""${jobDescription}"""

Student Verified Skills:
${JSON.stringify(studentSkills, null, 2)}

Return STRICT JSON:
{
  "jobTitle": string,
  "companyName": string,
  "extractedRequirements": {
    "requiredSkills": string[],
    "preferredSkills": string[],
    "experienceLevel": string,
    "educationRequired": string,
    "keyResponsibilities": string[],
    "coreTools": string[]
  },
  "skillAlignment": [
    {
      "skill": string,
      "status": "matched" | "moderate" | "missing",
      "studentLevel": number,
      "requiredLevel": number,
      "importance": "required" | "preferred"
    }
  ],
  "matchScore": number (0 - 100, representing skill coverage percentage, NOT hiring probability),
  "missingCriticalSkills": string[],
  "recommendedPreparation": [
    {
      "step": string,
      "estimatedDays": number,
      "focusArea": string
    }
  ],
  "resumeTailoringTips": string[],
  "aiAnalysisSummary": string
}
`;

  const responseText = await generateWithGeminiCascade(prompt);
  return JSON.parse(cleanJsonResponse(responseText));
}

/**
 * 5. Analyze Student Project
 */
export async function analyzeProjectWithAI(project: {
  title: string;
  tagline?: string;
  description: string;
  githubUrl?: string;
  liveUrl?: string;
  techStack: string[];
}) {
  const prompt = `
Analyze this student project objectively based on the provided specifications.
Project Title: ${project.title}
Tech Stack: ${project.techStack.join(', ')}
Description: ${project.description}
GitHub URL: ${project.githubUrl || 'None provided'}
Live Demo URL: ${project.liveUrl || 'None provided'}

Note: Do not falsely claim you ran or inspected raw repository source code if only metadata/URL was provided.

Return STRICT JSON:
{
  "technicalDepth": number (0 - 100),
  "projectComplexity": number (0 - 100),
  "practicalValue": number (0 - 100),
  "documentation": number (0 - 100),
  "aiMlImplementation": number (0 - 100),
  "codeQualityEstimate": number (0 - 100),
  "resumeValue": number (0 - 100),
  "overallScore": number (0 - 100),
  "strengths": string[],
  "improvements": string[],
  "resumeBulletSuggestions": string[],
  "summary": string
}
`;

  const responseText = await generateWithGeminiCascade(prompt);
  return JSON.parse(cleanJsonResponse(responseText));
}

/**
 * 6. Generate Personalized 12-Week Career Roadmap
 */
export async function generateRoadmapWithAI(
  targetCareer: string,
  skills: any[],
  skillGaps: any[],
  availableHoursPerWeek: number = 15
) {
  const prompt = `
Create a realistic, structured 12-Week Career Roadmap to prepare a student for the role of "${targetCareer}".
Target Career: ${targetCareer}
Student Skills: ${JSON.stringify(skills)}
Identified Skill Gaps: ${JSON.stringify(skillGaps)}
Available Study Time: ${availableHoursPerWeek} hours/week

Return STRICT JSON:
{
  "targetCareer": "${targetCareer}",
  "durationWeeks": 12,
  "keyMilestones": [string, string, string, string],
  "weeks": [
    {
      "weekNumber": number (1 to 12),
      "title": string,
      "focusArea": string,
      "objective": string,
      "estimatedHours": number,
      "isCompleted": false,
      "tasks": [
        {
          "id": string,
          "title": string,
          "description": string,
          "resourceName": string,
          "resourceUrl": string,
          "type": "learn" | "build" | "assess" | "interview",
          "isCompleted": false
        }
      ]
    }
  ]
}
`;

  const responseText = await generateWithGeminiCascade(prompt);
  return JSON.parse(cleanJsonResponse(responseText));
}

/**
 * 7. Generate Skill Assessment Questions dynamically
 */
export async function generateAssessmentQuestionsWithAI(
  skillName: string,
  topic: string,
  difficulty: string = 'intermediate',
  count: number = 5
) {
  const prompt = `
Generate ${count} high-quality, practical technical assessment questions for Skill: "${skillName}" (Topic: "${topic}", Difficulty: "${difficulty}").
Mix question types: MCQ, Code Snippet output/debug questions, and realistic engineering scenario questions.

Return STRICT JSON format:
{
  "skillName": "${skillName}",
  "questions": [
    {
      "id": string,
      "question": string,
      "type": "mcq" | "code_snippet" | "scenario",
      "codeSnippet": string or null,
      "options": [string, string, string, string],
      "correctAnswerIndex": number (0, 1, 2, or 3),
      "explanation": string,
      "topic": string,
      "difficulty": "${difficulty}"
    }
  ]
}
`;

  const responseText = await generateWithGeminiCascade(prompt);
  return JSON.parse(cleanJsonResponse(responseText));
}

/**
 * 8. AI Career Copilot Interactive Chat
 */
export async function chatWithCareerCopilot(
  userMessage: string,
  studentContext: {
    profile: any;
    skills: any[];
    readinessBreakdown: any;
    skillGaps: any[];
    projects: any[];
    recentRoadmapTask?: string;
  },
  chatHistory: { role: 'user' | 'model'; parts: string }[] = []
) {
  const client = getGeminiClient();
  if (!client) {
    throw new Error('GEMINI_API_KEY is not configured.');
  }

  const systemInstruction = `
${GEMINI_SAFETY_SYSTEM_INSTRUCTION}
You are the personal CareerOS AI Mentor & Copilot.
You have live, direct access to the student's profile, skill gaps, projects, and readiness score.
Always tailor advice specifically to their target career (${studentContext.profile?.targetCareerTitle || 'Software Engineer'}) and their exact verified numbers.
Be encouraging, deeply actionable, concise, and professional.
Never give generic superficial answers.
Student Live Context:
${JSON.stringify(studentContext, null, 2)}
`;

  const prompt = `
Chat History:
${chatHistory.map(h => `${h.role}: ${h.parts}`).join('\n')}

User: ${userMessage}

Respond as the CareerOS AI Career Copilot:
`;

  return await generateWithGeminiCascade(prompt, systemInstruction);
}

/**
 * 9. AI Mock Interview: Generate Role-Specific Question & Evaluate Answers
 */
export async function generateInterviewQuestionWithAI(
  targetRole: string,
  difficulty: string,
  questionNumber: number,
  previousMessages: any[]
) {
  const prompt = `
You are a senior tech lead and interviewer conducting a mock technical & behavioral interview for the role of: "${targetRole}" (Difficulty: ${difficulty}).
This is Question #${questionNumber} of 5.
Previous interview dialogue:
${JSON.stringify(previousMessages)}

Generate the next realistic interview question. Keep it direct, clear, and relevant to the role.
Return STRICT JSON:
{
  "question": string,
  "focusArea": string,
  "interviewerNotes": string
}
`;

  const responseText = await generateWithGeminiCascade(prompt);
  return JSON.parse(cleanJsonResponse(responseText));
}

export async function evaluateInterviewAnswerWithAI(
  targetRole: string,
  question: string,
  studentAnswer: string
) {
  const prompt = `
Evaluate the student's response to this interview question for role "${targetRole}".
Question: "${question}"
Student Answer: "${studentAnswer}"

Evaluate strictly on technical accuracy, clarity, completeness, and communication.
Do NOT make assumptions about personality or mental state.
Return STRICT JSON:
{
  "technicalAccuracy": number (0 - 100),
  "completeness": number (0 - 100),
  "clarity": number (0 - 100),
  "communication": number (0 - 100),
  "keyStrengths": string[],
  "improvementTips": string[],
  "sampleBetterAnswer": string
}
`;

  const responseText = await generateWithGeminiCascade(prompt);
  return JSON.parse(cleanJsonResponse(responseText));
}
