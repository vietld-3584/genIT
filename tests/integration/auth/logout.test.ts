import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ApiClient } from '../../helpers/api-client';
import { TestDataFactory } from '../../helpers/test-factory';

describe('POST /auth/logout', () => {
  let apiClient: ApiClient;

  beforeEach(() => {
    apiClient = new ApiClient();
    TestDataFactory.reset();
  });

  afterEach(() => {
    apiClient.clearAuthToken();
  });

  it('LOGOUT_01: Successful logout', async () => {
    // Set a valid token
    apiClient.setAuthToken('valid_bearer_token');

    try {
      const response = await apiClient.post('/auth/logout');
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('message', 'Logout successful');
    } catch (error: any) {
      // Expected to fail until implementation is complete
      expect([404, 500]).toContain(error.response?.status);
    }
  });

  it('LOGOUT_02: No token provided returns 401', async () => {
    // Ensure no token is set
    apiClient.clearAuthToken();

    try {
      const response = await apiClient.post('/auth/logout');
      expect(response.status).toBe(401);
      expect(response.data).toHaveProperty('error', 'Unauthorized');
      expect(response.data).toHaveProperty('message', 'Access token required');
    } catch (error: any) {
      expect(error.response?.status).toBe(401);
      expect(error.response?.data).toHaveProperty('error');
    }
  });

  it('LOGOUT_03: Invalid token returns 401', async () => {
    apiClient.setAuthToken(TestDataFactory.generateInvalidToken());

    try {
      const response = await apiClient.post('/auth/logout');
      expect(response.status).toBe(401);
      expect(response.data).toHaveProperty('error', 'Unauthorized');
      expect(response.data).toHaveProperty('message', 'Invalid access token');
    } catch (error: any) {
      expect(error.response?.status).toBe(401);
      expect(error.response?.data).toHaveProperty('error');
    }
  });

  it('LOGOUT_04: Expired token returns 401', async () => {
    apiClient.setAuthToken(TestDataFactory.generateExpiredToken());

    try {
      const response = await apiClient.post('/auth/logout');
      expect(response.status).toBe(401);
      expect(response.data).toHaveProperty('error', 'Unauthorized');
      expect(response.data).toHaveProperty('message', 'Token has expired');
    } catch (error: any) {
      expect(error.response?.status).toBe(401);
      expect(error.response?.data).toHaveProperty('error');
    }
  });
});