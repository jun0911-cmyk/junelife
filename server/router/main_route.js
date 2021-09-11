const express = require("express");
const path = require("path");
const requestIp = require("request-ip");
const checkToken = require("../middleware/oauth_token/checkTokens");
const authCheck = require("../middleware/oauth_token/authCheck");
const models = require("../database/connect");
const router = express.Router();

router.use(function timeLog(req, res, next) {
  console.log(
    `서버 접속로그, 접속 시간 : ${Date.now()}, 접속 IP : ${requestIp.getClientIp(
      req
    )}`
  );
  next();
});

router.get("/", checkToken, function (req, res, next) {
  res.sendFile(path.join(__dirname, "..", "..", "/public/views/index.html"));
});

module.exports = router;
