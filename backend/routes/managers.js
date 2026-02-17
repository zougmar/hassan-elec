import express from 'express';
import { protect, adminOnly, adminOrManager } from '../middleware/roles.js';
import * as controller from '../controllers/managerController.js';

const router = express.Router();

// Managers need GET access for employee assignment dropdown
router.get('/', protect, adminOrManager, controller.getManagers);
router.get('/:id', protect, adminOrManager, controller.getManager);
router.post('/', protect, adminOnly, controller.createManager);
router.put('/:id', protect, adminOnly, controller.updateManager);
router.delete('/:id', protect, adminOnly, controller.deleteManager);

export default router;
