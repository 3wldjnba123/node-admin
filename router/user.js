const express = require("express");
const Result = require("../models/Result"); //响应结果封装
const { md5, decode } = require("../utils"); // MD5 + SALT 加密，Token 解密
const jwt = require("jsonwebtoken"); //生成 JWT Token
const { PWD_SALT, PRIVATE_KEY, JWT_EXPIRED } = require("../utils/constant");
const { login, findUser } = require("../service/user");

const router = express.Router();

router.post("/login", (req, res) => {
  // express-validator服务端表单验证先不写，感觉前端已经写的很严格了，后端还需要在验证吗？
  let { username, password } = req.body;
  password = md5(`${password}${PWD_SALT}`); // MD5 + SALT 加密
  login(username, password).then(user => {
    console.log("user: ", user);
    if (!user || user.length === 0) {
      new Result("登录失败").success(res);
    } else {
      //生成 JWT Token 传给前端
      const token = jwt.sign({ username }, PRIVATE_KEY, {
        expiresIn: JWT_EXPIRED
      });
      new Result({ token }, "登录成功").success(res);
    }
  });
});

router.get("/info", (req, res) => {
  let decoded = decode(req); // Token 解密
  if (decoded && decoded.username) {
    findUser(decoded.username).then(user => {
      if (user) {
        user.roles = [user.role];
        new Result(user, "获取用户信息成功").success(res);
      } else {
        new Result("获取用户信息失败").fail(res);
      }
    });
  } else {
    new Result("用户信息解析失败").fail(res);
  }
});

module.exports = router;
