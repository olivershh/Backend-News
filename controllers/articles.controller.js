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
  const { article_id } = req.params;
  const votes = req.body.inc_votes;

  updateArticleById(article_id, votes)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { topic, order, sort_by } = req.query;

  selectArticles(topic, order, sort_by)
    .then((articles) => {
      res.status(200).send({ articles: articles });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  selectCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments: comments });
    })
    .catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  newCommentByArticleId(username, body, article_id)
    .then((comment) => {
      res.status(201).send({ comment: comment });
    })
    .catch(next);
};
