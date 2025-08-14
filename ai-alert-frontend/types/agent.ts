import { Strategy } from './strategy';

export interface Agent {
  id: string;
  strategyId: string;
  strategy?: Strategy;
  status: 'active' | 'stopped' | 'error' | 'paused';
  lastTrigger?: Date;
  lastCheck?: Date;
  nextCheck?: Date;
  config: AgentConfig;
  stats: AgentStats;
  createdAt: Date;
  updatedAt: Date;
}

export interface AgentConfig {
  check_interval_ms: number;
  retry_attempts: number;
  timeout_ms: number;
  enable_logging: boolean;
  auto_restart: boolean;
  max_runtime_hours?: number;
}

export interface AgentStats {
  total_checks: number;
  total_triggers: number;
  total_alerts_sent: number;
  success_rate: number;
  avg_response_time_ms: number;
  last_error?: string;
  last_error_time?: Date;
  uptime_hours: number;
}

export interface CreateAgentRequest {
  strategyId: string;
  config?: Partial<AgentConfig>;
  autoStart?: boolean;
}

export interface UpdateAgentRequest {
  status?: Agent['status'];
  config?: Partial<AgentConfig>;
}

export interface AgentLogEntry {
  id: string;
  agentId: string;
  timestamp: Date;
  type: 'check' | 'trigger' | 'alert' | 'error' | 'start' | 'stop';
  message: string;
  data?: Record<string, any>;
  duration_ms?: number;
  success: boolean;
}