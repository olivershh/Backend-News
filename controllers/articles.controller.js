const {
  selectArticleById,
  updateArticleById,
  selectArticles,
  selectCommentsByArticleId,
  newCommentByArticleId,
} = require("../models/articles.model");

exports.getArticleById = (req, res, next) => {
  const articleID = req.params.article_id;

  selectArticleById(articleID)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const articleID = req.params.article_id;
  const votes = req.body.inc_votes;

  updateArticleById(articleID, votes)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const topic = req.query.topic;
  const order = req.query.order;
  const sort_by = req.query.sort_by;

  selectArticles(topic, order, sort_by)
    .then((articles) => {
      res.status(200).send({ articles: articles });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const article_id = req.params.article_id;

  selectCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments: comments });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const article_id = req.params.article_id;
  const username = req.body.username;
  const commentBody = req.body.body;

  newCommentByArticleId(username, commentBody, article_id)
    .then((comment) => {
      res.status(201).send({ comment: comment });
    })
    .catch(next);
};
