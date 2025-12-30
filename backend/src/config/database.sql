-- Create Database
CREATE DATABASE IF NOT EXISTS complaint_management;
USE complaint_management;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'staff', 'admin') DEFAULT 'user',
  contact_info VARCHAR(255),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Complaints Table
CREATE TABLE IF NOT EXISTS complaints (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  staff_id INT,
  title VARCHAR(255) NOT NULL,
  description LONGTEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  status ENUM('open', 'assigned', 'in-progress', 'resolved') DEFAULT 'open',
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  attachments VARCHAR(500),
  resolution_notes LONGTEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (staff_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create indices for performance
CREATE INDEX idx_user_id ON complaints(user_id);
CREATE INDEX idx_staff_id ON complaints(staff_id);
CREATE INDEX idx_status ON complaints(status);
CREATE INDEX idx_category ON complaints(category);
CREATE INDEX idx_created_at ON complaints(created_at);CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_user_role ON users(role);
CREATE INDEX idx_complaint_status_created ON complaints(status, created_at);