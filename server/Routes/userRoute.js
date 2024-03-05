import express from 'express';
import upload from '../utils/multer.js';
import { UserController } from '../controllers/userController.js';
import JwtAuthMiddleware from '../middleware/jwt.auth.middleware.js';

const router = express.Router();

// GET requests
router.get('/getAllUsers', UserController.getAllUsers);
router.get('/getSelectedProfile/:id', UserController.getProfile);
router.get('/:id', UserController.getUser);

// PUT requests
router.put('/edit_profile', JwtAuthMiddleware, UserController.editProfile);
router.put('/findUser', UserController.findUser);

// PATCH requests
router.patch('/:userId', upload.single('dpImage'), UserController.changeAvatar);
router.patch('/update_password', JwtAuthMiddleware, UserController.UpdatePassword);

// DELETE requests
router.delete('/deleteAvatar', JwtAuthMiddleware, UserController.deleteAvatar);

export default router;
