'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { aiAnalysis, aiConversation, MISTRAL_MODELS, isHuggingFaceConfigured } from '@/lib/huggingface';

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

  const handleSingleAnalysis = async () => {
    if (!input.trim() || !isHuggingFaceConfigured()) return;
    
    setIsLoading(true);
    try {
      const userMessage: Message = {
        role: 'user',
        content: input,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      const result = await aiAnalysis(input, selectedModel, 500, 0.7);
      
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
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConversation = async () => {
    if (!input.trim() || !isHuggingFaceConfigured()) return;
    
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
      
      const result = await aiConversation(conversationHistory, selectedModel, 400);
      
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

  if (!isHuggingFaceConfigured()) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-red-600">Configuration Required</CardTitle>
          <CardDescription>
            Please create a .env.local file with your HUGGING_FACE_API_KEY to use this feature.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🤖 Mistral AI Analysis</CardTitle>
          <CardDescription>
            Powered by Mistral models from Hugging Face. Choose your preferred model and analysis type.
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
              Mistral 7B
            </Button>
            <Button
              variant={selectedModel === MISTRAL_MODELS.MIXTRAL_8X7B ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedModel(MISTRAL_MODELS.MIXTRAL_8X7B)}
            >
              Mixtral 8x7B
            </Button>
            <Button
              variant={selectedModel === MISTRAL_MODELS.MISTRAL_SMALL ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedModel(MISTRAL_MODELS.MISTRAL_SMALL)}
            >
              Mistral Small
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
