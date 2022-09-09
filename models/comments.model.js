const db = require("../db/connection");

exports.removeCommentById = (commentId) => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *", [
      commentId,
    ])
    .then((queryData) => {
      if (queryData.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "does not exist" });
      }
    });
};
