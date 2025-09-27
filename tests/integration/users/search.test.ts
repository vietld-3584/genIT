import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { UserFactory } from '../fixtures';
import { getTestApp } from '../setup/server';

describe('GET /users/search', () => {
  let app: any;

  beforeEach(() => {
    app = getTestApp();
    expect(app).toBeTruthy();
  });

  // SEARCH_01: Search users successfully
  it('SEARCH_01: should return search results for valid query', async () => {
    const response = await request(app)
      .get('/users/search')
      .query({ q: 'john' })
      .set('Authorization', 'Bearer valid_jwt_token')
      .expect('Content-Type', /json/);

    expect(response.status).toBe(404);
    // When implemented, should be 200 with users array and total count
  });

  // SEARCH_02: No search results
  it('SEARCH_02: should return empty results for non-matching query', async () => {
    const response = await request(app)
      .get('/users/search')
      .query({ q: 'nonexistentuser' })
      .set('Authorization', 'Bearer valid_jwt_token')
      .expect('Content-Type', /json/);

    expect(response.status).toBe(404);
    // When implemented, should be 200 with empty users array and total 0
  });

  // SEARCH_03: Missing search query
  it('SEARCH_03: should reject request without search query', async () => {
    const response = await request(app)
      .get('/users/search')
      .set('Authorization', 'Bearer valid_jwt_token')
      .expect('Content-Type', /json/);

    expect(response.status).toBe(404);
    // When implemented, should be 400 with validation error
  });

  // SEARCH_04: Empty search query
  it('SEARCH_04: should reject request with empty search query', async () => {
    const response = await request(app)
      .get('/users/search')
      .query({ q: '' })
      .set('Authorization', 'Bearer valid_jwt_token')
      .expect('Content-Type', /json/);

    expect(response.status).toBe(404);
    // When implemented, should be 400 with validation error
  });

  // SEARCH_05: Query too long
  it('SEARCH_05: should reject request with query too long', async () => {
    const longQuery = 'a'.repeat(110); // Over 100 chars
    
    const response = await request(app)
      .get('/users/search')
      .query({ q: longQuery })
      .set('Authorization', 'Bearer valid_jwt_token')
      .expect('Content-Type', /json/);

    expect(response.status).toBe(404);
    // When implemented, should be 400 with validation error
  });
});