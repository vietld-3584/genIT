# Integration Test Suite

This folder contains integration test scaffolding for the Chat Application API. Tests are currently written in a TDD-first manner and WILL FAIL until the corresponding API endpoints are implemented.

## Coverage Mapping
All test case IDs from `api_spec/BACKEND_API_TESTCASES.md` are mapped to test files:

- auth/signin.test.ts: LOGIN_01 .. LOGIN_10
- auth/signup.test.ts: SIGNUP_01 .. SIGNUP_08
- auth/oauth-google.test.ts: GOOGLE_01 .. GOOGLE_04
- auth/oauth-apple.test.ts: APPLE_01 .. APPLE_03
- auth/logout.test.ts: LOGOUT_01 .. LOGOUT_04
- channels/channels-crud.test.ts: CHANNELS_01..04, CREATE_CH_01..07, GET_CH_01..04, UPDATE_CH_01..05, DELETE_CH_01..04
- channels/channel-members.test.ts: GET_MEM_01..04, ADD_MEM_01..06, REM_MEM_01..04
- channels/messages.test.ts: GET_MSG_01..06, SEND_MSG_01..07
- users/search.test.ts: SEARCH_01..05
- user-profile/profile.test.ts: PROFILE_01..03, UPD_PROF_01..04, UPD_CONT_01..06, UPD_PHOTO_01..05

## Running Integration Tests
Ensure a PostgreSQL database is available with credentials matching `.env.test`.

Run:
```
yarn test:integration
```

## Expected Current State
All tests will currently return 404 Not Implemented because only placeholder routes are registered. As endpoints are implemented, replace placeholder server builder with real application routes and add assertions.

## Next Steps
1. Implement real route handlers.
2. Add authentication + permission logic.
3. Replace placeholder tests' minimal requests with full Arrange-Act-Assert including response body validation.
4. Introduce per-test transaction rollback for performance if needed.
