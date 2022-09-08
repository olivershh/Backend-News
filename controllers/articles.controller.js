const {
  selectArticleById,
  updateArticleById,
  selectArticles,
  selectCommentsByArticleId,
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

  selectArticles(topic)
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
