import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { server } from '../server'
import { createTestUser } from '../setup'

describe('POST /auth/signin', () => {
  let testUser: any

  beforeEach(async () => {
    // Create a test user for login tests
    testUser = await createTestUser({
      email: 'user@example.com',
      passwordHash: '$2b$10$validPasswordHashForTesting', // This would be a proper bcrypt hash in real app
      name: 'Test User'
    })
  })

  it('LOGIN_01: Successful login', async () => {
    await request(server)
      .post('/api/auth/signin')
      .send({
        email: 'user@example.com',
        password: 'validPassword123'
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('token')
        expect(res.body).toHaveProperty('user')
        expect(res.body).toHaveProperty('expiresIn', 3600)
        expect(res.body.user).toHaveProperty('email', 'user@example.com')
        expect(res.body.user).toHaveProperty('name', 'Test User')
      })
  })

  it('LOGIN_02: Invalid password', async () => {
    await request(server)
      .post('/api/auth/signin')
      .send({
        email: 'user@example.com',
        password: 'wrongPassword'
      })
      .expect(401)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Invalid credentials')
        expect(res.body).toHaveProperty('message', 'Email or password is incorrect')
      })
  })

  it('LOGIN_03: Invalid email format', async () => {
    await request(server)
      .post('/api/auth/signin')
      .send({
        email: 'invalid-email',
        password: 'validPassword123'
      })
      .expect(400)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Validation error')
        expect(res.body).toHaveProperty('message', 'Invalid email format')
      })
  })

  it('LOGIN_04: Empty email field', async () => {
    await request(server)
      .post('/api/auth/signin')
      .send({
        email: '',
        password: 'validPassword123'
      })
      .expect(400)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Validation error')
        expect(res.body).toHaveProperty('message', 'Email is required')
      })
  })

  it('LOGIN_05: Empty password field', async () => {
    await request(server)
      .post('/api/auth/signin')
      .send({
        email: 'user@example.com',
        password: ''
      })
      .expect(400)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Validation error')
        expect(res.body).toHaveProperty('message', 'Password is required')
      })
  })

  it('LOGIN_06: Password too short', async () => {
    await request(server)
      .post('/api/auth/signin')
      .send({
        email: 'user@example.com',
        password: '123'
      })
      .expect(400)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Validation error')
        expect(res.body).toHaveProperty('message', 'Password must be at least 6 characters')
      })
  })

  it('LOGIN_07: Email too short', async () => {
    await request(server)
      .post('/api/auth/signin')
      .send({
        email: 'a@b',
        password: 'validPassword123'
      })
      .expect(400)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Validation error')
        expect(res.body).toHaveProperty('message', 'Email must be at least 5 characters')
      })
  })

  it('LOGIN_08: Email too long (>254)', async () => {
    const longEmail = 'a'.repeat(250) + '@example.com' // Creates email > 254 chars
    
    await request(server)
      .post('/api/auth/signin')
      .send({
        email: longEmail,
        password: 'validPassword123'
      })
      .expect(400)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Validation error')
        expect(res.body).toHaveProperty('message', 'Email must not exceed 254 characters')
      })
  })

  it('LOGIN_09: Password too long (>128)', async () => {
    const longPassword = 'a'.repeat(130) // Creates password > 128 chars
    
    await request(server)
      .post('/api/auth/signin')
      .send({
        email: 'user@example.com',
        password: longPassword
      })
      .expect(400)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Validation error')
        expect(res.body).toHaveProperty('message', 'Password must not exceed 128 characters')
      })
  })

  it('LOGIN_10: Non-existent user', async () => {
    await request(server)
      .post('/api/auth/signin')
      .send({
        email: 'nonexistent@example.com',
        password: 'validPassword123'
      })
      .expect(401)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Invalid credentials')
        expect(res.body).toHaveProperty('message', 'Email or password is incorrect')
      })
  })
})