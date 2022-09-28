const db = require("../db/connection");
const format = require("pg-format");
const { query } = require("../db/connection");

exports.selectArticleById = async (article_id) => {
  const queryData = await db.query(
    `SELECT articles.*, count(comments.article_id) AS comment_count 
    FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 
    GROUP BY articles.article_id;`,
    [article_id]
  );

  const article = queryData.rows[0];

  if (!article)
    return Promise.reject({ status: 404, msg: "article not found" });

  article.comment_count = parseInt(article.comment_count);
  return article;
};

exports.updateArticleById = async (article_id, votes) => {
  const queryData = await db.query(
    "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *",
    [votes, article_id]
  );

  const article = queryData.rows[0];
  if (!article)
    return Promise.reject({ status: 404, msg: "article not found" });

  return article;
};

exports.selectArticles = async (
  topic,
  order = "DESC",
  sortBy = "created_at"
) => {
  let topicFilter = "";

  if (topic) topicFilter = format(`WHERE TOPIC = '%I'`, topic);

  order = order.toUpperCase();

  if (!["ASC", "DESC"].includes(order))
    return Promise.reject({ status: 400, msg: "bad request" });

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

  const queryData = await db.query(
    `SELECT articles.article_id, title, topic, articles.author, articles.created_at, articles.votes, count(comments.article_id) AS comment_count 
      FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id ${topicFilter}
      GROUP BY articles.article_id ORDER BY ${sortBy.toLowerCase()} ${order.toLowerCase()};`
  );

  const articles = queryData.rows.map((article) => {
    return { ...article, comment_count: parseInt(article.comment_count) };
  });

  if (articles.length !== 0) return articles;

  const data = await db.query(`SELECT * FROM TOPICS WHERE slug = $1`, [topic]);

  if (data.rowCount !== undefined) {
    if (data.rowCount > 0) {
      return [];
    }
    return Promise.reject({ status: 404, msg: "topic not found" });
  } else {
    return data;
  }
};

exports.selectCommentsByArticleId = async (article_id) => {
  const queryData = await db.query(
    "SELECT comment_id, body, author, votes, created_at FROM comments WHERE article_id = $1",
    [article_id]
  );

  const comments = queryData.rows;
  if (comments.length !== 0) return comments;

  const data = await db.query(
    "SELECT * FROM articles WHERE article_id = $1 ORDER BY created_at DESC",
    [article_id]
  );

  if (data.rowCount !== undefined) {
    if (data.rowCount > 0) {
      return [];
    }
    return Promise.reject({ status: 404, msg: "article not found" });
  } else {
    return data;
  }
};

exports.newCommentByArticleId = async (username, commentBody, article_id) => {
  const queryData = await db.query(
    "INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *",
    [username, commentBody, article_id]
  );

  return queryData.rows[0];
};

exports.newArticle = async (article) => {
  const { author, title, body, topic } = article;

  const queryData = await db.query(
    `INSERT INTO articles (author, title, body, topic) VALUES ($1, $2, $3, $4) returning article_id;`,
    [author, title, body, topic]
  );

  const returnedId = queryData.rows[0].article_id;

  const postedArticle = await this.selectArticleById(returnedId);

  return postedArticle;
};
