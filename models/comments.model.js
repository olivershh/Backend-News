const db = require("../db/connection");

exports.removeCommentById = async (comment_id) => {
  const queryData = await db.query(
    "DELETE FROM comments WHERE comment_id = $1 RETURNING *",
    [comment_id]
  );

  if (queryData.rowCount === 0) {
    return Promise.reject({ status: 404, msg: "does not exist" });
  }
};

exports.updateComment = async (comment_id, votes) => {
  const queryData = await db.query(
    "UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *",
    [votes, comment_id]
  );

  const comment = queryData.rows[0];

  if (!comment)
    return Promise.reject({ status: 404, msg: "comment not found" });

  return comment;
};
