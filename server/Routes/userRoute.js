import express from 'express';
const router = express.Router()
import {UserController} from '../controllers/userController.js'
import JwtAuthMiddleware from '../middleware/jwt.auth.middleware.js'
import upload from '../utils/multer.js'

// User Route ---------------------

// Get requests
router.post('/getAllUsers', UserController.getAllUsers)
router.get('/getSelectedProfile', UserController.getProfile)
router.get('/:id', UserController.getUser)

// Put requests
router.put('/edit_profile',JwtAuthMiddleware, UserController.editProfile);
router.post('/findUser', UserController.findUser);

// Patch requests
router.patch('/:userId', upload.single('dpImage'), UserController.changeAvatar);
router.post('/update_password', JwtAuthMiddleware, UserController.UpdatePassword);


export default router;