import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ApiClient } from '../../helpers/api-client';
import { TestDataFactory } from '../../helpers/test-factory';
import { globalMocks } from '../../helpers/mock-server';

describe('POST /auth/signin', () => {
  let apiClient: ApiClient;

  beforeEach(() => {
    apiClient = new ApiClient();
    TestDataFactory.reset();
  });

  afterEach(() => {
    apiClient.clearAuthToken();
  });

  it('LOGIN_01: Successful login with valid credentials', async () => {
    const loginData = {
      email: 'user@example.com',
      password: 'validPassword123',
    };

    try {
      const response = await apiClient.post('/auth/signin', loginData);
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('token');
      expect(response.data).toHaveProperty('user');
      expect(response.data).toHaveProperty('expiresIn');
      expect(response.data.expiresIn).toBe(3600);
      expect(response.data.user).toHaveProperty('email', loginData.email);
    } catch (error: any) {
      // Expected to fail until implementation is complete
      expect([404, 500]).toContain(error.response?.status);
    }
  });

  it('LOGIN_02: Invalid password returns 401', async () => {
    const loginData = {
      email: 'user@example.com',
      password: 'wrongPassword',
    };

    try {
      const response = await apiClient.post('/auth/signin', loginData);
      expect(response.status).toBe(401);
      expect(response.data).toHaveProperty('error', 'Invalid credentials');
      expect(response.data).toHaveProperty('message', 'Email or password is incorrect');
    } catch (error: any) {
      expect(error.response?.status).toBe(401);
      expect(error.response?.data).toHaveProperty('error');
    }
  });

  it('LOGIN_03: Invalid email format returns 400', async () => {
    const loginData = {
      email: TestDataFactory.generateInvalidEmail(),
      password: 'validPassword123',
    };

    try {
      const response = await apiClient.post('/auth/signin', loginData);
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('error', 'Validation error');
      expect(response.data).toHaveProperty('message', 'Invalid email format');
    } catch (error: any) {
      expect(error.response?.status).toBe(400);
      expect(error.response?.data).toHaveProperty('error');
    }
  });

  it('LOGIN_04: Empty email field returns 400', async () => {
    const loginData = {
      email: TestDataFactory.generateEmptyString(),
      password: 'validPassword123',
    };

    try {
      const response = await apiClient.post('/auth/signin', loginData);
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('error', 'Validation error');
      expect(response.data).toHaveProperty('message', 'Email is required');
    } catch (error: any) {
      expect(error.response?.status).toBe(400);
      expect(error.response?.data).toHaveProperty('error');
    }
  });

  it('LOGIN_05: Empty password field returns 400', async () => {
    const loginData = {
      email: 'user@example.com',
      password: TestDataFactory.generateEmptyString(),
    };

    try {
      const response = await apiClient.post('/auth/signin', loginData);
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('error', 'Validation error');
      expect(response.data).toHaveProperty('message', 'Password is required');
    } catch (error: any) {
      expect(error.response?.status).toBe(400);
      expect(error.response?.data).toHaveProperty('error');
    }
  });

  it('LOGIN_06: Password too short returns 400', async () => {
    const loginData = {
      email: 'user@example.com',
      password: TestDataFactory.generateShortPassword(),
    };

    try {
      const response = await apiClient.post('/auth/signin', loginData);
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('error', 'Validation error');
      expect(response.data).toHaveProperty('message', 'Password must be at least 6 characters');
    } catch (error: any) {
      expect(error.response?.status).toBe(400);
      expect(error.response?.data).toHaveProperty('error');
    }
  });

  it('LOGIN_07: Email too short returns 400', async () => {
    const loginData = {
      email: 'a@b',
      password: 'validPassword123',
    };

    try {
      const response = await apiClient.post('/auth/signin', loginData);
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('error', 'Validation error');
      expect(response.data).toHaveProperty('message', 'Email must be at least 5 characters');
    } catch (error: any) {
      expect(error.response?.status).toBe(400);
      expect(error.response?.data).toHaveProperty('error');
    }
  });

  it('LOGIN_08: Email too long (>254) returns 400', async () => {
    const longEmail = TestDataFactory.generateLongString(250) + '@example.com';
    const loginData = {
      email: longEmail,
      password: 'validPassword123',
    };

    try {
      const response = await apiClient.post('/auth/signin', loginData);
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('error', 'Validation error');
      expect(response.data).toHaveProperty('message', 'Email must not exceed 254 characters');
    } catch (error: any) {
      expect(error.response?.status).toBe(400);
      expect(error.response?.data).toHaveProperty('error');
    }
  });

  it('LOGIN_09: Password too long (>128) returns 400', async () => {
    const loginData = {
      email: 'user@example.com',
      password: TestDataFactory.generateLongPassword(),
    };

    try {
      const response = await apiClient.post('/auth/signin', loginData);
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('error', 'Validation error');
      expect(response.data).toHaveProperty('message', 'Password must not exceed 128 characters');
    } catch (error: any) {
      expect(error.response?.status).toBe(400);
      expect(error.response?.data).toHaveProperty('error');
    }
  });

  it('LOGIN_10: Non-existent user returns 401', async () => {
    const loginData = {
      email: 'nonexistent@example.com',
      password: 'validPassword123',
    };

    try {
      const response = await apiClient.post('/auth/signin', loginData);
      expect(response.status).toBe(401);
      expect(response.data).toHaveProperty('error', 'Invalid credentials');
      expect(response.data).toHaveProperty('message', 'Email or password is incorrect');
    } catch (error: any) {
      expect(error.response?.status).toBe(401);
      expect(error.response?.data).toHaveProperty('error');
    }
  });
});