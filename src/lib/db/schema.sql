-- CareerOS Database Schema (PostgreSQL / Supabase)
-- High Performance, Strictly Typed Schema for AI Career Readiness System

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    role VARCHAR(50) DEFAULT 'student' CHECK (role IN ('student', 'college_admin', 'recruiter')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. STUDENT PROFILES TABLE
CREATE TABLE IF NOT EXISTS student_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    age INT,
    location VARCHAR(255),
    college VARCHAR(255),
    degree VARCHAR(255),
    branch VARCHAR(255),
    year VARCHAR(50),
    cgpa NUMERIC(4, 2),
    bio TEXT,
    target_career_id VARCHAR(100),
    target_career_title VARCHAR(255),
    readiness_score INT DEFAULT 0,
    is_demo BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. CAREER GOALS & BENCHMARKS
CREATE TABLE IF NOT EXISTS career_goals (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    required_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
    avg_salary VARCHAR(100),
    market_demand VARCHAR(50) DEFAULT 'high',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. STUDENT SKILLS & VERIFICATIONS
CREATE TABLE IF NOT EXISTS student_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
    skill_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    current_level INT DEFAULT 0 CHECK (current_level >= 0 AND current_level <= 100),
    verified_by_assessment BOOLEAN DEFAULT FALSE,
    last_assessed_at TIMESTAMP WITH TIME ZONE,
    assessment_score INT,
    sub_skills JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. ASSESSMENTS & QUESTIONS
CREATE TABLE IF NOT EXISTS assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    skill_name VARCHAR(100) NOT NULL,
    topic VARCHAR(100),
    difficulty VARCHAR(50) DEFAULT 'intermediate',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS assessment_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'mcq',
    code_snippet TEXT,
    options JSONB NOT NULL,
    correct_answer_index JSONB NOT NULL,
    explanation TEXT,
    topic VARCHAR(100),
    difficulty VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS assessment_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
    skill_name VARCHAR(100) NOT NULL,
    total_questions INT NOT NULL,
    correct_count INT NOT NULL,
    score_percentage NUMERIC(5, 2) NOT NULL,
    time_spent_seconds INT NOT NULL,
    topic_breakdown JSONB NOT NULL,
    strengths JSONB DEFAULT '[]'::jsonb,
    weaknesses JSONB DEFAULT '[]'::jsonb,
    recommended_topics JSONB DEFAULT '[]'::jsonb,
    ai_summary TEXT,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    tagline VARCHAR(255),
    description TEXT NOT NULL,
    github_url VARCHAR(500),
    live_url VARCHAR(500),
    tech_stack JSONB DEFAULT '[]'::jsonb,
    highlights JSONB DEFAULT '[]'::jsonb,
    ai_evaluation JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. RESUMES TABLE
CREATE TABLE IF NOT EXISTS resumes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
    template VARCHAR(50) DEFAULT 'modern',
    personal_info JSONB NOT NULL,
    professional_summary TEXT,
    education JSONB DEFAULT '[]'::jsonb,
    technical_skills JSONB DEFAULT '[]'::jsonb,
    projects JSONB DEFAULT '[]'::jsonb,
    experience JSONB DEFAULT '[]'::jsonb,
    certifications JSONB DEFAULT '[]'::jsonb,
    achievements JSONB DEFAULT '[]'::jsonb,
    hackathons JSONB DEFAULT '[]'::jsonb,
    score_audit JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. JOB DESCRIPTIONS & ALIGNMENT ANALYSES
CREATE TABLE IF NOT EXISTS job_descriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
    job_title VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    raw_job_description TEXT NOT NULL,
    extracted_requirements JSONB,
    skill_alignment JSONB,
    match_score INT,
    missing_critical_skills JSONB,
    recommended_preparation JSONB,
    resume_tailoring_tips JSONB,
    ai_analysis_summary TEXT,
    analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. CAREER ROADMAPS & TASKS
CREATE TABLE IF NOT EXISTS career_roadmaps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
    target_career VARCHAR(255) NOT NULL,
    duration_weeks INT DEFAULT 12,
    overall_progress INT DEFAULT 0,
    weeks JSONB NOT NULL,
    key_milestones JSONB DEFAULT '[]'::jsonb,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. DAILY MISSIONS
CREATE TABLE IF NOT EXISTS daily_missions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    estimated_minutes INT DEFAULT 20,
    is_completed BOOLEAN DEFAULT FALSE,
    target_skill_gap VARCHAR(100),
    action_url VARCHAR(255),
    mission_date DATE DEFAULT CURRENT_DATE
);

-- 11. INTERVIEW SESSIONS & ANSWERS
CREATE TABLE IF NOT EXISTS interview_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
    target_role VARCHAR(255) NOT NULL,
    difficulty VARCHAR(50) DEFAULT 'intermediate',
    mode VARCHAR(20) DEFAULT 'text',
    total_questions INT DEFAULT 5,
    completed_questions INT DEFAULT 0,
    is_finished BOOLEAN DEFAULT FALSE,
    messages JSONB NOT NULL DEFAULT '[]'::jsonb,
    overall_evaluation JSONB,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    finished_at TIMESTAMP WITH TIME ZONE
);

-- 12. VOICE PROFILES
CREATE TABLE IF NOT EXISTS voice_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
    raw_transcript TEXT NOT NULL,
    extracted_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. AI INSIGHTS
CREATE TABLE IF NOT EXISTS ai_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES student_profiles(id) ON DELETE CASCADE,
    insight_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    score_impact INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes for fast querying
CREATE INDEX IF NOT EXISTS idx_student_profiles_user ON student_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_student_skills_student ON student_skills(student_id);
CREATE INDEX IF NOT EXISTS idx_assessments_student ON assessment_attempts(student_id);
CREATE INDEX IF NOT EXISTS idx_projects_student ON projects(student_id);
CREATE INDEX IF NOT EXISTS idx_roadmaps_student ON career_roadmaps(student_id);
CREATE INDEX IF NOT EXISTS idx_daily_missions_student ON daily_missions(student_id);
