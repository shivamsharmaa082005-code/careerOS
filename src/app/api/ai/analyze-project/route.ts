import { NextRequest, NextResponse } from 'next/server';
import { analyzeProjectWithAI } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { title, tagline, description, githubUrl, liveUrl, techStack } = await req.json();

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Project title and description are required.' },
        { status: 400 }
      );
    }

    const evaluation = await analyzeProjectWithAI({
      title,
      tagline,
      description,
      githubUrl,
      liveUrl,
      techStack: Array.isArray(techStack) ? techStack : [techStack].filter(Boolean)
    });

    return NextResponse.json({
      success: true,
      evaluation
    });
  } catch (error: any) {
    console.error('API /api/ai/analyze-project error:', error);
    const isApiKeyError = error.message?.includes('GEMINI_API_KEY');
    return NextResponse.json(
      { 
        error: isApiKeyError 
          ? 'GEMINI_API_KEY is not configured in .env.local. Please configure your key for Project Evaluation.' 
          : (error.message || 'Failed to analyze project.')
      },
      { status: isApiKeyError ? 503 : 500 }
    );
  }
}
