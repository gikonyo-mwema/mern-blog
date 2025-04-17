import { errorHandler } from '../utils/error.js';
import Post from '../models/post.model.js';
import cloudinary from '../utils/cloudinaryConfig.js';

// Create a new post with image upload
export const create = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, 'You are not allowed to create a post'));
    }

    const { title, content } = req.body;
    if (!title || !content) {
        return next(errorHandler(400, "Please provide all required fields"));
    }

    try {
        let imageUrl = '';
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'post_images',
            });
            imageUrl = result.secure_url;
        }

        const slug = title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');
        const newPost = new Post({
            ...req.body,
            slug,
            userId: req.user.id,
            image: imageUrl,
        });

        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        next(errorHandler(500, error.message));
    }
};

export const getPosts = async (req, res) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === 'asc' ? 1 : -1;

        const posts = await Post.find({
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.category && { category: req.query.category }),
            ...(req.query.slug && { slug: req.query.slug }),
            ...(req.query.postId && { postId: req.query.postId }),
            ...(req.query.searchTerm && {
                $or: [
                    { title: { $regex: req.query.searchTerm, $options: 'i' } },
                    { content: { $regex: req.query.searchTerm, $options: 'i' } },
                ],
            }),
        })
            .sort({ updatedAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        const totalPosts = await Post.countDocuments();

        const now = new Date();
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

        const lastMonthPosts = await Post.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });

        res.status(200).json({
            posts,
            totalPosts,
            lastMonthPosts,
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getTrendingPosts = async (req, res) => {
    try {
        // Get posts with most views in the last 7 days
        const trendingPosts = await Post.find({
            createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        })
            .sort({ views: -1 })
            .limit(5);

        res.status(200).json({ posts: trendingPosts });
    } catch (error) {
        console.error('Error fetching trending posts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const deletePost = async (req, res, next) => {
    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'You are not allowed to delete this post'));
    }
    try {
        await Post.findByIdAndDelete(req.params.postId);
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// Update an existing post with image upload
export const updatePost = async (req, res, next) => {
    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'You are not allowed to update this post'));
    }

    try {
        let updateData = { ...req.body };

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'post_images',
            });
            updateData.image = result.secure_url;
        }

        const updatedPost = await Post.findByIdAndUpdate(
            req.params.postId,
            { $set: updateData },
            { new: true }
        );

        res.status(200).json(updatedPost);
    } catch (error) {
        next(error);
    }
};