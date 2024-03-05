import express from 'express';
import { ChatController } from '../controllers/ChatController.js';

const router = express.Router();

// POST routes
router.post('/accessChat', ChatController.accessChat);
router.post('/blockedUsers', ChatController.BlockedUsers);
router.post('/UnBlockedUsers', ChatController.UnBlockedUsers);

// GET routes
router.get('/:userID', ChatController.fetchChat);
router.get('/AllBlocked/:userId', ChatController.AllBlocked);


export default router;
