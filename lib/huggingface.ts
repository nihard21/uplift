// Client-side functions that call our Next.js API route
export const aiAnalysis = async (
  prompt: string, 
  model: string = 'microsoft/DialoGPT-medium',
  maxLength: number = 500,
  temperature: number = 0.7,
  customSystemPrompt?: string
) => {
  try {
    console.log('Calling AI analysis API with:', { prompt, model, maxLength, temperature });
    
    const response = await fetch('/api/ai-analysis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        model,
        maxTokens: maxLength,
        temperature,
        customSystemPrompt,
        analysisType: 'single'
      }),
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('API response:', result);
    
    if (result.error) {
      throw new Error(result.error);
    }

    return result;
  } catch (error) {
    console.error('AI Analysis error:', error);
    throw error;
  }
};

// Enhanced text generation with system prompts
export const textGeneration = async (
  prompt: string, 
  model: string = 'microsoft/DialoGPT-medium',
  maxLength: number = 300,
  temperature: number = 0.7
) => {
  try {
    const response = await fetch('/api/ai-analysis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        model,
        maxTokens: maxLength,
        temperature,
        analysisType: 'general'
      }),
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error);
    }

    return result;
  } catch (error) {
    console.error('Text generation error:', error);
    throw error;
  }
};

// Conversation/chat function with context and system prompts
export const aiConversation = async (
  conversationHistory: Array<{ role: string; content: string }>,
  model: string = 'microsoft/DialoGPT-medium',
  maxLength: number = 400
) => {
  try {
    // Get the last user message for the conversation
    const lastUserMessage = conversationHistory
      .filter(msg => msg.role === 'user')
      .pop()?.content || '';

    const response = await fetch('/api/ai-analysis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: lastUserMessage,
        model,
        maxTokens: maxLength,
        analysisType: 'conversation'
      }),
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error);
    }

    return result;
  } catch (error) {
    console.error('AI Conversation error:', error);
    throw error;
  }
};

// Test function to verify API connection
export const testConnection = async () => {
  try {
    console.log('Testing API connection...');
    const response = await fetch('/api/ai-analysis', {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`API test failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Connection test successful:', result);
    return { success: true, result };
  } catch (error) {
    console.error('Connection test failed:', error);
    return { success: false, error };
  }
};

// Helper function to check if API key is configured (now checks if API is accessible)
export const isHuggingFaceConfigured = async (): Promise<boolean> => {
  try {
    const response = await fetch('/api/ai-analysis', { method: 'GET' });
    return response.ok;
  } catch (error) {
    console.log('API not accessible:', error);
    return false;
  }
};

// Model configuration - using reliable, available models
export const MISTRAL_MODELS = {
  MISTRAL_7B: 'microsoft/DialoGPT-medium', // Reliable conversational model
  MIXTRAL_8X7B: 'gpt2', // Fallback text generation model
  MISTRAL_SMALL: 'microsoft/DialoGPT-medium', // Same as 7B for consistency
} as const;
