const { createPost, getPosts, deletePost } = require("../services/postsService");

async function createPostController(req, res) {
    try {
        const id = req.user.id;
        const content = req.body.content;

        await createPost(id, content);

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
        const posts = await getPosts();

        posts.forEach(post => {
            if (userId == post.user_id) {
                post.can = "Yes";
            }
        });

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

async function deletePostController(req, res) {
    try {
        const id = req.user.id;
        const postId = req.body.post_id;

        const deleted = await deletePost(id, postId);

        if (deleted === 0) {
            return res.status(404).json({ message: "POST_NOT_FOUND" });
        }

        return res.status(200).json({ message: "SUCCESSFUL_DELETE" });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createPostController,
    getPostsController,
    deletePostController
}