const express = require("express");
const cors = require("cors"); //解决跨域
const bodyParser = require("body-parser"); //用于解析前端post参数，req.body
// boom  集中处理404请求的中间件（写在router/index.js）
const router = require("./router/index");

const app = express();

const whitelist = ["http://192.168.0.106:8080", "https://www.runoob.com"];
const corsOptions = {
  origin: whitelist //也可以是一个函数，教程 https://github.com/expressjs/cors
};
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(router);

const server = app.listen(5000, function() {
  const { address, port } = server.address();
  console.log("Http服务器正在运行 http://%s:%s", address, port);
});
