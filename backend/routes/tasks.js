import express from 'express';
import { protect, adminOrManager, employeeOnly } from '../middleware/roles.js';
import * as controller from '../controllers/taskController.js';

const router = express.Router();

router.get('/', protect, controller.getTasks);
router.get('/:id', protect, controller.getTask);
router.post('/', protect, adminOrManager, controller.createTask);
router.put('/:id', protect, controller.updateTask);
router.delete('/:id', protect, adminOrManager, controller.deleteTask);

export default router;
