import express from 'express';
import userController from '../controllers/userControllers.js'
const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/:id', userController.userProfile);
router.post('/change-avatar', userController.changeAvatar);
router.post('/edit-profile', userController.editProfile);



export default router;
