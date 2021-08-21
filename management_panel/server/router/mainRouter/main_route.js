const express = require('express');
const requestIp = require('request-ip');
const router = express.Router();

router.use(function timeLog(req, res, next) {
    console.log(`서버 접속로그, 접속 시간 : ${Date.now()}, 접속 IP : ${requestIp.getClientIp(req)}`);
    next();
});

router.get('/', function(req, res) {
    res.send(`homepage`);
});

module.exports = router;