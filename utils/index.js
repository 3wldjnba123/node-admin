const crypto = require("crypto"); // MD5 + SALT 加密
const jwt = require("jsonwebtoken"); // 用于 Token 解密
const { PRIVATE_KEY } = require("./constant");

function md5(s) {
  return crypto
    .createHash("md5")
    .update(String(s)) // 注意参数需要为 String 类型，否则会出错
    .digest("hex");
}

function decode(req) {
  let authorization = req.get("Authorization");
  let token = "";
  if (authorization.indexOf("Bearer") >= 0) {
    token = authorization.replace("Bearer ", "");
  } else {
    token = authorization;
  }
  return jwt.verify(token, PRIVATE_KEY);
}

module.exports = {
  md5,
  decode
};
