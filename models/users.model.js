const db = require("../db/connection");

exports.selectUsers = async () => {
  const queryData = await db.query(`SELECT * FROM users;`);
  const users = queryData.rows;
  return users;
};

exports.selectUser = async (username) => {
  const queryData = await db.query(`SELECT * FROM users WHERE username = $1`, [
    username,
  ]);

  const user = queryData.rows[0];
  if (!user) return Promise.reject({ status: 404, msg: "user not found" });

  return user;
};
