# 2FA Device Trust Testing Guide

## What Was Fixed

The 2FA "device trust" feature now properly persists for **180 days** per account and survives logout/login cycles.

### Changes Made:

1. **Improved Cookie Persistence** ([verify-otp/route.ts](app/api/auth/verify-otp/route.ts))
   - Added automatic cleanup of expired trusted devices (older than 180 days)
   - Enhanced logging for debugging in development mode
   - Fixed cookie comment (was "30 days", now correctly shows "180 days")

2. **Enhanced Login Verification** ([login/route.ts](app/api/auth/login/route.ts))
   - Added detailed logging to show when devices are trusted or expired
   - Better error handling for invalid cookie formats

3. **Robust Cookie Restoration** ([layout.tsx](app/layout.tsx))
   - Added verification that cookie is properly restored after logout
   - Enhanced logging to track cookie preservation

4. **Debug Endpoint** ([check-device-trust/route.ts](app/api/auth/check-device-trust/route.ts))
   - New API endpoint to check current device trust status (development only)

## How It Works

The `device_trusted` cookie stores multiple accounts in this format:
```json
{
  "user@example.com:CUSTOMER": 1703261234567,
  "user@example.com:SHARPENER": 1703261234890,
  "another@example.com:CUSTOMER": 1703261235123
}
```

Each account is tracked separately with a timestamp. When you login:
- If the timestamp is < 180 days old, 2FA is skipped
- If the timestamp is > 180 days old, you must verify OTP again

## Testing Steps

### Test 1: Basic 2FA Flow
1. Clear all cookies (or use incognito mode)
2. Login with Account A (user type: customer)
3. You should receive OTP via email
4. Verify OTP - you'll see a message about not needing OTP for 180 days
5. Logout
6. Login with Account A again
7. **Expected:** No OTP required, direct login

### Test 2: Multiple Accounts
1. Login with Account A (customer)
2. Verify OTP
3. Logout
4. Login with Account B (customer or sharpener)
5. Verify OTP
6. Logout
7. Login with Account A again
8. **Expected:** No OTP required (still trusted)
9. Login with Account B again
10. **Expected:** No OTP required (still trusted)

### Test 3: Same Email, Different Types
1. Login with email@example.com as CUSTOMER
2. Verify OTP
3. Logout
4. Login with email@example.com as SHARPENER
5. **Expected:** OTP required (different account type)
6. Verify OTP
7. Logout
8. Login with email@example.com as CUSTOMER
9. **Expected:** No OTP required (still trusted)

### Test 4: Check Device Trust Status (Development Only)
Visit: `http://localhost:3000/api/auth/check-device-trust`

You'll see something like:
```json
{
  "hasCookie": true,
  "totalDevices": 2,
  "devices": [
    {
      "account": "user@example.com:CUSTOMER",
      "trustedSince": "2024-12-22T10:30:00.000Z",
      "daysAgo": 0,
      "isValid": true
    },
    {
      "account": "user@example.com:SHARPENER",
      "trustedSince": "2024-12-22T10:35:00.000Z",
      "daysAgo": 0,
      "isValid": true
    }
  ]
}
```

## Development Console Logs

When running in development mode, you'll see helpful console logs:

**During OTP Verification:**
```
✓ Device trusted for: user@example.com:CUSTOMER
Total trusted devices: 1
```

**During Login:**
```
✓ Device trusted for user@example.com:CUSTOMER (verified 0 days ago)
```
or
```
✗ Device trust expired for user@example.com:CUSTOMER
```

**During Logout:**
```
Signing out, preserving device_trusted cookie: found
Device trust cookie restored: true
```

## Troubleshooting

### 2FA still asks for OTP after verification
1. Check browser console for logs (development mode)
2. Visit `/api/auth/check-device-trust` to see cookie status
3. Verify the cookie exists: Open browser DevTools → Application → Cookies
4. Check that `device_trusted` cookie has:
   - Path: `/`
   - Max-Age: ~15552000 (180 days in seconds)
   - SameSite: `Lax`

### Cookie disappeared after logout
1. Check console logs during logout
2. Verify the cookie is being preserved and restored
3. Some browsers might block cookies in certain modes (incognito, strict privacy)

### Testing with multiple accounts not working
1. Ensure you're using different email addresses OR same email with different account types
2. The format is `email:userType`, so `user@example.com:CUSTOMER` and `user@example.com:SHARPENER` are different

## Notes

- The cookie stores Base64-encoded JSON with account→timestamp mappings
- httpOnly is `false` to allow JavaScript preservation during logout
- Cookie automatically cleans up entries older than 180 days
- Each account type (CUSTOMER, SHARPENER, ADMIN) is tracked separately
- The feature works across different browsers on the same device (each browser has its own cookie)
