import { vi } from 'vitest';
import { TestDataFactory } from './test-factory';

// Mock external OAuth providers using Vitest mocks
export const mockOAuthServices = () => {
  // Mock Google OAuth validation
  const mockGoogleTokenValidation = vi.fn((token: string) => {
    if (token === TestDataFactory.getMockGoogleToken()) {
      return Promise.resolve({
        data: {
          aud: 'google-client-id',
          exp: Math.floor(Date.now() / 1000) + 3600,
          iat: Math.floor(Date.now() / 1000),
          iss: 'https://accounts.google.com',
          sub: 'google-user-id',
          email: 'google.user@gmail.com',
          email_verified: true,
          name: 'Google User',
        },
      });
    }
    
    return Promise.reject(new Error('Invalid Google token'));
  });

  // Mock Apple OAuth validation
  const mockAppleTokenValidation = vi.fn((token: string) => {
    if (token === TestDataFactory.getMockAppleToken()) {
      return Promise.resolve({
        data: {
          access_token: 'apple-access-token',
          token_type: 'Bearer',
          expires_in: 3600,
          refresh_token: 'apple-refresh-token',
          id_token: 'apple-id-token',
        },
      });
    }
    
    return Promise.reject(new Error('Invalid Apple token'));
  });

  // Mock email service
  const mockEmailService = vi.fn(() => {
    return Promise.resolve({
      data: {
        message_id: 'mock-email-123',
        status: 'queued',
      },
    });
  });

  return {
    mockGoogleTokenValidation,
    mockAppleTokenValidation,
    mockEmailService,
  };
};

// Create global mocks
export const globalMocks = mockOAuthServices();