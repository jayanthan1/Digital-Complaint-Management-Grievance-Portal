# Frontend Debugging Guide

## Debug Summary - Issues Fixed

### ✅ 1. **Error Handling & Type Safety**
- **Fixed**: Improved async/await error handling in staff dashboard `loadComplaints()`
- **Fixed**: Added null/undefined checks for optional properties (staff_id, priority, updated_at)
- **Fixed**: Enhanced error messages with better user feedback
- **Detail**: Added `Array.isArray()` checks for response data validation

### ✅ 2. **Route Guards**
- **Fixed**: Enhanced `AuthGuard` with error handling and token validation
- **Fixed**: Improved `RoleGuard` with better logging and error management
- **Benefit**: Better protection against route access issues

### ✅ 3. **HTTP Interceptor**
- **Status**: ✅ Working correctly
- **Verified**: Token is properly injected in Authorization header
- **Verified**: Console logging shows proper Bearer token format

### ✅ 4. **Service Error Handling**
- **Fixed**: Improved complaint list loading with try-catch blocks
- **Fixed**: Enhanced complaint details loading with validation
- **Fixed**: Better error messages in all API calls

### ✅ 5. **Form Validation**
- **Status**: ✅ Working correctly
- **Features**: Form submission properly catches errors
- **Details**: Error messages displayed to users via snackbars

---

## Common Issues & Solutions

### Issue 1: "Registration Failed" Error
**Cause**: Database connection or validation error
**Solution**:
1. Ensure MySQL is running: `services.msc` → MySQL80 (should be Running)
2. Check database password in `.env` file matches your MySQL password
3. Verify database and tables exist: Run `database.sql`
4. Check backend console for error messages

### Issue 2: Form Submission Hangs
**Cause**: Missing token or server not responding
**Solution**:
1. Check if backend server is running (port 5000)
2. Open browser DevTools → Network tab
3. Check if Authorization header is present in requests
4. Verify token exists in localStorage: `localStorage.getItem('token')`

### Issue 3: Undefined Dates or Properties
**Cause**: API returning null/undefined values
**Solution**:
1. All optional properties now have null checks
2. Date pipes include fallback "N/A" text
3. Staff_id only shows if value > 0
4. Priority defaults to "medium" if missing

### Issue 4: Route Guard Blocking Access
**Cause**: Guard redirecting to login/not-authorized
**Solution**:
1. Check browser console for guard logs
2. Verify token exists: `localStorage.getItem('token')`
3. Check user role in DevTools Console: `localStorage.getItem('currentUser')`
4. Required routes:
   - `/complaints/new` → Requires "user" role
   - `/staff/dashboard` → Requires "staff" or "admin" role
   - `/admin/dashboard` → Requires "admin" role

### Issue 5: Material Label Strikethrough
**Status**: ✅ FIXED
**Solution**: Added CSS to remove text-decoration on mat-labels in form fields

---

## Debugging Checklist

### Backend
- [ ] MySQL is running: `Get-Service MySQL80`
- [ ] Backend server running on port 5000: Check terminal or `http://localhost:5000/health`
- [ ] `.env` file has correct database password
- [ ] Database exists: `complaint_management`
- [ ] Tables exist and populated (if testing)

### Frontend
- [ ] Frontend running on port 4200
- [ ] Browser console shows no errors (F12 → Console)
- [ ] Token exists after login: Run in console: `localStorage.getItem('token')`
- [ ] AuthInterceptor logs show token being added to requests
- [ ] Network tab (DevTools) shows requests with `Authorization: Bearer <token>`

### Components to Check
1. **Auth Components** (Login/Register)
   - Form validation working
   - Error messages display
   - Token stored after login

2. **Complaint List**
   - Complaints load from API
   - Stats update correctly
   - Navigation works

3. **Complaint Details**
   - Data loads without errors
   - Status dropdown populates
   - Update button works

4. **Staff Dashboard**
   - Both assigned and unassigned complaints load
   - Stats display correctly
   - Status update works

5. **Admin Dashboard**
   - All users and complaints load
   - Charts/stats display
   - Filtering works

---

## Testing Workflow

### 1. Test Registration
```
1. Navigate to http://localhost:4200/auth/register
2. Fill form with valid data
3. Select role (user/staff/admin)
4. Click "Create Account"
5. Verify redirect to login page
6. Check browser console for token logs
```

### 2. Test Login
```
1. Navigate to http://localhost:4200/auth/login
2. Enter credentials
3. Click Login
4. Verify token stored: localStorage.getItem('token')
5. Verify redirect based on role
```

### 3. Test Protected Routes
```
1. Without token: Navigate to /complaints → Should redirect to /auth/login
2. With token: Navigate to protected routes → Should allow access
3. Wrong role: Access /admin/dashboard as "user" → Should show "Not Authorized"
```

### 4. Test API Calls
```
1. Open DevTools → Network tab
2. Perform action (e.g., file complaint)
3. Check request headers for: Authorization: Bearer <token>
4. Check response status codes
5. Check response body for success/error
```

---

## Console Logging Reference

### Auth Interceptor Logs
```
🔵 [AuthInterceptor #1] Intercepting request: {...}
🔵 [AuthInterceptor #1] Token check: exists, length
🔵 [AuthInterceptor #1] ✅ Adding Authorization header
🔵 [AuthInterceptor #1] ✅ Request completed successfully
```

### Auth Service Logs
```
Login successful, storing token
Token stored: <token preview>...
User set: {id, name, email, role}
```

### Guard Logs
```
[AuthGuard] User not authenticated, redirecting to login
[RoleGuard] User role not authorized. Required: [...], User role: user
```

### Component Logs
```
[ComplaintList] Invalid response structure: {...}
[ComplaintList] Failed to load complaints: {...}
[ComplaintDetails] Error in loadComplaint: {...}
```

---

## Browser DevTools Tips

### Check Token
```javascript
// In Console:
localStorage.getItem('token')  // Should return JWT string
localStorage.getItem('token')?.substring(0, 50) + '...'  // Preview
```

### Check User Info
```javascript
// Angular component property
// In component: this.authService.getCurrentUser()
```

### Monitor Requests
```
DevTools → Network tab → Filter by "api"
Click any request → Headers tab
Look for: Authorization: Bearer <token>
```

### Clear Data
```javascript
// Clear all storage:
localStorage.clear()
sessionStorage.clear()
// Then refresh page - will redirect to login
```

---

## Performance Optimization Tips

1. **Unsubscribe from Observables**: Use `takeUntil()` or `OnDestroy`
2. **Lazy Load Routes**: Routes already configured for lazy loading
3. **Bundle Size**: Material components are properly tree-shaken
4. **Change Detection**: Using OnPush strategy where possible

---

## Environment Configuration

### API URLs
- Backend: `http://localhost:5000/api`
- Frontend: `http://localhost:4200`

### If Ports Change
- Update in `auth.service.ts`: `private apiUrl = 'http://localhost:5000/api/auth'`
- Update in `complaint.service.ts`: `private apiUrl = 'http://localhost:5000/api/complaints'`
- Update in `user.service.ts`: `private apiUrl = 'http://localhost:5000/api/users'`

---

## Quick Reference

| Issue | Check | Fix |
|-------|-------|-----|
| 401 Unauthorized | Token in localStorage | Re-login |
| 403 Forbidden | User role | Check role in auth response |
| 404 Not Found | API endpoint URL | Verify backend routes |
| Form not submitting | Form validation | Check console for errors |
| Dates showing as blank | API returning null | Check database values |
| Dropdown empty | API not returning data | Check server response |

---

## Support Resources

- **Backend Logs**: Check terminal where `npm run dev` is running
- **Frontend Logs**: Browser DevTools → Console tab
- **Network Logs**: Browser DevTools → Network tab
- **Database**: Check MySQL Workbench or `mysql` command line

---

**Last Updated**: December 30, 2025
**Status**: ✅ All Major Issues Debugged and Fixed
