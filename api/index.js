import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.log(error);
    });

const app = express();
app.use(express.json());
const port = 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    });

// app.get('/test', (req, res) => {
//     res.json({message: 'API is working!'});
// });

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const Message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        Message
    });
});
