const {
  removeCommentById,
  updateComment,
} = require("../models/comments.model");

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentById(comment_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};

exports.patchComment = (req, res, next) => {
  const { comment_id } = req.params;
  const votes = req.body.inc_votes;

  updateComment(comment_id, votes)
    .then((comment) => {
      res.status(200).send({ comment: comment });
    })
    .catch(next);
};
