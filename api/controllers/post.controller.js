import { errorHandler } from "../utils/error"

export const create = (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, 'You are not allowed to create a post'))
    }
    if (!req.body.title || !req.body.content) {
        return next(errorHandler(400, "Please provide all required fields"))
    }
    const slug = req.body.title.split(" ").join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, "")
    const newPost = new Post({
        ...req.body,
        slug,
        userId: req.user.id,
    });

    newPost.save()
        .then(post => res.status(201).json(post))
        .catch(err => next(errorHandler(500, err.message)));
};