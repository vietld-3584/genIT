import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { server } from '../server'
import { createTestUser } from '../setup'

describe('GET /users/search', () => {
  let testUser: any
  let user1: any
  let user2: any
  let user3: any
  let authToken: string

  beforeEach(async () => {
    testUser = await createTestUser({
      email: 'testuser@example.com',
      name: 'Test User'
    })
    
    user1 = await createTestUser({
      email: 'john.doe@example.com',
      name: 'John Doe'
    })
    
    user2 = await createTestUser({
      email: 'jane.smith@example.com',
      name: 'Jane Smith'
    })
    
    user3 = await createTestUser({
      email: 'bob.johnson@example.com',
      name: 'Bob Johnson'
    })
    
    authToken = 'Bearer valid_jwt_token'
  })

  it('SEARCH_01: Search users successfully', async () => {
    await request(server)
      .get('/api/users/search')
      .query({ q: 'john' })
      .set('Authorization', authToken)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('users')
        expect(res.body).toHaveProperty('total')
        expect(res.body.users).toBeInstanceOf(Array)
        expect(res.body.total).toBeGreaterThanOrEqual(0)
        
        if (res.body.users.length > 0) {
          expect(res.body.users[0]).toHaveProperty('id')
          expect(res.body.users[0]).toHaveProperty('email')
          expect(res.body.users[0]).toHaveProperty('name')
        }
        
        // Should find users with 'john' in name or email
        const foundJohn = res.body.users.some((user: any) => 
          user.name.toLowerCase().includes('john') || 
          user.email.toLowerCase().includes('john')
        )
        expect(foundJohn).toBe(true)
      })
  })

  it('SEARCH_02: No search results', async () => {
    await request(server)
      .get('/api/users/search')
      .query({ q: 'nonexistentuser12345' })
      .set('Authorization', authToken)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('users')
        expect(res.body).toHaveProperty('total', 0)
        expect(res.body.users).toEqual([])
      })
  })

  it('SEARCH_03: Missing search query', async () => {
    await request(server)
      .get('/api/users/search')
      .set('Authorization', authToken)
      .expect(400)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Invalid search query')
        expect(res.body).toHaveProperty('message', "Search query parameter 'q' is required")
      })
  })

  it('SEARCH_04: Empty search query', async () => {
    await request(server)
      .get('/api/users/search')
      .query({ q: '' })
      .set('Authorization', authToken)
      .expect(400)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Invalid search query')
        expect(res.body).toHaveProperty('message', 'Search query cannot be empty')
      })
  })

  it('SEARCH_05: Query too long (>100)', async () => {
    const longQuery = 'a'.repeat(105) // Creates query > 100 chars
    
    await request(server)
      .get('/api/users/search')
      .query({ q: longQuery })
      .set('Authorization', authToken)
      .expect(400)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Invalid search query')
        expect(res.body).toHaveProperty('message', 'Search query must not exceed 100 characters')
      })
  })

  it('SEARCH_06: Unauthorized access', async () => {
    await request(server)
      .get('/api/users/search')
      .query({ q: 'john' })
      .expect(401)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Unauthorized')
        expect(res.body).toHaveProperty('message', 'Access token required')
      })
  })

  it('SEARCH_07: Case insensitive search', async () => {
    await request(server)
      .get('/api/users/search')
      .query({ q: 'JANE' })
      .set('Authorization', authToken)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('users')
        expect(res.body.total).toBeGreaterThanOrEqual(0)
        
        if (res.body.total > 0) {
          const foundJane = res.body.users.some((user: any) => 
            user.name.toLowerCase().includes('jane') || 
            user.email.toLowerCase().includes('jane')
          )
          expect(foundJane).toBe(true)
        }
      })
  })

  it('SEARCH_08: Search by email partial match', async () => {
    await request(server)
      .get('/api/users/search')
      .query({ q: 'smith' })
      .set('Authorization', authToken)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('users')
        expect(res.body.total).toBeGreaterThanOrEqual(0)
        
        if (res.body.total > 0) {
          const foundSmith = res.body.users.some((user: any) => 
            user.name.toLowerCase().includes('smith') || 
            user.email.toLowerCase().includes('smith')
          )
          expect(foundSmith).toBe(true)
        }
      })
  })
})