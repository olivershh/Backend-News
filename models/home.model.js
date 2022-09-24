const fs = require("fs/promises");
const endpoints = require("../endpoints");

exports.selectEndpoints = async () => {
  const data = await fs.readFile("./endpoints.json", "utf-8");

  return JSON.parse(data);
};
