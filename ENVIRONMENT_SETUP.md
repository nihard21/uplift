# Environment Setup for AI Analysis

## Quick Setup

To get your AI analysis working, you need to create a `.env.local` file in your project root with your Hugging Face API key.

### 1. Get a Hugging Face API Key

1. Go to [Hugging Face](https://huggingface.co/)
2. Sign up or log in
3. Go to your profile → Settings → Access Tokens
4. Create a new token with "read" permissions
5. Copy the token

### 2. Create Environment File

Create a file called `.env.local` in your project root (same level as `package.json`):

\`\`\`bash
# .env.local
HUGGING_FACE_API_KEY=your_api_key_here
\`\`\`

**Important**: 
- Use `HUGGING_FACE_API_KEY` (no NEXT_PUBLIC_ prefix needed)
- No quotes around the API key
- No spaces around the `=` sign

### 3. Restart Your Development Server

After creating the `.env.local` file, restart your Next.js development server:

\`\`\`bash
npm run dev
# or
pnpm dev
\`\`\`

## Why This Fixes the Issue

The previous implementation had several problems:

1. **CORS Issues**: Trying to call Hugging Face API directly from the browser caused 404 errors
2. **Client-side limitations**: Environment variables with NEXT_PUBLIC_ prefix expose API keys to the browser
3. **Network restrictions**: Hugging Face Inference API isn't designed for direct browser calls

## Current Implementation

Now you're using:
- **Server-side API route**: `/api/ai-analysis` handles all Hugging Face calls
- **Secure API keys**: Environment variables stay on the server
- **Proper error handling**: Fallback models and better error messages
- **System prompts**: AI receives detailed instructions for better responses

## How It Works

1. **Client sends request** to `/api/ai-analysis`
2. **Server validates** the Hugging Face API key
3. **Server calls Hugging Face** with your prompt and system instructions
4. **Server returns response** to the client
5. **No CORS issues** since it's all server-to-server communication

## Testing

Once set up, try:
1. Type a simple question like "How can I improve my productivity?"
2. Select different models to see the difference
3. Use the preset prompts in Advanced Settings
4. Adjust temperature and max tokens
5. Click "Test Connection" to verify everything works

The AI should now give you much better, structured responses based on the system prompts!
