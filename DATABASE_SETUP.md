# Database Setup Guide

## Quick Start to Initialize Database

### Option 1: Using Command Line (Recommended)

#### Windows (PowerShell):
```powershell
# Navigate to backend directory
cd c:\projects_25_2\complaint\backend

# Initialize database
mysql -u root -p"password" < src/config/database.sql
```

#### Mac/Linux:
```bash
cd complaint/backend
mysql -u root -p < src/config/database.sql
# Enter password when prompted: password
```

### Option 2: Using MySQL Workbench or GUI Tool

1. Open MySQL Workbench
2. Create a new query tab
3. Copy contents from: `backend/src/config/database.sql`
4. Execute the query
5. Verify: Database `complaint_management` is created with `users` and `complaints` tables

### Option 3: Command by Command

```sql
-- Run these commands in MySQL CLI or Workbench

CREATE DATABASE IF NOT EXISTS complaint_management;
USE complaint_management;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'staff', 'admin') DEFAULT 'user',
  contact_info VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS complaints (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  staff_id INT,
  title VARCHAR(255) NOT NULL,
  description LONGTEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  status ENUM('open', 'assigned', 'in-progress', 'resolved') DEFAULT 'open',
  attachments VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (staff_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_user_id ON complaints(user_id);
CREATE INDEX idx_staff_id ON complaints(staff_id);
CREATE INDEX idx_status ON complaints(status);
CREATE INDEX idx_category ON complaints(category);
CREATE INDEX idx_created_at ON complaints(created_at);
```

## Verify Installation

After running the initialization script, verify everything is set up:

```sql
-- Check database exists
SHOW DATABASES;

-- Use the database
USE complaint_management;

-- Check tables exist
SHOW TABLES;

-- Verify users table structure
DESCRIBE users;

-- Verify complaints table structure
DESCRIBE complaints;

-- Check indices
SHOW INDEX FROM complaints;
```

## Connection Details

**Host**: localhost  
**Port**: 3306  
**User**: root  
**Password**: password  
**Database**: complaint_management  

> ⚠️ **Important**: Update these credentials in `.env` file if your MySQL setup is different!

## Troubleshooting

### "Access denied for user 'root'"
- Ensure MySQL is running
- Verify username and password in `.env` file
- Check if MySQL service is started: 
  - Windows: `net start MySQL80` (or your MySQL version)
  - Mac: `brew services start mysql`
  - Linux: `sudo systemctl start mysql`

### "Database does not exist"
- Re-run the initialization script
- Ensure you have CREATE DATABASE privileges
- Check for error messages in the output

### "Table already exists"
- This is normal if running the script multiple times (due to `IF NOT EXISTS`)
- The script won't overwrite existing tables

### Port already in use
- Default MySQL port is 3306
- If already in use, update port in `.env` file and database config

## Test Data (Optional)

After database initialization, you can add test data:

```sql
USE complaint_management;

-- Insert test user
INSERT INTO users (name, email, password, role, contact_info) VALUES
('John Doe', 'john@example.com', '$2a$10$salt...', 'user', '+1234567890');

-- Password note: The actual password stored is hashed using bcryptjs
-- For testing, use the demo account provided in the documentation
```

## Reset Database

To completely reset the database and start fresh:

```sql
DROP DATABASE IF EXISTS complaint_management;
-- Then re-run the initialization script
```

## Next Steps

1. ✅ Initialize database (this document)
2. 🔄 Restart backend server (it will reconnect to DB)
3. 🌐 Test login at: http://localhost:4200
4. 📝 Try creating a complaint
5. 📊 Check admin dashboard for statistics

---

**Database setup complete!** Your application is now fully functional. 🎊
