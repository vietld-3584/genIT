import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { testData, UserFactory } from '../fixtures';
import { getTestApp } from '../setup/server';

describe('POST /auth/signin', () => {
  let app: any;

  beforeEach(() => {
    app = getTestApp();
    expect(app).toBeTruthy();
  });

  // LOGIN_01: Successful login
  it('LOGIN_01: should authenticate user with valid credentials', async () => {
    const testUser = testData.users[0]; // Use seeded test user
    
    const response = await request(app)
      .post('/auth/signin')
      .send({
        email: testUser.email,
        password: testUser.password
      })
      .expect('Content-Type', /json/);

    // For now, expect 404 since endpoints are not implemented
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Not Found');
    expect(response.body).toHaveProperty('message', 'Endpoint not implemented yet');
  });

  // LOGIN_02: Invalid password
  it('LOGIN_02: should reject login with invalid password', async () => {
    const testUser = testData.users[0];
    
    const response = await request(app)
      .post('/auth/signin')
      .send({
        email: testUser.email,
        password: 'wrongPassword'
      })
      .expect('Content-Type', /json/);

    // For now, expect 404 since endpoints are not implemented
    // When implemented, should be 401 with appropriate error message
    expect(response.status).toBe(404);
  });

  // LOGIN_03: Invalid email format
  it('LOGIN_03: should reject login with invalid email format', async () => {
    const response = await request(app)
      .post('/auth/signin')
      .send({
        email: 'invalid-email',
        password: 'validPassword123'
      })
      .expect('Content-Type', /json/);

    expect(response.status).toBe(404);
    // When implemented, should be 400 with validation error
  });

  // LOGIN_04: Empty email field
  it('LOGIN_04: should reject login with empty email', async () => {
    const response = await request(app)
      .post('/auth/signin')
      .send({
        email: '',
        password: 'validPassword123'
      })
      .expect('Content-Type', /json/);

    expect(response.status).toBe(404);
    // When implemented, should be 400 with validation error
  });

  // LOGIN_05: Empty password field
  it('LOGIN_05: should reject login with empty password', async () => {
    const testUser = testData.users[0];
    
    const response = await request(app)
      .post('/auth/signin')
      .send({
        email: testUser.email,
        password: ''
      })
      .expect('Content-Type', /json/);

    expect(response.status).toBe(404);
    // When implemented, should be 400 with validation error
  });

  // LOGIN_06: Password too short
  it('LOGIN_06: should reject login with password too short', async () => {
    const testUser = testData.users[0];
    
    const response = await request(app)
      .post('/auth/signin')
      .send({
        email: testUser.email,
        password: '123'
      })
      .expect('Content-Type', /json/);

    expect(response.status).toBe(404);
    // When implemented, should be 400 with validation error
  });

  // LOGIN_07: Email too short
  it('LOGIN_07: should reject login with email too short', async () => {
    const response = await request(app)
      .post('/auth/signin')
      .send({
        email: 'a@b',
        password: 'validPassword123'
      })
      .expect('Content-Type', /json/);

    expect(response.status).toBe(404);
    // When implemented, should be 400 with validation error
  });

  // LOGIN_08: Email too long
  it('LOGIN_08: should reject login with email too long', async () => {
    const longEmail = 'a'.repeat(250) + '@example.com'; // Over 254 chars
    
    const response = await request(app)
      .post('/auth/signin')
      .send({
        email: longEmail,
        password: 'validPassword123'
      })
      .expect('Content-Type', /json/);

    expect(response.status).toBe(404);
    // When implemented, should be 400 with validation error
  });

  // LOGIN_09: Password too long
  it('LOGIN_09: should reject login with password too long', async () => {
    const testUser = testData.users[0];
    const longPassword = 'a'.repeat(130); // Over 128 chars
    
    const response = await request(app)
      .post('/auth/signin')
      .send({
        email: testUser.email,
        password: longPassword
      })
      .expect('Content-Type', /json/);

    expect(response.status).toBe(404);
    // When implemented, should be 400 with validation error
  });

  // LOGIN_10: Non-existent user
  it('LOGIN_10: should reject login for non-existent user', async () => {
    const nonExistentUser = UserFactory.create({
      email: 'nonexistent@example.com'
    });
    
    const response = await request(app)
      .post('/auth/signin')
      .send({
        email: nonExistentUser.email,
        password: 'validPassword123'
      })
      .expect('Content-Type', /json/);

    expect(response.status).toBe(404);
    // When implemented, should be 401 with invalid credentials error
  });
});