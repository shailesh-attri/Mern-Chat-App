import express from 'express';
import JwtAuthMiddleware from '../middleware/jwt.auth.middleware.js';
const router = express.Router();
import { MessageController } from '../controllers/MessageController.js';
import upload from '../utils/multer.js'; // Import multer middleware


// Ensure that multer middleware is applied to handle file uploads
router.post('/sendMessage', upload.single('image'), MessageController.sendMessage);

// router.post('/uploadImage', upload.single('image'), async (req, res) => {});

export default router;
