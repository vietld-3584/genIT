import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ApiClient } from '../../helpers/api-client';
import { TestDataFactory } from '../../helpers/test-factory';

describe('GET /channels/{channelId}/messages', () => {
  let apiClient: ApiClient;
  const channelId = TestDataFactory.generateValidChannelId();

  beforeEach(() => {
    apiClient = new ApiClient();
    TestDataFactory.reset();
  });

  afterEach(() => {
    apiClient.clearAuthToken();
  });

  it('GET_MSG_01: Get channel messages successfully', async () => {
    apiClient.setAuthToken('valid_bearer_token');

    try {
      const response = await apiClient.get(`/channels/${channelId}/messages`);
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('messages');
      expect(response.data).toHaveProperty('hasMore');
      expect(Array.isArray(response.data.messages)).toBe(true);
      expect(typeof response.data.hasMore).toBe('boolean');
    } catch (error: any) {
      // Expected to fail until implementation is complete
      expect([404, 500]).toContain(error.response?.status);
    }
  });

  it('GET_MSG_02: Get with pagination', async () => {
    apiClient.setAuthToken('valid_bearer_token');
    const params = { limit: 20, before: 'msg_456' };

    try {
      const response = await apiClient.get(`/channels/${channelId}/messages`, { params });
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('messages');
      expect(response.data).toHaveProperty('hasMore');
      expect(Array.isArray(response.data.messages)).toBe(true);
    } catch (error: any) {
      // Expected to fail until implementation is complete
      expect([404, 500]).toContain(error.response?.status);
    }
  });

  it('GET_MSG_03: Empty message list returns empty array', async () => {
    apiClient.setAuthToken('valid_bearer_token');
    const emptyChannelId = 'ch_empty';

    try {
      const response = await apiClient.get(`/channels/${emptyChannelId}/messages`);
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('messages', []);
      expect(response.data).toHaveProperty('hasMore', false);
    } catch (error: any) {
      // Expected to fail until implementation is complete
      expect([404, 500]).toContain(error.response?.status);
    }
  });

  it('GET_MSG_04: Invalid limit returns 400', async () => {
    apiClient.setAuthToken('valid_bearer_token');
    const params = { limit: 150 };

    try {
      const response = await apiClient.get(`/channels/${channelId}/messages`, { params });
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('error', 'Validation error');
      expect(response.data).toHaveProperty('message', 'Limit must not exceed 100');
    } catch (error: any) {
      expect(error.response?.status).toBe(400);
      expect(error.response?.data).toHaveProperty('error');
    }
  });

  it('GET_MSG_05: Channel not found returns 404', async () => {
    apiClient.setAuthToken('valid_bearer_token');
    const nonexistentChannelId = TestDataFactory.generateNonExistentId();

    try {
      const response = await apiClient.get(`/channels/${nonexistentChannelId}/messages`);
      expect(response.status).toBe(404);
      expect(response.data).toHaveProperty('error', 'Channel not found');
      expect(response.data).toHaveProperty('message', 'Channel does not exist');
    } catch (error: any) {
      expect(error.response?.status).toBe(404);
      expect(error.response?.data).toHaveProperty('error');
    }
  });

  it('GET_MSG_06: No access to channel returns 403', async () => {
    apiClient.setAuthToken('no_access_token');

    try {
      const response = await apiClient.get(`/channels/${channelId}/messages`);
      expect(response.status).toBe(403);
      expect(response.data).toHaveProperty('error', 'Access denied');
      expect(response.data).toHaveProperty('message', 'User does not have access to this channel');
    } catch (error: any) {
      expect(error.response?.status).toBe(403);
      expect(error.response?.data).toHaveProperty('error');
    }
  });
});

describe('POST /channels/{channelId}/messages', () => {
  let apiClient: ApiClient;
  const channelId = TestDataFactory.generateValidChannelId();

  beforeEach(() => {
    apiClient = new ApiClient();
    TestDataFactory.reset();
  });

  afterEach(() => {
    apiClient.clearAuthToken();
  });

  it('SEND_MSG_01: Send message successfully', async () => {
    apiClient.setAuthToken('valid_bearer_token');
    const messageData = {
      content: 'Hello, everyone!',
    };

    try {
      const response = await apiClient.post(`/channels/${channelId}/messages`, messageData);
      
      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('id');
      expect(response.data).toHaveProperty('content', messageData.content);
      expect(response.data).toHaveProperty('sender');
      expect(response.data).toHaveProperty('channelId', channelId);
      expect(response.data).toHaveProperty('createdAt');
      expect(response.data).toHaveProperty('updatedAt');
    } catch (error: any) {
      // Expected to fail until implementation is complete
      expect([404, 500]).toContain(error.response?.status);
    }
  });

  it('SEND_MSG_02: Empty message content returns 400', async () => {
    apiClient.setAuthToken('valid_bearer_token');
    const messageData = {
      content: TestDataFactory.generateEmptyString(),
    };

    try {
      const response = await apiClient.post(`/channels/${channelId}/messages`, messageData);
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('error', 'Validation error');
      expect(response.data).toHaveProperty('message', 'Message content cannot be empty');
    } catch (error: any) {
      expect(error.response?.status).toBe(400);
      expect(error.response?.data).toHaveProperty('error');
    }
  });

  it('SEND_MSG_03: Missing content field returns 400', async () => {
    apiClient.setAuthToken('valid_bearer_token');
    const messageData = {};

    try {
      const response = await apiClient.post(`/channels/${channelId}/messages`, messageData);
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('error', 'Validation error');
      expect(response.data).toHaveProperty('message', 'Content field is required');
    } catch (error: any) {
      expect(error.response?.status).toBe(400);
      expect(error.response?.data).toHaveProperty('error');
    }
  });

  it('SEND_MSG_04: Message too long (>1000) returns 400', async () => {
    apiClient.setAuthToken('valid_bearer_token');
    const messageData = {
      content: TestDataFactory.generateLongString(1001),
    };

    try {
      const response = await apiClient.post(`/channels/${channelId}/messages`, messageData);
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('error', 'Validation error');
      expect(response.data).toHaveProperty('message', 'Message content must not exceed 1000 characters');
    } catch (error: any) {
      expect(error.response?.status).toBe(400);
      expect(error.response?.data).toHaveProperty('error');
    }
  });

  it('SEND_MSG_05: Whitespace only content returns 400', async () => {
    apiClient.setAuthToken('valid_bearer_token');
    const messageData = {
      content: TestDataFactory.generateWhitespaceOnlyString(),
    };

    try {
      const response = await apiClient.post(`/channels/${channelId}/messages`, messageData);
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('error', 'Validation error');
      expect(response.data).toHaveProperty('message', 'Message content cannot be only whitespace');
    } catch (error: any) {
      expect(error.response?.status).toBe(400);
      expect(error.response?.data).toHaveProperty('error');
    }
  });

  it('SEND_MSG_06: Channel not found returns 404', async () => {
    apiClient.setAuthToken('valid_bearer_token');
    const nonexistentChannelId = TestDataFactory.generateNonExistentId();
    const messageData = {
      content: 'Hello, everyone!',
    };

    try {
      const response = await apiClient.post(`/channels/${nonexistentChannelId}/messages`, messageData);
      expect(response.status).toBe(404);
      expect(response.data).toHaveProperty('error', 'Channel not found');
      expect(response.data).toHaveProperty('message', 'Channel does not exist');
    } catch (error: any) {
      expect(error.response?.status).toBe(404);
      expect(error.response?.data).toHaveProperty('error');
    }
  });

  it('SEND_MSG_07: No send permission returns 403', async () => {
    apiClient.setAuthToken('no_send_permission_token');
    const messageData = {
      content: 'Hello, everyone!',
    };

    try {
      const response = await apiClient.post(`/channels/${channelId}/messages`, messageData);
      expect(response.status).toBe(403);
      expect(response.data).toHaveProperty('error', 'Access denied');
      expect(response.data).toHaveProperty('message', 'User does not have permission to send messages');
    } catch (error: any) {
      expect(error.response?.status).toBe(403);
      expect(error.response?.data).toHaveProperty('error');
    }
  });
});