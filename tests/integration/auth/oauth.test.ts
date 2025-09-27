import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { server } from '../server'

describe('POST /auth/signup/google', () => {
  it('GOOGLE_01: Valid Google OAuth token', async () => {
    // Mock valid Google token - in real tests, this would be mocked at the service level
    await request(server)
      .post('/api/auth/signup/google')
      .send({
        token: 'valid_google_oauth_token'
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('token')
        expect(res.body).toHaveProperty('user')
        expect(res.body).toHaveProperty('expiresIn', 3600)
      })
  })

  it('GOOGLE_02: Invalid Google token', async () => {
    await request(server)
      .post('/api/auth/signup/google')
      .send({
        token: 'invalid_google_token'
      })
      .expect(400)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Invalid OAuth token')
        expect(res.body).toHaveProperty('message', 'Google token validation failed')
      })
  })

  it('GOOGLE_03: Missing token', async () => {
    await request(server)
      .post('/api/auth/signup/google')
      .send({})
      .expect(400)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Validation error')
        expect(res.body).toHaveProperty('message', 'Token is required')
      })
  })

  it('GOOGLE_04: Expired Google token', async () => {
    await request(server)
      .post('/api/auth/signup/google')
      .send({
        token: 'expired_google_token'
      })
      .expect(400)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Invalid OAuth token')
        expect(res.body).toHaveProperty('message', 'Token has expired')
      })
  })
})

describe('POST /auth/signup/apple', () => {
  it('APPLE_01: Valid Apple OAuth token', async () => {
    await request(server)
      .post('/api/auth/signup/apple')
      .send({
        token: 'valid_apple_oauth_token'
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('token')
        expect(res.body).toHaveProperty('user')
        expect(res.body).toHaveProperty('expiresIn', 3600)
      })
  })

  it('APPLE_02: Invalid Apple token', async () => {
    await request(server)
      .post('/api/auth/signup/apple')
      .send({
        token: 'invalid_apple_token'
      })
      .expect(400)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Invalid OAuth token')
        expect(res.body).toHaveProperty('message', 'Apple token validation failed')
      })
  })

  it('APPLE_03: Missing token', async () => {
    await request(server)
      .post('/api/auth/signup/apple')
      .send({})
      .expect(400)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Validation error')
        expect(res.body).toHaveProperty('message', 'Token is required')
      })
  })
})