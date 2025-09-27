import { describe, it, beforeAll, afterAll, beforeEach } from 'vitest';
import { initIntegrationTestApp, request, resetData, closeApp, getAuthToken, authed } from '../setup/testUtils';

let app: any;

// Covers: GET /channels, POST /channels, /channels/:id (GET, PUT, DELETE)
describe('Channels CRUD API', () => {
  beforeAll(async () => { app = await initIntegrationTestApp(); });
  afterAll(async () => { await closeApp(); });
  beforeEach(async () => { await resetData(); });

  // GET /channels
  it('CHANNELS_01: Get user channels', async () => { const token = await getAuthToken(); await request(app).get('/channels').set(authed(token)); });
  it('CHANNELS_02: No channels available', async () => { const token = await getAuthToken(); await request(app).get('/channels').set(authed(token)); });
  it('CHANNELS_03: Unauthorized access', async () => { await request(app).get('/channels'); });
  it('CHANNELS_04: Invalid token', async () => { await request(app).get('/channels').set('Authorization','Bearer invalid'); });

  // POST /channels
  it('CREATE_CH_01: Create channel successfully', async () => { const token = await getAuthToken(); await request(app).post('/channels').set(authed(token)).send({ name: 'Research', description: 'Research discussions' }); });
  it('CREATE_CH_02: Missing channel name', async () => { const token = await getAuthToken(); await request(app).post('/channels').set(authed(token)).send({ description: 'Research discussions' }); });
  it('CREATE_CH_03: Empty channel name', async () => { const token = await getAuthToken(); await request(app).post('/channels').set(authed(token)).send({ name: '', description: 'Research discussions' }); });
  it('CREATE_CH_04: Channel name too long', async () => { const token = await getAuthToken(); await request(app).post('/channels').set(authed(token)).send({ name: 'a'.repeat(101), description: 'desc' }); });
  it('CREATE_CH_05: Description too long', async () => { const token = await getAuthToken(); await request(app).post('/channels').set(authed(token)).send({ name: 'Research', description: 'a'.repeat(1001) }); });
  it('CREATE_CH_06: Unauthorized user', async () => { await request(app).post('/channels').send({ name: 'Research' }); });
  it('CREATE_CH_07: Insufficient permissions', async () => { const token = await getAuthToken(); await request(app).post('/channels').set(authed(token)).send({ name: 'Research' }); });

  // GET /channels/:channelId
  it('GET_CH_01: Get channel details', async () => { const token = await getAuthToken(); await request(app).get('/channels/ch_123456').set(authed(token)); });
  it('GET_CH_02: Channel not found', async () => { const token = await getAuthToken(); await request(app).get('/channels/ch_nonexistent').set(authed(token)); });
  it('GET_CH_03: No access to channel', async () => { const token = await getAuthToken(); await request(app).get('/channels/ch_private').set(authed(token)); });
  it('GET_CH_04: Unauthorized access', async () => { await request(app).get('/channels/ch_123456'); });

  // PUT /channels/:channelId
  it('UPDATE_CH_01: Update channel successfully', async () => { const token = await getAuthToken(); await request(app).put('/channels/ch_123').set(authed(token)).send({ name: 'Updated Research', description: 'Updated description' }); });
  it('UPDATE_CH_02: Empty channel name', async () => { const token = await getAuthToken(); await request(app).put('/channels/ch_123').set(authed(token)).send({ name: '', description: 'Updated description' }); });
  it('UPDATE_CH_03: Channel name too long', async () => { const token = await getAuthToken(); await request(app).put('/channels/ch_123').set(authed(token)).send({ name: 'a'.repeat(101), description: 'desc' }); });
  it('UPDATE_CH_04: Channel not found', async () => { const token = await getAuthToken(); await request(app).put('/channels/ch_nonexistent').set(authed(token)).send({ name: 'New', description: 'desc' }); });
  it('UPDATE_CH_05: Insufficient permissions', async () => { const token = await getAuthToken(); await request(app).put('/channels/ch_123').set(authed(token)).send({ name: 'New', description: 'desc' }); });

  // DELETE /channels/:channelId
  it('DELETE_CH_01: Delete channel successfully', async () => { const token = await getAuthToken(); await request(app).delete('/channels/ch_123456').set(authed(token)); });
  it('DELETE_CH_02: Channel not found', async () => { const token = await getAuthToken(); await request(app).delete('/channels/ch_nonexistent').set(authed(token)); });
  it('DELETE_CH_03: Insufficient permissions', async () => { const token = await getAuthToken(); await request(app).delete('/channels/ch_123456').set(authed(token)); });
  it('DELETE_CH_04: Unauthorized access', async () => { await request(app).delete('/channels/ch_123456'); });
});
