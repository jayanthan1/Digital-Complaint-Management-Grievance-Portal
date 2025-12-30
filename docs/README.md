# Digital Complaint Management & Grievance Portal

A full-stack web application for managing complaints with role-based access, real-time tracking, and admin analytics.

## Project Overview

This project implements a comprehensive complaint management system with the following features:

- **User Roles**: User, Staff/Technician, Admin
- **Complaint Lifecycle**: Open → Assigned → In-progress → Resolved
- **Real-time Status Tracking**: Users can monitor complaint status
- **Admin Dashboard**: Manage complaints, assign to staff, view analytics
- **Role-Based Access Control**: Using Angular route guards

## Technology Stack

### Backend
- **Framework**: Node.js with Express.js
- **Language**: TypeScript
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator

### Frontend
- **Framework**: Angular 18 (Standalone Components)
- **UI Library**: Angular Material 18
- **Language**: TypeScript 5.4
- **HTTP Client**: Angular HttpClient
- **State Management**: RxJS Observables

## Project Structure

```
complaint-management-portal/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts
│   │   │   └── database.sql
│   │   ├── controllers/
│   │   │   ├── AuthController.ts
│   │   │   ├── ComplaintController.ts
│   │   │   └── UserController.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   └── error.ts
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   └── Complaint.ts
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── complaints.ts
│   │   │   └── users.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   ├── auth.ts
│   │   │   ├── error.ts
│   │   │   └── validation.ts
│   │   └── index.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   │   ├── guards/
│   │   │   │   │   ├── auth.guard.ts
│   │   │   │   │   └── role.guard.ts
│   │   │   │   ├── interceptors/
│   │   │   │   │   └── auth.interceptor.ts
│   │   │   │   └── services/
│   │   │   │       ├── auth.service.ts
│   │   │   │       ├── complaint.service.ts
│   │   │   │       └── user.service.ts
│   │   │   ├── features/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── login/
│   │   │   │   │   ├── register/
│   │   │   │   │   └── auth.component.ts
│   │   │   │   ├── complaints/
│   │   │   │   │   ├── complaint-list/
│   │   │   │   │   ├── complaint-form/
│   │   │   │   │   ├── complaint-details/
│   │   │   │   │   └── staff-dashboard/
│   │   │   │   └── admin/
│   │   │   │       └── admin-dashboard/
│   │   │   ├── shared/
│   │   │   │   ├── models/
│   │   │   │   └── components/
│   │   │   │       └── not-authorized/
│   │   │   ├── app.component.ts
│   │   │   └── app.routes.ts
│   │   ├── main.ts
│   │   ├── styles.css
│   │   └── index.html
│   ├── angular.json
│   ├── tsconfig.json
│   └── package.json
│
└── docs/
    └── API_DOCUMENTATION.md
```

## Installation & Setup

### Prerequisites
- Node.js (v16+)
- MySQL Server (v8.0+)
- Angular CLI (v16+)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**:
```bash
cd backend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Configure environment**:
```bash
cp .env.example .env
```
Edit `.env` with your MySQL credentials:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=complaint_management
```

4. **Set up database**:
```bash
mysql -u root -p < src/config/database.sql
```

5. **Start the backend server**:
```bash
npm run dev
```
Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**:
```bash
cd frontend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Start the development server**:
```bash
npm start
```
Application will be available at `http://localhost:4200`

## Database Schema

### Users Table
- `id`: Primary Key (Auto-increment)
- `name`: String (required)
- `email`: String (unique, required)
- `password`: String (hashed, required)
- `role`: Enum ('user', 'staff', 'admin')
- `contact_info`: String (optional)
- `created_at`: Timestamp

### Complaints Table
- `id`: Primary Key (Auto-increment)
- `user_id`: Foreign Key (references users.id)
- `staff_id`: Foreign Key (references users.id, nullable)
- `title`: String (required)
- `description`: Text (required)
- `category`: String (required)
- `status`: Enum ('open', 'assigned', 'in-progress', 'resolved')
- `attachments`: String (file path/URL, optional)
- `created_at`: Timestamp
- `updated_at`: Timestamp

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires auth)

### Complaints
- `POST /api/complaints` - Create new complaint
- `GET /api/complaints/my-complaints` - Get user's complaints
- `GET /api/complaints/staff-assigned` - Get staff's assigned complaints
- `GET /api/complaints/:id` - Get complaint details
- `PUT /api/complaints/:id/status` - Update complaint status
- `PUT /api/complaints/:id/assign` - Assign complaint to staff (admin only)
- `GET /api/complaints` - Get all complaints (admin only)
- `GET /api/complaints/statistics/overview` - Get statistics (admin only)

### Users
- `GET /api/users/staff` - Get all staff members (admin only)
- `GET /api/users` - Get all users (admin only)

## Routes

| Path | Component | Role | Description |
|------|-----------|------|-------------|
| `/auth/register` | RegisterComponent | Public | User registration |
| `/auth/login` | LoginComponent | Public | User login |
| `/complaints` | ComplaintListComponent | User | View user's complaints |
| `/complaints/new` | ComplaintFormComponent | User | Create new complaint |
| `/complaints/:id` | ComplaintDetailsComponent | User | View complaint details |
| `/staff/dashboard` | StaffDashboardComponent | Staff/Admin | View assigned complaints |
| `/admin/dashboard` | AdminDashboardComponent | Admin | Admin dashboard |
| `/not-authorized` | NotAuthorizedComponent | All | Access denied page |

## Features

### User Features
- Register with role selection
- Submit complaints with title, description, category
- View all their complaints
- Track complaint status
- View complaint details

### Staff Features
- View assigned complaints
- Update complaint status
- View complaint details
- Add resolution notes

### Admin Features
- View all complaints
- Assign complaints to staff
- View complaint statistics
- View analytics by category
- Manage users
- Monitor system

## Validation Rules

### Registration
- Name: Required, non-empty
- Email: Required, valid email format
- Password: Required, minimum 6 characters
- Role: Required, must be 'user', 'staff', or 'admin'

### Complaint Creation
- Title: Required, non-empty
- Description: Required, non-empty
- Category: Required, non-empty

### Status Update
- Status must follow workflow: open → assigned → in-progress → resolved

## Error Handling

### Backend
- Proper HTTP status codes (200, 201, 400, 401, 403, 404, 500)
- Structured error responses
- Error logging for debugging
- Validation error messages

### Frontend
- User-friendly error messages via snack bars
- Form validation feedback
- Loading states for async operations
- Graceful error handling

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Role-Based Access Control**: Angular route guards enforce authorization
- **HTTP Interceptor**: Automatic token injection in requests
- **CORS**: Cross-Origin Resource Sharing configured
- **Middleware**: Authentication and error handling middleware

## Running the Application

### Terminal 1 - Start Backend
```bash
cd backend
npm install
npm run dev
```

### Terminal 2 - Start Frontend
```bash
cd frontend
npm install
npm start
```

Access the application at `http://localhost:4200`

## Test Credentials

### User Account
- Email: `user@example.com`
- Password: `password123`
- Role: User

### Staff Account
- Email: `staff@example.com`
- Password: `password123`
- Role: Staff

### Admin Account
- Email: `admin@example.com`
- Password: `password123`
- Role: Admin

## Building for Production

### Backend
```bash
npm run build
npm start
```

### Frontend
```bash
npm run build
```

The built application will be in `dist/complaint-portal/`

## Troubleshooting

### Database Connection Error
- Ensure MySQL server is running
- Check database credentials in `.env`
- Verify database exists and is initialized with schema

### Frontend Cannot Connect to Backend
- Ensure backend server is running on port 5000
- Check CORS configuration in backend
- Verify API URLs in services

### JWT Token Error
- Clear browser localStorage and login again
- Check JWT_SECRET in `.env`
- Verify token expiration time

## Future Enhancements

- File upload support for attachments
- Email notifications on status changes
- Real-time updates using WebSockets
- Advanced analytics dashboard
- Complaint search and filtering
- User feedback/rating system
- Multi-language support
- Mobile application

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For issues or questions, please create an issue in the repository.
