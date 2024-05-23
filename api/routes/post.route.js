import express from 'express';
import { verifyUser } from '../utils/verifyUser.js';
import { createPost, updatePost, deletePost } from '../controllers/post.controller.js';

const router = express.Router();

router.post('/create', verifyUser, createPost);
router.put('/update/:postId', verifyUser, updatePost);
router.delete('/delete/:postId', verifyUser, deletePost);

export default router;