import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import { setupTestDatabase } from './database';
import { getEM } from '../../../lib/db/client';

// NOTE: Real route handlers are not implemented yet. We provide placeholders so tests can run and fail with 404/Not Implemented.
// Replace these with actual application routes when available.

export const buildTestServer = async () => {
  await setupTestDatabase();
  const app = express();
  app.use(express.json());

  // Simple auth middleware placeholder
  app.use((req: Request, _res: Response, next: NextFunction) => {
    const auth = req.headers['authorization'];
    if (auth && auth.startsWith('Bearer ')) {
      // Attach fake user context (would be decoded from JWT in real impl)
      (req as any).user = { id: 1, email: 'test@example.com' };
    }
    next();
  });

  // Placeholder routes (should be replaced by actual implementation or Next.js route handlers)
  const notImplemented = (req: Request, res: Response) => {
    res.status(404).json({ error: 'Not Implemented', message: `Route ${req.method} ${req.path} not implemented in test harness` });
  };

  const routes = [
    '/auth/signin','/auth/signup','/auth/signup/google','/auth/signup/apple','/auth/logout',
    '/channels','/channels/:channelId','/channels/:channelId/members','/channels/:channelId/members/:userId',
    '/users/search','/channels/:channelId/messages','/user/profile','/user/profile/contact','/user/profile/photo'
  ];
  routes.forEach(r => {
    app.all(r, notImplemented);
  });

  return app;
};
