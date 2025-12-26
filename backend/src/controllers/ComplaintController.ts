import { Request, Response } from 'express';
import { ComplaintModel } from '../models/Complaint';
import { UserModel } from '../models/User';

export const ComplaintController = {
  async create(req: Request, res: Response) {
    try {
      console.log('Create complaint request received');
      console.log('User:', req.user);
      console.log('Request body:', req.body);
      
      if (!req.user) {
        console.error('No user in request');
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const { title, description, category } = req.body;

      // Validate required fields
      if (!title || !description || !category) {
        console.error('Missing required fields', { title, description, category });
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: title, description, category',
        });
      }

      console.log('Creating complaint for user:', req.user.id);
      const complaint = await ComplaintModel.create({
        user_id: req.user.id,
        title,
        description,
        category,
        status: 'open',
        staff_id: null,
        attachments: null,
      });

      if (!complaint) {
        console.error('Failed to create complaint in database');
        return res.status(500).json({
          success: false,
          message: 'Failed to create complaint in database',
        });
      }

      console.log('Complaint created successfully:', complaint);
      res.status(201).json({
        success: true,
        message: 'Complaint registered successfully',
        data: complaint,
      });
    } catch (error: any) {
      console.error('Complaint creation error:', error);
      console.error('Error stack:', error.stack);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to create complaint',
      });
    }
  },

  async getMyComplaints(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const complaints = await ComplaintModel.findByUserId(req.user.id);

      res.json({
        success: true,
        message: 'Complaints retrieved successfully',
        data: complaints,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve complaints',
      });
    }
  },

  async getStaffComplaints(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const complaints = await ComplaintModel.findByStaffId(req.user.id);

      res.json({
        success: true,
        message: 'Assigned complaints retrieved successfully',
        data: complaints,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve complaints',
      });
    }
  },

  async getUnassignedComplaints(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const complaints = await ComplaintModel.findUnassignedComplaints();

      res.json({
        success: true,
        message: 'Unassigned complaints retrieved successfully',
        data: complaints,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve complaints',
      });
    }
  },

  async getComplaintById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const complaint = await ComplaintModel.findById(parseInt(id));
      if (!complaint) {
        return res.status(404).json({
          success: false,
          message: 'Complaint not found',
        });
      }

      res.json({
        success: true,
        message: 'Complaint retrieved successfully',
        data: complaint,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve complaint',
      });
    }
  },

  async updateStatus(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const { id } = req.params;
      const { status } = req.body;

      // Validate status
      const validStatuses = ['open', 'assigned', 'in-progress', 'resolved'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status',
        });
      }

      const complaint = await ComplaintModel.updateStatus(parseInt(id), status);
      if (!complaint) {
        return res.status(404).json({
          success: false,
          message: 'Complaint not found',
        });
      }

      res.json({
        success: true,
        message: 'Complaint status updated successfully',
        data: complaint,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to update complaint',
      });
    }
  },

  async assignToStaff(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const { id } = req.params;
      const { staff_id } = req.body;

      // Admin can assign to any staff, staff can assign to themselves
      if (req.user.role === 'admin') {
        // Verify staff exists and has staff role
        const staff = await UserModel.findById(staff_id);
        if (!staff || (staff.role !== 'staff' && staff.role !== 'admin')) {
          return res.status(400).json({
            success: false,
            message: 'Invalid staff ID',
          });
        }
      } else if (req.user.role === 'staff') {
        // Staff can only assign to themselves
        if (staff_id !== req.user.id) {
          return res.status(403).json({
            success: false,
            message: 'Staff can only assign complaints to themselves',
          });
        }
      } else {
        return res.status(403).json({
          success: false,
          message: 'Only staff and admins can assign complaints',
        });
      }

      const complaint = await ComplaintModel.assignToStaff(parseInt(id), staff_id);
      if (!complaint) {
        return res.status(404).json({
          success: false,
          message: 'Complaint not found',
        });
      }

      res.json({
        success: true,
        message: 'Complaint assigned successfully',
        data: complaint,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to assign complaint',
      });
    }
  },

  async getAllComplaints(req: Request, res: Response) {
    try {
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Only admins can view all complaints',
        });
      }

      const complaints = await ComplaintModel.getAll();

      res.json({
        success: true,
        message: 'All complaints retrieved successfully',
        data: complaints,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve complaints',
      });
    }
  },

  async getStatistics(req: Request, res: Response) {
    try {
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Only admins can view statistics',
        });
      }

      const stats = await ComplaintModel.getStatistics();
      const categoryStats = await ComplaintModel.getCategoryStats();

      res.json({
        success: true,
        message: 'Statistics retrieved successfully',
        data: {
          overall: stats[0],
          byCategory: categoryStats,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve statistics',
      });
    }
  },
};
