import express from 'express';
import userAuthController from '../controllers/userAuthControllers.js'
const router = express.Router();

// Authentication routes
router.post('/register', userAuthController.register);
router.post('/login', userAuthController.login);
router.patch('/reset_password', userAuthController.reset_password);
router.post('/verify_otp', userAuthController.verify_otp);
router.post('/email_verify', userAuthController.email_verify);




export default router;
