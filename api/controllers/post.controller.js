import { errorHandler } from '../utils/error.js';
import Post from '../models/post.model.js';
import cloudinary from '../utils/cloudinaryConfig.js';

// CREATE POST
export const create = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, 'You are not allowed to create a post'));
    }

    const { title, content, image, category } = req.body;

    if (!title || !content || !image) {
        return next(errorHandler(400, 'Title, content, and image URL are required'));
    }

    if (!image.startsWith('https://res.cloudinary.com/')) {
        return next(errorHandler(400, 'Invalid image URL format'));
    }

    try {
        const slug = title
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');

        const newPost = new Post({
            title,
            content,
            image,
            slug,
            userId: req.user.id,
            category: category || 'uncategorized'
        });

        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        next(errorHandler(500, error.message));
    }
};

// GET POSTS
export const getPosts = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === 'asc' ? 1 : -1;

        const query = {
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.category && { category: req.query.category }),
            ...(req.query.slug && { slug: req.query.slug }),
            ...(req.query.postId && { _id: req.query.postId }),
            ...(req.query.searchTerm && {
                $or: [
                    { title: { $regex: req.query.searchTerm, $options: 'i' } },
                    { content: { $regex: req.query.searchTerm, $options: 'i' } }
                ]
            })
        };

        const totalPosts = await Post.countDocuments(query);
        const totalPages = Math.ceil(totalPosts / limit);
        const skip = (page - 1) * limit;

        const posts = await Post.find(query)
            .sort({ updatedAt: sortDirection })
            .skip(skip)
            .limit(limit)
            .populate('userId', 'username profilePicture')
            .lean();

        const formattedPosts = posts.map(post => ({
            ...post,
            author: post.userId?.username || 'Eco Author',
            authorProfile: post.userId?.profilePicture || null
        }));

        const lastMonthPosts = await Post.countDocuments({
            ...query,
            createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        });

        res.status(200).json({
            posts: formattedPosts || [],
            totalPosts: totalPosts || 0,
            totalPages: totalPages || 0,
            currentPage: page,
            lastMonthPosts: lastMonthPosts || 0
        });
    } catch (error) {
        console.error("Backend error in getPosts:", error);
        res.status(500).json({
            error: 'Failed to fetch posts',
            message: error.message,
            success: false
        });
    }
};

// GET TRENDING POSTS
export const getTrendingPosts = async (req, res, next) => {
    try {
        const trendingPosts = await Post.find({
            createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        })
            .sort({ views: -1 })
            .limit(5)
            .populate('userId', 'username')
            .select('title image slug views createdAt')
            .lean();

        const formattedPosts = trendingPosts.map(post => ({
            ...post,
            author: post.userId?.username || 'Eco Author'
        }));

        res.status(200).json({ posts: formattedPosts });
    } catch (error) {
        next(errorHandler(500, 'Failed to fetch trending posts'));
    }
};

// DELETE POST
export const deletePost = async (req, res, next) => {
    if (!req.user.isAdmin && req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'Unauthorized to delete this post'));
    }

    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return next(errorHandler(404, 'Post not found'));
        }

        // Optional: Delete image from Cloudinary if applicable
        // await cloudinary.uploader.destroy(post.imagePublicId);

        await Post.findByIdAndDelete(req.params.postId);
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        next(errorHandler(500, 'Failed to delete post'));
    }
};

// UPDATE POST
export const updatePost = async (req, res, next) => {
    if (!req.user.isAdmin && req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'Unauthorized to update this post'));
    }

    try {
        const updateData = {
            ...req.body,
            ...(req.body.title && {
                slug: req.body.title
                    .trim()
                    .toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^a-z0-9-]/g, '')
            })
        };

        const updatedPost = await Post.findByIdAndUpdate(
            req.params.postId,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedPost) {
            return next(errorHandler(404, 'Post not found'));
        }

        res.status(200).json(updatedPost);
    } catch (error) {
        next(errorHandler(500, 'Failed to update post'));
    }
};

