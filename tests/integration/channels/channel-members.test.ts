import { describe, it, beforeAll, afterAll, beforeEach } from 'vitest';
import { initIntegrationTestApp, request, resetData, closeApp, getAuthToken, authed } from '../setup/testUtils';

let app: any;

describe('Channel Members API', () => {
  beforeAll(async () => { app = await initIntegrationTestApp(); });
  afterAll(async () => { await closeApp(); });
  beforeEach(async () => { await resetData(); });

  // GET members
  it('GET_MEM_01: Get channel members', async () => { const token = await getAuthToken(); await request(app).get('/channels/ch_123456/members').set(authed(token)); });
  it('GET_MEM_02: Empty member list', async () => { const token = await getAuthToken(); await request(app).get('/channels/ch_empty/members').set(authed(token)); });
  it('GET_MEM_03: Channel not found', async () => { const token = await getAuthToken(); await request(app).get('/channels/ch_nonexistent/members').set(authed(token)); });
  it('GET_MEM_04: No access to channel', async () => { const token = await getAuthToken(); await request(app).get('/channels/ch_private/members').set(authed(token)); });

  // POST members
  it('ADD_MEM_01: Add members successfully', async () => { const token = await getAuthToken(); await request(app).post('/channels/ch_123/members').set(authed(token)).send({ userIds: ['user_123','user_456'] }); });
  it('ADD_MEM_02: Empty user list', async () => { const token = await getAuthToken(); await request(app).post('/channels/ch_123/members').set(authed(token)).send({ userIds: [] }); });
  it('ADD_MEM_03: Missing userIds field', async () => { const token = await getAuthToken(); await request(app).post('/channels/ch_123/members').set(authed(token)).send({}); });
  it('ADD_MEM_04: User not found', async () => { const token = await getAuthToken(); await request(app).post('/channels/ch_123/members').set(authed(token)).send({ userIds: ['user_nonexistent'] }); });
  it('ADD_MEM_05: Channel not found', async () => { const token = await getAuthToken(); await request(app).post('/channels/ch_nonexistent/members').set(authed(token)).send({ userIds: ['user_123'] }); });
  it('ADD_MEM_06: Insufficient permissions', async () => { const token = await getAuthToken(); await request(app).post('/channels/ch_123/members').set(authed(token)).send({ userIds: ['user_123'] }); });

  // DELETE member
  it('REM_MEM_01: Remove member successfully', async () => { const token = await getAuthToken(); await request(app).delete('/channels/ch_123/members/user_456').set(authed(token)); });
  it('REM_MEM_02: Member not in channel', async () => { const token = await getAuthToken(); await request(app).delete('/channels/ch_123/members/user_notmember').set(authed(token)); });
  it('REM_MEM_03: Channel not found', async () => { const token = await getAuthToken(); await request(app).delete('/channels/ch_nonexistent/members/user_123').set(authed(token)); });
  it('REM_MEM_04: Insufficient permissions', async () => { const token = await getAuthToken(); await request(app).delete('/channels/ch_123/members/user_456').set(authed(token)); });
});
