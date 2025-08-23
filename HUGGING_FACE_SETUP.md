# Hugging Face API Setup

## Environment Configuration

To use the Hugging Face API in this project, you need to create a `.env.local` file in your project root with your API key.

### Step 1: Create Environment File

Create a file named `.env.local` in your project root directory and add:

\`\`\`bash
HUGGING_FACE_API_KEY=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
\`\`\`

### Step 2: Restart Development Server

After creating the `.env.local` file, restart your Next.js development server:

\`\`\`bash
pnpm dev
\`\`\`

**Note:** The application is now configured to run on **localhost:3001** instead of the default port 3000.

## Available Functions

The project now includes several pre-configured Hugging Face functions powered by **Mistral AI models**:

### AI Analysis (Mistral-Powered)
\`\`\`typescript
import { aiAnalysis } from '@/lib/huggingface';

const result = await aiAnalysis("Analyze this text for emotional content", 'mistralai/Mistral-7B-Instruct-v0.2');
\`\`\`

### Text Generation with Mistral
\`\`\`typescript
import { textGeneration } from '@/lib/huggingface';

const result = await textGeneration("Hello, how are you?", 'mistralai/Mistral-7B-Instruct-v0.2');
\`\`\`

### AI Conversation/Chat
\`\`\`typescript
import { aiConversation } from '@/lib/huggingface';

const messages = [
  { role: 'user', content: 'Hello!' },
  { role: 'assistant', content: 'Hi there!' }
];
const result = await aiConversation(messages, 'mistralai/Mistral-7B-Instruct-v0.2');
\`\`\`

### Image Classification
\`\`\`typescript
import { imageClassification } from '@/lib/huggingface';

const result = await imageClassification("https://example.com/image.jpg");
\`\`\`

### Text to Image
\`\`\`typescript
import { textToImage } from '@/lib/huggingface';

const result = await textToImage("A beautiful sunset over mountains");
\`\`\`

## Available Mistral Models

The project includes three pre-configured Mistral models:

- **Mistral 7B**: `mistralai/Mistral-7B-Instruct-v0.2` (Default)
- **Mixtral 8x7B**: `mistralai/Mixtral-8x7B-Instruct-v0.1` (More powerful)
- **Mistral Small**: `mistralai/Mistral-7B-Instruct-v0.1` (Faster)

## New AI Analysis Component

A new **AI Analysis** tab has been added to your journal application that provides:

- **Model Selection**: Choose between different Mistral models
- **Analysis Types**: Single analysis or conversation mode
- **Real-time AI Responses**: Powered by your selected Mistral model
- **Conversation History**: Track your AI interactions

## Security Notes

- The `.env.local` file is already in `.gitignore` and won't be committed to version control
- Never commit API keys to public repositories
- For production, use environment variables in your hosting platform (Vercel, Netlify, etc.)

## API Key

Your Hugging Face API key: `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`

## Next Steps

1. Create the `.env.local` file with your API key
2. Restart your development server with `pnpm dev`
3. Access your application at **http://localhost:3001**
4. Navigate to the new "AI Analysis" tab in your journal
5. Start using Mistral-powered AI analysis and conversations!

## Features

- **Journal AI Analysis**: Automatic emotional analysis of journal entries
- **Interactive AI Chat**: Direct conversations with Mistral models
- **Model Comparison**: Test different Mistral models for various tasks
- **Real-time Responses**: Instant AI-powered insights and analysis
