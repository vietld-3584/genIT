import { describe, it, beforeAll, afterAll, beforeEach } from 'vitest';
import { initIntegrationTestApp, request, resetData, closeApp } from '../setup/testUtils';

let app: any;

describe('POST /auth/signup/google', () => {
  beforeAll(async () => { app = await initIntegrationTestApp(); });
  afterAll(async () => { await closeApp(); });
  beforeEach(async () => { await resetData(); });

  it('GOOGLE_01: Valid Google OAuth token', async () => { await request(app).post('/auth/signup/google').send({ token: 'valid_google_oauth_token' }); });
  it('GOOGLE_02: Invalid Google token', async () => { await request(app).post('/auth/signup/google').send({ token: 'invalid_google_token' }); });
  it('GOOGLE_03: Missing token', async () => { await request(app).post('/auth/signup/google').send({}); });
  it('GOOGLE_04: Expired Google token', async () => { await request(app).post('/auth/signup/google').send({ token: 'expired_google_token' }); });
});
