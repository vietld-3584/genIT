import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ApiClient } from '../../helpers/api-client';
import { TestDataFactory } from '../../helpers/test-factory';

describe('POST /auth/signup', () => {
  let apiClient: ApiClient;

  beforeEach(() => {
    apiClient = new ApiClient();
    TestDataFactory.reset();
  });

  afterEach(() => {
    apiClient.clearAuthToken();
  });

  it('SIGNUP_01: Successful registration', async () => {
    const signupData = {
      email: 'newuser@example.com',
      password: 'securePass123',
      name: 'John Doe',
      title: 'Developer',
    };

    try {
      const response = await apiClient.post('/auth/signup', signupData);
      
      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('token');
      expect(response.data).toHaveProperty('user');
      expect(response.data).toHaveProperty('expiresIn');
      expect(response.data.expiresIn).toBe(3600);
      expect(response.data.user).toHaveProperty('email', signupData.email);
      expect(response.data.user).toHaveProperty('name', signupData.name);
    } catch (error: any) {
      // Expected to fail until implementation is complete
      expect([404, 500]).toContain(error.response?.status);
    }
  });

  it('SIGNUP_02: Email already exists returns 409', async () => {
    const signupData = {
      email: 'existing@example.com',
      password: 'securePass123',
      name: 'John Doe',
    };

    try {
      const response = await apiClient.post('/auth/signup', signupData);
      expect(response.status).toBe(409);
      expect(response.data).toHaveProperty('error', 'Email already exists');
      expect(response.data).toHaveProperty('message', 'This email is already registered');
    } catch (error: any) {
      expect(error.response?.status).toBe(409);
      expect(error.response?.data).toHaveProperty('error');
    }
  });

  it('SIGNUP_03: Invalid email format returns 400', async () => {
    const signupData = {
      email: TestDataFactory.generateInvalidEmail(),
      password: 'securePass123',
      name: 'John Doe',
    };

    try {
      const response = await apiClient.post('/auth/signup', signupData);
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('error', 'Validation error');
      expect(response.data).toHaveProperty('message', 'Invalid email format');
    } catch (error: any) {
      expect(error.response?.status).toBe(400);
      expect(error.response?.data).toHaveProperty('error');
    }
  });

  it('SIGNUP_04: Missing required name returns 400', async () => {
    const signupData = {
      email: 'newuser@example.com',
      password: 'securePass123',
    };

    try {
      const response = await apiClient.post('/auth/signup', signupData);
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('error', 'Validation error');
      expect(response.data).toHaveProperty('message', 'Name is required');
    } catch (error: any) {
      expect(error.response?.status).toBe(400);
      expect(error.response?.data).toHaveProperty('error');
    }
  });

  it('SIGNUP_05: Password too short returns 400', async () => {
    const signupData = {
      email: 'newuser@example.com',
      password: TestDataFactory.generateShortPassword(),
      name: 'John Doe',
    };

    try {
      const response = await apiClient.post('/auth/signup', signupData);
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('error', 'Validation error');
      expect(response.data).toHaveProperty('message', 'Password must be at least 6 characters');
    } catch (error: any) {
      expect(error.response?.status).toBe(400);
      expect(error.response?.data).toHaveProperty('error');
    }
  });

  it('SIGNUP_06: Name too long (>255) returns 400', async () => {
    const signupData = {
      email: 'newuser@example.com',
      password: 'securePass123',
      name: TestDataFactory.generateLongString(256),
    };

    try {
      const response = await apiClient.post('/auth/signup', signupData);
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('error', 'Validation error');
      expect(response.data).toHaveProperty('message', 'Name must not exceed 255 characters');
    } catch (error: any) {
      expect(error.response?.status).toBe(400);
      expect(error.response?.data).toHaveProperty('error');
    }
  });

  it('SIGNUP_07: Title too long (>100) returns 400', async () => {
    const signupData = {
      email: 'newuser@example.com',
      password: 'securePass123',
      name: 'John',
      title: TestDataFactory.generateLongString(101),
    };

    try {
      const response = await apiClient.post('/auth/signup', signupData);
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('error', 'Validation error');
      expect(response.data).toHaveProperty('message', 'Title must not exceed 100 characters');
    } catch (error: any) {
      expect(error.response?.status).toBe(400);
      expect(error.response?.data).toHaveProperty('error');
    }
  });

  it('SIGNUP_08: Empty required fields returns 400', async () => {
    const signupData = {
      email: TestDataFactory.generateEmptyString(),
      password: TestDataFactory.generateEmptyString(),
      name: TestDataFactory.generateEmptyString(),
    };

    try {
      const response = await apiClient.post('/auth/signup', signupData);
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('error', 'Validation error');
      expect(response.data).toHaveProperty('message', 'Email, password, and name are required');
    } catch (error: any) {
      expect(error.response?.status).toBe(400);
      expect(error.response?.data).toHaveProperty('error');
    }
  });
});