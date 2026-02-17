import express from 'express';
import { protect, adminOnly } from '../middleware/roles.js';
import * as controller from '../controllers/organizationController.js';

const router = express.Router();

router.get('/', protect, controller.getOrganizations);
router.get('/:id', protect, controller.getOrganization);
router.post('/', protect, adminOnly, controller.createOrganization);
router.put('/:id', protect, adminOnly, controller.updateOrganization);

export default router;
