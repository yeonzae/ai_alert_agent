'use client';

import { StrategyPrompt } from '../../../components/forms/strategy-prompt';
import { StrategyPreview } from '../../../components/preview/strategy-preview';

export default function NewStrategyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI Alert Agent
          </h1>
          <p className="text-lg text-gray-600">
            Create intelligent investment alerts with natural language
          </p>
        </div>
        
        <div className="space-y-6">
          <StrategyPrompt />
          <StrategyPreview />
        </div>
        
        <div className="text-center mt-12 text-sm text-gray-500">
          <p>Built with Next.js, TypeScript, and OpenAI</p>
        </div>
      </div>
    </div>
  );
}