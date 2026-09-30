import { NextRequest, NextResponse } from 'next/server';
import { extractProfileFromTranscript } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { transcript } = await req.json();

    if (!transcript || typeof transcript !== 'string' || transcript.trim().length < 5) {
      return NextResponse.json(
        { error: 'Please provide a valid spoken introduction or text transcript.' },
        { status: 400 }
      );
    }

    // Call real Gemini API
    const extractedData = await extractProfileFromTranscript(transcript);

    return NextResponse.json({
      success: true,
      extractedData,
      rawTranscript: transcript
    });
  } catch (error: any) {
    console.error('API /api/ai/extract-profile error:', error);
    const isApiKeyError = error.message?.includes('GEMINI_API_KEY');
    return NextResponse.json(
      { 
        error: isApiKeyError 
          ? 'GEMINI_API_KEY is not configured in .env.local. Please add your real Gemini API key to activate AI profile extraction.' 
          : (error.message || 'Failed to extract profile from transcript.')
      },
      { status: isApiKeyError ? 503 : 500 }
    );
  }
}
