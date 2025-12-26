import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import complaintRoutes from './routes/complaints';
import userRoutes from './routes/users';
import { errorMiddleware } from './middleware/error';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next) => {
  if (req.path.includes('/api/')) {
    console.log(`[${req.method}] ${req.path}`);
    const authHeader = req.headers.authorization;
    console.log(`[Headers] Authorization: ${authHeader ? 'PRESENT' : 'MISSING'}`);
    if (authHeader) {
      console.log(`[Auth] Format: ${authHeader.substring(0, 20)}...`);
    }
  }
  next();
});

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'Server is running' });
});

// DEBUG: Log all requests with headers
app.use((req: Request, res: Response, next: Function) => {
  const authHeader = req.headers.authorization;
  console.log(`[${req.method}] ${req.path}`);
  console.log('[Headers]', authHeader ? 'Authorization: PRESENT' : 'Authorization: MISSING');
  if (authHeader) {
    const tokenPreview = authHeader.substring(0, 50);
    console.log('[Auth] Format:', tokenPreview + '...');
  }
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/users', userRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handling middleware (must be last)
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
