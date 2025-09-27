# API Test Coverage Mapping

## Test Coverage Matrix

| API Endpoint | HTTP Method | Test File | Test Cases | Implementation Status |
|--------------|-------------|-----------|------------|----------------------|
| `/auth/signin` | POST | `auth/signin.test.ts` | LOGIN_01 - LOGIN_10 (10 tests) | ⏳ Pending |
| `/auth/signup` | POST | `auth/signup.test.ts` | SIGNUP_01 - SIGNUP_08 (8 tests) | ⏳ Pending |
| `/auth/signup/google` | POST | `auth/oauth.test.ts` | GOOGLE_01 - GOOGLE_04 (4 tests) | ⏳ Pending |
| `/auth/signup/apple` | POST | `auth/oauth.test.ts` | APPLE_01 - APPLE_03 (3 tests) | ⏳ Pending |
| `/auth/logout` | POST | `auth/logout.test.ts` | LOGOUT_01 - LOGOUT_04 (4 tests) | ⏳ Pending |
| `/channels` | GET | `channels/channels.test.ts` | CHANNELS_01 - CHANNELS_04 (4 tests) | ⏳ Pending |
| `/channels` | POST | `channels/channels.test.ts` | CREATE_CH_01 - CREATE_CH_07 (7 tests) | ⏳ Pending |
| `/channels/{channelId}` | GET | `channels/channel-details.test.ts` | GET_CH_01 - GET_CH_04 (4 tests) | ⏳ Pending |
| `/channels/{channelId}` | PUT | `channels/channel-details.test.ts` | UPDATE_CH_01 - UPDATE_CH_05 (5 tests) | ⏳ Pending |
| `/channels/{channelId}` | DELETE | `channels/channel-details.test.ts` | DELETE_CH_01 - DELETE_CH_04 (4 tests) | ⏳ Pending |
| `/channels/{channelId}/members` | GET | `channels/members.test.ts` | GET_MEM_01 - GET_MEM_04 (4 tests) | ⏳ Pending |
| `/channels/{channelId}/members` | POST | `channels/members.test.ts` | ADD_MEM_01 - ADD_MEM_06 (6 tests) | ⏳ Pending |
| `/channels/{channelId}/members/{userId}` | DELETE | `channels/members.test.ts` | REM_MEM_01 - REM_MEM_04 (4 tests) | ⏳ Pending |
| `/users/search` | GET | `users/search.test.ts` | SEARCH_01 - SEARCH_08 (8 tests) | ⏳ Pending |
| `/channels/{channelId}/messages` | GET | `channels/messages.test.ts` | GET_MSG_01 - GET_MSG_06 (6 tests) | ⏳ Pending |
| `/channels/{channelId}/messages` | POST | `channels/messages.test.ts` | SEND_MSG_01 - SEND_MSG_07 (7 tests) | ⏳ Pending |
| `/user/profile` | GET | `users/profile.test.ts` | PROFILE_01 - PROFILE_03 (3 tests) | ⏳ Pending |
| `/user/profile` | PUT | `users/profile.test.ts` | UPD_PROF_01 - UPD_PROF_07 (7 tests) | ⏳ Pending |
| `/user/profile/contact` | PUT | `users/profile.test.ts` | UPD_CONT_01 - UPD_CONT_07 (7 tests) | ⏳ Pending |
| `/user/profile/photo` | PUT | `users/profile.test.ts` | UPD_PHOTO_01 - UPD_PHOTO_06 (6 tests) | ⏳ Pending |

**Total: 102 Test Cases**

## Legend
- ✅ **Implemented**: API endpoint đã được triển khai và tests đang pass
- ⚠️ **Partial**: API endpoint đã có implementation nhưng một số tests vẫn fail
- ⏳ **Pending**: API endpoint chưa được triển khai (expected)
- ❌ **Failed**: Tests có lỗi configuration hoặc setup

## Test Categories

### Authentication & Authorization (29 tests)
- **Sign In**: Email/password validation, credential verification
- **Sign Up**: User registration with validation 
- **OAuth**: Google & Apple OAuth integration
- **Logout**: Token invalidation

### Channel Management (28 tests)
- **Channel CRUD**: Create, read, update, delete channels
- **Member Management**: Add/remove members, role management
- **Access Control**: Permission-based operations

### Messaging (13 tests)
- **Message Retrieval**: Pagination, filtering
- **Message Creation**: Content validation, permissions
- **Real-time Features**: Future WebSocket integration

### User Management (32 tests)
- **User Search**: Search functionality with filters
- **Profile Management**: Name, title, email updates
- **File Upload**: Profile photo handling

## Expected Test Results (TDD Phase)

### Red Phase (Current Expected State)
Tất cả tests sẽ **THẤT BẠI** với các lỗi sau:

```
❌ POST /auth/signin
   Error: 404 Not Found - Route not implemented

❌ POST /auth/signup  
   Error: 404 Not Found - Route not implemented

❌ GET /channels
   Error: 404 Not Found - Route not implemented
```

### Green Phase (Target State)
Sau khi implement các API endpoints:

```
✅ POST /auth/signin (10/10 tests passing)
✅ POST /auth/signup (8/8 tests passing)
✅ GET /channels (4/4 tests passing)
```

### Refactor Phase
Code optimization không làm break tests:

```
✅ All tests maintain GREEN status
🔄 Performance improvements
📏 Code quality metrics
```

## Implementation Priority

### Phase 1: Authentication (29 tests)
1. `POST /auth/signin` - Fundamental login functionality
2. `POST /auth/signup` - User registration
3. `POST /auth/logout` - Session management
4. OAuth endpoints (can be mocked initially)

### Phase 2: Core Features (41 tests)
1. `GET /channels` - List user channels
2. `POST /channels` - Create channels
3. `GET /channels/{id}` - Channel details
4. `GET /user/profile` - User profile

### Phase 3: Advanced Features (32 tests)
1. Channel management (PUT/DELETE)
2. Member management
3. Messaging system
4. File upload handling

## Progress Tracking Commands

```bash
# Run all tests and see current status
npm run test:integration

# Run specific test suite
npm run test:integration -- tests/integration/auth/

# Generate coverage report
npm run test:integration -- --coverage

# Watch mode for active development
npm run test:integration -- --watch
```

## Integration with Development

### Daily Workflow
1. **Morning**: Check test status với `npm run test:integration`
2. **Development**: Implement một endpoint để pass một nhóm tests
3. **Validation**: Re-run tests để confirm GREEN status
4. **Commit**: Include test status trong commit message

### Commit Message Examples
```
feat(auth): implement signin endpoint

- Passes LOGIN_01 through LOGIN_10 test cases
- Handles email validation and password verification
- JWT token generation included

Test Status: 10/102 tests passing (+10)
```

## Continuous Integration

### Pre-commit Hooks
```bash
# Run integration tests before commit
npm run test:integration -- --run
```

### Pipeline Integration
```yaml
# Example GitHub Actions
test:
  runs-on: ubuntu-latest
  steps:
    - run: npm run test:integration
    - name: Upload coverage
      uses: codecov/codecov-action@v3
```

---

**Note**: Đây là living document sẽ được cập nhật khi các API endpoints được triển khai. Test status sẽ chuyển từ ⏳ Pending → ✅ Implemented theo tiến độ development.