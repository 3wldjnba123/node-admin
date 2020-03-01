const mysql = require("mysql");
const { host, user, password, database } = require("./config");
const debug = require("../utils/constant").debug;

// 连接数据库
function connect() {
  return mysql.createConnection({
    host,
    user,
    password,
    database,
    multipleStatements: true //multipleStatements：允许每条 mysql 语句有多条查询.使用它时要非常注意，因为它很容易引起 sql 注入（默认：false
  });
}

// 查询
function querySql(sql, params) {
  const conn = connect();
  return new Promise((resolve, reject) => {
    try {
      let query = conn.query(sql, params, (err, results) => {
        if (err) {
          debug && console.log("查询失败，原因:" + JSON.stringify(err));
          reject(err);
        } else {
          debug && console.log("查询成功", JSON.stringify(results));
          resolve(results);
        }
      });
      debug && console.log(query.sql);
    } catch (e) {
      reject(e);
    } finally {
      conn.end();
    }
  });
}

function queryOne(sql, params) {
  return new Promise((resolve, reject) => {
    querySql(sql, params)
      .then(results => {
        if (results && results.length > 0) {
          resolve(results[0]);
        } else {
          results(null);
        }
      })
      .catch(error => {
        reject;
      });
  });
}

module.exports = {
  querySql,
  queryOne
};
