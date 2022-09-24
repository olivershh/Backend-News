const {
  removeCommentById,
  updateComment,
} = require("../models/comments.model");

exports.deleteCommentById = async (req, res, next) => {
  const { comment_id } = req.params;

  try {
    await removeCommentById(comment_id);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

exports.patchComment = async (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;

  try {
    const comment = await updateComment(comment_id, inc_votes);
    res.status(200).send({ comment: comment });
  } catch (err) {
    next(err);
  }
};
