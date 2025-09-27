import { describe, it, beforeAll, afterAll, beforeEach } from 'vitest';
import { initIntegrationTestApp, request, resetData, closeApp, getAuthToken, authed } from '../setup/testUtils';

let app: any;

describe('POST /auth/logout', () => {
  beforeAll(async () => { app = await initIntegrationTestApp(); });
  afterAll(async () => { await closeApp(); });
  beforeEach(async () => { await resetData(); });

  it('LOGOUT_01: Successful logout', async () => { const token = await getAuthToken(); await request(app).post('/auth/logout').set(authed(token)); });
  it('LOGOUT_02: No token provided', async () => { await request(app).post('/auth/logout'); });
  it('LOGOUT_03: Invalid token', async () => { await request(app).post('/auth/logout').set('Authorization', 'Bearer invalid'); });
  it('LOGOUT_04: Expired token', async () => { await request(app).post('/auth/logout').set('Authorization', 'Bearer expiredtoken'); });
});
