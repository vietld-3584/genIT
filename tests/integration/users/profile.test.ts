import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { server } from '../server'
import { createTestUser } from '../setup'

describe('GET /user/profile', () => {
  let testUser: any
  let authToken: string

  beforeEach(async () => {
    testUser = await createTestUser({
      email: 'testuser@example.com',
      name: 'Test User',
      title: 'Software Engineer'
    })
    
    authToken = 'Bearer valid_jwt_token'
  })

  it('PROFILE_01: Get user profile', async () => {
    await request(server)
      .get('/api/user/profile')
      .set('Authorization', authToken)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('id')
        expect(res.body).toHaveProperty('email', 'testuser@example.com')
        expect(res.body).toHaveProperty('name', 'Test User')
        expect(res.body).toHaveProperty('title', 'Software Engineer')
        expect(res.body).toHaveProperty('createdAt')
        expect(res.body).toHaveProperty('updatedAt')
      })
  })

  it('PROFILE_02: Unauthorized access', async () => {
    await request(server)
      .get('/api/user/profile')
      .expect(401)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Unauthorized')
        expect(res.body).toHaveProperty('message', 'Access token required')
      })
  })

  it('PROFILE_03: Invalid token', async () => {
    await request(server)
      .get('/api/user/profile')
      .set('Authorization', 'Bearer invalid_token')
      .expect(401)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Unauthorized')
        expect(res.body).toHaveProperty('message', 'Invalid access token')
      })
  })
})

describe('PUT /user/profile', () => {
  let testUser: any
  let authToken: string

  beforeEach(async () => {
    testUser = await createTestUser({
      email: 'testuser@example.com',
      name: 'Original Name',
      title: 'Original Title'
    })
    
    authToken = 'Bearer valid_jwt_token'
  })

  it('UPD_PROF_01: Update profile successfully', async () => {
    await request(server)
      .put('/api/user/profile')
      .set('Authorization', authToken)
      .send({
        name: 'Jane Doe',
        title: 'Senior Developer'
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('id')
        expect(res.body).toHaveProperty('name', 'Jane Doe')
        expect(res.body).toHaveProperty('title', 'Senior Developer')
        expect(res.body).toHaveProperty('email', 'testuser@example.com') // Email should remain unchanged
      })
  })

  it('UPD_PROF_02: Name too long (>255)', async () => {
    const longName = 'a'.repeat(260) // Creates name > 255 chars
    
    await request(server)
      .put('/api/user/profile')
      .set('Authorization', authToken)
      .send({
        name: longName,
        title: 'Developer'
      })
      .expect(400)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Validation error')
        expect(res.body).toHaveProperty('message', 'Name must not exceed 255 characters')
      })
  })

  it('UPD_PROF_03: Title too long (>100)', async () => {
    const longTitle = 'a'.repeat(105) // Creates title > 100 chars
    
    await request(server)
      .put('/api/user/profile')
      .set('Authorization', authToken)
      .send({
        name: 'Jane Doe',
        title: longTitle
      })
      .expect(400)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Validation error')
        expect(res.body).toHaveProperty('message', 'Title must not exceed 100 characters')
      })
  })

  it('UPD_PROF_04: Empty name', async () => {
    await request(server)
      .put('/api/user/profile')
      .set('Authorization', authToken)
      .send({
        name: '',
        title: 'Developer'
      })
      .expect(400)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Validation error')
        expect(res.body).toHaveProperty('message', 'Name cannot be empty')
      })
  })

  it('UPD_PROF_05: Update only name', async () => {
    await request(server)
      .put('/api/user/profile')
      .set('Authorization', authToken)
      .send({
        name: 'Updated Name Only'
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('name', 'Updated Name Only')
        expect(res.body).toHaveProperty('title', 'Original Title') // Should remain unchanged
      })
  })

  it('UPD_PROF_06: Update only title', async () => {
    await request(server)
      .put('/api/user/profile')
      .set('Authorization', authToken)
      .send({
        title: 'Updated Title Only'
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('name', 'Original Name') // Should remain unchanged
        expect(res.body).toHaveProperty('title', 'Updated Title Only')
      })
  })

  it('UPD_PROF_07: Unauthorized access', async () => {
    await request(server)
      .put('/api/user/profile')
      .send({
        name: 'Jane Doe',
        title: 'Senior Developer'
      })
      .expect(401)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Unauthorized')
        expect(res.body).toHaveProperty('message', 'Access token required')
      })
  })
})

describe('PUT /user/profile/contact', () => {
  let testUser: any
  let existingUser: any
  let authToken: string

  beforeEach(async () => {
    testUser = await createTestUser({
      email: 'testuser@example.com',
      name: 'Test User'
    })
    
    existingUser = await createTestUser({
      email: 'existing@example.com',
      name: 'Existing User'
    })
    
    authToken = 'Bearer valid_jwt_token'
  })

  it('UPD_CONT_01: Update email successfully', async () => {
    await request(server)
      .put('/api/user/profile/contact')
      .set('Authorization', authToken)
      .send({
        email: 'newemail@example.com'
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('id')
        expect(res.body).toHaveProperty('email', 'newemail@example.com')
        expect(res.body).toHaveProperty('name', 'Test User') // Name should remain unchanged
      })
  })

  it('UPD_CONT_02: Invalid email format', async () => {
    await request(server)
      .put('/api/user/profile/contact')
      .set('Authorization', authToken)
      .send({
        email: 'invalid-email'
      })
      .expect(400)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Validation error')
        expect(res.body).toHaveProperty('message', 'Invalid email format')
      })
  })

  it('UPD_CONT_03: Empty email', async () => {
    await request(server)
      .put('/api/user/profile/contact')
      .set('Authorization', authToken)
      .send({
        email: ''
      })
      .expect(400)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Validation error')
        expect(res.body).toHaveProperty('message', 'Email is required')
      })
  })

  it('UPD_CONT_04: Email already exists', async () => {
    await request(server)
      .put('/api/user/profile/contact')
      .set('Authorization', authToken)
      .send({
        email: 'existing@example.com'
      })
      .expect(409)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Email already in use')
        expect(res.body).toHaveProperty('message', 'This email is already registered to another user')
      })
  })

  it('UPD_CONT_05: Email too short', async () => {
    await request(server)
      .put('/api/user/profile/contact')
      .set('Authorization', authToken)
      .send({
        email: 'a@b'
      })
      .expect(400)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Validation error')
        expect(res.body).toHaveProperty('message', 'Email must be at least 5 characters')
      })
  })

  it('UPD_CONT_06: Email too long (>254)', async () => {
    const longEmail = 'a'.repeat(250) + '@example.com' // Creates email > 254 chars
    
    await request(server)
      .put('/api/user/profile/contact')
      .set('Authorization', authToken)
      .send({
        email: longEmail
      })
      .expect(400)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Validation error')
        expect(res.body).toHaveProperty('message', 'Email must not exceed 254 characters')
      })
  })

  it('UPD_CONT_07: Unauthorized access', async () => {
    await request(server)
      .put('/api/user/profile/contact')
      .send({
        email: 'newemail@example.com'
      })
      .expect(401)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Unauthorized')
        expect(res.body).toHaveProperty('message', 'Access token required')
      })
  })
})

describe('PUT /user/profile/photo', () => {
  let testUser: any
  let authToken: string

  beforeEach(async () => {
    testUser = await createTestUser({
      email: 'testuser@example.com',
      name: 'Test User'
    })
    
    authToken = 'Bearer valid_jwt_token'
  })

  it('UPD_PHOTO_01: Upload photo successfully', async () => {
    // Mock file upload - in real implementation, this would use actual file handling
    await request(server)
      .put('/api/user/profile/photo')
      .set('Authorization', authToken)
      .attach('photo', Buffer.from('fake-image-data'), 'avatar.jpg')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('photoUrl')
        expect(res.body).toHaveProperty('user')
        expect(res.body.photoUrl).toMatch(/^https?:\/\/.*\.jpg$/)
        expect(res.body.user).toHaveProperty('id')
      })
  })

  it('UPD_PHOTO_02: Invalid file format', async () => {
    await request(server)
      .put('/api/user/profile/photo')
      .set('Authorization', authToken)
      .attach('photo', Buffer.from('text-content'), 'document.txt')
      .expect(400)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Invalid file format')
        expect(res.body).toHaveProperty('message', 'Only JPG and PNG files are allowed')
      })
  })

  it('UPD_PHOTO_03: File too large', async () => {
    // Mock large file
    const largeBuffer = Buffer.alloc(6 * 1024 * 1024) // 6MB - exceeds typical limit
    
    await request(server)
      .put('/api/user/profile/photo')
      .set('Authorization', authToken)
      .attach('photo', largeBuffer, 'large-image.jpg')
      .expect(413)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'File too large')
        expect(res.body).toHaveProperty('message', 'File size must not exceed maximum limit')
      })
  })

  it('UPD_PHOTO_04: Missing file', async () => {
    await request(server)
      .put('/api/user/profile/photo')
      .set('Authorization', authToken)
      .expect(400)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Validation error')
        expect(res.body).toHaveProperty('message', 'Photo file is required')
      })
  })

  it('UPD_PHOTO_05: Corrupted file', async () => {
    // Mock corrupted image file
    await request(server)
      .put('/api/user/profile/photo')
      .set('Authorization', authToken)
      .attach('photo', Buffer.from('corrupted-data'), 'corrupted.jpg')
      .expect(400)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Invalid file')
        expect(res.body).toHaveProperty('message', 'File is corrupted or invalid')
      })
  })

  it('UPD_PHOTO_06: Unauthorized access', async () => {
    await request(server)
      .put('/api/user/profile/photo')
      .attach('photo', Buffer.from('fake-image-data'), 'avatar.jpg')
      .expect(401)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty('error', 'Unauthorized')
        expect(res.body).toHaveProperty('message', 'Access token required')
      })
  })
})