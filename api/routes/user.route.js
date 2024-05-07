import express from 'express';

const router = express.Router();

router.get('/test', (req, res) => {
    res.json({ message: 'API test successful!' });
});

export default router;