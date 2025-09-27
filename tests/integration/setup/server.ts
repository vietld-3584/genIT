import express, { Express } from 'express';
import { logger } from '../../../lib/logging/logger';

let testServer: Express | null = null;

export async function createTestApp(): Promise<Express> {
  if (testServer) {
    return testServer;
  }

  const app = express();

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // CORS for testing
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  // Health check endpoint for tests
  app.get('/health', (req, res) => {
    res.status(200).json({ 
      status: 'ok', 
      environment: 'test',
      timestamp: new Date().toISOString()
    });
  });

  // TODO: Add API routes here when they are implemented
  // For now, we'll create basic route handlers that return appropriate errors
  
  // Authentication routes
  app.post('/auth/signin', (req, res) => {
    res.status(404).json({ error: 'Not Found', message: 'Endpoint not implemented yet' });
  });

  app.post('/auth/signup', (req, res) => {
    res.status(404).json({ error: 'Not Found', message: 'Endpoint not implemented yet' });
  });

  app.post('/auth/signup/google', (req, res) => {
    res.status(404).json({ error: 'Not Found', message: 'Endpoint not implemented yet' });
  });

  app.post('/auth/signup/apple', (req, res) => {
    res.status(404).json({ error: 'Not Found', message: 'Endpoint not implemented yet' });
  });

  app.post('/auth/logout', (req, res) => {
    res.status(404).json({ error: 'Not Found', message: 'Endpoint not implemented yet' });
  });

  // Channel routes
  app.get('/channels', (req, res) => {
    res.status(404).json({ error: 'Not Found', message: 'Endpoint not implemented yet' });
  });

  app.post('/channels', (req, res) => {
    res.status(404).json({ error: 'Not Found', message: 'Endpoint not implemented yet' });
  });

  app.get('/channels/:channelId', (req, res) => {
    res.status(404).json({ error: 'Not Found', message: 'Endpoint not implemented yet' });
  });

  app.put('/channels/:channelId', (req, res) => {
    res.status(404).json({ error: 'Not Found', message: 'Endpoint not implemented yet' });
  });

  app.delete('/channels/:channelId', (req, res) => {
    res.status(404).json({ error: 'Not Found', message: 'Endpoint not implemented yet' });
  });

  // Channel member routes
  app.get('/channels/:channelId/members', (req, res) => {
    res.status(404).json({ error: 'Not Found', message: 'Endpoint not implemented yet' });
  });

  app.post('/channels/:channelId/members', (req, res) => {
    res.status(404).json({ error: 'Not Found', message: 'Endpoint not implemented yet' });
  });

  app.delete('/channels/:channelId/members/:userId', (req, res) => {
    res.status(404).json({ error: 'Not Found', message: 'Endpoint not implemented yet' });
  });

  // User search routes
  app.get('/users/search', (req, res) => {
    res.status(404).json({ error: 'Not Found', message: 'Endpoint not implemented yet' });
  });

  // Message routes
  app.get('/channels/:channelId/messages', (req, res) => {
    res.status(404).json({ error: 'Not Found', message: 'Endpoint not implemented yet' });
  });

  app.post('/channels/:channelId/messages', (req, res) => {
    res.status(404).json({ error: 'Not Found', message: 'Endpoint not implemented yet' });
  });

  // User profile routes
  app.get('/user/profile', (req, res) => {
    res.status(404).json({ error: 'Not Found', message: 'Endpoint not implemented yet' });
  });

  app.put('/user/profile', (req, res) => {
    res.status(404).json({ error: 'Not Found', message: 'Endpoint not implemented yet' });
  });

  app.put('/user/profile/contact', (req, res) => {
    res.status(404).json({ error: 'Not Found', message: 'Endpoint not implemented yet' });
  });

  app.put('/user/profile/photo', (req, res) => {
    res.status(404).json({ error: 'Not Found', message: 'Endpoint not implemented yet' });
  });

  // 404 handler
  app.use('*', (req, res) => {
    res.status(404).json({
      error: 'Not Found',
      message: `Endpoint ${req.method} ${req.originalUrl} not found`,
      timestamp: new Date().toISOString()
    });
  });

  // Error handler
  app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error('Test server error:', error);
    
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'An unexpected error occurred',
      timestamp: new Date().toISOString()
    });
  });

  testServer = app;
  logger.info('🚀 Test Express app created successfully');
  
  return testServer;
}

export async function closeTestApp(): Promise<void> {
  if (testServer) {
    testServer = null;
    logger.info('🔒 Test Express app closed');
  }
}

export function getTestApp(): Express | null {
  return testServer;
}