import express from 'express';
import JwtAuthMiddleware from '../middleware/jwt.auth.middleware.js';
import userAuthController from '../controllers/userAuthControllers.js';
import { JwtAuthMiddlewareForRegistration } from '../middleware/jwt.auth.middleware.js';

const router = express.Router();

// POST routes
router.post('/register', userAuthController.register);
router.post('/login', userAuthController.login);
router.post('/email_verify', userAuthController.email_verify);
router.post('/verify_otp', JwtAuthMiddleware, userAuthController.verify_otp);
router.post('/registration_verify', JwtAuthMiddlewareForRegistration, userAuthController.registration_verify);


// PATCH route
router.patch('/reset_password', JwtAuthMiddleware, userAuthController.reset_password);

export default router;
