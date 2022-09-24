const db = require("../db/connection");

exports.selectTopics = async () => {
  const queryData = await db.query("SELECT * FROM topics;");
  const topics = queryData.rows;
  return topics;
};
