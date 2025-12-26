import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authMiddleware, roleMiddleware } from '../middleware/auth';

const router = Router();

// All user routes require authentication and admin role
router.use(authMiddleware);
router.use(roleMiddleware('admin'));

// Get all staff members
router.get('/staff', UserController.getStaffMembers);

// Get all users
router.get('/', UserController.getAllUsers);

export default router;
