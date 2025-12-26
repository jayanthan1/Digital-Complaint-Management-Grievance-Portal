import pool from '../config/database';
import { User } from '../types';

export const UserModel = {
  async findByEmail(email: string): Promise<User | null> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      return (rows as User[])[0] || null;
    } finally {
      connection.release();
    }
  },

  async findById(id: number): Promise<User | null> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );
      return (rows as User[])[0] || null;
    } finally {
      connection.release();
    }
  },

  async create(user: Omit<User, 'id' | 'created_at'>): Promise<User> {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query(
        `INSERT INTO users (name, email, password, role, contact_info)
         VALUES (?, ?, ?, ?, ?)`,
        [
          user.name,
          user.email,
          user.password,        // ✅ already hashed
          user.role,
          user.contact_info || null,
        ]
      );

      const insertId = (result as any).insertId;
      return this.findById(insertId) as Promise<User>;
    } finally {
      connection.release();
    }
  },

  async findByRole(role: string): Promise<User[]> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        'SELECT * FROM users WHERE role = ?',
        [role]
      );
      return rows as User[];
    } finally {
      connection.release();
    }
  },

  async getAll(): Promise<User[]> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        `SELECT id, name, email, role, contact_info, created_at
         FROM users`
      );
      return rows as User[];
    } finally {
      connection.release();
    }
  },
};
