import request from 'supertest';
import { buildTestServer } from './server';
import { clearDatabase, teardownTestDatabase } from './database';
import { Express } from 'express';

let app: Express;

export const initIntegrationTestApp = async () => {
  if (!app) {
    app = await buildTestServer();
  }
  return app;
};

export const resetData = async () => {
  await clearDatabase();
};

export const closeApp = async () => {
  await teardownTestDatabase();
};

export const authed = (token: string) => ({ Authorization: `Bearer ${token}` });

export const getAuthToken = async (): Promise<string> => {
  // For now return a placeholder token; once /auth/signup implemented we can create a user dynamically.
  return 'test-token';
};

export { request };
