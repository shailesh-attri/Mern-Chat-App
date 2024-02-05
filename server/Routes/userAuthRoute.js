import express from 'express';
import userAuthController from '../controllers/userAuthControllers.js'
const router = express.Router();
import JwtAuthMiddleware from '../middleware/jwt.auth.middleware.js';
import { JwtAuthMiddlewareForRegistration } from '../middleware/jwt.auth.middleware.js';
// Authentication routes
router.post('/register', userAuthController.register);
router.post('/login', userAuthController.login);
router.post('/email_verify', userAuthController.email_verify);
router.post('/verify_otp', JwtAuthMiddleware, userAuthController.verify_otp);
router.post('/registration_verify', JwtAuthMiddlewareForRegistration, userAuthController.registration_verify);
router.patch('/reset_password',JwtAuthMiddleware,userAuthController.reset_password);
router.post('/logout', userAuthController.logout);




export default router;
