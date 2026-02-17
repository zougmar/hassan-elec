import express from 'express';
import { protect, adminOnly } from '../middleware/roles.js';
import * as controller from '../controllers/departmentController.js';

const router = express.Router();

router.get('/', protect, controller.getDepartments);
router.get('/:id', protect, controller.getDepartment);
router.post('/', protect, adminOnly, controller.createDepartment);
router.put('/:id', protect, adminOnly, controller.updateDepartment);
router.delete('/:id', protect, adminOnly, controller.deleteDepartment);

export default router;
