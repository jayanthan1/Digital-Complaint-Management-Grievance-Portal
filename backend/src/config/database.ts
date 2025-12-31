import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST as string,
  user: process.env.MYSQL_USER as string,
  password: process.env.MYSQL_PASSWORD as string,
  database: process.env.MYSQL_DATABASE as string,
  port: Number(process.env.MYSQL_PORT),
  ssl: {
    rejectUnauthorized: false,
  },
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
    console.error('Host:', process.env.MYSQL_HOST);
    console.error('User:', process.env.MYSQL_USER);
    console.error('Database:', process.env.MYSQL_DATABASE);
  });

export default pool;
