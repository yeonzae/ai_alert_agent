import { setupExpress } from './config/express';
import { config } from './config/environment';
import routes from './routes';

async function startServer() {
  try {
    const app = setupExpress();
    
    // Routes
    app.use('/api', routes);
    
    // Root endpoint
    app.get('/', (req, res) => {
      res.json({
        message: 'AI Alert Agent Backend',
        version: '1.0.0',
        status: 'running',
        endpoints: {
          health: '/api/health',
          strategyDraft: 'POST /api/ai/strategy/draft',
          strategyTest: 'GET /api/ai/strategy/test'
        }
      });
    });
    
    // 404 handler
    app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        error: 'Endpoint not found',
        path: req.originalUrl
      });
    });
    
    const server = app.listen(config.PORT, () => {
      console.log(`🚀 Server running on port ${config.PORT}`);
      console.log(`📡 Health check: http://localhost:${config.PORT}/api/health`);
      console.log(`🤖 Strategy draft: POST http://localhost:${config.PORT}/api/ai/strategy/draft`);
      console.log(`🧪 Test endpoint: http://localhost:${config.PORT}/api/ai/strategy/test`);
    });
    
    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();