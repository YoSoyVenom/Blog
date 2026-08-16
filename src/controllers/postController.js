const { findLike, deleteLike, createLike } = require("../services/likesService");
const { createPost, getPosts, deletePost } = require("../services/postsService");

async function createPostController(req, res) {
    try {
        const userId = req.user.id;
        const content = req.body.content;

        await createPost(userId, content);

        res.status(201).json({ message: "POST_CREATED" });
    } catch (error) {
        if (error.code == "23503") {
            return res.status(401).json({ message: "INVALID_CREDENTIALS" });
        }
        return res.status(500).json({ message: error.message });
    }
}

async function getPostsController(req, res) {
    try {
        const userId = req.user.id;
        const posts = await getPosts(userId);

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

async function deletePostController(req, res) {
    try {
        const userId = req.user.id;
        const postId = req.body.post_id;

        const deleted = await deletePost(userId, postId);

        if (deleted === 0) {
            return res.status(404).json({ message: "POST_NOT_FOUND" });
        }

        return res.status(200).json({ message: "SUCCESSFUL_DELETE" });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function toggleLikeController(req, res) {
    try {

        const userId = req.user.id;
        const postId = Number(req.params.post_id);

        const isLiked = await findLike(userId, postId);

        if (!isLiked) {
            await createLike(userId, postId);
            return res.status(200).json({ message: "LIKE_CREATED", liked: true });
        }

        await deleteLike(userId, postId);

        return res.status(200).json({ message: "LIKE_DELETED", liked: false});

    } catch (error) {

        if (error.code == "23503") {
            return res.status(404).json({ message: "POST_NOT_FOUND" });
        }

        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createPostController,
    getPostsController,
    deletePostController,
    toggleLikeController
}