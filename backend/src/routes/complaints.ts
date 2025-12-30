import { Router } from 'express';
import { ComplaintController } from '../controllers/ComplaintController';
import { validateComplaint, validateComplaintUpdate, handleValidationErrors } from '../utils/validation';
import { authMiddleware, roleMiddleware } from '../middleware/auth';

const router = Router();

// All complaint routes require authentication
router.use(authMiddleware);

// Create complaint (Users can create)
router.post('/', validateComplaint, handleValidationErrors, ComplaintController.create);

// Get user's complaints
router.get('/my-complaints', ComplaintController.getMyComplaints);

// Get complaints assigned to staff
router.get('/staff-assigned', ComplaintController.getStaffComplaints);

// Get statistics (Admin only) - must be before /:id route
router.get('/statistics/overview', roleMiddleware('admin'), ComplaintController.getStatistics);

// Get unassigned complaints (available for staff to pick up) - must be before /:id route
router.get('/unassigned/available', ComplaintController.getUnassignedComplaints);

// Get all complaints (Admin only) - must be before /:id route
router.get('/', roleMiddleware('admin'), ComplaintController.getAllComplaints);

// Get complaint by ID
router.get('/:id', ComplaintController.getComplaintById);

// Update complaint status (Staff/Admin)
router.put('/:id/status', validateComplaintUpdate, handleValidationErrors, ComplaintController.updateStatus);

// Assign complaint to staff (Admin only)
router.put('/:id/assign', roleMiddleware('admin'), ComplaintController.assignToStaff);

export default router;
