import { Request, Response } from 'express';
import { UserModel } from '../models/User';
import { comparePassword, hashPassword, generateToken } from '../utils/auth';
import { AuthToken } from '../types';

/**
 * Extend Express Request to include user
 * (Required for getProfile)
 */
interface AuthRequest extends Request {
  user?: AuthToken;
}

export const AuthController = {
  /**
   * =====================
   * REGISTER
   * =====================
   */
  async register(req: Request, res: Response): Promise<Response> {
    try {
      const { name, email, password, role, contact_info } = req.body;

      // Basic validation
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Name, email, and password are required',
        });
      }

      // Check existing user
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Email already registered',
        });
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create user
      const user = await UserModel.create({
        name,
        email,
        password: hashedPassword,
        role: role || 'user',
        contact_info: contact_info || null,
      });

      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error: any) {
      console.error('Register Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Registration failed',
      });
    }
  },

  /**
   * =====================
   * LOGIN
   * =====================
   */
  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required',
        });
      }

      // Find user
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }

      // Compare password
      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }

      // Generate JWT
      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        },
      });
    } catch (error: any) {
      console.error('Login Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Login failed',
      });
    }
  },

  /**
   * =====================
   * GET PROFILE
   * =====================
   */
  async getProfile(req: AuthRequest, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
      }

      const user = await UserModel.findById(req.user.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Profile fetched successfully',
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          contact_info: user.contact_info,
          created_at: user.created_at,
        },
      });
    } catch (error: any) {
      console.error('Profile Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve profile',
      });
    }
  },
};
