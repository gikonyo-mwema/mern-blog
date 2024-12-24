import Comment from '../models/comment.model';

export const createComment = async (req, res, next) => {
    try {
        const { content, postId, userId} = req.body;

        if (userId !== req.user.Id) {
            return next(errorHandler(403, 'You are not authorized to perform this action'));
        }

        const newComment = new Comment({
            content,
            postId,
            userId,
        });
        await newComment.save();

    } catch (error) {
        next(error);
    }
};


    