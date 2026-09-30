import { NextRequest, NextResponse } from 'next/server';
import { analyzeJobDescriptionWithAI } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { jobDescription, studentSkills = [] } = await req.json();

    if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.trim().length < 20) {
      return NextResponse.json(
        { error: 'Please provide a realistic job description (at least 20 characters).' },
        { status: 400 }
      );
    }

    const analysis = await analyzeJobDescriptionWithAI(jobDescription, studentSkills);

    return NextResponse.json({
      success: true,
      analysis
    });
  } catch (error: any) {
    console.error('API /api/ai/analyze-job error:', error);
    const isApiKeyError = error.message?.includes('GEMINI_API_KEY');
    return NextResponse.json(
      { 
        error: isApiKeyError 
          ? 'GEMINI_API_KEY is not configured in .env.local. Please configure your key for Job Description Analysis.' 
          : (error.message || 'Failed to analyze job description.')
      },
      { status: isApiKeyError ? 503 : 500 }
    );
  }
}
