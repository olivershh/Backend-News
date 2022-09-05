const { selectArticleById } = require("../models/articles.models");

exports.getArticleById = (req, res, next) => {
  const articleId = req.params.article_id;
  console.log(articleId, "in controllers");
  selectArticleById(article_id).then((article) => {
    res.status(200).send({ article: article });
  });
};
