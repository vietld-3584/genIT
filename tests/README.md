# Integration Tests Documentation

## Overview

This document provides comprehensive integration tests for the Chat Application API, covering all endpoints defined in the API specification. The tests are designed following TDD (Test-Driven Development) principles and are expected to fail initially until the corresponding API endpoints are implemented.

## Project Technology Stack

- **Framework**: Next.js 15.5.3 (with App Router)
- **Testing Framework**: Vitest 3.2.4 with multi-project configuration
- **Database**: MikroORM 6.5.3 + PostgreSQL
- **HTTP Client**: Supertest 7.1.4 + Express 5.1.0
- **Test Data Generation**: @faker-js/faker 10.0.0
- **Package Manager**: Yarn 4.6.0

## Directory Structure

```
tests/
├── integration/
│   ├── auth/
│   │   ├── signin.test.ts          # POST /auth/signin (10 test cases)
│   │   ├── signup.test.ts          # POST /auth/signup + OAuth (15 test cases)
│   │   └── logout.test.ts          # POST /auth/logout (4 test cases)
│   ├── channels/
│   │   ├── channels.test.ts        # Channel CRUD operations (24 test cases)
│   │   └── members.test.ts         # Channel member management (14 test cases)
│   ├── messages/
│   │   └── messages.test.ts        # Message operations (13 test cases)
│   ├── users/
│   │   ├── search.test.ts          # GET /users/search (5 test cases)
│   │   └── profile.test.ts         # User profile management (18 test cases)
│   ├── fixtures/
│   │   ├── factories.ts            # Test data factories
│   │   └── index.ts                # Factory exports
│   └── setup/
│       ├── globalSetup.ts          # Global test setup and teardown
│       ├── server.ts               # Express test server setup
│       └── testData.ts             # Test data seeding and management
```

## Test Coverage

### Test Case Coverage Summary

| Domain | Endpoint | Test Cases | Status |
|--------|----------|------------|---------|
| **Authentication** | | | |
| | POST /auth/signin | 10 | ✅ Complete |
| | POST /auth/signup | 8 | ✅ Complete |
| | POST /auth/signup/google | 4 | ✅ Complete |
| | POST /auth/signup/apple | 3 | ✅ Complete |
| | POST /auth/logout | 4 | ✅ Complete |
| **Channels** | | | |
| | GET /channels | 4 | ✅ Complete |
| | POST /channels | 7 | ✅ Complete |
| | GET /channels/:channelId | 4 | ✅ Complete |
| | PUT /channels/:channelId | 5 | ✅ Complete |
| | DELETE /channels/:channelId | 4 | ✅ Complete |
| **Channel Members** | | | |
| | GET /channels/:channelId/members | 4 | ✅ Complete |
| | POST /channels/:channelId/members | 6 | ✅ Complete |
| | DELETE /channels/:channelId/members/:userId | 4 | ✅ Complete |
| **Messages** | | | |
| | GET /channels/:channelId/messages | 6 | ✅ Complete |
| | POST /channels/:channelId/messages | 7 | ✅ Complete |
| **Users** | | | |
| | GET /users/search | 5 | ✅ Complete |
| | GET /user/profile | 3 | ✅ Complete |
| | PUT /user/profile | 4 | ✅ Complete |
| | PUT /user/profile/contact | 6 | ✅ Complete |
| | PUT /user/profile/photo | 5 | ✅ Complete |
| **TOTAL** | **20 endpoints** | **103 test cases** | **✅ 100% Coverage** |

### Test Case Mapping

All test cases from `BACKEND_API_TESTCASES.md` have been implemented:

- **Authentication**: LOGIN_01-10, SIGNUP_01-08, GOOGLE_01-04, APPLE_01-03, LOGOUT_01-04
- **Channels**: CHANNELS_01-04, CREATE_CH_01-07, GET_CH_01-04, UPDATE_CH_01-05, DELETE_CH_01-04
- **Channel Members**: GET_MEM_01-04, ADD_MEM_01-06, REM_MEM_01-04
- **Messages**: GET_MSG_01-06, SEND_MSG_01-07
- **Users**: SEARCH_01-05, PROFILE_01-03, UPD_PROF_01-04, UPD_CONT_01-06, UPD_PHOTO_01-05

## Setup Instructions

### Prerequisites

1. **Node.js** (version 18 or higher)
2. **Yarn** (version 4.6.0)
3. **PostgreSQL** (version 14 or higher)

### Environment Setup

1. **Install Dependencies**:
   ```bash
   yarn install
   ```

2. **Database Setup**:
   ```bash
   # Set up PostgreSQL database for testing
   yarn db:setup
   ```

3. **Environment Configuration**:
   Create a `.env.test` file (already provided) with test-specific environment variables:
   ```bash
   # The .env.test file contains:
   DB_NAME=myapp_db_test
   NODE_ENV=test
   JWT_SECRET=test_jwt_secret_key
   # ... other test configurations
   ```

4. **Database Migration** (when available):
   ```bash
   yarn db:migrate:up
   ```

5. **Seed Test Data** (when available):
   ```bash
   yarn db:seed
   ```

## Running Integration Tests

### Basic Commands

```bash
# Run all integration tests
yarn test:integration

# Run integration tests in watch mode
yarn test:integration:watch

# Run integration tests with coverage
yarn test:integration:coverage

# Run integration tests with UI
yarn test:integration:ui

# Run specific test file
yarn test:integration tests/integration/auth/signin.test.ts

# Run tests for specific domain
yarn test:integration tests/integration/auth/
```

### Expected Test Results

Currently, **all tests are expected to fail** with the following types of errors:

1. **404 Not Found**: For endpoints not yet implemented
2. **500 Internal Server Error**: For partially implemented endpoints with bugs
3. **Assertion Failures**: When endpoints exist but return unexpected responses
4. **Database/Seeding Errors**: When database schema is incomplete

This is expected behavior following TDD principles - tests are written first, then implementation follows.

## Test Data Management

### Factories

The test suite uses factory pattern for generating realistic test data:

```typescript
// Create users with realistic data
const user = UserFactory.create();
const adminUser = UserFactory.createAdmin();
const users = UserFactory.createMany(5);

// Create channels
const channel = ChannelFactory.create();
const namedChannel = ChannelFactory.createWithName('general');

// Create messages
const message = MessageFactory.create();
const longMessage = MessageFactory.createLong();
```

### Test Data Seeding

- **Global Setup**: Seeds minimal test data for all tests
- **Per-Test Isolation**: Each test has access to predictable test data
- **Cleanup**: Automatic cleanup after test completion

### Seeded Test Data

The following test data is automatically seeded:

- **4 Test Users**: Including admin, regular users with different permissions
- **3 Test Channels**: General, Random, Tech channels
- **Channel Memberships**: Pre-configured user-channel relationships  
- **Sample Messages**: For testing message-related functionality

## Mock Strategy

### External Services Mocked

- **OAuth Providers**: Google and Apple OAuth token validation
- **Email Services**: Email sending and validation
- **File Storage**: Photo upload and processing

### What's NOT Mocked

- **Database**: Uses real PostgreSQL database with test data
- **API Endpoints**: Tests hit actual Express routes (when implemented)
- **HTTP Layer**: Real HTTP requests via Supertest

## Test Architecture

### Global Setup/Teardown

```typescript
// Global setup runs once before all tests
beforeAll(async () => {
  // 1. Initialize database connection
  // 2. Create test Express app
  // 3. Seed test data
  // 4. Setup mock services
});

// Global teardown runs once after all tests  
afterAll(async () => {
  // 1. Clean up test data
  // 2. Close test server
  // 3. Close database connection
});
```

### Test Server

- **In-Memory Express App**: No network binding, faster execution
- **Middleware**: JSON parsing, CORS, error handling
- **Route Stubs**: All API routes return 404 until implemented

### Error Handling

Tests include comprehensive error scenarios:

- **Validation Errors**: Invalid input data
- **Authentication Errors**: Missing or invalid tokens  
- **Authorization Errors**: Insufficient permissions
- **Resource Errors**: Not found, already exists
- **Network Errors**: Timeouts, connection issues

## Development Workflow

### TDD Cycle

1. **Red Phase**: Run tests - they should fail (currently at this stage)
2. **Green Phase**: Implement minimal code to make tests pass
3. **Refactor Phase**: Improve code while keeping tests green

### Integration with Development

```bash
# Watch tests while developing
yarn test:integration:watch

# Check test coverage
yarn test:integration:coverage

# Debug specific failing tests
yarn test:integration --reporter=verbose tests/integration/auth/signin.test.ts
```

### Adding New Tests

1. **Create test file** in appropriate domain folder
2. **Use factories** for test data generation
3. **Follow naming convention**: `DOMAIN_##: description` for test cases
4. **Include error scenarios** along with happy path
5. **Add documentation** for new test coverage

## Troubleshooting

### Common Issues

1. **Database Connection Errors**:
   ```bash
   # Ensure PostgreSQL is running
   yarn db:debug
   
   # Reset test database
   yarn db:reset
   ```

2. **Port Already in Use**:
   ```bash
   # Tests use in-memory server, no port conflicts expected
   # If issues persist, check for hanging processes
   ```

3. **Timeout Errors**:
   ```bash
   # Increase timeout in vitest.config.ts
   testTimeout: 30000  # Current setting
   ```

4. **Memory Issues**:
   ```bash
   # Run tests with more memory
   NODE_OPTIONS="--max_old_space_size=4096" yarn test:integration
   ```

### Debug Mode

```bash
# Enable debug logging
DEBUG=1 yarn test:integration

# Use test UI for debugging
yarn test:integration:ui
```

## Future Enhancements

### When API Implementation Begins

1. **Update Route Handlers**: Replace 404 stubs with actual implementations
2. **Add Authentication**: Implement JWT middleware and user context
3. **Database Integration**: Connect with MikroORM entities and repositories
4. **File Upload**: Add multer middleware for photo uploads
5. **External Services**: Integrate with real OAuth providers

### Test Suite Improvements

1. **Performance Tests**: Add response time assertions
2. **Load Tests**: Simulate concurrent user scenarios
3. **Security Tests**: Add SQL injection, XSS protection tests
4. **Contract Tests**: Validate API responses match OpenAPI spec
5. **End-to-End Tests**: Full user journey testing

## Conclusion

This comprehensive integration test suite provides:

- ✅ **100% API Coverage**: All 20 endpoints, 103 test cases
- ✅ **TDD Ready**: Tests written before implementation
- ✅ **Realistic Test Data**: Using Faker.js factories
- ✅ **Proper Isolation**: Independent test execution
- ✅ **Error Scenarios**: Comprehensive failure testing
- ✅ **Documentation**: Full coverage mapping and instructions

The test suite is ready to guide the API development process and ensure high-quality, reliable implementation of all Chat Application API endpoints.