// import express from 'express';
// import { createAdmin } from '../controllers/adminController.js';
// import { authenticate } from '../middlewares/authMiddleware.js';

// const router = express.Router();

// router.post('/create', authenticate, createAdmin);

// export default router;


import express from 'express';
import * as adminController from '../controllers/adminController.js';
import { authenticate, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authenticate, authorizeRoles('superadmin'), adminController.createAdmin);
router.get('/', authenticate, authorizeRoles('admin', 'superadmin'), adminController.getAllAdmins);
router.get('/:id', authenticate,authorizeRoles('admin', 'superadmin'), adminController.getAdminById);
router.put('/:id', authenticate,authorizeRoles('superadmin'), adminController.updateAdmin);
router.delete('/:id', authenticate, authorizeRoles('superadmin'), adminController.deleteAdmin);
router.post('/reset-password',authenticate, authorizeRoles('superadmin','admin'), adminController.resetPassword);
router.post('/change-password', authenticate, adminController.changePassword);

export default router;
