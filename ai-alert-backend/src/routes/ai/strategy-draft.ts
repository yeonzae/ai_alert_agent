import { Request, Response } from 'express';
import { z } from 'zod';
import { gptClient } from '../../services/ai/gpt-client';

const createStrategyDraftSchema = z.object({
  prompt: z.string().min(10).max(500),
  userId: z.string().optional(),
  preferences: z.object({
    risk_level: z.enum(['conservative', 'moderate', 'aggressive']).optional(),
    notification_channels: z.array(z.string()).optional(),
    trading_hours_only: z.boolean().optional(),
    exclude_weekends: z.boolean().optional()
  }).optional()
});

export async function createStrategyDraft(req: Request, res: Response) {
  try {
    const body = createStrategyDraftSchema.parse(req.body);
    
    console.log('Creating strategy draft for prompt:', body.prompt);
    
    const result = await gptClient.generateStrategy(body.prompt);
    
    res.json({
      success: true,
      data: {
        strategy: result.strategy,
        confidence: result.confidence,
        warnings: result.warnings,
        suggestions: [
          "Consider adding a volume filter to reduce false signals",
          "Test with paper trading before going live",
          "Review risk settings based on your portfolio size"
        ]
      }
    });
    
  } catch (error) {
    console.error('Strategy draft creation error:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.issues
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to generate strategy',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

export async function testStrategyDraft(req: Request, res: Response) {
  try {
    const testPrompts = [
      "Alert me when Bitcoin goes up 5% in an hour",
      "Notify me when Tesla drops 3% today",
      "Tell me when Ethereum volume is high and price increases 2%"
    ];
    
    const results = await Promise.all(
      testPrompts.map(async (prompt) => {
        const result = await gptClient.generateStrategy(prompt);
        return { prompt, result };
      })
    );
    
    res.json({
      success: true,
      test_results: results
    });
    
  } catch (error) {
    console.error('Strategy draft test error:', error);
    res.status(500).json({
      success: false,
      error: 'Test failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}