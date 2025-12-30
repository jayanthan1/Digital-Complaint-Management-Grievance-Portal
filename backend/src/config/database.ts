import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'jayanthan$2005',
  database: process.env.DB_NAME || 'complaint_management',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test the connection
pool.getConnection()
  .then((connection) => {
    console.log('✅ Database connection successful');
    connection.release();
  })
  .catch((error: any) => {
    console.error('❌ Database connection failed:', error.message);
    console.error('Host:', process.env.DB_HOST || 'localhost');
    console.error('User:', process.env.DB_USER || 'root');
    console.error('Database:', process.env.DB_NAME || 'complaint_management');
  });

export default pool;
