import { describe, it, beforeAll, afterAll, beforeEach } from 'vitest';
import { initIntegrationTestApp, request, resetData, closeApp } from '../setup/testUtils';

let app: any;

describe('POST /auth/signup', () => {
  beforeAll(async () => { app = await initIntegrationTestApp(); });
  afterAll(async () => { await closeApp(); });
  beforeEach(async () => { await resetData(); });

  it('SIGNUP_01: Successful registration', async () => {
    await request(app).post('/auth/signup').send({ email: 'newuser@example.com', password: 'securePass123', name: 'John Doe', title: 'Developer' });
  });
  it('SIGNUP_02: Email already exists', async () => {
    await request(app).post('/auth/signup').send({ email: 'existing@example.com', password: 'securePass123', name: 'John Doe' });
  });
  it('SIGNUP_03: Invalid email format', async () => { await request(app).post('/auth/signup').send({ email: 'invalid-email', password: 'securePass123', name: 'John Doe' }); });
  it('SIGNUP_04: Missing required name', async () => { await request(app).post('/auth/signup').send({ email: 'newuser@example.com', password: 'securePass123' }); });
  it('SIGNUP_05: Password too short', async () => { await request(app).post('/auth/signup').send({ email: 'newuser@example.com', password: '123', name: 'John Doe' }); });
  it('SIGNUP_06: Name too long', async () => { await request(app).post('/auth/signup').send({ email: 'newuser@example.com', password: 'securePass123', name: 'a'.repeat(256) }); });
  it('SIGNUP_07: Title too long', async () => { await request(app).post('/auth/signup').send({ email: 'newuser@example.com', password: 'securePass123', name: 'John', title: 'a'.repeat(101) }); });
  it('SIGNUP_08: Empty required fields', async () => { await request(app).post('/auth/signup').send({ email: '', password: '', name: '' }); });
});
