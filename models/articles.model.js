const db = require("../db/connection");

exports.selectArticleById = (articleID) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [articleID])
    .then((queryData) => {
      const article = queryData.rows[0];
      if (!article) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return article;
    });
};

exports.updateArticleById = (articleId, votes) => {
  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *",
      [votes, articleId]
    )
    .then((queryData) => {
      return queryData.rows[0];
    });
};
