import Comment from '../models/comment.model.js';
import { errorHandler } from '../utils/error.js';


export const createComment = async (req, res, next) => {
    try {
        const { postId, userId, comment } = req.body;
        if (userId !== req.user.id) {
            return next(errorHandler(403, 'You are not authorized to perform this action.'));
        }
        const newComment = new Comment({
            comment,
            postId,
            userId,
        });
        await newComment.save();
        res.status(200).json(newComment);
    } catch (error) {
        next(error);
    }
};

export const getPostComments = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const comments = await Comment.find({ postId }).sort({ createdAt: -1 });
        res.status(200).json(comments);
    } catch (error) {
        next(error);
    }
};

export const editComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return next(errorHandler(404, 'Comment not found.'));
        }
        if (comment.userId != req.user.id) {
            return next(errorHandler(403, 'You are not authorized to perform this action.'));
        }
        const editedComment = await Comment.findByIdAndUpdate(req.params.commentId, { comment: req.body.comment }, { new: true });
        res.status(200).json(editedComment);
    } catch (error) {
        next(error);
    }

};

export const deleteComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return next(errorHandler(404, 'Comment not found.'));
        }
        if (comment.userId.toString() !== req.user.id && req.user.type !== 'admin') {
            return next(errorHandler(403, 'You are not authorized to perform this action.'));
        }
        await Comment.findByIdAndDelete(req.params.commentId);
        res.status(200).json('Comment deleted successfully.');
    } catch (error) {
        next(error);
    }
};

export const likeComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return next(errorHandler(404, 'Comment not found.'));
        }
        const userIndex = comment.likes.indexOf(req.user.id);
        if (userIndex === -1) {
            comment.numberOfLikes += 1;
            comment.likes.push(req.user.id);
        } else {
            comment.numberOfLikes -= 1;
            comment.likes.splice(userIndex, 1);
        }
        await comment.save();
        res.status(200).json(comment);
    } catch (error) {
        next(error);
    }
};

export const getComments = async (req, res, next) => {
    try {
      const startIndex = req.query.startIndex || 0;
      const limit = req.query.limit || 9;
      const sortDirection = req.query.order === 'asc' ? 1 : -1;
      const comments = await Comment.find()
        .sort({ createdAt: sortDirection })
        .skip(parseInt(startIndex))
        .limit(parseInt(limit));
  
      const totalComments = await Comment.countDocuments();
  
      const now = new Date();
  
      const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      );
  
      const lastMonthComments = await Comment.countDocuments({
        createdAt: { $gte: oneMonthAgo },
      });
  
      res.status(200).json({ comments, totalComments, lastMonthComments });
    } catch (error) {
      return next(error);
    }
  };