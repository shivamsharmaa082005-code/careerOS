import { NextRequest, NextResponse } from 'next/server';
import { chatWithCareerCopilot } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { message, studentContext, history = [] } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'A prompt message is required.' },
        { status: 400 }
      );
    }

    const aiResponse = await chatWithCareerCopilot(message, studentContext, history);

    return NextResponse.json({
      success: true,
      response: aiResponse
    });
  } catch (error: any) {
    console.error('API /api/ai/copilot error:', error);
    const isApiKeyError = error.message?.includes('GEMINI_API_KEY');
    return NextResponse.json(
      { 
        error: isApiKeyError 
          ? 'GEMINI_API_KEY is not configured in .env.local. Please configure your key to chat with Career Copilot.' 
          : (error.message || 'Failed to process AI Career Copilot response.')
      },
      { status: isApiKeyError ? 503 : 500 }
    );
  }
}
