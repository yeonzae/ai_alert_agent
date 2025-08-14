export const SYSTEM_PROMPT = `
You are an expert investment alert strategy generator. You convert natural language investment prompts into structured JSON strategies.

Your task is to analyze user prompts and create a strategy with the following components:
1. TRIGGER: The main condition that starts the alert (price, news, economic indicator)
2. FILTER: Optional conditions to refine when alerts fire (technical indicators, time, volume)
3. ACTION: How to notify the user (telegram, webhook, log)
4. RISK: Risk management settings (cooldown, daily limits)

IMPORTANT RULES:
- Always include at least one trigger
- Use realistic values based on market conditions
- Set reasonable risk limits (cooldown: 30-60 minutes, daily alerts: 5-20)
- For crypto assets, use symbols like BTC, ETH, ADA
- For stocks, use symbols like AAPL, TSLA, NVDA
- Price changes should be in percentage (e.g., 5 for 5%)
- Timeframes: 5m, 15m, 1h, 4h, 1d

Return only valid JSON in this exact format:
{
  "name": "Strategy Name",
  "description": "Brief description",
  "nodes": [
    {
      "id": "trigger-1",
      "type": "trigger",
      "condition": {
        "type": "price",
        "asset": "BTC",
        "symbol": "BTC",
        "change_pct": 5,
        "timeframe": "1h",
        "direction": "up"
      }
    },
    {
      "id": "action-1", 
      "type": "action",
      "condition": {
        "type": "telegram",
        "message_template": "🚀 BTC is up 5% in the last hour! Current trend looks bullish.",
        "priority": "medium"
      }
    }
  ],
  "risk": {
    "cooldown_minutes": 60,
    "max_alerts_per_day": 10
  }
}

Examples of valid prompts and responses:

USER: "Alert me when Bitcoin goes up 5% in an hour"
RESPONSE: Strategy with price trigger for BTC 5% up in 1h, telegram action, 60min cooldown

USER: "Tell me when Tesla stock drops more than 3% today"
RESPONSE: Strategy with price trigger for TSLA -3% in 1d, telegram action, reasonable risk settings

USER: "Notify me when Ethereum volume is high and price increases 2%"
RESPONSE: Strategy with price trigger + volume filter, telegram action
`;

export const EXAMPLE_STRATEGIES = [
  {
    prompt: "Alert me when Bitcoin goes up 5% in an hour",
    strategy: {
      name: "Bitcoin 5% Hourly Alert",
      description: "Get notified when BTC increases by 5% within an hour",
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
            message_template: "🚀 Bitcoin is up 5% in the last hour! Current price trend is bullish.",
            priority: "medium"
          }
        }
      ],
      risk: {
        cooldown_minutes: 60,
        max_alerts_per_day: 8
      }
    }
  },
  {
    prompt: "Notify me when Tesla drops 3% with high volume",
    strategy: {
      name: "Tesla Drop with Volume Alert", 
      description: "Alert when TSLA drops 3% with above average volume",
      nodes: [
        {
          id: "trigger-1",
          type: "trigger",
          condition: {
            type: "price",
            asset: "Tesla",
            symbol: "TSLA",
            change_pct: -3,
            timeframe: "1d",
            direction: "down"
          }
        },
        {
          id: "filter-1",
          type: "filter",
          condition: {
            type: "volume",
            volume_threshold: 150 // 150% of average
          }
        },
        {
          id: "action-1",
          type: "action",
          condition: {
            type: "telegram",
            message_template: "📉 Tesla (TSLA) dropped 3% today with high volume - potential support level test.",
            priority: "high"
          }
        }
      ],
      risk: {
        cooldown_minutes: 240,
        max_alerts_per_day: 3
      }
    }
  }
];

export function getPromptWithExamples(userPrompt: string): string {
  return `${SYSTEM_PROMPT}

Now generate a strategy for this user prompt: "${userPrompt}"

Remember to return only valid JSON with no additional text or explanation.`;
}