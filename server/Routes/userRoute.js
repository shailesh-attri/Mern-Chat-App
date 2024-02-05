import express from 'express';
const router = express.Router()
import {UserController} from '../controllers/userController.js'
import JwtAuthMiddleware from '../middleware/jwt.auth.middleware.js'


// User Route ---------------------

// Get requests
router.get('/getAllUsers', UserController.getAllUsers)
router.get('/getProfile',JwtAuthMiddleware, UserController.getProfile)

// Put requests
router.put('/edit_profile', UserController.editProfile);
router.post('/findUser', UserController.findUser);

// Patch requests
router.patch('/change_avatar', UserController.changeAvatar);

// Delete requests
router.delete('/delete_profile', UserController.deleteProfile)
router.get('/:id', UserController.getUser)
router.put('/:id/unFollow', UserController.unFollowUser);
export default router;