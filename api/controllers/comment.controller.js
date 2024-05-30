import Comment from '../models/comment.model.js';

export const createComment = async (req, res, next) => {
    try{
        const { postId, userId, comment } = req.body;
        if(userId !== req.user.id) {
            return next(errorHandler(403, 'You are not authorized to perform this action.'));
        }
        const newComment = new Comment({
            comment,
            postId,
            userId, 
        });
        await newComment.save();
        res.status(200).json(newComment);
    } catch(error) {
        next(error);
    }
};

export const updateComment = async (req, res, next) => {
        
};

export const deleteComment = async (req, res, next) => {
    
};