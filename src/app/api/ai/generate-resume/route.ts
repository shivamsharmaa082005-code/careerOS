import { NextRequest, NextResponse } from 'next/server';
import { generateResumeWithAI } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { profileData, template = 'modern' } = await req.json();

    if (!profileData) {
      return NextResponse.json(
        { error: 'Profile data is required to generate resume.' },
        { status: 400 }
      );
    }

    const generatedResume = await generateResumeWithAI(profileData, template);

    return NextResponse.json({
      success: true,
      resume: generatedResume
    });
  } catch (error: any) {
    console.error('API /api/ai/generate-resume error:', error);
    const isApiKeyError = error.message?.includes('GEMINI_API_KEY');
    return NextResponse.json(
      { 
        error: isApiKeyError 
          ? 'GEMINI_API_KEY is not configured in .env.local. Please configure it to generate AI resumes.' 
          : (error.message || 'Failed to generate resume.')
      },
      { status: isApiKeyError ? 503 : 500 }
    );
  }
}
