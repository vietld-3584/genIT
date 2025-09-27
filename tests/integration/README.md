# Integration Test Suite Documentation

## 🎯 Tổng quan

Integration Test Suite này được tạo theo phương pháp TDD (Test-Driven Development) để kiểm thử toàn diện Chat Application API. Bộ test bao phủ **100% các endpoint** với **103 test cases** chi tiết, được tổ chức thành các domain logic rõ ràng.

## 📊 Thống kê Test Coverage

| Domain | Endpoints | Test Cases | Test Files |
|--------|-----------|------------|------------|
| Authentication | 3 | 29 | 3 |
| Channels | 9 | 38 | 2 |
| Messages | 4 | 13 | 1 |
| Users | 4 | 23 | 2 |
| **TOTAL** | **20** | **103** | **8** |

### Chi tiết Coverage theo Endpoint

#### 🔐 Authentication Domain (29 tests)
- `POST /auth/signin` - 10 test cases
- `POST /auth/signup` - 15 test cases  
- `POST /auth/logout` - 4 test cases

#### 💬 Channels Domain (38 tests)
- `GET /channels` - 4 test cases
- `POST /channels` - 6 test cases
- `GET /channels/:channelId` - 3 test cases
- `PUT /channels/:channelId` - 5 test cases
- `DELETE /channels/:channelId` - 6 test cases
- `GET /channels/:channelId/members` - 3 test cases
- `POST /channels/:channelId/members` - 4 test cases
- `DELETE /channels/:channelId/members/:memberId` - 4 test cases
- `PUT /channels/:channelId/members/:memberId/role` - 3 test cases

#### 📝 Messages Domain (13 tests)
- `GET /channels/:channelId/messages` - 4 test cases
- `POST /channels/:channelId/messages` - 4 test cases
- `PUT /messages/:messageId` - 3 test cases
- `DELETE /messages/:messageId` - 2 test cases

#### 👥 Users Domain (23 tests)
- `GET /users/search` - 5 test cases
- `GET /users/me` - 6 test cases
- `PUT /users/me` - 6 test cases
- `PUT /users/me/password` - 6 test cases

## 🏗️ Kiến trúc Test Suite

### Cấu trúc Thư mục
```
tests/integration/
├── auth/                    # Authentication tests
│   ├── signin.test.ts       # Signin functionality (10 tests)
│   ├── signup.test.ts       # Signup functionality (15 tests)
│   └── logout.test.ts       # Logout functionality (4 tests)
├── channels/                # Channel management tests
│   ├── channels.test.ts     # Channel CRUD operations (24 tests)
│   └── members.test.ts      # Channel member management (14 tests)
├── messages/                # Message functionality tests
│   └── messages.test.ts     # Message operations (13 tests)
├── users/                   # User management tests
│   ├── search.test.ts       # User search functionality (5 tests)
│   └── profile.test.ts      # User profile management (18 tests)
├── setup/                   # Test infrastructure
│   ├── globalSetup.ts       # Global test setup và teardown
│   ├── server.ts           # Express test server configuration
│   └── testData.ts         # Test data seeding helpers
└── fixtures/               # Test data factories
    ├── factories.ts        # Factory classes cho tất cả entities
    └── index.ts           # Factory exports
```

### Core Components

#### 1. Test Server Setup
- **Express Test Server**: In-process server instance dành riêng cho testing
- **MikroORM Integration**: Database layer với PostgreSQL test database
- **Global Setup/Teardown**: Quản lý lifecycle của database và server

#### 2. Test Data Management
- **Factory Pattern**: Tạo realistic test data với Faker.js
- **Data Seeding**: Automated setup/cleanup của test data
- **Entity Relationships**: Proper handling của user-channel-message relationships

#### 3. HTTP Client & Assertions
- **Supertest**: HTTP testing library cho Express applications
- **Vitest Framework**: Modern testing framework với TypeScript support
- **Custom Matchers**: Extended assertions cho API response validation

## 🚀 Hướng dẫn Sử dụng

### Cài đặt Dependencies
```bash
# Tất cả dependencies đã được cài sẵn
yarn install
```

### Chạy Tests

#### Chạy tất cả Integration Tests
```bash
yarn test:integration
```

#### Chạy specific test domain
```bash
# Authentication tests only
yarn test:integration auth

# Channel tests only  
yarn test:integration channels

# Message tests only
yarn test:integration messages

# User tests only
yarn test:integration users
```

#### Chạy single test file
```bash
yarn test:integration tests/integration/auth/signin.test.ts
```

#### Watch mode for development
```bash
yarn test:integration --watch
```

### Environment Setup

#### Database Configuration
Test suite sử dụng riêng test database được cấu hình trong `.env.test`:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/genIT_test"
NODE_ENV="test"

# JWT
JWT_SECRET="test-jwt-secret-key-for-integration-tests"
JWT_EXPIRES_IN="7d"

# OAuth (mocked in tests)
GOOGLE_CLIENT_ID="mock-google-client-id"
GOOGLE_CLIENT_SECRET="mock-google-client-secret"
```

## 📋 Test Case Mapping

### API Specification Coverage
Tất cả 103 test cases được mapped chính xác từ file `BACKEND_API_TESTCASES.md`:

#### Authentication Tests (AUTH_001 - AUTH_029)
- ✅ Email/password signin variations
- ✅ OAuth provider integrations (Google, Apple)
- ✅ Registration với email confirmation
- ✅ Input validation và error handling
- ✅ Session management

#### Channel Tests (CHAN_001 - CHAN_038)  
- ✅ Channel CRUD operations
- ✅ Permission-based access control
- ✅ Member management workflows
- ✅ Role-based operations (admin, member)
- ✅ Error scenarios và edge cases

#### Message Tests (MSG_001 - MSG_013)
- ✅ Message posting và retrieval
- ✅ Pagination và filtering
- ✅ Edit/delete permissions
- ✅ Channel membership validation

#### User Tests (USER_001 - USER_023)
- ✅ User search functionality
- ✅ Profile management
- ✅ Password change workflows
- ✅ Data validation rules

## 🔧 Technical Implementation

### Test Data Factories
```typescript
// Factory pattern với Faker.js
const userFactory = {
  build: (overrides = {}) => ({
    email: faker.internet.email(),
    password: faker.internet.password({ length: 10 }),
    displayName: faker.person.fullName(),
    ...overrides
  })
}
```

### Test Structure Pattern
```typescript
describe('POST /auth/signin', () => {
  beforeEach(async () => {
    // Seed required test data
  });

  it('[AUTH_001]: Should successfully sign in with valid email and password', async () => {
    // Arrange
    const userData = userFactory.build();
    
    // Act
    const response = await request(app)
      .post('/auth/signin')
      .send(userData);
    
    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      success: true,
      user: expect.objectContaining({
        email: userData.email
      }),
      token: expect.any(String)
    });
  });
});
```

## 🛠️ Development Workflow

### 1. TDD Approach
Tests được viết trước khi implement API endpoints:
- ✅ **RED**: Tests fail initially (current state)
- 🔄 **GREEN**: Implement API endpoints to make tests pass
- 🔄 **REFACTOR**: Clean up implementation code

### 2. Current Status
- **Test Suite**: ✅ Complete (103/103 test cases)
- **API Implementation**: ❌ Not yet implemented (expected)
- **Database Schema**: ⚠️ Entity metadata cần configuration

### 3. Next Steps
1. **Fix Database Issues**: Configure MikroORM entity metadata
2. **Implement API Routes**: Start với authentication endpoints
3. **Iterative Development**: Implement theo priority của business logic
4. **Continuous Testing**: Chạy tests sau mỗi implementation

## 🐛 Troubleshooting

### Common Issues

#### 1. Database Connection Errors
```
Error: MikroORM entity metadata not found
```
**Solution**: Configure entity metadata trong MikroORM entities

#### 2. Module Import Errors
```
Cannot resolve module '@/lib/...'
```
**Solution**: Sử dụng relative imports thay vì alias imports trong test files

#### 3. Test Timeout Issues
```
Test timeout after 5000ms
```
**Solution**: Tăng timeout cho database operations:
```typescript
test('should handle slow operation', async () => {
  // test implementation
}, 10000); // 10 second timeout
```

### Performance Optimization
- **Parallel Test Execution**: Tests được design để chạy parallel safely
- **Database Transactions**: Sử dụng transactions với rollback cho faster cleanup
- **Connection Pooling**: Reuse database connections across tests

## 📈 Test Results Interpretation

### Expected Test Failures (Current State)
```
❌ 103 failing tests (expected - TDD approach)

Common failure patterns:
• 404 Not Found - API endpoints chưa implemented
• Connection refused - Test server setup issues  
• Entity metadata errors - Database configuration pending
```

### Target Success State
```
✅ 103 passing tests (after API implementation)

Success indicators:
• All HTTP status codes match expectations
• Response schemas validate correctly  
• Database operations complete successfully
• Authentication flows work end-to-end
```

## 📝 Maintenance Guidelines

### Adding New Tests
1. **Identify API Specification**: Tham khảo `api-docs.yaml`
2. **Map Test Cases**: Thêm vào `BACKEND_API_TESTCASES.md` 
3. **Create Test File**: Theo naming convention `{domain}.test.ts`
4. **Update Factory**: Thêm factory methods cho new entities
5. **Update Documentation**: Cập nhật coverage statistics

### Modifying Existing Tests
1. **Maintain Test IDs**: Giữ nguyên format `[TEST_ID]: description`
2. **Update Expected Results**: Sync với API specification changes
3. **Preserve Test Data**: Ensure backward compatibility của factories
4. **Validate Coverage**: Run validation script sau modifications

---

## 💡 Best Practices Implemented

✅ **Comprehensive Coverage**: 100% endpoint coverage với 103 detailed test cases  
✅ **Realistic Test Data**: Faker-based factories tạo production-like data  
✅ **Isolated Tests**: Mỗi test có independent test data  
✅ **Clear Organization**: Domain-based structure với descriptive naming  
✅ **TDD Ready**: Tests written before implementation (Red-Green-Refactor)  
✅ **Maintainable Code**: Factory pattern và helper utilities  
✅ **Performance Optimized**: Parallel execution safe với proper cleanup  
✅ **Documentation Complete**: Comprehensive guide cho development team  

**Integration Test Suite sẵn sàng cho API development phase!** 🚀