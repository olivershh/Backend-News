const { selectArticleById } = require("../models/articles.model");

exports.getArticleById = (req, res, next) => {
  const articleID = req.params.article_id;

  selectArticleById(articleID)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch(next);
};