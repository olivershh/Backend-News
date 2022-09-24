const {
  selectArticleById,
  updateArticleById,
  selectArticles,
  selectCommentsByArticleId,
  newCommentByArticleId,
  newArticle,
} = require("../models/articles.model");

exports.getArticleById = async (req, res, next) => {
  const { article_id } = req.params;

  try {
    const article = await selectArticleById(article_id);
    res.status(200).send({ article: article });
  } catch (err) {
    next(err);
  }
};

exports.patchArticleById = async (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  try {
    const article = await updateArticleById(article_id, inc_votes);
    res.status(200).send({ article: article });
  } catch (err) {
    next(err);
  }
};

exports.getArticles = async (req, res, next) => {
  const { topic, order, sort_by } = req.query;

  try {
    const articles = await selectArticles(topic, order, sort_by);
    res.status(200).send({ articles: articles });
  } catch (err) {
    next(err);
  }
};

exports.getCommentsByArticleId = async (req, res, next) => {
  const { article_id } = req.params;

  try {
    const comments = await selectCommentsByArticleId(article_id);
    res.status(200).send({ comments: comments });
  } catch (err) {
    next(err);
  }
};

exports.postCommentByArticleId = async (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  try {
    const comment = await newCommentByArticleId(username, body, article_id);
    res.status(201).send({ comment: comment });
  } catch (err) {
    next(err);
  }
};

exports.postArticle = async (req, res, next) => {
  const article = req.body;

  try {
    const postedArticle = await newArticle(article);
    res.status(201).send({ article: postedArticle });
  } catch (err) {
    next(err);
  }
};
