const { getEndpoints } = require("../controllers/home.controller");
const homeRouter = require("express").Router();

homeRouter.get("/", getEndpoints);

module.exports = homeRouter;
