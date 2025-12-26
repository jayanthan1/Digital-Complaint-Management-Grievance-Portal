import { Request, Response } from 'express';
import { UserModel } from '../models/User';

export const UserController = {
  async getStaffMembers(req: Request, res: Response) {
    try {
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Only admins can view staff members',
        });
      }

      const staffMembers = await UserModel.findByRole('staff');

      res.json({
        success: true,
        message: 'Staff members retrieved successfully',
        data: staffMembers.map((staff) => ({
          id: staff.id,
          name: staff.name,
          email: staff.email,
          contact_info: staff.contact_info,
        })),
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve staff members',
      });
    }
  },

  async getAllUsers(req: Request, res: Response) {
    try {
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Only admins can view all users',
        });
      }

      const users = await UserModel.getAll();

      res.json({
        success: true,
        message: 'Users retrieved successfully',
        data: users.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          contact_info: user.contact_info,
        })),
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve users',
      });
    }
  },
};
