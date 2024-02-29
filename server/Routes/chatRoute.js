import express from 'express';
const router = express.Router();
import { ChatController } from '../controllers/ChatController.js';

router.post('/accessChat', ChatController.accessChat)
router.get('/:userID', ChatController.fetchChat)
router.post('/blockedUsers', ChatController.BlockedUsers)
router.post('/UnBlockedUsers', ChatController.UnBlockedUsers)
router.get('/AllBlocked/:userId', ChatController.AllBlocked)

export default router