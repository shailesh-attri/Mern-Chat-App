import express from 'express';
import upload from '../utils/multer.js';
import { MessageController } from '../controllers/MessageController.js';

const router = express.Router();


router.post('/sendMessage', upload.single('image'), MessageController.sendMessage);

export default router;
