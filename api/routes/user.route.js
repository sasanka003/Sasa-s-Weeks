import express from 'express';
import { test, getUsers, updateUser, deleteUser, signout, getUser } from '../controllers/user.controller.js';
import { verifyUser } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/test', test);
router.get('/getusers', verifyUser, getUsers);
router.put('/update/:userId', verifyUser, updateUser);
router.delete('/delete/:userId', verifyUser, deleteUser);
router.post('/signout', signout);
router.get('/:userId', getUser);

export default router;