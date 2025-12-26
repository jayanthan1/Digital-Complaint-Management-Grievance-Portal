# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### 1. Register User
**POST** `/auth/register`

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user",
  "contact_info": "+1234567890"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Validation**:
- `name`: Required, non-empty string
- `email`: Required, valid email format, unique
- `password`: Required, minimum 6 characters
- `role`: Required, one of: 'user', 'staff', 'admin'
- `contact_info`: Optional string

---

### 2. Login User
**POST** `/auth/login`

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

**Error Response** (401 Unauthorized):
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### 3. Get User Profile
**GET** `/auth/profile`

**Headers**: 
```
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "contact_info": "+1234567890"
  }
}
```

---

## Complaint Endpoints

### 1. Create Complaint
**POST** `/complaints`

**Headers**: 
```
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "title": "Water Leakage in Room 101",
  "description": "There is water leaking from the ceiling in room 101. It started yesterday.",
  "category": "Plumbing"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Complaint registered successfully",
  "data": {
    "id": 1,
    "user_id": 1,
    "title": "Water Leakage in Room 101",
    "description": "There is water leaking from the ceiling in room 101. It started yesterday.",
    "category": "Plumbing",
    "status": "open",
    "staff_id": null,
    "attachments": null,
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

**Validation**:
- `title`: Required, non-empty string
- `description`: Required, non-empty string
- `category`: Required, non-empty string

---

### 2. Get My Complaints
**GET** `/complaints/my-complaints`

**Headers**: 
```
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Complaints retrieved successfully",
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "title": "Water Leakage",
      "description": "There is water leaking...",
      "category": "Plumbing",
      "status": "assigned",
      "staff_id": 2,
      "attachments": null,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-16T09:15:00Z"
    }
  ]
}
```

---

### 3. Get Staff Assigned Complaints
**GET** `/complaints/staff-assigned`

**Headers**: 
```
Authorization: Bearer <token>
Role: staff or admin
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Assigned complaints retrieved successfully",
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "title": "Water Leakage",
      "category": "Plumbing",
      "status": "assigned",
      "staff_id": 2,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### 4. Get Complaint Details
**GET** `/complaints/:id`

**Headers**: 
```
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Complaint retrieved successfully",
  "data": {
    "id": 1,
    "user_id": 1,
    "title": "Water Leakage in Room 101",
    "description": "There is water leaking from the ceiling...",
    "category": "Plumbing",
    "status": "in-progress",
    "staff_id": 2,
    "attachments": null,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-16T14:20:00Z"
  }
}
```

---

### 5. Update Complaint Status
**PUT** `/complaints/:id/status`

**Headers**: 
```
Authorization: Bearer <token>
Role: staff or admin
```

**Request Body**:
```json
{
  "status": "in-progress"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Complaint status updated successfully",
  "data": {
    "id": 1,
    "user_id": 1,
    "title": "Water Leakage in Room 101",
    "status": "in-progress",
    "updated_at": "2024-01-16T14:20:00Z"
  }
}
```

**Status Flow**: `open` → `assigned` → `in-progress` → `resolved`

---

### 6. Assign Complaint to Staff
**PUT** `/complaints/:id/assign`

**Headers**: 
```
Authorization: Bearer <token>
Role: admin
```

**Request Body**:
```json
{
  "staff_id": 2
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Complaint assigned successfully",
  "data": {
    "id": 1,
    "user_id": 1,
    "staff_id": 2,
    "status": "assigned",
    "updated_at": "2024-01-16T09:15:00Z"
  }
}
```

---

### 7. Get All Complaints (Admin)
**GET** `/complaints`

**Headers**: 
```
Authorization: Bearer <token>
Role: admin
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "All complaints retrieved successfully",
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "title": "Water Leakage",
      "category": "Plumbing",
      "status": "in-progress",
      "staff_id": 2
    },
    {
      "id": 2,
      "user_id": 3,
      "title": "Broken Light",
      "category": "Electrical",
      "status": "open",
      "staff_id": null
    }
  ]
}
```

---

### 8. Get Complaint Statistics
**GET** `/complaints/statistics/overview`

**Headers**: 
```
Authorization: Bearer <token>
Role: admin
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Statistics retrieved successfully",
  "data": {
    "overall": [
      {
        "total": 15,
        "open_count": 3,
        "assigned_count": 4,
        "in_progress_count": 5,
        "resolved_count": 3
      }
    ],
    "byCategory": [
      {
        "category": "Plumbing",
        "count": 5
      },
      {
        "category": "Electrical",
        "count": 4
      },
      {
        "category": "Facility",
        "count": 6
      }
    ]
  }
}
```

---

## User Management Endpoints

### 1. Get Staff Members (Admin)
**GET** `/users/staff`

**Headers**: 
```
Authorization: Bearer <token>
Role: admin
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Staff members retrieved successfully",
  "data": [
    {
      "id": 2,
      "name": "John Smith",
      "email": "john.smith@example.com",
      "contact_info": "+1234567890"
    },
    {
      "id": 4,
      "name": "Jane Doe",
      "email": "jane.doe@example.com",
      "contact_info": "+0987654321"
    }
  ]
}
```

---

### 2. Get All Users (Admin)
**GET** `/users`

**Headers**: 
```
Authorization: Bearer <token>
Role: admin
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "contact_info": null
    },
    {
      "id": 2,
      "name": "John Smith",
      "email": "john.smith@example.com",
      "role": "staff",
      "contact_info": "+1234567890"
    },
    {
      "id": 5,
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "admin",
      "contact_info": null
    }
  ]
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Complaint not found"
}
```

### 409 Conflict
```json
{
  "success": false,
  "message": "Email already registered"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

## Status Codes Summary

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Internal Server Error |

---

## Rate Limiting

Currently, no rate limiting is implemented. Consider implementing in production.

## Pagination

Currently, pagination is not implemented. All results are returned. Consider implementing for large datasets.

## Filtering & Sorting

Currently, no filtering or sorting options are available. These features can be added in future versions.
