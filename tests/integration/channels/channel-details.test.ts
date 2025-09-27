import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { server } from '../server'
import { createTestUser, createTestChannel, createChannelMember } from '../setup'

describe('GET /channels/{channelId}', () => {
  let testUser: any
  let authToken: string
  let testChannel: any
  let privateChannel: any

  beforeEach(async () => {
    testUser = await createTestUser({
      email: 'testuser@example.com',
      name: 'Test User'
    })
    
    authToken = 'Bearer valid_jwt_token'
    
    // Create channels
    testChannel = await createTestChannel({
      channelName: 'general',
      description: 'General discussion channel'
    })
    
    privateChannel = await createTestChannel({
      channelName: 'private-channel',
      description: 'Private channel'
    })
    
    // Add user to general channel only
    await createChannelMember(testChannel, testUser, 'member')
  })

  it('GET_CH_01: Get channel details', async () => {
    await request(server)
      .get(`/api/channels/${testChannel.id}`)
      .set('Authorization', authToken)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', testChannel.id)
        expect(res.body).toHaveProperty('name', 'general')
        expect(res.body).toHaveProperty('description', 'General discussion channel')
        expect(res.body).toHaveProperty('memberCount')
        expect(res.body).toHaveProperty('createdAt')
      })
  })

  it('GET_CH_02: Channel not found', async () => {
    await request(server)
      .get('/api/channels/ch_nonexistent')
      .set('Authorization', authToken)
      .expect(404)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Channel not found')
        expect(res.body).toHaveProperty('message', 'Channel does not exist')
      })
  })

  it('GET_CH_03: No access to channel', async () => {
    await request(server)
      .get(`/api/channels/${privateChannel.id}`)
      .set('Authorization', authToken)
      .expect(403)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Access denied')
        expect(res.body).toHaveProperty('message', 'User does not have access to this channel')
      })
  })

  it('GET_CH_04: Unauthorized access', async () => {
    await request(server)
      .get(`/api/channels/${testChannel.id}`)
      .expect(401)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Unauthorized')
        expect(res.body).toHaveProperty('message', 'Access token required')
      })
  })
})

describe('PUT /channels/{channelId}', () => {
  let testUser: any
  let adminUser: any
  let authToken: string
  let adminToken: string
  let testChannel: any

  beforeEach(async () => {
    testUser = await createTestUser({
      email: 'member@example.com',
      name: 'Member User'
    })
    
    adminUser = await createTestUser({
      email: 'admin@example.com',
      name: 'Admin User'
    })
    
    authToken = 'Bearer member_jwt_token'
    adminToken = 'Bearer admin_jwt_token'
    
    testChannel = await createTestChannel({
      channelName: 'general',
      description: 'General discussion'
    })
    
    // Add users with different roles
    await createChannelMember(testChannel, testUser, 'member')
    await createChannelMember(testChannel, adminUser, 'admin')
  })

  it('UPDATE_CH_01: Update channel successfully', async () => {
    await request(server)
      .put(`/api/channels/${testChannel.id}`)
      .set('Authorization', adminToken)
      .send({
        name: 'Updated Research',
        description: 'Updated description'
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', testChannel.id)
        expect(res.body).toHaveProperty('name', 'Updated Research')
        expect(res.body).toHaveProperty('description', 'Updated description')
      })
  })

  it('UPDATE_CH_02: Empty channel name', async () => {
    await request(server)
      .put(`/api/channels/${testChannel.id}`)
      .set('Authorization', adminToken)
      .send({
        name: '',
        description: 'Updated description'
      })
      .expect(400)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Validation error')
        expect(res.body).toHaveProperty('message', 'Channel name cannot be empty')
      })
  })

  it('UPDATE_CH_03: Channel name too long', async () => {
    const longName = 'a'.repeat(105) // Creates name > 100 chars
    
    await request(server)
      .put(`/api/channels/${testChannel.id}`)
      .set('Authorization', adminToken)
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

  it('UPDATE_CH_04: Channel not found', async () => {
    await request(server)
      .put('/api/channels/ch_nonexistent')
      .set('Authorization', adminToken)
      .send({
        name: 'Updated Research',
        description: 'Updated description'
      })
      .expect(404)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Channel not found')
        expect(res.body).toHaveProperty('message', 'Channel does not exist')
      })
  })

  it('UPDATE_CH_05: Insufficient permissions', async () => {
    await request(server)
      .put(`/api/channels/${testChannel.id}`)
      .set('Authorization', authToken) // Regular member token
      .send({
        name: 'Updated Research',
        description: 'Updated description'
      })
      .expect(403)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Insufficient permissions')
        expect(res.body).toHaveProperty('message', 'User does not have permission to edit this channel')
      })
  })
})

describe('DELETE /channels/{channelId}', () => {
  let testUser: any
  let adminUser: any
  let authToken: string
  let adminToken: string
  let testChannel: any

  beforeEach(async () => {
    testUser = await createTestUser({
      email: 'member@example.com',
      name: 'Member User'
    })
    
    adminUser = await createTestUser({
      email: 'admin@example.com',
      name: 'Admin User'
    })
    
    authToken = 'Bearer member_jwt_token'
    adminToken = 'Bearer admin_jwt_token'
    
    testChannel = await createTestChannel({
      channelName: 'to-be-deleted',
      description: 'Channel to be deleted'
    })
    
    await createChannelMember(testChannel, testUser, 'member')
    await createChannelMember(testChannel, adminUser, 'admin')
  })

  it('DELETE_CH_01: Delete channel successfully', async () => {
    await request(server)
      .delete(`/api/channels/${testChannel.id}`)
      .set('Authorization', adminToken)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('message', 'Channel deleted successfully')
      })
  })

  it('DELETE_CH_02: Channel not found', async () => {
    await request(server)
      .delete('/api/channels/ch_nonexistent')
      .set('Authorization', adminToken)
      .expect(404)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Channel not found')
        expect(res.body).toHaveProperty('message', 'Channel does not exist')
      })
  })

  it('DELETE_CH_03: Insufficient permissions', async () => {
    await request(server)
      .delete(`/api/channels/${testChannel.id}`)
      .set('Authorization', authToken) // Regular member token
      .expect(403)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Insufficient permissions')
        expect(res.body).toHaveProperty('message', 'User does not have permission to delete this channel')
      })
  })

  it('DELETE_CH_04: Unauthorized access', async () => {
    await request(server)
      .delete(`/api/channels/${testChannel.id}`)
      .expect(401)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Unauthorized')
        expect(res.body).toHaveProperty('message', 'Access token required')
      })
  })
})