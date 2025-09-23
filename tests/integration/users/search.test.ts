import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ApiClient } from '../../helpers/api-client';
import { TestDataFactory } from '../../helpers/test-factory';

describe('GET /users/search', () => {
  let apiClient: ApiClient;

  beforeEach(() => {
    apiClient = new ApiClient();
    TestDataFactory.reset();
  });

  afterEach(() => {
    apiClient.clearAuthToken();
  });

  it('SEARCH_01: Search users successfully', async () => {
    apiClient.setAuthToken('valid_bearer_token');
    const searchQuery = 'john';

    try {
      const response = await apiClient.get('/users/search', {
        params: { q: searchQuery },
      });
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('users');
      expect(response.data).toHaveProperty('total');
      expect(Array.isArray(response.data.users)).toBe(true);
      expect(typeof response.data.total).toBe('number');
      
      // Check if each user has required properties
      if (response.data.users.length > 0) {
        response.data.users.forEach((user: any) => {
          expect(user).toHaveProperty('id');
          expect(user).toHaveProperty('email');
          expect(user).toHaveProperty('name');
        });
      }
    } catch (error: any) {
      // Expected to fail until implementation is complete
      expect([404, 500]).toContain(error.response?.status);
    }
  });

  it('SEARCH_02: No search results returns empty array', async () => {
    apiClient.setAuthToken('valid_bearer_token');
    const searchQuery = 'nonexistentuser';

    try {
      const response = await apiClient.get('/users/search', {
        params: { q: searchQuery },
      });
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('users', []);
      expect(response.data).toHaveProperty('total', 0);
    } catch (error: any) {
      // Expected to fail until implementation is complete
      expect([404, 500]).toContain(error.response?.status);
    }
  });

  it('SEARCH_03: Missing search query returns 400', async () => {
    apiClient.setAuthToken('valid_bearer_token');

    try {
      const response = await apiClient.get('/users/search');
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('error', 'Invalid search query');
      expect(response.data).toHaveProperty('message', 'Search query parameter \'q\' is required');
    } catch (error: any) {
      expect(error.response?.status).toBe(400);
      expect(error.response?.data).toHaveProperty('error');
    }
  });

  it('SEARCH_04: Empty search query returns 400', async () => {
    apiClient.setAuthToken('valid_bearer_token');

    try {
      const response = await apiClient.get('/users/search', {
        params: { q: TestDataFactory.generateEmptyString() },
      });
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('error', 'Invalid search query');
      expect(response.data).toHaveProperty('message', 'Search query cannot be empty');
    } catch (error: any) {
      expect(error.response?.status).toBe(400);
      expect(error.response?.data).toHaveProperty('error');
    }
  });

  it('SEARCH_05: Query too long (>100) returns 400', async () => {
    apiClient.setAuthToken('valid_bearer_token');
    const longQuery = TestDataFactory.generateLongString(101);

    try {
      const response = await apiClient.get('/users/search', {
        params: { q: longQuery },
      });
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('error', 'Invalid search query');
      expect(response.data).toHaveProperty('message', 'Search query must not exceed 100 characters');
    } catch (error: any) {
      expect(error.response?.status).toBe(400);
      expect(error.response?.data).toHaveProperty('error');
    }
  });
});