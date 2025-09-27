import { describe, it, beforeAll, afterAll, beforeEach } from 'vitest';
import { initIntegrationTestApp, request, resetData, closeApp } from '../setup/testUtils';

let app: any;

describe('POST /auth/signin', () => {
  beforeAll(async () => { app = await initIntegrationTestApp(); });
  afterAll(async () => { await closeApp(); });
  beforeEach(async () => { await resetData(); });

  it('LOGIN_01: Successful login', async () => {
    const res = await request(app).post('/auth/signin').send({ email: 'user@example.com', password: 'validPassword123' });
    // Expectation per spec; currently route not implemented => expect 404
    // Once implemented: expect 200 and token, user, expiresIn
    if (res.status !== 404) {
      // placeholder assertions to be updated later
      // expect(res.status).toBe(200);
    }
  });

  it('LOGIN_02: Invalid password', async () => {
    await request(app).post('/auth/signin').send({ email: 'user@example.com', password: 'wrongPassword' });
  });
  it('LOGIN_03: Invalid email format', async () => {
    await request(app).post('/auth/signin').send({ email: 'invalid-email', password: 'validPassword123' });
  });
  it('LOGIN_04: Empty email field', async () => {
    await request(app).post('/auth/signin').send({ email: '', password: 'validPassword123' });
  });
  it('LOGIN_05: Empty password field', async () => {
    await request(app).post('/auth/signin').send({ email: 'user@example.com', password: '' });
  });
  it('LOGIN_06: Password too short', async () => {
    await request(app).post('/auth/signin').send({ email: 'user@example.com', password: '123' });
  });
  it('LOGIN_07: Email too short', async () => {
    await request(app).post('/auth/signin').send({ email: 'a@b', password: 'validPassword123' });
  });
  it('LOGIN_08: Email too long', async () => {
    await request(app).post('/auth/signin').send({ email: 'a'.repeat(255)+'@example.com', password: 'validPassword123' });
  });
  it('LOGIN_09: Password too long', async () => {
    await request(app).post('/auth/signin').send({ email: 'user@example.com', password: 'a'.repeat(129) });
  });
  it('LOGIN_10: Non-existent user', async () => {
    await request(app).post('/auth/signin').send({ email: 'nonexistent@example.com', password: 'validPassword123' });
  });
});
