import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyUser = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        console.log('no token');
        return next(errorHandler( 401, 'Unauthorized'));
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log('jwt verify error');
            return next(errorHandler( 401, 'Unauthorized'));
        }
        req.user = user;
        next();
    });
}