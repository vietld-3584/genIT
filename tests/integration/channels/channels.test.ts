import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { server } from '../server'
import { createTestUser, createTestChannel, createChannelMember } from '../setup'

describe('GET /channels', () => {
  let testUser: any
  let authToken: string
  let testChannel1: any
  let testChannel2: any

  beforeEach(async () => {
    // Create test user
    testUser = await createTestUser({
      email: 'testuser@example.com',
      name: 'Test User'
    })
    
    // Mock auth token
    authToken = 'Bearer valid_jwt_token'
    
    // Create test channels
    testChannel1 = await createTestChannel({
      channelName: 'general',
      description: 'General discussion'
    })
    
    testChannel2 = await createTestChannel({
      channelName: 'random',
      description: 'Random chat'
    })
    
    // Add user to channels
    await createChannelMember(testChannel1, testUser, 'member')
    await createChannelMember(testChannel2, testUser, 'admin')
  })

  it('CHANNELS_01: Get user channels', async () => {
    await request(server)
      .get('/api/channels')
      .set('Authorization', authToken)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('channels')
        expect(res.body.channels).toBeInstanceOf(Array)
        expect(res.body.channels.length).toBeGreaterThanOrEqual(2)
        expect(res.body.channels[0]).toHaveProperty('id')
        expect(res.body.channels[0]).toHaveProperty('name')
        expect(res.body.channels[0]).toHaveProperty('description')
      })
  })

  it('CHANNELS_02: No channels available', async () => {
    // Create user with no channels
    const newUser = await createTestUser({
      email: 'noChannels@example.com',
      name: 'No Channels User'
    })
    
    await request(server)
      .get('/api/channels')
      .set('Authorization', 'Bearer token_for_user_with_no_channels')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('channels')
        expect(res.body.channels).toEqual([])
      })
  })

  it('CHANNELS_03: Unauthorized access', async () => {
    await request(server)
      .get('/api/channels')
      .expect(401)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Unauthorized')
        expect(res.body).toHaveProperty('message', 'Access token required')
      })
  })

  it('CHANNELS_04: Invalid token', async () => {
    await request(server)
      .get('/api/channels')
      .set('Authorization', 'Bearer invalid_token')
      .expect(401)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Unauthorized')
        expect(res.body).toHaveProperty('message', 'Invalid access token')
      })
  })
})

describe('POST /channels', () => {
  let testUser: any
  let authToken: string

  beforeEach(async () => {
    testUser = await createTestUser({
      email: 'testuser@example.com',
      name: 'Test User'
    })
    
    authToken = 'Bearer valid_jwt_token'
  })

  it('CREATE_CH_01: Create channel successfully', async () => {
    await request(server)
      .post('/api/channels')
      .set('Authorization', authToken)
      .send({
        name: 'Research',
        description: 'Research discussions'
      })
      .expect(201)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('id')
        expect(res.body).toHaveProperty('name', 'Research')
        expect(res.body).toHaveProperty('description', 'Research discussions')
        expect(res.body).toHaveProperty('memberCount')
        expect(res.body).toHaveProperty('createdAt')
      })
  })

  it('CREATE_CH_02: Missing channel name', async () => {
    await request(server)
      .post('/api/channels')
      .set('Authorization', authToken)
      .send({
        description: 'Research discussions'
      })
      .expect(400)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Validation error')
        expect(res.body).toHaveProperty('message', 'Channel name is required')
      })
  })

  it('CREATE_CH_03: Empty channel name', async () => {
    await request(server)
      .post('/api/channels')
      .set('Authorization', authToken)
      .send({
        name: '',
        description: 'Research discussions'
      })
      .expect(400)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Validation error')
        expect(res.body).toHaveProperty('message', 'Channel name cannot be empty')
      })
  })

  it('CREATE_CH_04: Channel name too long (>100)', async () => {
    const longName = 'a'.repeat(105) // Creates name > 100 chars
    
    await request(server)
      .post('/api/channels')
      .set('Authorization', authToken)
      .send({
        name: longName,
        description: 'desc'
      })
      .expect(400)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Validation error')
        expect(res.body).toHaveProperty('message', 'Channel name must not exceed 100 characters')
      })
  })

  it('CREATE_CH_05: Description too long (>1000)', async () => {
    const longDescription = 'a'.repeat(1005) // Creates description > 1000 chars
    
    await request(server)
      .post('/api/channels')
      .set('Authorization', authToken)
      .send({
        name: 'Research',
        description: longDescription
      })
      .expect(400)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Validation error')
        expect(res.body).toHaveProperty('message', 'Description must not exceed 1000 characters')
      })
  })

  it('CREATE_CH_06: Unauthorized user', async () => {
    await request(server)
      .post('/api/channels')
      .send({
        name: 'Research',
        description: 'Research discussions'
      })
      .expect(401)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Unauthorized')
        expect(res.body).toHaveProperty('message', 'Access token required')
      })
  })

  it('CREATE_CH_07: Insufficient permissions', async () => {
    await request(server)
      .post('/api/channels')
      .set('Authorization', 'Bearer token_for_restricted_user')
      .send({
        name: 'Research',
        description: 'Research discussions'
      })
      .expect(403)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Insufficient permissions')
        expect(res.body).toHaveProperty('message', 'User does not have permission to create channels')
      })
  })
})