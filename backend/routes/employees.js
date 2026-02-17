import express from 'express';
import { protect, adminOrManager } from '../middleware/roles.js';
import * as controller from '../controllers/employeeController.js';

const router = express.Router();

router.get('/', protect, adminOrManager, controller.getEmployees);
router.get('/:id', protect, adminOrManager, controller.getEmployee);
router.post('/', protect, adminOrManager, controller.createEmployee);
router.put('/:id', protect, adminOrManager, controller.updateEmployee);
router.delete('/:id', protect, adminOrManager, controller.deleteEmployee);

export default router;
