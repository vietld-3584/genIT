import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { server } from '../server'
import { createTestUser, createTestChannel, createChannelMember } from '../setup'

describe('GET /channels/{channelId}/members', () => {
  let testUser: any
  let member1: any
  let member2: any
  let authToken: string
  let testChannel: any
  let privateChannel: any

  beforeEach(async () => {
    testUser = await createTestUser({
      email: 'testuser@example.com',
      name: 'Test User'
    })
    
    member1 = await createTestUser({
      email: 'member1@example.com',
      name: 'Member One'
    })
    
    member2 = await createTestUser({
      email: 'member2@example.com',
      name: 'Member Two'
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
    
    // Add members to test channel
    await createChannelMember(testChannel, testUser, 'admin')
    await createChannelMember(testChannel, member1, 'member')
    await createChannelMember(testChannel, member2, 'member')
  })

  it('GET_MEM_01: Get channel members', async () => {
    await request(server)
      .get(`/api/channels/${testChannel.id}/members`)
      .set('Authorization', authToken)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('members')
        expect(res.body).toHaveProperty('count', 3)
        expect(res.body.members).toBeInstanceOf(Array)
        expect(res.body.members.length).toBe(3)
        expect(res.body.members[0]).toHaveProperty('id')
        expect(res.body.members[0]).toHaveProperty('email')
        expect(res.body.members[0]).toHaveProperty('name')
      })
  })

  it('GET_MEM_02: Empty member list', async () => {
    const emptyChannel = await createTestChannel({
      channelName: 'empty-channel',
      description: 'Empty channel'
    })
    
    // Add only the requesting user as admin to access the channel
    await createChannelMember(emptyChannel, testUser, 'admin')
    
    await request(server)
      .get(`/api/channels/${emptyChannel.id}/members`)
      .set('Authorization', authToken)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('members')
        expect(res.body).toHaveProperty('count', 1) // Only the admin user
        expect(res.body.members).toBeInstanceOf(Array)
        expect(res.body.members.length).toBe(1)
      })
  })

  it('GET_MEM_03: Channel not found', async () => {
    await request(server)
      .get('/api/channels/ch_nonexistent/members')
      .set('Authorization', authToken)
      .expect(404)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Channel not found')
        expect(res.body).toHaveProperty('message', 'Channel does not exist')
      })
  })

  it('GET_MEM_04: No access to channel', async () => {
    await request(server)
      .get(`/api/channels/${privateChannel.id}/members`)
      .set('Authorization', authToken)
      .expect(403)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Access denied')
        expect(res.body).toHaveProperty('message', 'User does not have access to this channel')
      })
  })
})

describe('POST /channels/{channelId}/members', () => {
  let testUser: any
  let targetUser1: any
  let targetUser2: any
  let authToken: string
  let memberToken: string
  let testChannel: any

  beforeEach(async () => {
    testUser = await createTestUser({
      email: 'admin@example.com',
      name: 'Admin User'
    })
    
    targetUser1 = await createTestUser({
      email: 'user1@example.com',
      name: 'User One'
    })
    
    targetUser2 = await createTestUser({
      email: 'user2@example.com',
      name: 'User Two'
    })
    
    const memberUser = await createTestUser({
      email: 'member@example.com',
      name: 'Regular Member'
    })
    
    authToken = 'Bearer admin_jwt_token'
    memberToken = 'Bearer member_jwt_token'
    
    testChannel = await createTestChannel({
      channelName: 'general',
      description: 'General discussion'
    })
    
    // Add admin and member
    await createChannelMember(testChannel, testUser, 'admin')
    await createChannelMember(testChannel, memberUser, 'member')
  })

  it('ADD_MEM_01: Add members successfully', async () => {
    await request(server)
      .post(`/api/channels/${testChannel.id}/members`)
      .set('Authorization', authToken)
      .send({
        userIds: [targetUser1.id.toString(), targetUser2.id.toString()]
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('message', 'Members added successfully')
        expect(res.body).toHaveProperty('added')
        expect(res.body.added).toBeInstanceOf(Array)
        expect(res.body.added.length).toBe(2)
      })
  })

  it('ADD_MEM_02: Empty user list', async () => {
    await request(server)
      .post(`/api/channels/${testChannel.id}/members`)
      .set('Authorization', authToken)
      .send({
        userIds: []
      })
      .expect(400)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Validation error')
        expect(res.body).toHaveProperty('message', 'At least one user ID is required')
      })
  })

  it('ADD_MEM_03: Missing userIds field', async () => {
    await request(server)
      .post(`/api/channels/${testChannel.id}/members`)
      .set('Authorization', authToken)
      .send({})
      .expect(400)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Validation error')
        expect(res.body).toHaveProperty('message', 'userIds field is required')
      })
  })

  it('ADD_MEM_04: User not found', async () => {
    await request(server)
      .post(`/api/channels/${testChannel.id}/members`)
      .set('Authorization', authToken)
      .send({
        userIds: ['999999'] // Non-existent user ID
      })
      .expect(404)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'User not found')
        expect(res.body).toHaveProperty('message', 'One or more users do not exist')
      })
  })

  it('ADD_MEM_05: Channel not found', async () => {
    await request(server)
      .post('/api/channels/ch_nonexistent/members')
      .set('Authorization', authToken)
      .send({
        userIds: [targetUser1.id.toString()]
      })
      .expect(404)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Channel not found')
        expect(res.body).toHaveProperty('message', 'Channel does not exist')
      })
  })

  it('ADD_MEM_06: Insufficient permissions', async () => {
    await request(server)
      .post(`/api/channels/${testChannel.id}/members`)
      .set('Authorization', memberToken) // Regular member token
      .send({
        userIds: [targetUser1.id.toString()]
      })
      .expect(403)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Insufficient permissions')
        expect(res.body).toHaveProperty('message', 'User does not have permission to add members')
      })
  })
})

describe('DELETE /channels/{channelId}/members/{userId}', () => {
  let adminUser: any
  let memberUser: any
  let targetUser: any
  let adminToken: string
  let memberToken: string
  let testChannel: any

  beforeEach(async () => {
    adminUser = await createTestUser({
      email: 'admin@example.com',
      name: 'Admin User'
    })
    
    memberUser = await createTestUser({
      email: 'member@example.com',
      name: 'Member User'
    })
    
    targetUser = await createTestUser({
      email: 'target@example.com',
      name: 'Target User'
    })
    
    adminToken = 'Bearer admin_jwt_token'
    memberToken = 'Bearer member_jwt_token'
    
    testChannel = await createTestChannel({
      channelName: 'general',
      description: 'General discussion'
    })
    
    // Add users to channel
    await createChannelMember(testChannel, adminUser, 'admin')
    await createChannelMember(testChannel, memberUser, 'member')
    await createChannelMember(testChannel, targetUser, 'member')
  })

  it('REM_MEM_01: Remove member successfully', async () => {
    await request(server)
      .delete(`/api/channels/${testChannel.id}/members/${targetUser.id}`)
      .set('Authorization', adminToken)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('message', 'Member removed successfully')
      })
  })

  it('REM_MEM_02: Member not in channel', async () => {
    const nonMemberUser = await createTestUser({
      email: 'nonmember@example.com',
      name: 'Non Member User'
    })
    
    await request(server)
      .delete(`/api/channels/${testChannel.id}/members/${nonMemberUser.id}`)
      .set('Authorization', adminToken)
      .expect(404)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Member not found')
        expect(res.body).toHaveProperty('message', 'User is not a member of this channel')
      })
  })

  it('REM_MEM_03: Channel not found', async () => {
    await request(server)
      .delete(`/api/channels/ch_nonexistent/members/${targetUser.id}`)
      .set('Authorization', adminToken)
      .expect(404)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Channel not found')
        expect(res.body).toHaveProperty('message', 'Channel does not exist')
      })
  })

  it('REM_MEM_04: Insufficient permissions', async () => {
    await request(server)
      .delete(`/api/channels/${testChannel.id}/members/${targetUser.id}`)
      .set('Authorization', memberToken) // Regular member token
      .expect(403)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Insufficient permissions')
        expect(res.body).toHaveProperty('message', 'User does not have permission to remove members')
      })
  })
})