# Integration Tests cho Chat Application API

Bộ integration test này được thiết kế để kiểm thử toàn diện các API endpoint của Chat Application dựa trên OpenAPI specification và test case documentation.

## 📋 Coverage Summary

| API Endpoint | Test Cases | Status |
|--------------|------------|--------|
| `POST /auth/signin` | 10 test cases (LOGIN_01 - LOGIN_10) | ✅ Complete |
| `POST /auth/signup` | 8 test cases (SIGNUP_01 - SIGNUP_08) | ✅ Complete |
| `POST /auth/signup/google` | 4 test cases (GOOGLE_01 - GOOGLE_04) | ✅ Complete |
| `POST /auth/signup/apple` | 3 test cases (APPLE_01 - APPLE_03) | ✅ Complete |
| `POST /auth/logout` | 4 test cases (LOGOUT_01 - LOGOUT_04) | ✅ Complete |
| `GET /channels` | 4 test cases (CHANNELS_01 - CHANNELS_04) | ✅ Complete |
| `POST /channels` | 7 test cases (CREATE_CH_01 - CREATE_CH_07) | ✅ Complete |
| `GET /channels/{channelId}` | 4 test cases (GET_CH_01 - GET_CH_04) | ✅ Complete |
| `PUT /channels/{channelId}` | 5 test cases (UPDATE_CH_01 - UPDATE_CH_05) | ✅ Complete |
| `DELETE /channels/{channelId}` | 4 test cases (DELETE_CH_01 - DELETE_CH_04) | ✅ Complete |
| `GET /channels/{channelId}/members` | 4 test cases (GET_MEM_01 - GET_MEM_04) | ✅ Complete |
| `POST /channels/{channelId}/members` | 6 test cases (ADD_MEM_01 - ADD_MEM_06) | ✅ Complete |
| `DELETE /channels/{channelId}/members/{userId}` | 4 test cases (REM_MEM_01 - REM_MEM_04) | ✅ Complete |
| `GET /users/search` | 8 test cases (SEARCH_01 - SEARCH_08) | ✅ Complete |
| `GET /channels/{channelId}/messages` | 6 test cases (GET_MSG_01 - GET_MSG_06) | ✅ Complete |
| `POST /channels/{channelId}/messages` | 7 test cases (SEND_MSG_01 - SEND_MSG_07) | ✅ Complete |
| `GET /user/profile` | 3 test cases (PROFILE_01 - PROFILE_03) | ✅ Complete |
| `PUT /user/profile` | 7 test cases (UPD_PROF_01 - UPD_PROF_07) | ✅ Complete |
| `PUT /user/profile/contact` | 7 test cases (UPD_CONT_01 - UPD_CONT_07) | ✅ Complete |
| `PUT /user/profile/photo` | 6 test cases (UPD_PHOTO_01 - UPD_PHOTO_06) | ✅ Complete |

**Tổng cộng: 102 test cases** được triển khai đầy đủ.

## 🏗️ Architecture

### Test Structure
```
tests/integration/
├── setup.ts                    # Global test setup và database utilities
├── server.ts                   # Next.js server setup cho testing
├── auth/
│   ├── signin.test.ts          # Authentication - Sign In tests
│   ├── signup.test.ts          # Authentication - Sign Up tests  
│   ├── oauth.test.ts           # OAuth (Google/Apple) tests
│   └── logout.test.ts          # Logout tests
├── channels/
│   ├── channels.test.ts        # Channel CRUD operations
│   ├── channel-details.test.ts # Single channel operations
│   ├── members.test.ts         # Channel member management
│   └── messages.test.ts        # Channel messaging
└── users/
    ├── search.test.ts          # User search functionality
    └── profile.test.ts         # User profile management
```

### Kiến trúc Testing

1. **Test Database**: Sử dụng PostgreSQL test database riêng biệt
2. **In-Process Server**: Next.js server chạy trong bộ nhớ với Supertest
3. **Entity Layer**: Tích hợp với MikroORM entities thực tế
4. **Data Cleanup**: Automatic cleanup sau mỗi test case
5. **Mock External Services**: OAuth providers và email services được mock

## 🚀 Chạy Tests

### Prerequisites
1. PostgreSQL đang chạy
2. Test database đã được tạo
3. Environment variables trong `.env.test`

### Commands

```bash
# Chạy tất cả integration tests
npm run test:integration

# Chạy với watch mode
npm run test:integration -- --watch

# Chạy với coverage report
npm run test:integration -- --coverage

# Chạy một test file cụ thể
npm run test:integration -- tests/integration/auth/signin.test.ts

# Chạy tests với output chi tiết
npm run test:integration -- --reporter=verbose
```

## 🔧 Configuration

### Environment Variables (.env.test)
```env
NODE_ENV=test
DB_HOST=localhost
DB_PORT=5432
DB_NAME=myapp_test_db
DB_USER=myapp_user
DB_PASSWORD=myapp_password
API_URL=http://localhost:3000
TEST_TIMEOUT=30000
```

### Vitest Configuration
- **Environment**: Node.js
- **Test Timeout**: 30 seconds
- **Setup Files**: Automated database setup và cleanup
- **Global**: Vitest globals enabled

## 📊 Test Data Management

### Automatic Setup
- Database schema refresh trước mỗi test suite
- Test data cleanup sau mỗi test case
- Entity factories cho tạo test data

### Helper Functions
```typescript
// Tạo test user
const user = await createTestUser({ email: 'test@example.com', name: 'Test User' })

// Tạo test channel  
const channel = await createTestChannel({ channelName: 'general' })

// Tạo channel member
const member = await createChannelMember(channel, user, 'admin')

// Tạo test message
const message = await createTestMessage(channel, user, 'Hello world!')
```

## 🎯 Test Patterns

### Arrange-Act-Assert Pattern
```typescript
it('LOGIN_01: Successful login', async () => {
  // Arrange
  const testUser = await createTestUser({ email: 'user@example.com' })
  
  // Act  
  const response = await request(server)
    .post('/api/auth/signin')
    .send({ email: 'user@example.com', password: 'validPassword123' })
    
  // Assert
  expect(response.status).toBe(200)
  expect(response.body).toHaveProperty('token')
})
```

### Error Validation Testing
Mỗi endpoint được test cho:
- ✅ Successful operations
- ❌ Validation errors (invalid input, missing fields, length limits)  
- 🔒 Authentication/authorization errors
- 🚫 Resource not found errors
- 🛡️ Permission errors

## 🔍 Expected Test Results

⚠️ **QUAN TRỌNG**: Các test này được thiết kế để **THẤT BẠI BAN ĐẦU** vì các API endpoint chưa được triển khai.

### Các lỗi dự kiến:

1. **404 Not Found**: Endpoint chưa tồn tại
   ```
   POST /api/auth/signin -> 404 Not Found
   ```

2. **500 Internal Server Error**: Logic chưa hoàn thành
   ```
   Missing authentication middleware
   Database connection errors
   ```

3. **Assertion Failures**: Response structure khác với expected
   ```
   Expected: { token: "...", user: {...} }
   Actual: { message: "Not implemented" }
   ```

### Test Progress Tracking

Dùng test results để track implementation progress:

```bash
# Check current status
npm run test:integration -- --reporter=json > test-results.json

# Count passing vs failing tests
grep -c '"status":"passed"' test-results.json
grep -c '"status":"failed"' test-results.json
```

## 🛠️ Development Workflow

1. **Red Phase**: Chạy tests → Tất cả FAIL (expected)
2. **Green Phase**: Implement API endpoints → Tests PASS
3. **Refactor Phase**: Clean up code while keeping tests PASS

### Implementation Checklist

- [ ] Authentication middleware
- [ ] Input validation với Zod
- [ ] Database operations với MikroORM
- [ ] JWT token generation/verification  
- [ ] Error handling và status codes
- [ ] File upload handling (cho profile photos)
- [ ] OAuth integration mocking

## 📈 Monitoring & Reporting

### Coverage Metrics
```bash
# Generate HTML coverage report
npm run test:integration -- --coverage --coverage.reporter=html

# View coverage
open coverage/index.html
```

### Performance Monitoring
- Test execution time
- Database query performance
- Memory usage during test runs

---

**Note**: Đây là integration tests hoàn chỉnh được thiết kế theo TDD principles. Tất cả test cases đã được implement và sẵn sàng để guide development process.