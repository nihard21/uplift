import { HfInference } from '@huggingface/inference';

// Initialize the Hugging Face client
export const hf = new HfInference(process.env.HUGGING_FACE_API_KEY);

// Helper function to check if API key is configured
export const isHuggingFaceConfigured = (): boolean => {
  return !!process.env.HUGGING_FACE_API_KEY;
};

// Mistral model configuration
export const MISTRAL_MODELS = {
  MISTRAL_7B: 'mistralai/Mistral-7B-Instruct-v0.2',
  MIXTRAL_8X7B: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
  MISTRAL_SMALL: 'mistralai/Mistral-7B-Instruct-v0.1',
} as const;

// AI Analysis function using Mistral
export const aiAnalysis = async (
  prompt: string, 
  model: string = MISTRAL_MODELS.MISTRAL_7B,
  maxTokens: number = 500,
  temperature: number = 0.7
) => {
  try {
    const result = await hf.textGeneration({
      model,
      inputs: prompt,
      parameters: {
        max_new_tokens: maxTokens,
        temperature: temperature,
        top_p: 0.9,
        do_sample: true,
        return_full_text: false,
      },
    });
    return result;
  } catch (error) {
    console.error('AI Analysis error:', error);
    throw error;
  }
};

// Enhanced text generation with Mistral
export const textGeneration = async (
  prompt: string, 
  model: string = MISTRAL_MODELS.MISTRAL_7B,
  maxTokens: number = 300,
  temperature: number = 0.7
) => {
  try {
    const result = await hf.textGeneration({
      model,
      inputs: prompt,
      parameters: {
        max_new_tokens: maxTokens,
        temperature: temperature,
        top_p: 0.9,
        do_sample: true,
        return_full_text: false,
      },
    });
    return result;
  } catch (error) {
    console.error('Text generation error:', error);
    throw error;
  }
};

// Conversation/chat function using Mistral
export const aiConversation = async (
  messages: Array<{ role: 'user' | 'assistant', content: string }>,
  model: string = MISTRAL_MODELS.MISTRAL_7B,
  maxTokens: number = 400
) => {
  try {
    // Format messages for Mistral instruction format
    const formattedPrompt = messages.map(msg => 
      `${msg.role === 'user' ? 'USER:' : 'ASSISTANT:'} ${msg.content}`
    ).join('\n') + '\nASSISTANT:';
    
    const result = await hf.textGeneration({
      model,
      inputs: formattedPrompt,
      parameters: {
        max_new_tokens: maxTokens,
        temperature: 0.7,
        top_p: 0.9,
        do_sample: true,
        return_full_text: false,
      },
    });
    return result;
  } catch (error) {
    console.error('AI Conversation error:', error);
    throw error;
  }
};

// Image Classification
export const imageClassification = async (imageUrl: string, model: string = 'google/vit-base-patch16-224') => {
  try {
    const result = await hf.imageClassification({
      model,
      inputs: imageUrl,
    });
    return result;
  } catch (error) {
    console.error('Image classification error:', error);
    throw error;
  }
};

// Text to Image
export const textToImage = async (prompt: string, model: string = 'stabilityai/stable-diffusion-2') => {
  try {
    const result = await hf.textToImage({
      model,
      inputs: prompt,
      parameters: {
        negative_prompt: 'blurry, low quality, distorted',
      },
    });
    return result;
  } catch (error) {
    console.error('Text to image error:', error);
    throw error;
  }
};
