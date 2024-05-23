import express from 'express';
import { verifyUser } from '../utils/verifyUser.js';
import { createComment, updateComment, deleteComment } from '../controllers/comment.controller.js';

const router = express.Router();

router.post('/create', verifyUser, createComment);
router.put('/update/:commentId', verifyUser, updateComment);
router.delete('/delete/:commentId', verifyUser, deleteComment);

export default router;