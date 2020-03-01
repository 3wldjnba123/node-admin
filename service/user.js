const { querySql, queryOne } = require("../db");

function login(username, password) {
  const sql = "select * from admin_user where username= ? and password = ?";
  return querySql(sql, [username, password]);
}

function findUser(username) {
  const sql = `select * from admin_user where username = ?`;
  return queryOne(sql, [username]);
}

module.exports = {
  login,
  findUser
};
