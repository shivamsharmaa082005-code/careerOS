import { NextRequest, NextResponse } from 'next/server';
import { generateRoadmapWithAI } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { targetCareer, skills = [], skillGaps = [], availableHoursPerWeek = 15 } = await req.json();

    if (!targetCareer) {
      return NextResponse.json(
        { error: 'Target career is required to generate a personalized roadmap.' },
        { status: 400 }
      );
    }

    const roadmap = await generateRoadmapWithAI(targetCareer, skills, skillGaps, availableHoursPerWeek);

    return NextResponse.json({
      success: true,
      roadmap
    });
  } catch (error: any) {
    console.error('API /api/ai/generate-roadmap error:', error);
    const isApiKeyError = error.message?.includes('GEMINI_API_KEY');
    return NextResponse.json(
      { 
        error: isApiKeyError 
          ? 'GEMINI_API_KEY is not configured in .env.local. Please configure your key to generate dynamic roadmaps.' 
          : (error.message || 'Failed to generate career roadmap.')
      },
      { status: isApiKeyError ? 503 : 500 }
    );
  }
}
