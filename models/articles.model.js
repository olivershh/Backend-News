const db = require("../db/connection");
const format = require("pg-format");
const { query } = require("../db/connection");

exports.selectArticleById = (articleID) => {
  return db
    .query(
      `SELECT articles.*, count(comments.article_id) AS comment_count 
    FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 
    GROUP BY articles.article_id;`,
      [articleID]
    )
    .then((queryData) => {
      const article = queryData.rows[0];
      if (!article) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      article.comment_count = parseInt(article.comment_count);
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
      const article = queryData.rows[0];
      if (!article) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return article;
    });
};

exports.selectArticles = (topic, order = "DESC", sortBy = "created_at") => {
  let topicFilter = "";
  if (topic) {
    topicFilter = format(`WHERE TOPIC = '%I'`, topic);
  }
  order = order.toUpperCase();
  if (!["ASC", "DESC"].includes(order)) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
  if (
    ![
      "article_id",
      "title",
      "topic",
      "author",
      "body",
      "created_at",
      "votes",
    ].includes(sortBy)
  ) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }

  return db
    .query(
      `SELECT articles.article_id, title, topic, articles.author, articles.created_at, articles.votes, count(comments.article_id) AS comment_count 
      FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id ${topicFilter}
      GROUP BY articles.article_id ORDER BY ${sortBy.toLowerCase()} ${order.toLowerCase()};`
    )
    .then((queryData) => {
      const articles = queryData.rows;
      articles.map(
        (article) => (article.comment_count = parseInt(article.comment_count))
      );
      return queryData.rows;
    })
    .then((articles) => {
      if (articles.length !== 0) return articles;
      else {
        return db.query(`SELECT * FROM TOPICS WHERE slug = $1`, [topic]);
      }
    })
    .then((data) => {
      if (data.rowCount !== undefined) {
        if (data.rowCount > 0) {
          return [];
        }
        return Promise.reject({ status: 404, msg: "topic not found" });
      } else {
        return data;
      }
    });
};

exports.selectCommentsByArticleId = (articleId) => {
  return db
    .query(
      "SELECT comment_id, body, author, votes, created_at FROM comments WHERE article_id = $1",
      [articleId]
    )
    .then((queryData) => {
      const comments = queryData.rows;
      if (comments.length !== 0) return comments;
      else {
        return db.query("SELECT * FROM articles WHERE article_id = $1", [
          articleId,
        ]);
      }
    })
    .then((data) => {
      if (data.rowCount !== undefined) {
        if (data.rowCount > 0) {
          return [];
        }
        return Promise.reject({ status: 404, msg: "article not found" });
      } else {
        return data;
      }
    });
};

exports.newCommentByArticleId = (username, commentBody, articleId) => {
  return db
    .query(
      "INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *",
      [username, commentBody, articleId]
    )
    .then((queryData) => {
      return queryData.rows[0];
    });
};
