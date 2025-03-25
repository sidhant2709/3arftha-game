import express from 'express';
import * as userController from '../controllers/userController.js';
import { authenticate, authorizeRoles } from '../middlewares/authMiddleware.js';
// import upload from '../utils/multerConfig.js';
import { uploadUserProfile } from "../config/cloudinaryConfig.js";
const router = express.Router();

router.post('/register',uploadUserProfile.single('profilePicture'), userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/:id', authenticate, userController.getUserById);
router.put('/:id', authenticate,uploadUserProfile.single("profilePicture"), userController.updateUser);
router.delete('/:id', authenticate, userController.deleteUser);
router.post('/reset-password', authenticate,userController.resetPassword);
router.post('/block/:id', authenticate,authorizeRoles('admin', 'superadmin'), userController.blockUser);
router.post('/unblock/:id', authenticate,authorizeRoles('admin', 'superadmin'), userController.unblockUser);

export default router;
