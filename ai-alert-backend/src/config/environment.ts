import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  PORT: process.env.PORT || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // AI Service
  GPT_API_KEY: process.env.GPT_API_KEY || '',
  OPENAI_API_URL: process.env.OPENAI_API_URL || 'https://api.openai.com/v1',
  
  // Database
  DB_PATH: process.env.DB_PATH || './data/alerts.db',
  
  // Notifications
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || '',
  
  // External APIs
  COINGECKO_API_KEY: process.env.COINGECKO_API_KEY || '',
  ALPHAVANTAGE_API_KEY: process.env.ALPHAVANTAGE_API_KEY || '',
  
  // Security
  JWT_SECRET: process.env.JWT_SECRET || 'default-jwt-secret-change-in-production',
  CORS_ORIGINS: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
  
  // Monitoring
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  MONITOR_INTERVAL_MS: parseInt(process.env.MONITOR_INTERVAL_MS || '30000'),
};

export const isDevelopment = config.NODE_ENV === 'development';
export const isProduction = config.NODE_ENV === 'production';