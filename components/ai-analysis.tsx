'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { aiAnalysis, aiConversation, MISTRAL_MODELS, isHuggingFaceConfigured, testConnection } from '@/lib/huggingface';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function AIAnalysis() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedModel, setSelectedModel] = useState(MISTRAL_MODELS.MISTRAL_7B);
  const [analysisType, setAnalysisType] = useState<'single' | 'conversation'>('single');
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);
  
  // AI Configuration options
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(500);
  const [customPrompt, setCustomPrompt] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState('default');

  // Check configuration on component mount
  useEffect(() => {
    const checkConfig = () => {
      const configured = isHuggingFaceConfigured();
      setIsConfigured(configured);
    };
    checkConfig();
  }, []);

  // Preset system prompts for common use cases
  const PRESET_PROMPTS = {
    default: 'Use default AI instructions',
    personalDevelopment: `You are a life coach specializing in personal growth and habit formation. 
Your role is to analyze user input and provide:
1. **Current State Assessment**: What patterns or behaviors are visible?
2. **Root Cause Analysis**: What underlying factors might be driving these patterns?
3. **Actionable Steps**: 3-5 specific, measurable actions they can take this week
4. **Progress Tracking**: How to measure improvement
5. **Encouragement**: Motivational support tailored to their situation

Use a warm, supportive tone. Be specific and avoid generic advice.`,
    
    creativeWriting: `You are a professional writing coach with expertise in creative fiction. 
When reviewing writing samples, provide feedback on:
1. **Structure**: Plot flow, scene organization, pacing
2. **Character Development**: Depth, motivation, dialogue authenticity
3. **Language**: Word choice, sentence variety, imagery
4. **Genre Conventions**: Adherence to and subversion of genre expectations
5. **Specific Improvements**: Line-by-line suggestions for key passages

Be constructive and specific. Point out strengths as well as areas for improvement.`,
    
    technicalSupport: `You are a senior software engineer specializing in debugging and system optimization.
When analyzing technical issues:
1. **Problem Identification**: Clearly state what the issue appears to be
2. **Root Cause Analysis**: Identify the underlying technical cause
3. **Solution Options**: Provide 2-3 different approaches with pros/cons
4. **Implementation Steps**: Step-by-step instructions for the recommended solution
5. **Prevention**: How to avoid similar issues in the future

Use clear, technical language but explain complex concepts. Include code examples when relevant.`,
    
    businessAnalysis: `You are a business consultant specializing in strategic analysis and growth planning.
When analyzing business situations:
1. **Situation Overview**: Summarize the current business context
2. **Key Challenges**: Identify the main obstacles or opportunities
3. **Strategic Options**: Present 2-3 strategic approaches with pros/cons
4. **Implementation Roadmap**: Outline a step-by-step execution plan
5. **Success Metrics**: Define how to measure progress and success

Be analytical yet practical. Focus on actionable insights and measurable outcomes.`,
    
    emotionalIntelligence: `You are an emotional intelligence coach specializing in self-awareness and relationship skills.
When analyzing emotional situations:
1. **Emotional State**: Identify the primary emotions and their intensity
2. **Triggers & Patterns**: What events or thoughts are causing these emotions?
3. **Perspective Taking**: How might others view this situation differently?
4. **Regulation Strategies**: Specific techniques to manage these emotions
5. **Growth Opportunities**: How can this situation contribute to emotional growth?

Use an empathetic, non-judgmental tone. Validate feelings while encouraging self-reflection.`
  };

  const handlePresetChange = (preset: string) => {
    setSelectedPreset(preset);
    if (preset === 'default') {
      setCustomPrompt('');
    } else {
      setCustomPrompt(PRESET_PROMPTS[preset as keyof typeof PRESET_PROMPTS]);
    }
  };

  const handleSingleAnalysis = async () => {
    if (!input.trim()) return;
    
    // Check configuration before proceeding
    if (!isConfigured) {
      console.error('Hugging Face not configured');
      return;
    }
    
    setIsLoading(true);
    try {
      const userMessage: Message = {
        role: 'user',
        content: input,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      console.log('Calling AI analysis with:', {
        input,
        model: selectedModel,
        maxTokens,
        temperature,
        customPrompt: customPrompt || 'default'
      });
      
      const result = await aiAnalysis(input, selectedModel, maxTokens, temperature, customPrompt || undefined);
      
      console.log('AI analysis result:', result);
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: result.generated_text || 'No response generated',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setInput('');
    } catch (error) {
      console.error('Analysis failed:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}. Check console for details.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConversation = async () => {
    if (!input.trim()) return;
    
    // Check configuration before proceeding
    if (!isConfigured) {
      console.error('Hugging Face not configured');
      return;
    }
    
    setIsLoading(true);
    try {
      const userMessage: Message = {
        role: 'user',
        content: input,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      // Prepare conversation history for Mistral
      const conversationHistory = [...messages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content,
      }));
      
      const result = await aiConversation(conversationHistory, selectedModel, maxTokens);
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: result.generated_text || 'No response generated',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setInput('');
    } catch (error) {
      console.error('Conversation failed:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearConversation = () => {
    setMessages([]);
  };

  if (isConfigured === null) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-red-600">Loading Configuration...</CardTitle>
          <CardDescription>
            Checking Hugging Face API configuration.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div>Checking API Key...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isConfigured) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-red-600">Configuration Required</CardTitle>
          <CardDescription>
            Please create a .env.local file with your NEXT_PUBLIC_HUGGING_FACE_API_KEY to use this feature.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div>Current API Key Status: {process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY ? '✅ Found' : '❌ Missing'}</div>
            <div>API Key Length: {process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY?.length || 0}</div>
            <div className="text-xs text-gray-500">
              Make sure to restart your development server after creating the .env.local file.
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🤖 AI Analysis & Conversation</CardTitle>
          <CardDescription>
            Powered by Hugging Face models. Choose your preferred model and analysis type.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Model Selection */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedModel === MISTRAL_MODELS.MISTRAL_7B ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedModel(MISTRAL_MODELS.MISTRAL_7B)}
            >
              DistilGPT-2
            </Button>
            <Button
              variant={selectedModel === MISTRAL_MODELS.MIXTRAL_8X7B ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedModel(MISTRAL_MODELS.MIXTRAL_8X7B)}
            >
              BlenderBot
            </Button>
            <Button
              variant={selectedModel === MISTRAL_MODELS.MISTRAL_SMALL ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedModel(MISTRAL_MODELS.MISTRAL_SMALL)}
            >
              DialoGPT Small
            </Button>
          </div>

          {/* Analysis Type Selection */}
          <div className="flex gap-2">
            <Button
              variant={analysisType === 'single' ? "default" : "outline"}
              size="sm"
              onClick={() => setAnalysisType('single')}
            >
              Single Analysis
            </Button>
            <Button
              variant={analysisType === 'conversation' ? "default" : "outline"}
              size="sm"
              onClick={() => setAnalysisType('conversation')}
            >
              Conversation Mode
            </Button>
          </div>

          {/* Advanced Configuration Toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? 'Hide' : 'Show'} Advanced Settings
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                console.log('Testing connection...');
                const result = await testConnection();
                console.log('Test result:', result);
                if (result.success) {
                  alert('✅ Connection successful! Check console for details.');
                } else {
                  alert('❌ Connection failed! Check console for details.');
                }
              }}
            >
              Test Connection
            </Button>
          </div>

          {/* Advanced Configuration */}
          {showAdvanced && (
            <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Temperature: {temperature}</label>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Lower = more focused, Higher = more creative
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Max Tokens: {maxTokens}</label>
                  <input
                    type="range"
                    min="100"
                    max="1000"
                    step="50"
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Controls response length
                  </div>
                </div>
              </div>
              
              {/* Preset System Prompts */}
              <div>
                <label className="block text-sm font-medium mb-2">Preset System Prompts</label>
                <select
                  value={selectedPreset}
                  onChange={(e) => handlePresetChange(e.target.value)}
                  className="w-full p-2 border rounded-md text-sm"
                >
                  <option value="default">Default AI Instructions</option>
                  <option value="personalDevelopment">Personal Development Coach</option>
                  <option value="creativeWriting">Creative Writing Coach</option>
                  <option value="technicalSupport">Technical Support Engineer</option>
                  <option value="businessAnalysis">Business Consultant</option>
                  <option value="emotionalIntelligence">Emotional Intelligence Coach</option>
                </select>
                <div className="text-xs text-gray-500 mt-1">
                  Quick preset prompts for common use cases
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Custom System Prompt (Optional)</label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Override default AI instructions with your own..."
                  className="w-full p-2 border rounded-md text-sm"
                  rows={3}
                />
                <div className="text-xs text-gray-500 mt-1">
                  Leave empty to use default instructions, or modify the preset above
                </div>
              </div>
            </div>
          )}

          {/* Input and Submit */}
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything or describe what you'd like me to analyze..."
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && (analysisType === 'single' ? handleSingleAnalysis() : handleConversation())}
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              onClick={analysisType === 'single' ? handleSingleAnalysis : handleConversation}
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? 'Thinking...' : 'Send'}
            </Button>
          </div>

          {/* Clear Button */}
          {messages.length > 0 && (
            <Button variant="outline" onClick={clearConversation} size="sm">
              Clear Conversation
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Messages Display */}
      {messages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Conversation History</CardTitle>
            <CardDescription>
              {analysisType === 'single' ? 'Single analysis responses' : 'Full conversation thread'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="text-sm font-medium mb-1">
                    {message.role === 'user' ? 'You' : 'Mistral AI'}
                  </div>
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  <div className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
