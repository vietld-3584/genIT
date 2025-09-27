import { describe, it, beforeAll, afterAll, beforeEach } from 'vitest';
import { initIntegrationTestApp, request, resetData, closeApp } from '../setup/testUtils';

let app: any;

describe('POST /auth/signup/apple', () => {
  beforeAll(async () => { app = await initIntegrationTestApp(); });
  afterAll(async () => { await closeApp(); });
  beforeEach(async () => { await resetData(); });

  it('APPLE_01: Valid Apple OAuth token', async () => { await request(app).post('/auth/signup/apple').send({ token: 'valid_apple_oauth_token' }); });
  it('APPLE_02: Invalid Apple token', async () => { await request(app).post('/auth/signup/apple').send({ token: 'invalid_apple_token' }); });
  it('APPLE_03: Missing token', async () => { await request(app).post('/auth/signup/apple').send({}); });
});
