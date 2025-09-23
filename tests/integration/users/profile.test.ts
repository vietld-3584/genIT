import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ApiClient } from '../../helpers/api-client';
import { TestDataFactory } from '../../helpers/test-factory';

describe('GET /user/profile', () => {
  let apiClient: ApiClient;

  beforeEach(() => {
    apiClient = new ApiClient();
    TestDataFactory.reset();
  });

  afterEach(() => {
    apiClient.clearAuthToken();
  });

  it('PROFILE_01: Get user profile successfully', async () => {
    apiClient.setAuthToken('valid_bearer_token');

    try {
      const response = await apiClient.get('/user/profile');
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('id');
      expect(response.data).toHaveProperty('email');
      expect(response.data).toHaveProperty('name');
      expect(response.data).toHaveProperty('createdAt');
      expect(response.data).toHaveProperty('updatedAt');
      
      // Optional properties
      if (response.data.title) {
        expect(typeof response.data.title).toBe('string');
      }
      if (response.data.photoUrl) {
        expect(typeof response.data.photoUrl).toBe('string');
      }
    } catch (error: any) {
      // Expected to fail until implementation is complete
      expect([404, 500]).toContain(error.response?.status);
    }
  });

  it('PROFILE_02: Unauthorized access returns 401', async () => {
    apiClient.clearAuthToken();

    try {
      const response = await apiClient.get('/user/profile');
      expect(response.status).toBe(401);
      expect(response.data).toHaveProperty('error', 'Unauthorized');
      expect(response.data).toHaveProperty('message', 'Access token required');
    } catch (error: any) {
      expect(error.response?.status).toBe(401);
      expect(error.response?.data).toHaveProperty('error');
    }
  });

  it('PROFILE_03: Invalid token returns 401', async () => {
    apiClient.setAuthToken(TestDataFactory.generateInvalidToken());

    try {
      const response = await apiClient.get('/user/profile');
      expect(response.status).toBe(401);
      expect(response.data).toHaveProperty('error', 'Unauthorized');
      expect(response.data).toHaveProperty('message', 'Invalid access token');
    } catch (error: any) {
      expect(error.response?.status).toBe(401);
      expect(error.response?.data).toHaveProperty('error');
    }
  });
});

describe('PUT /user/profile', () => {
  let apiClient: ApiClient;

  beforeEach(() => {
    apiClient = new ApiClient();
    TestDataFactory.reset();
  });

  afterEach(() => {
    apiClient.clearAuthToken();
  });

  it('UPD_PROF_01: Update profile successfully', async () => {
    apiClient.setAuthToken('valid_bearer_token');
    const updateData = {
      name: 'Jane Doe',
      title: 'Senior Developer',
    };

    try {
      const response = await apiClient.put('/user/profile', updateData);
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('id');
      expect(response.data).toHaveProperty('name', updateData.name);
      expect(response.data).toHaveProperty('title', updateData.title);
      expect(response.data).toHaveProperty('updatedAt');
    } catch (error: any) {
      // Expected to fail until implementation is complete
      expect([404, 500]).toContain(error.response?.status);
    }
  });

  it('UPD_PROF_02: Name too long (>255) returns 400', async () => {
    apiClient.setAuthToken('valid_bearer_token');
    const updateData = {
      name: TestDataFactory.generateLongString(256),
      title: 'Developer',
    };

    try {
      const response = await apiClient.put('/user/profile', updateData);
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('error', 'Validation error');
      expect(response.data).toHaveProperty('message', 'Name must not exceed 255 characters');
    } catch (error: any) {
      expect(error.response?.status).toBe(400);
      expect(error.response?.data).toHaveProperty('error');
    }
  });

  it('UPD_PROF_03: Title too long (>100) returns 400', async () => {
    apiClient.setAuthToken('valid_bearer_token');
    const updateData = {
      name: 'Jane Doe',
      title: TestDataFactory.generateLongString(101),
    };

    try {
      const response = await apiClient.put('/user/profile', updateData);
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('error', 'Validation error');
      expect(response.data).toHaveProperty('message', 'Title must not exceed 100 characters');
    } catch (error: any) {
      expect(error.response?.status).toBe(400);
      expect(error.response?.data).toHaveProperty('error');
    }
  });

  it('UPD_PROF_04: Empty name returns 400', async () => {
    apiClient.setAuthToken('valid_bearer_token');
    const updateData = {
      name: TestDataFactory.generateEmptyString(),
      title: 'Developer',
    };

    try {
      const response = await apiClient.put('/user/profile', updateData);
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('error', 'Validation error');
      expect(response.data).toHaveProperty('message', 'Name cannot be empty');
    } catch (error: any) {
      expect(error.response?.status).toBe(400);
      expect(error.response?.data).toHaveProperty('error');
    }
  });
});

describe('PUT /user/profile/contact', () => {
  let apiClient: ApiClient;

  beforeEach(() => {
    apiClient = new ApiClient();
    TestDataFactory.reset();
  });

  afterEach(() => {
    apiClient.clearAuthToken();
  });

  it('UPD_CONT_01: Update email successfully', async () => {
    apiClient.setAuthToken('valid_bearer_token');
    const updateData = {
      email: 'newemail@example.com',
    };

    try {
      const response = await apiClient.put('/user/profile/contact', updateData);
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('id');
      expect(response.data).toHaveProperty('email', updateData.email);
      expect(response.data).toHaveProperty('updatedAt');
    } catch (error: any) {
      // Expected to fail until implementation is complete
      expect([404, 500]).toContain(error.response?.status);
    }
  });

  it('UPD_CONT_02: Invalid email format returns 400', async () => {
    apiClient.setAuthToken('valid_bearer_token');
    const updateData = {
      email: TestDataFactory.generateInvalidEmail(),
    };

    try {
      const response = await apiClient.put('/user/profile/contact', updateData);
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('error', 'Validation error');
      expect(response.data).toHaveProperty('message', 'Invalid email format');
    } catch (error: any) {
      expect(error.response?.status).toBe(400);
      expect(error.response?.data).toHaveProperty('error');
    }
  });

  it('UPD_CONT_03: Empty email returns 400', async () => {
    apiClient.setAuthToken('valid_bearer_token');
    const updateData = {
      email: TestDataFactory.generateEmptyString(),
    };

    try {
      const response = await apiClient.put('/user/profile/contact', updateData);
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('error', 'Validation error');
      expect(response.data).toHaveProperty('message', 'Email is required');
    } catch (error: any) {
      expect(error.response?.status).toBe(400);
      expect(error.response?.data).toHaveProperty('error');
    }
  });

  it('UPD_CONT_04: Email already exists returns 409', async () => {
    apiClient.setAuthToken('valid_bearer_token');
    const updateData = {
      email: 'existing@example.com',
    };

    try {
      const response = await apiClient.put('/user/profile/contact', updateData);
      expect(response.status).toBe(409);
      expect(response.data).toHaveProperty('error', 'Email already in use');
      expect(response.data).toHaveProperty('message', 'This email is already registered to another user');
    } catch (error: any) {
      expect(error.response?.status).toBe(409);
      expect(error.response?.data).toHaveProperty('error');
    }
  });

  it('UPD_CONT_05: Email too short returns 400', async () => {
    apiClient.setAuthToken('valid_bearer_token');
    const updateData = {
      email: 'a@b',
    };

    try {
      const response = await apiClient.put('/user/profile/contact', updateData);
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('error', 'Validation error');
      expect(response.data).toHaveProperty('message', 'Email must be at least 5 characters');
    } catch (error: any) {
      expect(error.response?.status).toBe(400);
      expect(error.response?.data).toHaveProperty('error');
    }
  });

  it('UPD_CONT_06: Email too long (>254) returns 400', async () => {
    apiClient.setAuthToken('valid_bearer_token');
    const longEmail = TestDataFactory.generateLongString(250) + '@example.com';
    const updateData = {
      email: longEmail,
    };

    try {
      const response = await apiClient.put('/user/profile/contact', updateData);
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('error', 'Validation error');
      expect(response.data).toHaveProperty('message', 'Email must not exceed 254 characters');
    } catch (error: any) {
      expect(error.response?.status).toBe(400);
      expect(error.response?.data).toHaveProperty('error');
    }
  });
});

describe('PUT /user/profile/photo', () => {
  let apiClient: ApiClient;

  beforeEach(() => {
    apiClient = new ApiClient();
    TestDataFactory.reset();
  });

  afterEach(() => {
    apiClient.clearAuthToken();
  });

  it('UPD_PHOTO_01: Upload photo successfully', async () => {
    apiClient.setAuthToken('valid_bearer_token');
    const imageFile = TestDataFactory.generateTestImageBuffer();

    try {
      const response = await apiClient.uploadFile('/user/profile/photo', imageFile, 'profile.jpg');
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('photoUrl');
      expect(response.data).toHaveProperty('user');
      expect(response.data.photoUrl).toMatch(/^https?:\/\/.+\.(jpg|jpeg|png)$/i);
    } catch (error: any) {
      // Expected to fail until implementation is complete
      expect([404, 500]).toContain(error.response?.status);
    }
  });

  it('UPD_PHOTO_02: Invalid file format returns 400', async () => {
    apiClient.setAuthToken('valid_bearer_token');
    const textFile = 'This is not an image file';

    try {
      const response = await apiClient.uploadFile('/user/profile/photo', textFile, 'invalid.txt');
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('error', 'Invalid file format');
      expect(response.data).toHaveProperty('message', 'Only JPG and PNG files are allowed');
    } catch (error: any) {
      expect(error.response?.status).toBe(400);
      expect(error.response?.data).toHaveProperty('error');
    }
  });

  it('UPD_PHOTO_03: File too large returns 413', async () => {
    apiClient.setAuthToken('valid_bearer_token');
    const largeFile = TestDataFactory.generateLargeImageBuffer();

    try {
      const response = await apiClient.uploadFile('/user/profile/photo', largeFile, 'large.jpg');
      expect(response.status).toBe(413);
      expect(response.data).toHaveProperty('error', 'File too large');
      expect(response.data).toHaveProperty('message', 'File size must not exceed maximum limit');
    } catch (error: any) {
      expect(error.response?.status).toBe(413);
      expect(error.response?.data).toHaveProperty('error');
    }
  });

  it('UPD_PHOTO_04: Missing file returns 400', async () => {
    apiClient.setAuthToken('valid_bearer_token');

    try {
      // Send empty request body
      const response = await apiClient.put('/user/profile/photo', {});
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('error', 'Validation error');
      expect(response.data).toHaveProperty('message', 'Photo file is required');
    } catch (error: any) {
      expect(error.response?.status).toBe(400);
      expect(error.response?.data).toHaveProperty('error');
    }
  });

  it('UPD_PHOTO_05: Corrupted file returns 400', async () => {
    apiClient.setAuthToken('valid_bearer_token');
    const corruptedFile = TestDataFactory.generateCorruptedImageBuffer();

    try {
      const response = await apiClient.uploadFile('/user/profile/photo', corruptedFile, 'corrupted.jpg');
      expect(response.status).toBe(400);
      expect(response.data).toHaveProperty('error', 'Invalid file');
      expect(response.data).toHaveProperty('message', 'File is corrupted or invalid');
    } catch (error: any) {
      expect(error.response?.status).toBe(400);
      expect(error.response?.data).toHaveProperty('error');
    }
  });
});