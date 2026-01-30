# Bearer Token Processing & Storage Documentation

## Overview
This document details how bearer tokens are generated, stored, processed, and used throughout the e-commerce application.

---

## 1. Token Storage Locations

### Primary Storage: Browser localStorage
- **Key**: `token`
- **Value**: JWT token string
- **Scope**: Browser domain-wide, persists across sessions
- **Access**: Readable from browser console via `localStorage.getItem('token')`

### Secondary Storage: React State (AuthContext)
- **Variable**: `token` state in `AuthContext`
- **Type**: `string | null`
- **Scope**: In-memory, persists during session only
- **Purpose**: Fast access without repeated localStorage reads

### Related Stored Data
| Key | Purpose | Type |
|-----|---------|------|
| `token` | Bearer authentication token | JWT string |
| `user` | Current logged-in user | JSON (userId, email, fullName, role) |
| `merchantProfile` | Merchant-specific profile data | JSON (optional) |
| `customerProfile` | Customer-specific profile data | JSON (optional) |

---

## 2. Token Lifecycle

### 2.1 Token Generation (Login)
```
User submits credentials → Backend validates → Issues JWT token
```

**File**: [src/api/auth.api.ts](src/api/auth.api.ts)
```typescript
login: async (credentials: LoginRequest): Promise<AuthResponse> => {
  const response = await authAPI.post('/login', payload);
  return authService.extractAuthResponse(response);
}
```

### 2.2 Token Storage (On Login Success)
**File**: [src/context/AuthContext.tsx](src/context/AuthContext.tsx#L56-L65)
```typescript
const login = async (email: string, password: string, role?: 'CUSTOMER' | 'MERCHANT') => {
  const response = await authService.login({ email, password }, role);
  
  // Store in localStorage
  localStorage.setItem('token', response.token);
  localStorage.setItem('user', JSON.stringify(response.user));
  
  // Store in React state
  setToken(response.token);
  setUser(response.user);
}
```

### 2.3 Token Retrieval (On App Mount)
**File**: [src/context/AuthContext.tsx](src/context/AuthContext.tsx#L25-L47)
```typescript
useEffect(() => {
  const loadUser = () => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  };
  loadUser();
}, []);
```

### 2.4 Token Usage (In API Requests)
**File**: [src/api/axios.config.ts](src/api/axios.config.ts#L44-L50)
```typescript
const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;  // ← Token added to header
  }
  return config;
};

// Applied to all API instances
[authAPI, productAPI, reviewAPI, inventoryAPI, orderAPI].forEach(api => {
  api.interceptors.request.use(requestInterceptor);
});
```

### 2.5 Token Removal (On Logout)
**File**: [src/api/auth.api.ts](src/api/auth.api.ts#L93-L99)
```typescript
logout: () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('merchantProfile');
  localStorage.removeItem('customerProfile');
}
```

### 2.6 Token Invalidation (On 401 Response)
**File**: [src/api/axios.config.ts](src/api/axios.config.ts#L52-L61)
```typescript
const errorInterceptor = (error: AxiosError) => {
  if (error.response?.status === 401) {
    // Token expired or invalid
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';  // ← Redirect to login
  }
  return Promise.reject(error);
};
```

---

## 3. Files Involved in Token Processing

### Core Auth Files
| File | Responsibility |
|------|-----------------|
| [src/context/AuthContext.tsx](src/context/AuthContext.tsx) | Store/retrieve token from localStorage and React state |
| [src/api/auth.api.ts](src/api/auth.api.ts) | Extract token from login/register responses |
| [src/api/axios.config.ts](src/api/axios.config.ts) | Inject token into all API request headers (interceptor) |
| [src/hooks/useAuth.ts](src/hooks/useAuth.ts) | Hook to access token/user throughout app |
| [src/utils/storage.ts](src/utils/storage.ts) | General localStorage utilities (optional) |

### Types Definitions
| File | Defines |
|------|---------|
| [src/types/auth.types.ts](src/types/auth.types.ts) | `AuthResponse`, `User`, `AuthContextType` types |
| [src/types/cart.types.ts](src/types/cart.types.ts) | Cart-related types |

---

## 4. Token Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│ LOGIN FLOW                                                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  User Input (email, password)                                      │
│         ↓                                                           │
│  LoginPage.tsx → AuthContext.login()                               │
│         ↓                                                           │
│  authService.login() → POST /login → Backend                       │
│         ↓                                                           │
│  Backend Response: { token: "jwt...", user: {...} }                │
│         ↓                                                           │
│  localStorage.setItem('token', response.token) ← STORED            │
│  setToken(response.token) ← React State Updated                    │
│         ↓                                                           │
│  Redirect to Dashboard / Product List                              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ API REQUEST FLOW (with Token)                                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Component calls: orderService.addToCart(productId, quantity)      │
│         ↓                                                           │
│  orderAPI.post('/cart/add', {...})                                 │
│         ↓                                                           │
│  Axios Request Interceptor Fires                                   │
│  requestInterceptor() → localStorage.getItem('token')              │
│         ↓                                                           │
│  Attaches Header: { Authorization: "Bearer <token>" }              │
│         ↓                                                           │
│  POST /api/cart/add HTTP/1.1                                       │
│  Authorization: Bearer eyJhbGciOiJIUzI1NiIs...                     │
│         ↓                                                           │
│  Backend validates token → Request succeeded                       │
│         ↓                                                           │
│  Response: { success: true, data: {...} }                          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ LOGOUT FLOW                                                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  User clicks Logout                                                │
│         ↓                                                           │
│  AuthContext.logout() → authService.logout()                       │
│         ↓                                                           │
│  localStorage.removeItem('token')                                  │
│  localStorage.removeItem('user')                                   │
│  setToken(null)                                                    │
│  setUser(null)                                                     │
│         ↓                                                           │
│  Redirect to Login Page                                            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ 401 (UNAUTHORIZED) FLOW                                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  API Response: 401 Unauthorized                                    │
│         ↓                                                           │
│  Axios Response Interceptor Fires                                  │
│  errorInterceptor(error)                                           │
│         ↓                                                           │
│  if (error.response?.status === 401)                               │
│         ↓                                                           │
│  localStorage.removeItem('token')                                  │
│  localStorage.removeItem('user')                                   │
│  window.location.href = '/login' ← Force Redirect                  │
│         ↓                                                           │
│  User back at Login Page                                           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 5. API Endpoints Using Tokens

All of these endpoints require the `Authorization: Bearer <token>` header:

| Service | Endpoint | Method | Requires Auth |
|---------|----------|--------|---|
| Order Service | `/api/cart/add` | POST | ✅ |
| Order Service | `/api/cart` | GET | ✅ |
| Order Service | `/api/cart/remove/{productId}` | DELETE | ✅ |
| Order Service | `/api/cart/update` | PUT | ✅ |
| Order Service | `/api/orders/checkout` | POST | ✅ |
| Order Service | `/api/orders/history` | GET | ✅ |
| Order Service | `/api/orders/{orderId}` | GET | ✅ |
| Product Service | `/api/products/{id}` | GET | ❌ |
| Review Service | `/api/reviews` | GET | ❌ |
| Review Service | `/api/reviews/product/{id}` | POST | ✅ |

---

## 6. Security Analysis & Recommendations

### ⚠️ Current Security Issues

#### 1. **localStorage Storage (XSS Vulnerability)**
- **Problem**: Token stored in `localStorage` is accessible to any JavaScript code
- **Risk**: XSS attacks can steal tokens if malicious script runs on page
- **Severity**: 🔴 HIGH

#### 2. **No Token Expiration/Refresh**
- **Problem**: Token may be valid indefinitely (if backend doesn't enforce TTL)
- **Risk**: Stolen token can be used forever; no way to force logout remotely
- **Severity**: 🔴 HIGH

#### 3. **No Refresh Token**
- **Problem**: No mechanism to extend session without forcing re-login
- **Risk**: Users logged out unexpectedly after token expires
- **Severity**: 🟡 MEDIUM

#### 4. **No CSRF Protection**
- **Problem**: No anti-CSRF tokens for state-changing requests
- **Risk**: Malicious sites can forge requests on behalf of authenticated users
- **Severity**: 🟡 MEDIUM

#### 5. **Token Transmitted Over HTTP (If Not HTTPS)**
- **Problem**: If app not served over HTTPS, tokens visible in transit
- **Risk**: Man-in-the-middle attacks
- **Severity**: 🔴 CRITICAL (if HTTP used)

---

### ✅ Recommended Fixes

#### 1. **Switch to HttpOnly Cookies** (BEST)
Replace localStorage with httpOnly cookies:
- ✅ Not accessible to JavaScript (prevents XSS token theft)
- ✅ Automatically sent with every request
- ✅ Can be set as `Secure` flag (HTTPS only)
- ✅ Can be set as `SameSite` flag (prevents CSRF)

**Implementation**:
```typescript
// On backend, return Set-Cookie header instead of token in body:
Set-Cookie: token=eyJ...; HttpOnly; Secure; SameSite=Strict; Max-Age=3600

// On frontend, axios will automatically send cookie with requests
// Remove localStorage.setItem('token') logic
```

#### 2. **Add Token Expiration & Refresh Flow**
```typescript
// Backend issues short-lived tokens (15-60 min)
// Frontend stores refresh token in httpOnly cookie (7-30 days)

// On 401 response, automatically refresh:
if (error.response?.status === 401) {
  const newToken = await refreshToken(); // POST /refresh
  retry original request with new token
}
```

#### 3. **Add CSRF Protection**
```typescript
// For state-changing requests (POST, PUT, DELETE):
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
config.headers['X-CSRF-Token'] = csrfToken;
```

#### 4. **Ensure HTTPS Only**
```typescript
// In axios config:
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // Must be https://
  withCredentials: true, // Send cookies with requests
});
```

#### 5. **Add Content Security Policy (CSP) Header**
```html
<!-- In public/index.html or backend header -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self';">
```

---

## 7. Implementation Roadmap

### Phase 1: Quick Wins (Low Risk, High Impact)
- [ ] Add `withCredentials: true` to axios config (enable cookie support)
- [ ] Increase axios timeout for slow endpoints (already 10s)
- [ ] Add retry logic for transient failures

### Phase 2: Security Hardening (Medium Effort)
- [ ] Coordinate with backend to implement httpOnly cookie storage
- [ ] Add token expiration check on frontend
- [ ] Implement refresh token flow
- [ ] Add CSRF token validation

### Phase 3: Advanced Security (Longer Term)
- [ ] Implement rate limiting on login endpoint
- [ ] Add IP whitelisting for sensitive operations
- [ ] Implement device fingerprinting for anomaly detection
- [ ] Add audit logging for all auth events

---

## 8. Quick Debugging Tips

### Check if Token is Stored
```javascript
// In browser console:
localStorage.getItem('token')
localStorage.getItem('user')
```

### Decode JWT Token
```javascript
// Install: npm install jwt-decode
import { jwtDecode } from 'jwt-decode';
const decoded = jwtDecode(localStorage.getItem('token'));
console.log(decoded);
```

### Monitor API Requests with Token
```javascript
// DevTools → Network tab → Click any API call → Headers tab
// Look for: Authorization: Bearer eyJ...
```

### Check AuthContext State
```javascript
// In component:
const { token, user, isAuthenticated } = useAuth();
console.log({ token, user, isAuthenticated });
```

---

## 9. Current Environment Variables

```env
REACT_APP_AUTH_SERVICE_URL=<backend-auth-service>
REACT_APP_ORDER_SERVICE_URL=<backend-order-service>
REACT_APP_PRODUCT_SERVICE_URL=<backend-product-service>
REACT_APP_REVIEW_SERVICE_URL=<backend-review-service>
```

Ensure all endpoints use **HTTPS** in production.

---

## 10. Summary Table

| Aspect | Current State | Recommendation |
|--------|---------------|-----------------|
| Storage | localStorage | httpOnly cookies |
| Expiration | None (indefinite) | 15-60 min (with refresh) |
| Refresh | None | Implement refresh token |
| Transmission | HTTP/HTTPS | HTTPS only |
| CSRF | None | Add CSRF tokens |
| XSS Protection | None | Implement CSP headers |

---

**Document Version**: 1.0  
**Last Updated**: January 30, 2026  
**Status**: Active - Review recommended after implementing Phase 2 security hardening
