import { Router, Request, Response } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/register', (req: Request, res: Response) => {
  AuthController.register(req, res);
});

router.post('/login', (req: Request, res: Response) => {
  AuthController.login(req, res);
});

// Protected routes
router.get('/profile', authMiddleware, (req: Request, res: Response) => {
  AuthController.getProfile(req, res);
});

export default router;

