# Login & Registration "Route Not Found" - Troubleshooting

## Current Status

✅ **Backend Server**: Running on port 5000  
✅ **Frontend Server**: Running on port 3000  
✅ **Database**: Connected  
✅ **Routes**: Properly configured  

## The Issue

You're getting "route not found" errors when trying to login or register.

## Most Likely Causes

### 1. React App Not Using Correct API URL

**Check**: Open browser console (F12) and look for network requests

**Expected URL**: `http://localhost:5000/api/auth/login`  
**If you see**: `http://localhost:3000/api/auth/login` ← WRONG!

**Fix**: The `.env` file was created, but React needs to be restarted.

### 2. Environment Variables Not Loaded

**Problem**: React only loads `.env` files when the server starts.

**Solution**:
1. Stop React server (Ctrl + C)
2. Start it again: `npm start`
3. Environment variables will load

## Quick Fix Steps

### Step 1: Verify .env File

Check `client/.env` contains:
```
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_51QhRGkRpKlLILJCEhBDnLGZxmzqCZyHJxqQvfWLYPUMWKJZVZ
REACT_APP_API_URL=http://localhost:5000
```

### Step 2: Restart React Server

```bash
# In client folder terminal
# Press Ctrl + C to stop
npm start
```

### Step 3: Clear Browser Cache

- Press `Ctrl + Shift + Delete`
- Clear cached images and files
- Or use Incognito mode

### Step 4: Test Login

1. Go to http://localhost:3000/login
2. Open browser console (F12)
3. Try to login
4. Check Network tab for the request URL

## Debugging

### Check API Calls in Browser Console

1. Open browser (F12)
2. Go to **Network** tab
3. Try to login
4. Look for the request to `/auth/login`

**What to check**:
- **Request URL**: Should be `http://localhost:5000/api/auth/login`
- **Status**: Should be 200 (success) or 400/401 (wrong credentials)
- **Response**: Should have JSON data

### Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| `ERR_CONNECTION_REFUSED` | Backend not running | Start backend: `npm run dev` |
| `404 Not Found` | Wrong URL | Check API_URL in .env |
| `CORS error` | CORS not configured | Backend should allow localhost:3000 |
| `Network Error` | Backend crashed | Check backend terminal for errors |

## Verify Backend is Working

### Test with Browser

Open this URL in browser:
```
http://localhost:5000/api/health
```

**Expected response**:
```json
{
  "success": true,
  "message": "Pizza Order API is running!",
  "timestamp": "2026-04-28T...",
  "db": {
    "connected": true
  }
}
```

### Test Login Endpoint

You can test if the backend login works by using Postman or browser console:

```javascript
// In browser console (F12)
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'shree@gmail.com',
    password: 'password'
  })
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

## Current Configuration

### Backend Routes (server/server.js)
```javascript
app.use('/api/auth', authRoutes);        // ✅ Configured
app.use('/api/users', userRoutes);       // ✅ Configured
app.use('/api/orders', orderRoutes);     // ✅ Configured
// ... etc
```

### Frontend API (client/src/services/api.js)
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

**This means**:
- If `REACT_APP_API_URL` is set: Uses that + `/api`
- If not set: Uses `http://localhost:5000/api`

**Your .env has**: `REACT_APP_API_URL=http://localhost:5000`  
**So API calls go to**: `http://localhost:5000/api/auth/login` ✅

## Still Not Working?

### Check These:

1. **Both servers running?**
   ```bash
   # Check backend
   netstat -ano | findstr :5000
   
   # Check frontend  
   netstat -ano | findstr :3000
   ```

2. **React server restarted after creating .env?**
   - Environment variables only load on startup
   - Must restart React server

3. **Browser cache cleared?**
   - Old cached files might have wrong API URL
   - Try Incognito mode

4. **Firewall blocking?**
   - Check if Windows Firewall is blocking Node.js
   - Allow Node.js through firewall

5. **Check backend logs**
   - Look at the terminal running `npm run dev`
   - Should show incoming requests
   - Any errors will appear there

## Expected Behavior

### When Login Works:

1. User enters email/password
2. Frontend sends POST to `http://localhost:5000/api/auth/login`
3. Backend validates credentials
4. Backend returns JWT token
5. Frontend stores token in localStorage
6. User is redirected to dashboard

### Network Request Should Look Like:

```
Request URL: http://localhost:5000/api/auth/login
Request Method: POST
Status Code: 200 OK

Request Headers:
Content-Type: application/json

Request Payload:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "user@example.com",
    "role": "customer"
  }
}
```

## Quick Checklist

- [ ] Backend server running on port 5000
- [ ] Frontend server running on port 3000
- [ ] `.env` file exists in `client/` folder
- [ ] `.env` has `REACT_APP_API_URL=http://localhost:5000`
- [ ] React server was restarted after creating `.env`
- [ ] Browser cache cleared
- [ ] Can access `http://localhost:5000/api/health`
- [ ] Network tab shows requests going to `localhost:5000`

## Next Steps

1. **Restart React server** (most important!)
2. **Clear browser cache**
3. **Try login again**
4. **Check browser console** for actual error
5. **Check Network tab** for request details

If still not working, check the browser console and network tab to see the exact error message and share that for more specific help.
