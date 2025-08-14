export interface NotificationChannel {
  id: string;
  type: 'telegram' | 'webhook' | 'email' | 'sms';
  name: string;
  config: TelegramConfig | WebhookConfig | EmailConfig | SmsConfig;
  isActive: boolean;
  createdAt: Date;
}

export interface TelegramConfig {
  bot_token: string;
  chat_id: string;
  parse_mode?: 'Markdown' | 'HTML';
  disable_web_page_preview?: boolean;
}

export interface WebhookConfig {
  url: string;
  headers?: Record<string, string>;
  method?: 'POST' | 'PUT';
  auth_type?: 'none' | 'bearer' | 'basic';
  auth_token?: string;
}

export interface EmailConfig {
  smtp_host: string;
  smtp_port: number;
  username: string;
  password: string;
  from_email: string;
  to_email: string;
  use_tls?: boolean;
}

export interface SmsConfig {
  provider: 'twilio' | 'aws_sns';
  account_sid?: string;
  auth_token?: string;
  from_number: string;
  to_number: string;
}

export interface NotificationMessage {
  id: string;
  agentId: string;
  strategyId: string;
  channelId: string;
  type: 'alert' | 'error' | 'status' | 'test';
  subject?: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'sent' | 'failed' | 'retrying';
  sentAt?: Date;
  failedAt?: Date;
  retryCount: number;
  maxRetries: number;
  errorMessage?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface SendNotificationRequest {
  channelId: string;
  content: string;
  subject?: string;
  priority?: NotificationMessage['priority'];
  metadata?: Record<string, any>;
}

export interface NotificationHistory {
  total: number;
  messages: NotificationMessage[];
  filters?: {
    agentId?: string;
    type?: NotificationMessage['type'];
    status?: NotificationMessage['status'];
    dateFrom?: Date;
    dateTo?: Date;
  };
}