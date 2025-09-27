import { describe, it, beforeAll, afterAll, beforeEach } from 'vitest';
import { initIntegrationTestApp, request, resetData, closeApp, getAuthToken, authed } from '../setup/testUtils';

let app: any;

describe('GET /users/search', () => {
  beforeAll(async () => { app = await initIntegrationTestApp(); });
  afterAll(async () => { await closeApp(); });
  beforeEach(async () => { await resetData(); });

  it('SEARCH_01: Search users successfully', async () => { const token = await getAuthToken(); await request(app).get('/users/search?q=john').set(authed(token)); });
  it('SEARCH_02: No search results', async () => { const token = await getAuthToken(); await request(app).get('/users/search?q=nonexistentuser').set(authed(token)); });
  it('SEARCH_03: Missing search query', async () => { const token = await getAuthToken(); await request(app).get('/users/search').set(authed(token)); });
  it('SEARCH_04: Empty search query', async () => { const token = await getAuthToken(); await request(app).get('/users/search?q=').set(authed(token)); });
  it('SEARCH_05: Query too long', async () => { const token = await getAuthToken(); await request(app).get('/users/search?q='+ 'a'.repeat(101)).set(authed(token)); });
});
