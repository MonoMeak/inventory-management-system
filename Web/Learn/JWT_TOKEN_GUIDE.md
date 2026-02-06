# JWT Token Authentication Implementation

## Overview

The application now supports JWT (JSON Web Token) based authentication with tokens stored in localStorage and included in all API requests via Bearer authorization header.

## How It Works

### 1. Token Storage

Tokens are stored in `localStorage` under the key `token`:

```typescript
// Get token
const token = localStorage.getItem("token");

// Store token
localStorage.setItem("token", token);

// Clear token
localStorage.removeItem("token");
```

### 2. API Client Integration

The API client automatically includes the JWT token in request headers:

```typescript
// In src/api/api.ts
headers.Authorization = `Bearer ${token}`;

// Request includes:
fetch(url, {
  headers: {
    Authorization: "Bearer eyJhbGciOiJIUzM4NCJ9...",
    "Content-Type": "application/json",
  },
});
```

### 3. Token Management in Auth Store

#### State

```typescript
{
  user: User | null,
  token: string | null,
  isAuthenticated: boolean
}
```

#### Actions

- `login(username, password)` - Login and store token
- `checkSession()` - Verify token with backend
- `logout()` - Clear token and logout

## Authentication Flow

### Login

```
1. User enters credentials
2. POST /login { username, password }
3. Backend returns { token, user }
4. Frontend stores token in localStorage
5. API client auto-includes token in headers
6. Redirect to dashboard
```

### Protected Route Access

```
1. User tries to access /products
2. Router checks if token exists in localStorage
3. If no token: redirect to /login
4. If token exists: send as Bearer header in requests
5. If 401 response: clear token, redirect to /login
```

### Logout

```
1. User clicks logout
2. Token cleared from localStorage
3. Session cleared on backend
4. Redirect to /login
```

## Token Utilities

Helper functions in `src/api/tokenUtils.ts`:

```typescript
// Store token
storeToken(token);

// Get token
const token = getToken();

// Clear token
clearToken();

// Check if valid token exists
hasValidToken();

// Decode token (without verification)
const payload = decodeToken(token);
// Returns: { sub, role, iat, exp, ... }

// Check if expired
isTokenExpired(token);

// Get expiration time
const secondsUntilExpire = getTokenExpiresIn(token);

// Log token info (debugging)
logTokenInfo();
```

## Token Structure

JWT tokens have three parts separated by dots: `header.payload.signature`

### Example Payload

```json
{
  "sub": "admin",
  "role": "ADMIN",
  "iat": 1766045306,
  "exp": 1766131706
}
```

- `sub`: Subject (username)
- `role`: User role (ADMIN or USER)
- `iat`: Issued at (Unix timestamp)
- `exp`: Expires at (Unix timestamp)

## Browser Developer Tools

### View Token in localStorage

```javascript
// Console
localStorage.getItem("token");
```

### Decode Token

```javascript
// Console
import { decodeToken } from "./src/api/tokenUtils";
const token = localStorage.getItem("token");
console.log(decodeToken(token));
```

### Check Token Expiration

```javascript
// Console
import { isTokenExpired, getTokenExpiresIn } from "./src/api/tokenUtils";
const token = localStorage.getItem("token");
console.log("Expired?", isTokenExpired(token));
console.log("Expires in (seconds):", getTokenExpiresIn(token));
```

## Error Handling

### 401 Unauthorized

When the API returns 401, the client:

1. Clears the token from localStorage
2. Redirects to /login
3. Shows error message

```typescript
if (response.status === 401) {
  localStorage.removeItem("token");
  window.location.href = "/login";
}
```

### Invalid Token

If the token is invalid or expired:

1. checkSession() throws an error
2. Token is cleared
3. User is redirected to login

## Router Guards

Protected routes require valid token:

```typescript
router.beforeEach(async (to) => {
  if (to.meta.requiresAuth) {
    if (!auth.isAuthenticated) {
      const token = localStorage.getItem("token");
      if (token) {
        // Try to validate token with backend
        try {
          await auth.checkSession();
        } catch (error) {
          return "/login";
        }
      } else {
        return "/login";
      }
    }
  }
});
```

## API Endpoints

All endpoints expect JWT in Authorization header:

```bash
# Example with token
curl -H "Authorization: Bearer eyJhbGciOiJIUzM4NCJ9..." \
  http://localhost:8080/api/products

# Response examples
# 200: Success
# 401: Invalid/expired token
# 403: Insufficient permissions
```

## Token Expiration Handling

### Auto Token Renewal (Optional)

You can implement token refresh by:

1. Storing refresh token separately
2. Using refreshToken endpoint before expiration
3. Updating stored token

```typescript
// Example refresh implementation
if (getTokenExpiresIn(token) < 60) {
  // Less than 1 minute left, refresh
  const newToken = await api.post("/refresh-token", {
    refreshToken: localStorage.getItem("refreshToken"),
  });
  storeToken(newToken);
}
```

### Manual Token Handling

For testing with a specific token:

```typescript
// In browser console
localStorage.setItem("token", "your-jwt-token-here");
window.location.href = "/dashboard";
```

## Security Notes

1. **localStorage**: Tokens in localStorage are accessible to XSS attacks

   - Always validate tokens on the backend
   - Implement CSP (Content Security Policy)
   - Use httpOnly cookies for sensitive data if possible

2. **Token Validation**: Frontend decoding is for display only

   - Always validate signatures on backend
   - Check expiration on backend

3. **HTTPS**: Always use HTTPS in production

   - Prevents token interception
   - Required for secure cookies

4. **Token Rotation**: Implement token rotation
   - Refresh tokens periodically
   - Shorter expiration times are safer

## Testing

### Test Login with Token

```typescript
// 1. Login normally
await auth.login("admin", "admin123");

// 2. Verify token in localStorage
const token = localStorage.getItem("token");
console.log("Token stored:", !!token);

// 3. Check token info
import { logTokenInfo } from "@/api/tokenUtils";
logTokenInfo();

// 4. Verify API calls include token
// Open Network tab in DevTools
// Check request headers for Authorization: Bearer ...
```

### Test Token Persistence

```typescript
// 1. Login
await auth.login("admin", "admin123");

// 2. Refresh page
location.reload();

// 3. Verify token still works
// Check if still authenticated
console.log(auth.isAuthenticated); // Should be true
```

### Test Token Expiration

```typescript
// Modify token to set past expiration
const token = localStorage.getItem("token");
const decoded = JSON.parse(atob(token.split(".")[1]));
decoded.exp = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago
// Re-encode and store (for testing only)

// Try to access protected route
// Should redirect to login
```

## Files Modified

- `src/api/api.ts` - JWT token in request headers
- `src/api/tokenUtils.ts` - Token management utilities
- `src/stores/authStore.ts` - Token storage and handling
- `src/router/index.ts` - Token-based route guards
- `src/pages/Login.vue` - Token logging on login
- `src/pages/Dashboard.vue` - Reports API integration

## Example Usage

### Manual Token Storage

```typescript
// For development/testing
import { storeToken } from "@/api/tokenUtils";

const testToken =
  "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJhZG1pbiIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc2NjA0NTMwNiwiZXhwIjoxNzY2MTMxNzA2fQ.FvWXH9hSw9CCaJsNI6eem63cqguodXsfPc1v-f0-OrfcrjPUiPXPzyTUq5VOSKIz";

storeToken(testToken);
// Token is now available for API calls
```

### Check Authentication Status

```typescript
import { useAuthStore } from "@/stores/authStore";

const auth = useAuthStore();
console.log(auth.isAuthenticated); // true/false
console.log(auth.user); // User object
console.log(auth.isAdmin); // true/false
```

## Backend Requirements

Backend must:

1. Issue JWT tokens on login
2. Accept JWT in Authorization header
3. Validate token signature and expiration
4. Return 401 for invalid/expired tokens
5. Return 403 for insufficient permissions

Example backend response:

```json
{
  "token": "eyJhbGciOiJIUzM4NCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "role": "ADMIN",
    "active": true
  }
}
```
