import { NextRequest, NextResponse } from 'next/server';
import { generateInterviewQuestionWithAI, evaluateInterviewAnswerWithAI } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'generate_question') {
      const { targetRole = 'Software Engineer', difficulty = 'intermediate', questionNumber = 1, previousMessages = [] } = body;
      const questionData = await generateInterviewQuestionWithAI(targetRole, difficulty, questionNumber, previousMessages);
      return NextResponse.json({ success: true, ...questionData });
    }

    if (action === 'evaluate_answer') {
      const { targetRole = 'Software Engineer', question, studentAnswer } = body;
      if (!question || !studentAnswer) {
        return NextResponse.json(
          { error: 'Question and student answer are required for evaluation.' },
          { status: 400 }
        );
      }
      const evaluation = await evaluateInterviewAnswerWithAI(targetRole, question, studentAnswer);
      return NextResponse.json({ success: true, evaluation });
    }

    return NextResponse.json({ error: 'Invalid action. Specify generate_question or evaluate_answer.' }, { status: 400 });
  } catch (error: any) {
    console.error('API /api/ai/interview error:', error);
    const isApiKeyError = error.message?.includes('GEMINI_API_KEY');
    return NextResponse.json(
      { 
        error: isApiKeyError 
          ? 'GEMINI_API_KEY is not configured in .env.local. Please configure your key to conduct AI Mock Interviews.' 
          : (error.message || 'Failed to process AI interview.')
      },
      { status: isApiKeyError ? 503 : 500 }
    );
  }
}
