# Backend API Functional Test Cases

This document contains comprehensive functional test cases for the Chat Application API endpoints.

## API: POST /auth/signin
### 📌 Description
Authenticate user by username and password.

### 🔎 Functional Test Cases
| ID | Scenario | Input Example | Expected Output | Status Code |
|----------|------------------------|--------------------------------------------------|--------------------------------------------------|-------------|
| LOGIN_01 | Successful login | `{ "email": "user@example.com", "password": "validPassword123" }` | `{ "token": "<jwt_token>", "user": {user_object}, "expiresIn": 3600 }` | 200 |
| LOGIN_02 | Invalid password | `{ "email": "user@example.com", "password": "wrongPassword" }` | `{ "error": "Invalid credentials", "message": "Email or password is incorrect" }` | 401 |
| LOGIN_03 | Invalid email format | `{ "email": "invalid-email", "password": "validPassword123" }` | `{ "error": "Validation error", "message": "Invalid email format" }` | 400 |
| LOGIN_04 | Empty email field | `{ "email": "", "password": "validPassword123" }` | `{ "error": "Validation error", "message": "Email is required" }` | 400 |
| LOGIN_05 | Empty password field | `{ "email": "user@example.com", "password": "" }` | `{ "error": "Validation error", "message": "Password is required" }` | 400 |
| LOGIN_06 | Password too short | `{ "email": "user@example.com", "password": "123" }` | `{ "error": "Validation error", "message": "Password must be at least 6 characters" }` | 400 |
| LOGIN_07 | Email too short | `{ "email": "a@b", "password": "validPassword123" }` | `{ "error": "Validation error", "message": "Email must be at least 5 characters" }` | 400 |
| LOGIN_08 | Email too long (>254) | `{ "email": "a...very long email over 254 chars", "password": "validPassword123" }` | `{ "error": "Validation error", "message": "Email must not exceed 254 characters" }` | 400 |
| LOGIN_09 | Password too long (>128) | `{ "email": "user@example.com", "password": "very long password over 128 chars..." }` | `{ "error": "Validation error", "message": "Password must not exceed 128 characters" }` | 400 |
| LOGIN_10 | Non-existent user | `{ "email": "nonexistent@example.com", "password": "validPassword123" }` | `{ "error": "Invalid credentials", "message": "Email or password is incorrect" }` | 401 |

## API: POST /auth/signup
### 📌 Description
Register a new user account with email and password.

### 🔎 Functional Test Cases
| ID | Scenario | Input Example | Expected Output | Status Code |
|----------|------------------------|--------------------------------------------------|--------------------------------------------------|-------------|
| SIGNUP_01 | Successful registration | `{ "email": "newuser@example.com", "password": "securePass123", "name": "John Doe", "title": "Developer" }` | `{ "token": "<jwt_token>", "user": {user_object}, "expiresIn": 3600 }` | 201 |
| SIGNUP_02 | Email already exists | `{ "email": "existing@example.com", "password": "securePass123", "name": "John Doe" }` | `{ "error": "Email already exists", "message": "This email is already registered" }` | 409 |
| SIGNUP_03 | Invalid email format | `{ "email": "invalid-email", "password": "securePass123", "name": "John Doe" }` | `{ "error": "Validation error", "message": "Invalid email format" }` | 400 |
| SIGNUP_04 | Missing required name | `{ "email": "newuser@example.com", "password": "securePass123" }` | `{ "error": "Validation error", "message": "Name is required" }` | 400 |
| SIGNUP_05 | Password too short | `{ "email": "newuser@example.com", "password": "123", "name": "John Doe" }` | `{ "error": "Validation error", "message": "Password must be at least 6 characters" }` | 400 |
| SIGNUP_06 | Name too long (>255) | `{ "email": "newuser@example.com", "password": "securePass123", "name": "very long name over 255 chars..." }` | `{ "error": "Validation error", "message": "Name must not exceed 255 characters" }` | 400 |
| SIGNUP_07 | Title too long (>100) | `{ "email": "newuser@example.com", "password": "securePass123", "name": "John", "title": "very long title over 100 chars..." }` | `{ "error": "Validation error", "message": "Title must not exceed 100 characters" }` | 400 |
| SIGNUP_08 | Empty required fields | `{ "email": "", "password": "", "name": "" }` | `{ "error": "Validation error", "message": "Email, password, and name are required" }` | 400 |

## API: POST /auth/signup/google
### 📌 Description
Register or sign in using Google OAuth.

### 🔎 Functional Test Cases
| ID | Scenario | Input Example | Expected Output | Status Code |
|----------|------------------------|--------------------------------------------------|--------------------------------------------------|-------------|
| GOOGLE_01 | Valid Google OAuth token | `{ "token": "valid_google_oauth_token" }` | `{ "token": "<jwt_token>", "user": {user_object}, "expiresIn": 3600 }` | 200 |
| GOOGLE_02 | Invalid Google token | `{ "token": "invalid_google_token" }` | `{ "error": "Invalid OAuth token", "message": "Google token validation failed" }` | 400 |
| GOOGLE_03 | Missing token | `{}` | `{ "error": "Validation error", "message": "Token is required" }` | 400 |
| GOOGLE_04 | Expired Google token | `{ "token": "expired_google_token" }` | `{ "error": "Invalid OAuth token", "message": "Token has expired" }` | 400 |

## API: POST /auth/signup/apple
### 📌 Description
Register or sign in using Apple OAuth.

### 🔎 Functional Test Cases
| ID | Scenario | Input Example | Expected Output | Status Code |
|----------|------------------------|--------------------------------------------------|--------------------------------------------------|-------------|
| APPLE_01 | Valid Apple OAuth token | `{ "token": "valid_apple_oauth_token" }` | `{ "token": "<jwt_token>", "user": {user_object}, "expiresIn": 3600 }` | 200 |
| APPLE_02 | Invalid Apple token | `{ "token": "invalid_apple_token" }` | `{ "error": "Invalid OAuth token", "message": "Apple token validation failed" }` | 400 |
| APPLE_03 | Missing token | `{}` | `{ "error": "Validation error", "message": "Token is required" }` | 400 |

## API: POST /auth/logout
### 📌 Description
Logout user and invalidate token.

### 🔎 Functional Test Cases
| ID | Scenario | Input Example | Expected Output | Status Code |
|----------|------------------------|--------------------------------------------------|--------------------------------------------------|-------------|
| LOGOUT_01 | Successful logout | Valid Bearer token in header | `{ "message": "Logout successful" }` | 200 |
| LOGOUT_02 | No token provided | No Authorization header | `{ "error": "Unauthorized", "message": "Access token required" }` | 401 |
| LOGOUT_03 | Invalid token | Invalid Bearer token | `{ "error": "Unauthorized", "message": "Invalid access token" }` | 401 |
| LOGOUT_04 | Expired token | Expired Bearer token | `{ "error": "Unauthorized", "message": "Token has expired" }` | 401 |

## API: GET /channels
### 📌 Description
Retrieve all channels the authenticated user has access to.

### 🔎 Functional Test Cases
| ID | Scenario | Input Example | Expected Output | Status Code |
|----------|------------------------|--------------------------------------------------|--------------------------------------------------|-------------|
| CHANNELS_01 | Get user channels | Valid Bearer token | `{ "channels": [{channel1}, {channel2}] }` | 200 |
| CHANNELS_02 | No channels available | Valid token, user has no channels | `{ "channels": [] }` | 200 |
| CHANNELS_03 | Unauthorized access | No token | `{ "error": "Unauthorized", "message": "Access token required" }` | 401 |
| CHANNELS_04 | Invalid token | Invalid Bearer token | `{ "error": "Unauthorized", "message": "Invalid access token" }` | 401 |

## API: POST /channels
### 📌 Description
Create a new chat channel.

### 🔎 Functional Test Cases
| ID | Scenario | Input Example | Expected Output | Status Code |
|----------|------------------------|--------------------------------------------------|--------------------------------------------------|-------------|
| CREATE_CH_01 | Create channel successfully | `{ "name": "Research", "description": "Research discussions" }` | `{ "id": "ch_123", "name": "Research", "description": "Research discussions", ... }` | 201 |
| CREATE_CH_02 | Missing channel name | `{ "description": "Research discussions" }` | `{ "error": "Validation error", "message": "Channel name is required" }` | 400 |
| CREATE_CH_03 | Empty channel name | `{ "name": "", "description": "Research discussions" }` | `{ "error": "Validation error", "message": "Channel name cannot be empty" }` | 400 |
| CREATE_CH_04 | Channel name too long (>100) | `{ "name": "very long channel name over 100 chars...", "description": "desc" }` | `{ "error": "Validation error", "message": "Channel name must not exceed 100 characters" }` | 400 |
| CREATE_CH_05 | Description too long (>1000) | `{ "name": "Research", "description": "very long description over 1000 chars..." }` | `{ "error": "Validation error", "message": "Description must not exceed 1000 characters" }` | 400 |
| CREATE_CH_06 | Unauthorized user | No Bearer token | `{ "error": "Unauthorized", "message": "Access token required" }` | 401 |
| CREATE_CH_07 | Insufficient permissions | Valid token, no create permission | `{ "error": "Insufficient permissions", "message": "User does not have permission to create channels" }` | 403 |

## API: GET /channels/{channelId}
### 📌 Description
Retrieve details of a specific channel.

### 🔎 Functional Test Cases
| ID | Scenario | Input Example | Expected Output | Status Code |
|----------|------------------------|--------------------------------------------------|--------------------------------------------------|-------------|
| GET_CH_01 | Get channel details | `/channels/ch_123456` | `{ "id": "ch_123456", "name": "General", "description": "...", ... }` | 200 |
| GET_CH_02 | Channel not found | `/channels/ch_nonexistent` | `{ "error": "Channel not found", "message": "Channel does not exist" }` | 404 |
| GET_CH_03 | No access to channel | `/channels/ch_private` (user has no access) | `{ "error": "Access denied", "message": "User does not have access to this channel" }` | 403 |
| GET_CH_04 | Unauthorized access | No Bearer token | `{ "error": "Unauthorized", "message": "Access token required" }` | 401 |

## API: PUT /channels/{channelId}
### 📌 Description
Update channel name and description.

### 🔎 Functional Test Cases
| ID | Scenario | Input Example | Expected Output | Status Code |
|----------|------------------------|--------------------------------------------------|--------------------------------------------------|-------------|
| UPDATE_CH_01 | Update channel successfully | `{ "name": "Updated Research", "description": "Updated description" }` | `{ "id": "ch_123", "name": "Updated Research", "description": "Updated description", ... }` | 200 |
| UPDATE_CH_02 | Empty channel name | `{ "name": "", "description": "Updated description" }` | `{ "error": "Validation error", "message": "Channel name cannot be empty" }` | 400 |
| UPDATE_CH_03 | Channel name too long | `{ "name": "very long name over 100 chars...", "description": "desc" }` | `{ "error": "Validation error", "message": "Channel name must not exceed 100 characters" }` | 400 |
| UPDATE_CH_04 | Channel not found | `/channels/ch_nonexistent` | `{ "error": "Channel not found", "message": "Channel does not exist" }` | 404 |
| UPDATE_CH_05 | Insufficient permissions | Valid token, no edit permission | `{ "error": "Insufficient permissions", "message": "User does not have permission to edit this channel" }` | 403 |

## API: DELETE /channels/{channelId}
### 📌 Description
Delete a channel permanently.

### 🔎 Functional Test Cases
| ID | Scenario | Input Example | Expected Output | Status Code |
|----------|------------------------|--------------------------------------------------|--------------------------------------------------|-------------|
| DELETE_CH_01 | Delete channel successfully | `/channels/ch_123456` | `{ "message": "Channel deleted successfully" }` | 200 |
| DELETE_CH_02 | Channel not found | `/channels/ch_nonexistent` | `{ "error": "Channel not found", "message": "Channel does not exist" }` | 404 |
| DELETE_CH_03 | Insufficient permissions | Valid token, no delete permission | `{ "error": "Insufficient permissions", "message": "User does not have permission to delete this channel" }` | 403 |
| DELETE_CH_04 | Unauthorized access | No Bearer token | `{ "error": "Unauthorized", "message": "Access token required" }` | 401 |

## API: GET /channels/{channelId}/members
### 📌 Description
Retrieve all members of a specific channel.

### 🔎 Functional Test Cases
| ID | Scenario | Input Example | Expected Output | Status Code |
|----------|------------------------|--------------------------------------------------|--------------------------------------------------|-------------|
| GET_MEM_01 | Get channel members | `/channels/ch_123456/members` | `{ "members": [{user1}, {user2}], "count": 72 }` | 200 |
| GET_MEM_02 | Empty member list | `/channels/ch_empty/members` | `{ "members": [], "count": 0 }` | 200 |
| GET_MEM_03 | Channel not found | `/channels/ch_nonexistent/members` | `{ "error": "Channel not found", "message": "Channel does not exist" }` | 404 |
| GET_MEM_04 | No access to channel | `/channels/ch_private/members` | `{ "error": "Access denied", "message": "User does not have access to this channel" }` | 403 |

## API: POST /channels/{channelId}/members
### 📌 Description
Add one or more members to a channel.

### 🔎 Functional Test Cases
| ID | Scenario | Input Example | Expected Output | Status Code |
|----------|------------------------|--------------------------------------------------|--------------------------------------------------|-------------|
| ADD_MEM_01 | Add members successfully | `{ "userIds": ["user_123", "user_456"] }` | `{ "message": "Members added successfully", "added": [{user1}, {user2}] }` | 200 |
| ADD_MEM_02 | Empty user list | `{ "userIds": [] }` | `{ "error": "Validation error", "message": "At least one user ID is required" }` | 400 |
| ADD_MEM_03 | Missing userIds field | `{}` | `{ "error": "Validation error", "message": "userIds field is required" }` | 400 |
| ADD_MEM_04 | User not found | `{ "userIds": ["user_nonexistent"] }` | `{ "error": "User not found", "message": "One or more users do not exist" }` | 404 |
| ADD_MEM_05 | Channel not found | `/channels/ch_nonexistent/members` | `{ "error": "Channel not found", "message": "Channel does not exist" }` | 404 |
| ADD_MEM_06 | Insufficient permissions | Valid token, no add permission | `{ "error": "Insufficient permissions", "message": "User does not have permission to add members" }` | 403 |

## API: DELETE /channels/{channelId}/members/{userId}
### 📌 Description
Remove a member from a channel.

### 🔎 Functional Test Cases
| ID | Scenario | Input Example | Expected Output | Status Code |
|----------|------------------------|--------------------------------------------------|--------------------------------------------------|-------------|
| REM_MEM_01 | Remove member successfully | `/channels/ch_123/members/user_456` | `{ "message": "Member removed successfully" }` | 200 |
| REM_MEM_02 | Member not in channel | `/channels/ch_123/members/user_notmember` | `{ "error": "Member not found", "message": "User is not a member of this channel" }` | 404 |
| REM_MEM_03 | Channel not found | `/channels/ch_nonexistent/members/user_123` | `{ "error": "Channel not found", "message": "Channel does not exist" }` | 404 |
| REM_MEM_04 | Insufficient permissions | Valid token, no remove permission | `{ "error": "Insufficient permissions", "message": "User does not have permission to remove members" }` | 403 |

## API: GET /users/search
### 📌 Description
Search for users to add to channels.

### 🔎 Functional Test Cases
| ID | Scenario | Input Example | Expected Output | Status Code |
|----------|------------------------|--------------------------------------------------|--------------------------------------------------|-------------|
| SEARCH_01 | Search users successfully | `/users/search?q=john` | `{ "users": [{user1}, {user2}], "total": 5 }` | 200 |
| SEARCH_02 | No search results | `/users/search?q=nonexistentuser` | `{ "users": [], "total": 0 }` | 200 |
| SEARCH_03 | Missing search query | `/users/search` | `{ "error": "Invalid search query", "message": "Search query parameter 'q' is required" }` | 400 |
| SEARCH_04 | Empty search query | `/users/search?q=` | `{ "error": "Invalid search query", "message": "Search query cannot be empty" }` | 400 |
| SEARCH_05 | Query too long (>100) | `/users/search?q=very_long_query_over_100_chars...` | `{ "error": "Invalid search query", "message": "Search query must not exceed 100 characters" }` | 400 |

## API: GET /channels/{channelId}/messages
### 📌 Description
Retrieve messages from a channel with pagination.

### 🔎 Functional Test Cases
| ID | Scenario | Input Example | Expected Output | Status Code |
|----------|------------------------|--------------------------------------------------|--------------------------------------------------|-------------|
| GET_MSG_01 | Get channel messages | `/channels/ch_123/messages` | `{ "messages": [{msg1}, {msg2}], "hasMore": true }` | 200 |
| GET_MSG_02 | Get with pagination | `/channels/ch_123/messages?limit=20&before=msg_456` | `{ "messages": [{msg1}], "hasMore": false }` | 200 |
| GET_MSG_03 | Empty message list | `/channels/ch_empty/messages` | `{ "messages": [], "hasMore": false }` | 200 |
| GET_MSG_04 | Invalid limit | `/channels/ch_123/messages?limit=150` | `{ "error": "Validation error", "message": "Limit must not exceed 100" }` | 400 |
| GET_MSG_05 | Channel not found | `/channels/ch_nonexistent/messages` | `{ "error": "Channel not found", "message": "Channel does not exist" }` | 404 |
| GET_MSG_06 | No access to channel | `/channels/ch_private/messages` | `{ "error": "Access denied", "message": "User does not have access to this channel" }` | 403 |

## API: POST /channels/{channelId}/messages
### 📌 Description
Send a message to a channel.

### 🔎 Functional Test Cases
| ID | Scenario | Input Example | Expected Output | Status Code |
|----------|------------------------|--------------------------------------------------|--------------------------------------------------|-------------|
| SEND_MSG_01 | Send message successfully | `{ "content": "Hello, everyone!" }` | `{ "id": "msg_123", "content": "Hello, everyone!", "sender": {user}, ... }` | 201 |
| SEND_MSG_02 | Empty message content | `{ "content": "" }` | `{ "error": "Validation error", "message": "Message content cannot be empty" }` | 400 |
| SEND_MSG_03 | Missing content field | `{}` | `{ "error": "Validation error", "message": "Content field is required" }` | 400 |
| SEND_MSG_04 | Message too long (>1000) | `{ "content": "very long message over 1000 chars..." }` | `{ "error": "Validation error", "message": "Message content must not exceed 1000 characters" }` | 400 |
| SEND_MSG_05 | Whitespace only content | `{ "content": "     " }` | `{ "error": "Validation error", "message": "Message content cannot be only whitespace" }` | 400 |
| SEND_MSG_06 | Channel not found | `/channels/ch_nonexistent/messages` | `{ "error": "Channel not found", "message": "Channel does not exist" }` | 404 |
| SEND_MSG_07 | No send permission | Valid token, no send permission | `{ "error": "Access denied", "message": "User does not have permission to send messages" }` | 403 |

## API: GET /user/profile
### 📌 Description
Retrieve the authenticated user's profile information.

### 🔎 Functional Test Cases
| ID | Scenario | Input Example | Expected Output | Status Code |
|----------|------------------------|--------------------------------------------------|--------------------------------------------------|-------------|
| PROFILE_01 | Get user profile | Valid Bearer token | `{ "id": "user_123", "email": "user@example.com", "name": "John Doe", ... }` | 200 |
| PROFILE_02 | Unauthorized access | No Bearer token | `{ "error": "Unauthorized", "message": "Access token required" }` | 401 |
| PROFILE_03 | Invalid token | Invalid Bearer token | `{ "error": "Unauthorized", "message": "Invalid access token" }` | 401 |

## API: PUT /user/profile
### 📌 Description
Update user's name and title.

### 🔎 Functional Test Cases
| ID | Scenario | Input Example | Expected Output | Status Code |
|----------|------------------------|--------------------------------------------------|--------------------------------------------------|-------------|
| UPD_PROF_01 | Update profile successfully | `{ "name": "Jane Doe", "title": "Senior Developer" }` | `{ "id": "user_123", "name": "Jane Doe", "title": "Senior Developer", ... }` | 200 |
| UPD_PROF_02 | Name too long (>255) | `{ "name": "very long name over 255 chars...", "title": "Developer" }` | `{ "error": "Validation error", "message": "Name must not exceed 255 characters" }` | 400 |
| UPD_PROF_03 | Title too long (>100) | `{ "name": "Jane Doe", "title": "very long title over 100 chars..." }` | `{ "error": "Validation error", "message": "Title must not exceed 100 characters" }` | 400 |
| UPD_PROF_04 | Empty name | `{ "name": "", "title": "Developer" }` | `{ "error": "Validation error", "message": "Name cannot be empty" }` | 400 |

## API: PUT /user/profile/contact
### 📌 Description
Update user's email address.

### 🔎 Functional Test Cases
| ID | Scenario | Input Example | Expected Output | Status Code |
|----------|------------------------|--------------------------------------------------|--------------------------------------------------|-------------|
| UPD_CONT_01 | Update email successfully | `{ "email": "newemail@example.com" }` | `{ "id": "user_123", "email": "newemail@example.com", ... }` | 200 |
| UPD_CONT_02 | Invalid email format | `{ "email": "invalid-email" }` | `{ "error": "Validation error", "message": "Invalid email format" }` | 400 |
| UPD_CONT_03 | Empty email | `{ "email": "" }` | `{ "error": "Validation error", "message": "Email is required" }` | 400 |
| UPD_CONT_04 | Email already exists | `{ "email": "existing@example.com" }` | `{ "error": "Email already in use", "message": "This email is already registered to another user" }` | 409 |
| UPD_CONT_05 | Email too short | `{ "email": "a@b" }` | `{ "error": "Validation error", "message": "Email must be at least 5 characters" }` | 400 |
| UPD_CONT_06 | Email too long (>254) | `{ "email": "very_long_email_over_254_chars@example.com" }` | `{ "error": "Validation error", "message": "Email must not exceed 254 characters" }` | 400 |

## API: PUT /user/profile/photo
### 📌 Description
Upload and update user's profile photo.

### 🔎 Functional Test Cases
| ID | Scenario | Input Example | Expected Output | Status Code |
|----------|------------------------|--------------------------------------------------|--------------------------------------------------|-------------|
| UPD_PHOTO_01 | Upload photo successfully | Upload valid JPG/PNG file | `{ "photoUrl": "https://cdn.chatapp.com/avatars/user123.jpg", "user": {user_object} }` | 200 |
| UPD_PHOTO_02 | Invalid file format | Upload .txt file | `{ "error": "Invalid file format", "message": "Only JPG and PNG files are allowed" }` | 400 |
| UPD_PHOTO_03 | File too large | Upload file > size limit | `{ "error": "File too large", "message": "File size must not exceed maximum limit" }` | 413 |
| UPD_PHOTO_04 | Missing file | No file provided | `{ "error": "Validation error", "message": "Photo file is required" }` | 400 |
| UPD_PHOTO_05 | Corrupted file | Upload corrupted image file | `{ "error": "Invalid file", "message": "File is corrupted or invalid" }` | 400 |