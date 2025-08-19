'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { aiAnalysis, textGeneration, aiConversation, MISTRAL_MODELS, isHuggingFaceConfigured } from '@/lib/huggingface';

export default function TestAIPage() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Array<{ type: string; content: string; timestamp: Date }>>([]);
  const [selectedModel, setSelectedModel] = useState(MISTRAL_MODELS.MISTRAL_7B);

  const testAIAnalysis = async () => {
    if (!input.trim() || !isHuggingFaceConfigured()) return;
    
    setIsLoading(true);
    try {
      const result = await aiAnalysis(input, selectedModel, 300, 0.7);
      
      setResults(prev => [{
        type: 'AI Analysis',
        content: result.generated_text || 'No response generated',
        timestamp: new Date()
      }, ...prev]);
    } catch (error) {
      console.error('AI Analysis failed:', error);
      setResults(prev => [{
        type: 'Error',
        content: 'AI Analysis failed. Please check your API key and try again.',
        timestamp: new Date()
      }, ...prev]);
    } finally {
      setIsLoading(false);
    }
  };

  const testTextGeneration = async () => {
    if (!input.trim() || !isHuggingFaceConfigured()) return;
    
    setIsLoading(true);
    try {
      const result = await textGeneration(input, selectedModel, 200, 0.7);
      
      setResults(prev => [{
        type: 'Text Generation',
        content: result.generated_text || 'No response generated',
        timestamp: new Date()
      }, ...prev]);
    } catch (error) {
      console.error('Text Generation failed:', error);
      setResults(prev => [{
        type: 'Error',
        content: 'Text Generation failed. Please check your API key and try again.',
        timestamp: new Date()
      }, ...prev]);
    } finally {
      setIsLoading(false);
    }
  };

  const testConversation = async () => {
    if (!input.trim() || !isHuggingFaceConfigured()) return;
    
    setIsLoading(true);
    try {
      const messages = [
        { role: 'user' as const, content: input }
      ];
      
      const result = await aiConversation(messages, selectedModel, 200);
      
      setResults(prev => [{
        type: 'Conversation',
        content: result.generated_text || 'No response generated',
        timestamp: new Date()
      }, ...prev]);
    } catch (error) {
      console.error('Conversation failed:', error);
      setResults(prev => [{
        type: 'Error',
        content: 'Conversation failed. Please check your API key and try again.',
        timestamp: new Date()
      }, ...prev]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  if (!isHuggingFaceConfigured()) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-600">Configuration Required</CardTitle>
              <CardDescription>
                Please create a .env.local file with your HUGGING_FACE_API_KEY to test the AI features.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-red-600">
                Create a file named .env.local in your project root and add:
              </p>
              <code className="block mt-2 p-2 bg-red-100 text-red-800 rounded">
                HUGGING_FACE_API_KEY=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
              </code>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>🧪 Mistral AI Integration Test</CardTitle>
            <CardDescription>
              Test your Hugging Face API integration with Mistral models
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

            {/* Input */}
            <div className="space-y-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter your test prompt here..."
                className="w-full"
              />
              <div className="flex gap-2">
                <Button 
                  onClick={testAIAnalysis}
                  disabled={isLoading || !input.trim()}
                  variant="default"
                >
                  Test AI Analysis
                </Button>
                <Button 
                  onClick={testTextGeneration}
                  disabled={isLoading || !input.trim()}
                  variant="outline"
                >
                  Test Text Generation
                </Button>
                <Button 
                  onClick={testConversation}
                  disabled={isLoading || !input.trim()}
                  variant="outline"
                >
                  Test Conversation
                </Button>
                <Button 
                  onClick={clearResults}
                  variant="ghost"
                  size="sm"
                >
                  Clear Results
                </Button>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
                <span className="text-gray-600">Processing with {selectedModel.split('/').pop()}...</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>
                Results from your AI model tests
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {results.map((result, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      result.type === 'Error' ? 'bg-red-100 text-red-800' :
                      result.type === 'AI Analysis' ? 'bg-blue-100 text-blue-800' :
                      result.type === 'Text Generation' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {result.type}
                    </span>
                    <span className="text-xs text-gray-500">
                      {result.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700 whitespace-pre-wrap">
                    {result.content}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Status */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-green-800">
                ✅ Hugging Face API is configured and ready to use
              </span>
            </div>
            <p className="text-sm text-green-600 mt-2">
              Current model: <code className="bg-green-100 px-1 rounded">{selectedModel}</code>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
