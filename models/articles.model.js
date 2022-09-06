const db = require("../db/connection");

exports.selectArticleById = (articleID) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [articleID])
    .then((queryData) => {
      const article = queryData.rows[0];
      if (!article) return Promise.reject({ status: 400, msg: "bad request" });
      return article;
    });
};
