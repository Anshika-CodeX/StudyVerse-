import { Router } from 'express';
import { streamChat, getChatHistory, getMessages, createNewChat, deleteChat, renameChat } from '../controllers/chat.controller';
// import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

// In a real scenario, these would be protected by requireAuth middleware
// router.use(requireAuth);

router.post('/stream', streamChat);
router.get('/history', getChatHistory);
router.get('/:id/messages', getMessages);
router.post('/new', createNewChat);
router.delete('/:id', deleteChat);
router.put('/:id', renameChat);

export default router;
