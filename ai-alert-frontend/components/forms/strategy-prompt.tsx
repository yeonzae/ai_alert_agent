'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useStrategyStore } from '../../store';

const EXAMPLE_PROMPTS = [
  "Alert me when Bitcoin goes up 5% in an hour",
  "Notify me when Tesla drops more than 3% today",
  "Tell me when Ethereum volume is high and price increases 2%",
  "Send alert if Apple stock moves 4% with high volume"
];

export function StrategyPrompt() {
  const [prompt, setPrompt] = useState('');
  const { generateStrategy, isGenerating, error } = useStrategyStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      await generateStrategy(prompt.trim());
    }
  };

  const handleExampleClick = (examplePrompt: string) => {
    setPrompt(examplePrompt);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto" glass>
      <CardHeader>
        <CardTitle className="text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Create Your Alert Strategy
        </CardTitle>
        <p className="text-center text-gray-600 text-sm">
          Describe what you want to be alerted about in plain English
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Example Prompts */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">Try these examples:</p>
          <div className="grid gap-2">
            {EXAMPLE_PROMPTS.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example)}
                className="text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
              Your Alert Strategy
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Example: Alert me when Bitcoin goes up 5% in an hour"
              className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              required
              minLength={10}
              maxLength={500}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Minimum 10 characters</span>
              <span>{prompt.length}/500</span>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={isGenerating}
            disabled={!prompt.trim() || prompt.length < 10}
          >
            {isGenerating ? 'Generating Strategy...' : 'Generate Strategy'}
          </Button>
        </form>

        <div className="text-center text-xs text-gray-500">
          🤖 Powered by AI - Your strategy will be generated in seconds
        </div>
      </CardContent>
    </Card>
  );
}