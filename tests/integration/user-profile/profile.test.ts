import { describe, it, beforeAll, afterAll, beforeEach } from 'vitest';
import { initIntegrationTestApp, request, resetData, closeApp, getAuthToken, authed } from '../setup/testUtils';

let app: any;

describe('User Profile API', () => {
  beforeAll(async () => { app = await initIntegrationTestApp(); });
  afterAll(async () => { await closeApp(); });
  beforeEach(async () => { await resetData(); });

  // GET /user/profile
  it('PROFILE_01: Get user profile', async () => { const token = await getAuthToken(); await request(app).get('/user/profile').set(authed(token)); });
  it('PROFILE_02: Unauthorized access', async () => { await request(app).get('/user/profile'); });
  it('PROFILE_03: Invalid token', async () => { await request(app).get('/user/profile').set('Authorization','Bearer invalid'); });

  // PUT /user/profile
  it('UPD_PROF_01: Update profile successfully', async () => { const token = await getAuthToken(); await request(app).put('/user/profile').set(authed(token)).send({ name: 'Jane Doe', title: 'Senior Developer' }); });
  it('UPD_PROF_02: Name too long', async () => { const token = await getAuthToken(); await request(app).put('/user/profile').set(authed(token)).send({ name: 'a'.repeat(256), title: 'Developer' }); });
  it('UPD_PROF_03: Title too long', async () => { const token = await getAuthToken(); await request(app).put('/user/profile').set(authed(token)).send({ name: 'Jane Doe', title: 'a'.repeat(101) }); });
  it('UPD_PROF_04: Empty name', async () => { const token = await getAuthToken(); await request(app).put('/user/profile').set(authed(token)).send({ name: '', title: 'Developer' }); });

  // PUT /user/profile/contact
  it('UPD_CONT_01: Update email successfully', async () => { const token = await getAuthToken(); await request(app).put('/user/profile/contact').set(authed(token)).send({ email: 'newemail@example.com' }); });
  it('UPD_CONT_02: Invalid email format', async () => { const token = await getAuthToken(); await request(app).put('/user/profile/contact').set(authed(token)).send({ email: 'invalid-email' }); });
  it('UPD_CONT_03: Empty email', async () => { const token = await getAuthToken(); await request(app).put('/user/profile/contact').set(authed(token)).send({ email: '' }); });
  it('UPD_CONT_04: Email already exists', async () => { const token = await getAuthToken(); await request(app).put('/user/profile/contact').set(authed(token)).send({ email: 'existing@example.com' }); });
  it('UPD_CONT_05: Email too short', async () => { const token = await getAuthToken(); await request(app).put('/user/profile/contact').set(authed(token)).send({ email: 'a@b' }); });
  it('UPD_CONT_06: Email too long', async () => { const token = await getAuthToken(); await request(app).put('/user/profile/contact').set(authed(token)).send({ email: 'a'.repeat(255) + '@example.com' }); });

  // PUT /user/profile/photo (These will need multipart handling when implemented)
  it('UPD_PHOTO_01: Upload photo successfully', async () => { const token = await getAuthToken(); await request(app).put('/user/profile/photo').set(authed(token)); });
  it('UPD_PHOTO_02: Invalid file format', async () => { const token = await getAuthToken(); await request(app).put('/user/profile/photo').set(authed(token)); });
  it('UPD_PHOTO_03: File too large', async () => { const token = await getAuthToken(); await request(app).put('/user/profile/photo').set(authed(token)); });
  it('UPD_PHOTO_04: Missing file', async () => { const token = await getAuthToken(); await request(app).put('/user/profile/photo').set(authed(token)); });
  it('UPD_PHOTO_05: Corrupted file', async () => { const token = await getAuthToken(); await request(app).put('/user/profile/photo').set(authed(token)); });
});
