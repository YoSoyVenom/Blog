const { findCommentLike, createCommentLike, deleteCommentLike } = require("../services/commentLikeService");
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

async function toggleCommentLikeController(req, res) {
    try {

        const userId = req.user.id;
        const commentId = Number(req.params.comment_id);

        const isLiked = await findCommentLike(userId, commentId);

        if (!isLiked) {
            await createCommentLike(userId, commentId);
            return res.status(200).json({ message: "LIKE_CREATED", liked: true });
        }

        await deleteCommentLike(userId, commentId);

        return res.status(200).json({ message: "LIKE_DELETED", liked: false});

    } catch (error) {

        console.error(error)

        if (error.code == "23503") {
            return res.status(404).json({ message: "COMMENT_NOT_FOUND" });
        }

        return res.status(500).json({ message: error.message });
    }
}


module.exports = {
    getCommentsController,
    toggleCommentLikeController
}