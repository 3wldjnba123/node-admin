const { CODE_SUCCESS, CODE_ERROR, CODE_TOKEN_EXPIRED } = require("../utils/constant");

class Result {
  // 该类主要有三个参数赋值给 this.msg,this.data,this.options
  constructor(data, msg = "操作成功", options) {
    this.data = null;
    if (arguments.length === 0) {
      this.msg = "操作成功";
    } else if (arguments.length === 1) {
      this.msg = data;
    } else {
      this.data = data;
      this.msg = msg;
      if (options) {
        this.options = options;
      }
    }
  }
  //把参数组成一个对象{code, msg, data, ...options},内部调用
  createResult() {
    if (!this.code) {
      this.code = CODE_SUCCESS;
    }
    let base = {
      code: this.code,
      msg: this.msg
    };
    if (this.data) {
      base.data = this.data;
    }
    if (this.options) {
      base = { ...base, ...this.options };
    }
    console.log("base：", base);
    return base;
  }
  //发送给前端，内部调用
  json(res) {
    res.json(this.createResult());
  }
  //在外部用
  success(res) {
    this.code = CODE_SUCCESS;
    this.json(res);
  }
  fail(res) {
    this.code = CODE_ERROR;
    this.json(res);
  }
  expired(res) {
    this.code = CODE_TOKEN_EXPIRED;
    this.json(res);
  }

}

module.exports = Result;
