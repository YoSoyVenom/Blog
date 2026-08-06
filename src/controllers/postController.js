const { createPost } = require("../services/postsService");

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

module.exports = {
    createPostController
}