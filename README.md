# CareerOS — AI Career Readiness & Employability Platform

> **“Don’t just tell students what career to choose. Show them how ready they are for it — and exactly what they need to do next.”**

From **“I want this career”** to **“I’m ready for this career.”**

---

## 🌟 Overview

**CareerOS** is an evidence-based career readiness platform powered by **Google Gemini AI**. Instead of functioning as a generic chatbot or simple resume template filler, CareerOS continuously computes a student's **Career Skill Readiness / Alignment Score** based on verifiable evidence across technical skills, DSA/algorithmic problem solving, project depth, ATS resume quality, and AI mock interview execution.

---

## 🚀 Key Modules & Capabilities

1. **Zero-Resume AI Voice Profile ("Tell Us About Yourself")**:
   - Students without a resume can record a 60-second natural voice introduction.
   - Live browser Web Audio API visual waveform animations, playback, pause, and speech-to-text.
   - Gemini AI extracts structured qualifications (Education, Skills, Projects, Achievements, Soft Skills) with **strict anti-hallucination guardrails** (no fake companies or fabricated internships).
   - Instant ATS-optimized fresher resume generation with 4 professional templates and **1-click PDF download**.

2. **Career Readiness Scoring Engine**:
   - Dynamic **0–100** score calculated from weighted evidence:
     - 25% Technical Skills & Verified Assessments
     - 20% DSA & Problem Solving
     - 20% Project Quality, Depth & Practical Value
     - 15% Resume ATS Structure & Quantified Impact
     - 10% AI Mock Interview Execution Score
     - 10% Technical Communication & Soft Skills
   - Transparent formula modal explaining the exact breakdown.

3. **Evidence-Based Skill Gap Analysis**:
   - Direct comparison between target career benchmark requirements (e.g. Machine Learning Engineer, Full Stack Developer, Data Scientist) and student verified proficiency.
   - Clear classification into **Strengths**, **Moderate Gaps**, and **Major Gaps** with tailored Gemini AI action plans.

4. **Dynamic AI Skill Assessments**:
   - Dynamic question generation powered by Gemini across Python, DSA, Machine Learning, SQL, Docker, and Communication.
   - Code snippet debugging, MCQ scenarios, and immediate sub-competency scoring that automatically recalibrates the student profile.

5. **AI Project Quality & Evidence Analyzer**:
   - Evaluates project descriptions and GitHub repositories across Technical Depth, Complexity, Practical Value, and ATS resume value.
   - Generates action-verb bullet points with quantifiable impact metrics.

6. **Job Description Analyzer**:
   - Paste any job posting (e.g. from LinkedIn or Internshala).
   - Gemini extracts required vs preferred skills, core tools, and responsibilities.
   - Generates a Skill Alignment Matrix (`✓ Matched`, `⚠ Moderate Gap`, `✕ Missing Critical`) and a step-by-step preparation timeline.

7. **Personalized 12-Week Career Roadmap**:
   - Week-by-week curriculum targeting student-specific gaps with learning milestones, curated resources, and interactive progress checkmarks.

8. **Daily Career Missions**:
   - Gamified 20-minute daily micro-tasks derived from active skill gaps with streak counters and celebratory confetti.

9. **AI Mock Interview Simulator**:
   - Real-time technical and behavioral mock interview rounds with role and difficulty selectors.
   - Dual interaction modes: **Text** or **Voice** (with browser Web Speech recognition & Speech Synthesis audio playback).
   - Multi-metric scoring per answer: Technical Accuracy, Completeness, Clarity, and Communication.

10. **Career Copilot**:
    - AI Career Mentor with persistent context grounded in the student's live readiness score, projects, and target career benchmarks.

11. **Institutional College Analytics Dashboard**:
    - Aggregated anonymous cohort telemetry, readiness distribution histograms, and department-wide skill gap detection for university administrators.

12. **Demo Profile Mode ("Rahul Verma — ML Engineer")**:
    - 1-click toggle to explore pre-populated realistic data for hackathon judges, with immediate switching back to a clean real student profile.

---

## 🛠 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack, React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Dark Glassmorphism, Custom CSS Variables
- **AI Model**: Google Gemini API (`gemini-1.5-flash` via `@google/generative-ai`)
- **Charts & Graphs**: [Recharts](https://recharts.org/) (Timeline charts, Radar competency graphs, Histograms)
- **Icons**: [Lucide React](https://lucide.dev/)
- **PDF Generation**: [jsPDF](https://github.com/parallax/jsPDF) & [html2canvas](https://html2canvas.hertzen.com/)
- **Database**: PostgreSQL / Supabase schema (`src/lib/db/schema.sql`) + local storage persistence

---

## ⚙️ Environment Setup

1. **Clone the repository** and install dependencies:
   ```bash
   npm install
   ```

2. **Configure your Google Gemini API Key**:
   Create a `.env.local` file in the root directory:
   ```env
   # Get a free API key at https://aistudio.google.com/app/apikey
   GEMINI_API_KEY=your_real_gemini_api_key_here
   ```

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Production Build**:
   ```bash
   npm run build
   npm start
   ```

---

## 🏆 Hackathon Demonstration Flow

1. **Landing Page** (`/`): Click **"Check My Career Readiness"** or **"Explore Platform (Demo)"**.
2. **Onboarding** (`/onboarding`): Select target career (*Machine Learning Engineer*) and choose **"I don't have a resume"**.
3. **Voice Studio** (`/voice-profile`): Record or type a natural spoken introduction. Press **"Extract Profile with Gemini AI"**, review extracted credentials, and click **"Generate My Resume"**.
4. **Main Dashboard** (`/dashboard`): Observe the dynamic **Career Readiness Score (64/100)**, skill gap diagnostics, and daily missions.
5. **Skill Assessments** (`/dashboard/assessments`): Take a 5-question test and watch your verified score update automatically.
6. **Project Analyzer** (`/dashboard/projects`): Inspect AI technical depth evaluation and generated ATS resume bullets.
7. **Job Analyzer** (`/dashboard/jobs`): Paste a job posting to view the instant alignment matrix.
8. **AI Mock Interview** (`/dashboard/interview`): Run an interactive text/voice mock interview and receive multi-metric answer scoring.
