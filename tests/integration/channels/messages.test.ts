import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { server } from '../server'
import { createTestUser, createTestChannel, createChannelMember, createTestMessage } from '../setup'

describe('GET /channels/{channelId}/messages', () => {
  let testUser: any
  let otherUser: any
  let authToken: string
  let testChannel: any
  let privateChannel: any
  let message1: any
  let message2: any
  let message3: any

  beforeEach(async () => {
    testUser = await createTestUser({
      email: 'testuser@example.com',
      name: 'Test User'
    })
    
    otherUser = await createTestUser({
      email: 'otheruser@example.com',
      name: 'Other User'
    })
    
    authToken = 'Bearer valid_jwt_token'
    
    // Create channels
    testChannel = await createTestChannel({
      channelName: 'general',
      description: 'General discussion'
    })
    
    privateChannel = await createTestChannel({
      channelName: 'private',
      description: 'Private channel'
    })
    
    // Add user to test channel
    await createChannelMember(testChannel, testUser, 'member')
    await createChannelMember(testChannel, otherUser, 'member')
    
    // Create test messages
    message1 = await createTestMessage(testChannel, testUser, 'Hello everyone!')
    message2 = await createTestMessage(testChannel, otherUser, 'How are you?')
    message3 = await createTestMessage(testChannel, testUser, 'I am fine, thanks!')
  })

  it('GET_MSG_01: Get channel messages', async () => {
    await request(server)
      .get(`/api/channels/${testChannel.id}/messages`)
      .set('Authorization', authToken)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('messages')
        expect(res.body).toHaveProperty('hasMore')
        expect(res.body.messages).toBeInstanceOf(Array)
        expect(res.body.messages.length).toBeGreaterThanOrEqual(3)
        expect(res.body.messages[0]).toHaveProperty('id')
        expect(res.body.messages[0]).toHaveProperty('content')
        expect(res.body.messages[0]).toHaveProperty('sender')
        expect(res.body.messages[0]).toHaveProperty('createdAt')
      })
  })

  it('GET_MSG_02: Get with pagination', async () => {
    await request(server)
      .get(`/api/channels/${testChannel.id}/messages`)
      .query({ limit: 2, before: message3.id })
      .set('Authorization', authToken)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('messages')
        expect(res.body).toHaveProperty('hasMore')
        expect(res.body.messages).toBeInstanceOf(Array)
        expect(res.body.messages.length).toBeLessThanOrEqual(2)
      })
  })

  it('GET_MSG_03: Empty message list', async () => {
    const emptyChannel = await createTestChannel({
      channelName: 'empty-channel',
      description: 'Empty channel'
    })
    
    await createChannelMember(emptyChannel, testUser, 'member')
    
    await request(server)
      .get(`/api/channels/${emptyChannel.id}/messages`)
      .set('Authorization', authToken)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('messages')
        expect(res.body).toHaveProperty('hasMore', false)
        expect(res.body.messages).toEqual([])
      })
  })

  it('GET_MSG_04: Invalid limit', async () => {
    await request(server)
      .get(`/api/channels/${testChannel.id}/messages`)
      .query({ limit: 150 }) // Exceeds maximum
      .set('Authorization', authToken)
      .expect(400)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Validation error')
        expect(res.body).toHaveProperty('message', 'Limit must not exceed 100')
      })
  })

  it('GET_MSG_05: Channel not found', async () => {
    await request(server)
      .get('/api/channels/ch_nonexistent/messages')
      .set('Authorization', authToken)
      .expect(404)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Channel not found')
        expect(res.body).toHaveProperty('message', 'Channel does not exist')
      })
  })

  it('GET_MSG_06: No access to channel', async () => {
    await request(server)
      .get(`/api/channels/${privateChannel.id}/messages`)
      .set('Authorization', authToken)
      .expect(403)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Access denied')
        expect(res.body).toHaveProperty('message', 'User does not have access to this channel')
      })
  })
})

describe('POST /channels/{channelId}/messages', () => {
  let testUser: any
  let restrictedUser: any
  let authToken: string
  let restrictedToken: string
  let testChannel: any
  let privateChannel: any

  beforeEach(async () => {
    testUser = await createTestUser({
      email: 'testuser@example.com',
      name: 'Test User'
    })
    
    restrictedUser = await createTestUser({
      email: 'restricted@example.com',
      name: 'Restricted User'
    })
    
    authToken = 'Bearer valid_jwt_token'
    restrictedToken = 'Bearer restricted_jwt_token'
    
    // Create channels
    testChannel = await createTestChannel({
      channelName: 'general',
      description: 'General discussion'
    })
    
    privateChannel = await createTestChannel({
      channelName: 'private',
      description: 'Private channel'
    })
    
    // Add user to test channel with send permission
    await createChannelMember(testChannel, testUser, 'member')
    
    // Add restricted user with no send permission (read-only)
    await createChannelMember(testChannel, restrictedUser, 'observer')
  })

  it('SEND_MSG_01: Send message successfully', async () => {
    await request(server)
      .post(`/api/channels/${testChannel.id}/messages`)
      .set('Authorization', authToken)
      .send({
        content: 'Hello, everyone!'
      })
      .expect(201)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('id')
        expect(res.body).toHaveProperty('content', 'Hello, everyone!')
        expect(res.body).toHaveProperty('sender')
        expect(res.body).toHaveProperty('channelId', testChannel.id)
        expect(res.body).toHaveProperty('createdAt')
        expect(res.body.sender).toHaveProperty('name', 'Test User')
      })
  })

  it('SEND_MSG_02: Empty message content', async () => {
    await request(server)
      .post(`/api/channels/${testChannel.id}/messages`)
      .set('Authorization', authToken)
      .send({
        content: ''
      })
      .expect(400)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Validation error')
        expect(res.body).toHaveProperty('message', 'Message content cannot be empty')
      })
  })

  it('SEND_MSG_03: Missing content field', async () => {
    await request(server)
      .post(`/api/channels/${testChannel.id}/messages`)
      .set('Authorization', authToken)
      .send({})
      .expect(400)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Validation error')
        expect(res.body).toHaveProperty('message', 'Content field is required')
      })
  })

  it('SEND_MSG_04: Message too long (>1000)', async () => {
    const longContent = 'a'.repeat(1005) // Creates content > 1000 chars
    
    await request(server)
      .post(`/api/channels/${testChannel.id}/messages`)
      .set('Authorization', authToken)
      .send({
        content: longContent
      })
      .expect(400)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Validation error')
        expect(res.body).toHaveProperty('message', 'Message content must not exceed 1000 characters')
      })
  })

  it('SEND_MSG_05: Whitespace only content', async () => {
    await request(server)
      .post(`/api/channels/${testChannel.id}/messages`)
      .set('Authorization', authToken)
      .send({
        content: '     '
      })
      .expect(400)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Validation error')
        expect(res.body).toHaveProperty('message', 'Message content cannot be only whitespace')
      })
  })

  it('SEND_MSG_06: Channel not found', async () => {
    await request(server)
      .post('/api/channels/ch_nonexistent/messages')
      .set('Authorization', authToken)
      .send({
        content: 'Hello, everyone!'
      })
      .expect(404)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Channel not found')
        expect(res.body).toHaveProperty('message', 'Channel does not exist')
      })
  })

  it('SEND_MSG_07: No send permission', async () => {
    await request(server)
      .post(`/api/channels/${testChannel.id}/messages`)
      .set('Authorization', restrictedToken) // Observer role token
      .send({
        content: 'Hello, everyone!'
      })
      .expect(403)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Access denied')
        expect(res.body).toHaveProperty('message', 'User does not have permission to send messages')
      })
  })
})