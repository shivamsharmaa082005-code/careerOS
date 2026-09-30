import { NextRequest, NextResponse } from 'next/server';
import { analyzeResumeWithAI } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { resumeData, targetCareer = 'Software Engineer' } = await req.json();

    if (!resumeData) {
      return NextResponse.json(
        { error: 'Resume text or structure is required.' },
        { status: 400 }
      );
    }

    const analysis = await analyzeResumeWithAI(resumeData, targetCareer);

    return NextResponse.json({
      success: true,
      analysis
    });
  } catch (error: any) {
    console.error('API /api/ai/analyze-resume error:', error);
    const isApiKeyError = error.message?.includes('GEMINI_API_KEY');
    return NextResponse.json(
      { 
        error: isApiKeyError 
          ? 'GEMINI_API_KEY is not configured in .env.local. Please configure your API key to analyze resumes.' 
          : (error.message || 'Failed to analyze resume.')
      },
      { status: isApiKeyError ? 503 : 500 }
    );
  }
}
