# Login Debugging Guide

## How to Check What's Happening

1. **Open Browser DevTools** - Press `F12`
2. **Go to Console tab**
3. **Try to login**
4. **Look for these console logs:**

### Successful Login Logs:
```
🔑 Login request payload: {email: "...", password: "..."}
📨 Login API response: {data: {...}}
✅ Extracted auth data: {token: "...", user: {...}}
Login attempt with: {email: "...", role: "CUSTOMER"}
Login response received: {token: "...", user: {...}}
Stored token and user
Login successful
```

### What to Look For:

**If you see an error message**, check the response format:
- The backend might be returning: `{ data: { token: "...", user: {...} } }`
- Or: `{ success: true, message: "...", data: { token: "...", user: {...} } }`
- Or: `{ token: "...", user: {...} }`

## Backend Response Format That Works

Your backend should return one of these formats:

### Format 1 (Preferred - Direct):
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": {
    "userId": 123,
    "email": "user@example.com",
    "fullName": "John Doe",
    "role": "CUSTOMER"
  }
}
```

### Format 2 (Wrapped in data):
```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "user": {
      "userId": 123,
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "CUSTOMER"
    }
  }
}
```

### Format 3 (With success wrapper):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "user": {
      "userId": 123,
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "CUSTOMER"
    }
  }
}
```

## What Each Field Means

- **token** - JWT token for authentication (required)
- **user** - User object with credentials (required)
  - **userId** - Unique user ID (number)
  - **email** - User email address
  - **fullName** - User's full name (or name, or full_name)
  - **role** - Either "CUSTOMER" or "MERCHANT"

## Common Issues & Fixes

### Issue 1: "No token in response"
**Cause:** Backend isn't returning a token  
**Fix:** Check that login endpoint returns token field

### Issue 2: "No user in response"
**Cause:** Backend isn't returning user data  
**Fix:** Check that login endpoint returns user object with email, fullName, role

### Issue 3: Login succeeds but stays on login page
**Cause:** User object doesn't have a `fullName` field  
**Fix:** Make sure backend returns either:
- `fullName` (camelCase), OR
- `full_name` (snake_case), OR  
- `name` (simple)

## Testing Login

### Step 1: Register a Customer
- Email: `test@example.com`
- Full Name: `Test User`
- Password: `password123`

### Step 2: Login as Customer
- Email: `test@example.com`
- Password: `password123`
- Role: Customer
- You should see console logs and be redirected to home page

### Step 3: Check localStorage
In browser console, run:
```javascript
console.log('Token:', localStorage.getItem('token'));
console.log('User:', localStorage.getItem('user'));
```

If both exist, login is working!

---

**If login still doesn't work**, copy the entire console output and share it with the development team.
