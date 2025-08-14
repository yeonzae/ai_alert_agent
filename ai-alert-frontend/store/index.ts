import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Strategy, StrategyDraftResponse } from '../types/strategy';

interface StrategyState {
  currentStrategy: Strategy | null;
  isGenerating: boolean;
  error: string | null;
  confidence: number;
  warnings: string[];
  suggestions: string[];
  
  // Actions
  generateStrategy: (prompt: string) => Promise<void>;
  clearStrategy: () => void;
  setError: (error: string | null) => void;
}

export const useStrategyStore = create<StrategyState>()(
  devtools(
    (set, get) => ({
      currentStrategy: null,
      isGenerating: false,
      error: null,
      confidence: 0,
      warnings: [],
      suggestions: [],
      
      generateStrategy: async (prompt: string) => {
        set({ isGenerating: true, error: null });
        
        try {
          const response = await fetch('http://localhost:3001/api/ai/strategy/draft', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt }),
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            throw new Error(data.error || 'Failed to generate strategy');
          }
          
          if (data.success && data.data) {
            set({
              currentStrategy: data.data.strategy,
              confidence: data.data.confidence || 0,
              warnings: data.data.warnings || [],
              suggestions: data.data.suggestions || [],
              error: null
            });
          } else {
            throw new Error('Invalid response format');
          }
          
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          set({ 
            error: errorMessage,
            currentStrategy: null,
            confidence: 0,
            warnings: [],
            suggestions: []
          });
        } finally {
          set({ isGenerating: false });
        }
      },
      
      clearStrategy: () => {
        set({
          currentStrategy: null,
          error: null,
          confidence: 0,
          warnings: [],
          suggestions: []
        });
      },
      
      setError: (error: string | null) => {
        set({ error });
      }
    }),
    {
      name: 'strategy-store',
    }
  )
);