import express from 'express';
import { verifyUser } from '../utils/verifyUser.js';
import { createPost, getPosts, updatePost, deletePost } from '../controllers/post.controller.js';

const router = express.Router();

router.post('/create', verifyUser, createPost);
router.get('/getPosts', getPosts);
router.put('/update/:postId', verifyUser, updatePost);
router.delete('/delete/:postId/:userId', verifyUser, deletePost);

export default router;