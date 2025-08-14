import express from 'express';
import cors from 'cors';
import { z } from 'zod';

const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Mock GPT response
function getMockStrategy(prompt: string) {
  return {
    id: 'strategy_' + Date.now(),
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
}

// Health endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'ai-alert-backend'
  });
});

// Strategy draft endpoint
app.post('/api/ai/strategy/draft', (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt || prompt.length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Prompt must be at least 10 characters long'
      });
    }
    
    const strategy = getMockStrategy(prompt);
    
    res.json({
      success: true,
      data: {
        strategy,
        confidence: 0.85,
        warnings: ['Using mock data - set GPT_API_KEY for AI generation'],
        suggestions: [
          "Consider adding a volume filter to reduce false signals",
          "Test with paper trading before going live",
          "Review risk settings based on your portfolio size"
        ]
      }
    });
    
  } catch (error) {
    console.error('Strategy draft error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate strategy'
    });
  }
});

// Test endpoint
app.get('/api/ai/strategy/test', (req, res) => {
  const testPrompts = [
    "Alert me when Bitcoin goes up 5% in an hour",
    "Notify me when Tesla drops 3% today"
  ];
  
  const results = testPrompts.map(prompt => ({
    prompt,
    result: { strategy: getMockStrategy(prompt), confidence: 0.8, warnings: [] }
  }));
  
  res.json({ success: true, test_results: results });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'AI Alert Agent Backend',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      strategyDraft: 'POST /api/ai/strategy/draft'
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Health: http://localhost:${PORT}/api/health`);
  console.log(`🤖 Strategy: POST http://localhost:${PORT}/api/ai/strategy/draft`);
});