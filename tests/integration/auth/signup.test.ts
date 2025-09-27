import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { server } from '../server'
import { createTestUser } from '../setup'

describe('POST /auth/signup', () => {
  beforeEach(async () => {
    // Create an existing user for conflict tests
    await createTestUser({
      email: 'existing@example.com',
      name: 'Existing User'
    })
  })

  it('SIGNUP_01: Successful registration', async () => {
    await request(server)
      .post('/api/auth/signup')
      .send({
        email: 'newuser@example.com',
        password: 'securePass123',
        name: 'John Doe',
        title: 'Developer'
      })
      .expect(201)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('token')
        expect(res.body).toHaveProperty('user')
        expect(res.body).toHaveProperty('expiresIn', 3600)
        expect(res.body.user).toHaveProperty('email', 'newuser@example.com')
        expect(res.body.user).toHaveProperty('name', 'John Doe')
        expect(res.body.user).toHaveProperty('title', 'Developer')
      })
  })

  it('SIGNUP_02: Email already exists', async () => {
    await request(server)
      .post('/api/auth/signup')
      .send({
        email: 'existing@example.com',
        password: 'securePass123',
        name: 'John Doe'
      })
      .expect(409)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Email already exists')
        expect(res.body).toHaveProperty('message', 'This email is already registered')
      })
  })

  it('SIGNUP_03: Invalid email format', async () => {
    await request(server)
      .post('/api/auth/signup')
      .send({
        email: 'invalid-email',
        password: 'securePass123',
        name: 'John Doe'
      })
      .expect(400)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Validation error')
        expect(res.body).toHaveProperty('message', 'Invalid email format')
      })
  })

  it('SIGNUP_04: Missing required name', async () => {
    await request(server)
      .post('/api/auth/signup')
      .send({
        email: 'newuser@example.com',
        password: 'securePass123'
      })
      .expect(400)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Validation error')
        expect(res.body).toHaveProperty('message', 'Name is required')
      })
  })

  it('SIGNUP_05: Password too short', async () => {
    await request(server)
      .post('/api/auth/signup')
      .send({
        email: 'newuser@example.com',
        password: '123',
        name: 'John Doe'
      })
      .expect(400)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Validation error')
        expect(res.body).toHaveProperty('message', 'Password must be at least 6 characters')
      })
  })

  it('SIGNUP_06: Name too long (>255)', async () => {
    const longName = 'a'.repeat(260) // Creates name > 255 chars
    
    await request(server)
      .post('/api/auth/signup')
      .send({
        email: 'newuser@example.com',
        password: 'securePass123',
        name: longName
      })
      .expect(400)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Validation error')
        expect(res.body).toHaveProperty('message', 'Name must not exceed 255 characters')
      })
  })

  it('SIGNUP_07: Title too long (>100)', async () => {
    const longTitle = 'a'.repeat(110) // Creates title > 100 chars
    
    await request(server)
      .post('/api/auth/signup')
      .send({
        email: 'newuser@example.com',
        password: 'securePass123',
        name: 'John',
        title: longTitle
      })
      .expect(400)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Validation error')
        expect(res.body).toHaveProperty('message', 'Title must not exceed 100 characters')
      })
  })

  it('SIGNUP_08: Empty required fields', async () => {
    await request(server)
      .post('/api/auth/signup')
      .send({
        email: '',
        password: '',
        name: ''
      })
      .expect(400)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Validation error')
        expect(res.body).toHaveProperty('message', 'Email, password, and name are required')
      })
  })
})