import express from 'express';
import userController from '../controllers/userControllers.js'
const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/:id', userController.userProfile);
router.post('/change-avatar', userController.changeAvatar);
router.patch('/reset_password', userController.reset_password);
router.post('/verify_otp', userController.verify_otp);
router.post('/edit-profile', userController.editProfile);
router.post('/email_verify', userController.email_verify);



export default router;
