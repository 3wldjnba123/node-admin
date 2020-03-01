const express = require("express");
const boom = require("boom"); // 集中处理404请求的中间件
const jwtAuth = require("./jwtAuth"); // JWT 认证
const userRouter = require("./user");
const Result = require("../models/Result");

// 注册路由
const router = express.Router();

// 对所有路由（白名单除外）进行 jwt 认证（前端axios白名单是设置是否头部添加后端传过来的token，与后端jwt认证白名单对应，还有前端钩子白名单是否要token），
// 在前端.headers['Authorization'] = `Bearer ${getToken()}`）这里会自动去验证前端头部的Authorization
router.use(jwtAuth);

router.get("/", (req, res) => {
  res.send("Hello Node.JS");
});

// 通过 userRouter 来处理 /user 路由，对路由处理进行解耦（如："/user/info"）
router.use("/user", userRouter);

/**
 * 集中处理404请求的中间件
 * 注意：该中间件必须放在正常处理流程之后
 * 否则，会拦截正常请求
 */
router.use((req, res, next) => {
  next(boom.notFound("接口不存在"));
});

/**
 * 自定义路由异常处理中间件
 * 注意两点：
 * 第一，方法的参数不能减少
 * 第二，方法的必须放在路由最后
 */
router.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    new Result(null, "toke失效", {
      error: err.status,
      errorMsg: err.name
    }).expired(res.status(err.status));
  } else {
    let msg = (err && err.message) || "系统错误";
    let statusCode = (err.output && err.output.statusCode) || 500;
    let errorMsg =
      (err.output && err.output.payload && err.output.payload.error) ||
      err.message;
    new Result(null, msg, {
      error: statusCode,
      errorMsg
    }).fail(res.status(statusCode));
  }
});

module.exports = router;
