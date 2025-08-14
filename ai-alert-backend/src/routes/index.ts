import { Router } from 'express';
import { createStrategyDraft, testStrategyDraft } from './ai/strategy-draft';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'ai-alert-backend'
  });
});

// AI Strategy Generation
router.post('/ai/strategy/draft', createStrategyDraft);
router.get('/ai/strategy/test', testStrategyDraft);

// Placeholder routes for future implementation
router.get('/strategies', (req, res) => {
  res.json({ message: 'Strategies endpoint - not implemented yet' });
});

router.post('/strategies', (req, res) => {
  res.json({ message: 'Create strategy endpoint - not implemented yet' });
});

router.get('/agents', (req, res) => {
  res.json({ message: 'Agents endpoint - not implemented yet' });
});

router.post('/agents', (req, res) => {
  res.json({ message: 'Create agent endpoint - not implemented yet' });
});

export default router;