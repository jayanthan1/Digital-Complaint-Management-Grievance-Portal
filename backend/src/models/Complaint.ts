import pool from '../config/database';
import { Complaint, ComplaintStatus } from '../types';

export const ComplaintModel = {
  async create(complaint: Omit<Complaint, 'id' | 'created_at' | 'updated_at'>): Promise<Complaint> {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query(
        'INSERT INTO complaints (user_id, title, description, category, status) VALUES (?, ?, ?, ?, ?)',
        [
          complaint.user_id,
          complaint.title,
          complaint.description,
          complaint.category,
          complaint.status || 'open',
        ]
      );
      
      const insertId = (result as any).insertId;
      return this.findById(insertId) as Promise<Complaint>;
    } finally {
      connection.release();
    }
  },

  async findById(id: number): Promise<Complaint | null> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM complaints WHERE id = ?', [id]);
      return (rows as Complaint[])[0] || null;
    } finally {
      connection.release();
    }
  },

  async findByUserId(userId: number): Promise<Complaint[]> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        'SELECT * FROM complaints WHERE user_id = ? ORDER BY created_at DESC',
        [userId]
      );
      return rows as Complaint[];
    } finally {
      connection.release();
    }
  },

  async findByStaffId(staffId: number): Promise<Complaint[]> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        'SELECT * FROM complaints WHERE staff_id = ? ORDER BY created_at DESC',
        [staffId]
      );
      return rows as Complaint[];
    } finally {
      connection.release();
    }
  },

  async findUnassignedComplaints(): Promise<Complaint[]> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query(
        'SELECT * FROM complaints WHERE staff_id IS NULL ORDER BY created_at DESC'
      );
      return rows as Complaint[];
    } finally {
      connection.release();
    }
  },

  async getAll(): Promise<Complaint[]> {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM complaints ORDER BY created_at DESC');
      return rows as Complaint[];
    } finally {
      connection.release();
    }
  },

  async update(
    id: number,
    updates: Partial<Complaint>
  ): Promise<Complaint | null> {
    const connection = await pool.getConnection();
    try {
      const fields = Object.keys(updates)
        .map((key) => `${key} = ?`)
        .join(', ');
      const values = Object.values(updates);

      await connection.query(`UPDATE complaints SET ${fields} WHERE id = ?`, [...values, id]);
      return this.findById(id);
    } finally {
      connection.release();
    }
  },

  async assignToStaff(complaintId: number, staffId: number): Promise<Complaint | null> {
    return this.update(complaintId, {
      staff_id: staffId,
      status: 'assigned' as ComplaintStatus,
    });
  },

  async updateStatus(
    complaintId: number,
    status: ComplaintStatus
  ): Promise<Complaint | null> {
    return this.update(complaintId, { status });
  },

  async getStatistics() {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) as open_count,
          SUM(CASE WHEN status = 'assigned' THEN 1 ELSE 0 END) as assigned_count,
          SUM(CASE WHEN status = 'in-progress' THEN 1 ELSE 0 END) as in_progress_count,
          SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved_count
        FROM complaints
      `);
      return result as any;
    } finally {
      connection.release();
    }
  },

  async getCategoryStats() {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query(`
        SELECT category, COUNT(*) as count
        FROM complaints
        GROUP BY category
      `);
      return result as any;
    } finally {
      connection.release();
    }
  },
};
