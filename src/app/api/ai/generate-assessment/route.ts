import { NextRequest, NextResponse } from 'next/server';
import { generateAssessmentQuestionsWithAI } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { skillName = 'Python', topic = 'Core Principles', difficulty = 'intermediate', count = 5 } = await req.json();

    const data = await generateAssessmentQuestionsWithAI(skillName, topic, difficulty, count);

    return NextResponse.json({
      success: true,
      data
    });
  } catch (error: any) {
    console.error('API /api/ai/generate-assessment error:', error);
    const isApiKeyError = error.message?.includes('GEMINI_API_KEY');
    return NextResponse.json(
      { 
        error: isApiKeyError 
          ? 'GEMINI_API_KEY is not configured in .env.local. Please configure your key to generate AI assessment questions.' 
          : (error.message || 'Failed to generate assessment questions.')
      },
      { status: isApiKeyError ? 503 : 500 }
    );
  }
}
