import { NextRequest, NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';

// Initialize Hugging Face client on the server side
const hf = new HfInference(process.env.HUGGING_FACE_API_KEY);

// System prompts for better AI responses
const SYSTEM_PROMPTS = {
  ANALYSIS: `You are an expert AI analyst specializing in personal development and emotional intelligence. 
Your role is to provide thoughtful, empathetic, and actionable analysis of user input.

When analyzing text, please:
1. Identify key themes and emotions
2. Provide thoughtful observations and insights
3. Offer specific, actionable improvement suggestions
4. Maintain a supportive and encouraging tone
5. Structure your response clearly with sections for observations, insights, and recommendations
6. Be specific and avoid generic advice
7. Consider the context and emotional state of the user

Format your response in a helpful, structured manner that the user can easily understand and act upon.`,

  CONVERSATION: `You are a supportive AI companion having a natural conversation. 
Maintain context from previous messages, be engaging, and provide helpful responses.
Keep your responses conversational while being informative and supportive.`,

  GENERAL: `You are a helpful AI assistant. Provide clear, accurate, and helpful responses to user queries.`
};

// Available models
const MODELS = {
  DIALOGPT: 'microsoft/DialoGPT-medium',
  GPT2: 'gpt2',
  GPT2_MEDIUM: 'gpt2-medium',
} as const;

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.HUGGING_FACE_API_KEY) {
      return NextResponse.json(
        { error: 'Hugging Face API key not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { 
      prompt, 
      model = MODELS.DIALOGPT, 
      maxTokens = 500, 
      temperature = 0.7, 
      customSystemPrompt,
      analysisType = 'single'
    } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    console.log('Processing AI request:', { prompt, model, analysisType });

    // Use custom prompt if provided, otherwise use default based on type
    const systemPrompt = customSystemPrompt || SYSTEM_PROMPTS[analysisType.toUpperCase() as keyof typeof SYSTEM_PROMPTS] || SYSTEM_PROMPTS.ANALYSIS;
    
    // Construct the full prompt with system instructions
    let fullPrompt: string;
    
    if (analysisType === 'conversation') {
      fullPrompt = `System: ${systemPrompt}

User: ${prompt}

Assistant:`;
    } else {
      fullPrompt = `System: ${systemPrompt}

User Input: ${prompt}

Please provide a comprehensive analysis following the guidelines above.`;
    }

    console.log('Calling Hugging Face API with prompt:', fullPrompt);

    // Call Hugging Face API
    const result = await hf.textGeneration({
      model,
      inputs: fullPrompt,
      parameters: {
        max_new_tokens: maxTokens,
        temperature: temperature,
        top_p: 0.9,
        do_sample: true,
        return_full_text: false,
      },
    });

    console.log('API response received:', result);

    return NextResponse.json({
      success: true,
      generated_text: result.generated_text,
      model: model,
      analysis_type: analysisType
    });

  } catch (error) {
    console.error('AI Analysis API error:', error);
    
    // Try fallback model if main model fails
    try {
      console.log('Trying fallback model: gpt2');
      const fallbackResult = await hf.textGeneration({
        model: 'gpt2',
        inputs: body?.prompt || 'Hello',
        parameters: {
          max_new_tokens: 100,
          return_full_text: false,
        },
      });
      
      return NextResponse.json({
        success: true,
        generated_text: fallbackResult.generated_text,
        model: 'gpt2 (fallback)',
        analysis_type: 'fallback'
      });
      
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
      
      return NextResponse.json(
        { 
          error: 'AI analysis failed',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      );
    }
  }
}

// Test endpoint
export async function GET() {
  try {
    if (!process.env.HUGGING_FACE_API_KEY) {
      return NextResponse.json(
        { error: 'Hugging Face API key not configured' },
        { status: 500 }
      );
    }

    // Simple test with GPT-2
    const result = await hf.textGeneration({
      model: 'gpt2',
      inputs: 'Hello',
      parameters: {
        max_new_tokens: 10,
        return_full_text: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'API connection successful',
      test_response: result.generated_text
    });

  } catch (error) {
    console.error('Test endpoint error:', error);
    return NextResponse.json(
      { 
        error: 'Test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
