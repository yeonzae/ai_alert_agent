import axios from 'axios';
import { config } from '../../config/environment';
import { Strategy } from '../../models/strategy/types';
import { getPromptWithExamples } from './prompt-templates';

interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

interface StrategyGenerationResult {
  strategy: Partial<Strategy>;
  confidence: number;
  warnings: string[];
}

export class GPTClient {
  private apiKey: string;
  private apiUrl: string;

  constructor() {
    this.apiKey = config.GPT_API_KEY;
    this.apiUrl = config.OPENAI_API_URL;
    
    if (!this.apiKey) {
      console.warn('Warning: GPT_API_KEY not set. Strategy generation will use mock data.');
    }
  }

  async generateStrategy(prompt: string): Promise<StrategyGenerationResult> {
    if (!this.apiKey) {
      return this.getMockStrategy(prompt);
    }

    try {
      const systemPrompt = getPromptWithExamples(prompt);
      
      const response = await axios.post<OpenAIResponse>(
        `${this.apiUrl}/chat/completions`,
        {
          model: 'gpt-4',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          max_tokens: 1000,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );

      const content = response.data.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response content from OpenAI');
      }

      return this.parseGPTResponse(content);
    } catch (error) {
      console.error('GPT API Error:', error);
      
      // Fallback to mock data if API fails
      return this.getMockStrategy(prompt);
    }
  }

  private parseGPTResponse(content: string): StrategyGenerationResult {
    try {
      // Clean up the response - remove any markdown or extra text
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : content;
      
      const parsed = JSON.parse(jsonStr);
      
      return {
        strategy: {
          ...parsed,
          id: this.generateId(),
          createdAt: new Date(),
          updatedAt: new Date(),
          isActive: false
        },
        confidence: 0.85,
        warnings: this.validateStrategy(parsed)
      };
    } catch (error) {
      console.error('Failed to parse GPT response:', error);
      return {
        strategy: this.getBasicMockStrategy(),
        confidence: 0.3,
        warnings: ['Failed to parse AI response, using basic template']
      };
    }
  }

  private validateStrategy(strategy: any): string[] {
    const warnings: string[] = [];
    
    if (!strategy.nodes || strategy.nodes.length === 0) {
      warnings.push('Strategy has no nodes defined');
    }
    
    const hasTrigger = strategy.nodes?.some((node: any) => node.type === 'trigger');
    if (!hasTrigger) {
      warnings.push('Strategy missing trigger condition');
    }
    
    const hasAction = strategy.nodes?.some((node: any) => node.type === 'action');
    if (!hasAction) {
      warnings.push('Strategy missing action condition');
    }
    
    if (!strategy.risk || !strategy.risk.cooldown_minutes) {
      warnings.push('Risk settings incomplete');
    }
    
    return warnings;
  }

  private getMockStrategy(prompt: string): StrategyGenerationResult {
    const isPrice = prompt.toLowerCase().includes('price') || prompt.toLowerCase().includes('goes up') || prompt.toLowerCase().includes('drops');
    const isCrypto = prompt.toLowerCase().includes('bitcoin') || prompt.toLowerCase().includes('btc') || prompt.toLowerCase().includes('ethereum') || prompt.toLowerCase().includes('crypto');
    const isStock = prompt.toLowerCase().includes('tesla') || prompt.toLowerCase().includes('apple') || prompt.toLowerCase().includes('stock');
    
    let mockStrategy: Partial<Strategy>;
    
    if (isPrice && isCrypto) {
      mockStrategy = {
        id: this.generateId(),
        name: "Bitcoin Price Alert",
        description: "Alert when Bitcoin price changes significantly",
        nodes: [
          {
            id: "trigger-1",
            type: "trigger",
            condition: {
              type: "price",
              asset: "Bitcoin",
              symbol: "BTC",
              change_pct: 5,
              timeframe: "1h",
              direction: "up"
            }
          },
          {
            id: "action-1",
            type: "action",
            condition: {
              type: "telegram",
              message_template: "🚀 Bitcoin is up 5% in the last hour!",
              priority: "medium"
            }
          }
        ],
        risk: {
          cooldown_minutes: 60,
          max_alerts_per_day: 10
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: false
      };
    } else {
      mockStrategy = this.getBasicMockStrategy();
    }
    
    return {
      strategy: mockStrategy,
      confidence: 0.7,
      warnings: ['Using mock data - set GPT_API_KEY for AI generation']
    };
  }

  private getBasicMockStrategy(): Partial<Strategy> {
    return {
      id: this.generateId(),
      name: "Basic Alert Strategy",
      description: "A basic alert strategy template",
      nodes: [
        {
          id: "trigger-1",
          type: "trigger",
          condition: {
            type: "price",
            asset: "Bitcoin",
            symbol: "BTC",
            change_pct: 5,
            timeframe: "1h",
            direction: "up"
          }
        },
        {
          id: "action-1",
          type: "action",
          condition: {
            type: "log",
            message_template: "Alert triggered for {{asset}}",
            priority: "medium"
          }
        }
      ],
      risk: {
        cooldown_minutes: 60,
        max_alerts_per_day: 5
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: false
    };
  }

  private generateId(): string {
    return 'strategy_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
  }
}

export const gptClient = new GPTClient();