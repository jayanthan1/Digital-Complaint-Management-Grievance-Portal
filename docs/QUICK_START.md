# Quick Start Guide

## Prerequisites
- Node.js v18+ 
- MySQL Server v8.0+
- Angular CLI 18+
- npm/yarn

## Step 1: Backend Setup (Terminal 1)

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your MySQL credentials
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=complaint_management

# Initialize database
mysql -u root -p < src/config/database.sql

# Start development server
npm run dev
```

Backend will be available at: **http://localhost:5000**

## Step 2: Frontend Setup (Terminal 2)

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend will be available at: **http://localhost:4200**

## Step 3: Test the Application

### Default Test Users

Register new users or use these test accounts:

**User Account**:
- Email: `user@test.com`
- Password: `password123`
- Role: User

**Staff Account**:
- Email: `staff@test.com`
- Password: `password123`
- Role: Staff

**Admin Account**:
- Email: `admin@test.com`
- Password: `password123`
- Role: Admin

### Testing Workflow

1. **As User**:
   - Register/Login as user
   - Go to "New Complaint" and create a complaint
   - View all your complaints in dashboard
   - Check complaint status

2. **As Staff**:
   - Login as staff member
   - Click "My Assignments" to see assigned complaints
   - Update complaint status
   - Add notes while updating status

3. **As Admin**:
   - Login as admin
   - Go to "Admin Dashboard"
   - View statistics and analytics
   - Assign complaints to staff members
   - Manage all users and complaints

## Common Issues & Solutions

### MySQL Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Solution**: Ensure MySQL is running
```bash
# Windows
net start MySQL80

# macOS
brew services start mysql

# Linux
sudo systemctl start mysql
```

### Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Solution**: Change port in `.env` or kill the process using the port
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

### CORS Error
```
Access to XMLHttpRequest at 'http://localhost:5000/api/...' from origin 
'http://localhost:4200' has been blocked by CORS policy
```
**Solution**: Backend CORS is configured. Restart backend server.

### Database Already Exists
If you get an error about database already existing:
```bash
mysql -u root -p
DROP DATABASE complaint_management;
# Then run the database.sql again
```

## Project Features Implemented

### ✅ User Authentication
- Register with role selection (User, Staff, Admin)
- Secure login with JWT tokens
- Token-based authorization

### ✅ User Roles
- **User**: Create complaints, view status, track progress
- **Staff**: View assigned complaints, update status
- **Admin**: Manage all complaints, assign to staff, view analytics

### ✅ Complaint Management
- Create complaints with title, description, category
- Track complaint status (Open → Assigned → In-Progress → Resolved)
- View complaint details and history

### ✅ Admin Features
- View all complaints in the system
- Assign complaints to staff members
- View statistics (total, by status, by category)
- Manage users and their roles

### ✅ UI/UX
- Angular Material components
- Responsive design
- User-friendly error messages
- Loading states and spinners
- Status color-coded chips

### ✅ Security
- JWT authentication
- Password hashing (bcryptjs)
- Role-based route guards
- HTTP interceptors for token injection
- Proper error handling

## Build for Production

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
```
Output will be in `dist/complaint-portal/`

## API Testing

You can test API endpoints using tools like:
- **Postman**: https://www.postman.com/
- **Insomnia**: https://insomnia.rest/
- **cURL**: Command-line tool

Example cURL for login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"password123"}'
```

## Useful Links

- **Backend Documentation**: `/docs/README.md`
- **API Documentation**: `/docs/API_DOCUMENTATION.md`
- **Angular Material**: https://material.angular.io/
- **Express.js Docs**: https://expressjs.com/
- **Angular Docs**: https://angular.io/docs

## Next Steps

1. ✅ Complete the basic setup
2. ✅ Test user registration and login
3. ✅ Create a test complaint
4. ✅ Test admin dashboard
5. 📋 Customize UI/branding
6. 📋 Add file upload support
7. 📋 Implement email notifications
8. 📋 Add real-time updates with WebSockets
9. 📋 Deploy to production

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review API documentation
3. Check browser console for errors
4. Check backend logs for server errors

---

**Happy coding!** 🎉
