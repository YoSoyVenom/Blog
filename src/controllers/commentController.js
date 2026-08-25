const { getComments } = require("../services/commentService");

async function getCommentsController(req, res) {
    try {
        const userId = req.user.id;
        const postId = req.params.post_id;

        const comments = await getComments(userId, postId);

        return res.status(200).json( comments );
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getCommentsController
}