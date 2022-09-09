const fs = require("fs/promises");
const endpoints = require("../endpoints");

exports.selectEndpoints = () => {
  return fs.readFile("./endpoints.json", "utf-8").then((data) => {
    return JSON.parse(data);
  });
};
