export interface Strategy {
  id: string;
  name: string;
  description?: string;
  nodes: StrategyNode[];
  risk: RiskSettings;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface StrategyNode {
  id: string;
  type: 'trigger' | 'filter' | 'action';
  condition: TriggerCondition | FilterCondition | ActionCondition;
  position?: { x: number; y: number };
}

export interface TriggerCondition {
  type: 'price' | 'news' | 'economic';
  asset?: string;
  symbol?: string;
  change_pct?: number;
  timeframe?: '5m' | '15m' | '1h' | '4h' | '1d';
  direction?: 'up' | 'down' | 'any';
  target_price?: number;
  keywords?: string[];
  source?: string;
}

export interface FilterCondition {
  type: 'rsi' | 'volume' | 'time' | 'market_cap' | 'custom';
  rsi_min?: number;
  rsi_max?: number;
  volume_threshold?: number;
  time_start?: string;
  time_end?: string;
  market_cap_min?: number;
  market_cap_max?: number;
  custom_logic?: string;
}

export interface ActionCondition {
  type: 'telegram' | 'webhook' | 'log';
  channel?: string;
  chat_id?: string;
  webhook_url?: string;
  message_template?: string;
  include_chart?: boolean;
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

export interface RiskSettings {
  cooldown_minutes: number;
  max_alerts_per_day: number;
  max_alerts_per_hour?: number;
  stop_loss?: number;
  take_profit?: number;
  position_size?: number;
}

export interface CreateStrategyRequest {
  prompt: string;
  userId?: string;
  preferences?: StrategyPreferences;
}

export interface StrategyPreferences {
  risk_level: 'conservative' | 'moderate' | 'aggressive';
  notification_channels: string[];
  trading_hours_only?: boolean;
  exclude_weekends?: boolean;
}

export interface StrategyDraftResponse {
  strategy: Strategy;
  confidence: number;
  suggestions?: string[];
  warnings?: string[];
}