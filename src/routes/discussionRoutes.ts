import express from 'express';
import multer from 'multer';
import { createDiscussion, updateDiscussion, deleteDiscussion, getDiscussionsByTags, getDiscussionsByText } from '../controllers/discussionController';
import authMiddleware from '../middleware/auth';

const router = express.Router();
const upload = multer();

router.post('/', authMiddleware, upload.single('image'), createDiscussion);
router.put('/:discussionId', authMiddleware, upload.single('image'), updateDiscussion);
router.delete('/:discussionId', authMiddleware, deleteDiscussion);
router.get('/tags', authMiddleware, getDiscussionsByTags);
router.get('/text', authMiddleware, getDiscussionsByText);

export default router;
