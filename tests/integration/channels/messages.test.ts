import { describe, it, beforeAll, afterAll, beforeEach } from 'vitest';
import { initIntegrationTestApp, request, resetData, closeApp, getAuthToken, authed } from '../setup/testUtils';

let app: any;

describe('Channel Messages API', () => {
  beforeAll(async () => { app = await initIntegrationTestApp(); });
  afterAll(async () => { await closeApp(); });
  beforeEach(async () => { await resetData(); });

  // GET /channels/:channelId/messages
  it('GET_MSG_01: Get channel messages', async () => { const token = await getAuthToken(); await request(app).get('/channels/ch_123/messages').set(authed(token)); });
  it('GET_MSG_02: Get with pagination', async () => { const token = await getAuthToken(); await request(app).get('/channels/ch_123/messages?limit=20&before=msg_456').set(authed(token)); });
  it('GET_MSG_03: Empty message list', async () => { const token = await getAuthToken(); await request(app).get('/channels/ch_empty/messages').set(authed(token)); });
  it('GET_MSG_04: Invalid limit', async () => { const token = await getAuthToken(); await request(app).get('/channels/ch_123/messages?limit=150').set(authed(token)); });
  it('GET_MSG_05: Channel not found', async () => { const token = await getAuthToken(); await request(app).get('/channels/ch_nonexistent/messages').set(authed(token)); });
  it('GET_MSG_06: No access to channel', async () => { const token = await getAuthToken(); await request(app).get('/channels/ch_private/messages').set(authed(token)); });

  // POST /channels/:channelId/messages
  it('SEND_MSG_01: Send message successfully', async () => { const token = await getAuthToken(); await request(app).post('/channels/ch_123/messages').set(authed(token)).send({ content: 'Hello, everyone!' }); });
  it('SEND_MSG_02: Empty message content', async () => { const token = await getAuthToken(); await request(app).post('/channels/ch_123/messages').set(authed(token)).send({ content: '' }); });
  it('SEND_MSG_03: Missing content field', async () => { const token = await getAuthToken(); await request(app).post('/channels/ch_123/messages').set(authed(token)).send({}); });
  it('SEND_MSG_04: Message too long', async () => { const token = await getAuthToken(); await request(app).post('/channels/ch_123/messages').set(authed(token)).send({ content: 'a'.repeat(1001) }); });
  it('SEND_MSG_05: Whitespace only content', async () => { const token = await getAuthToken(); await request(app).post('/channels/ch_123/messages').set(authed(token)).send({ content: '     ' }); });
  it('SEND_MSG_06: Channel not found', async () => { const token = await getAuthToken(); await request(app).post('/channels/ch_nonexistent/messages').set(authed(token)).send({ content: 'Hi' }); });
  it('SEND_MSG_07: No send permission', async () => { const token = await getAuthToken(); await request(app).post('/channels/ch_123/messages').set(authed(token)).send({ content: 'Hi' }); });
});
