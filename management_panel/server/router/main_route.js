const express = require('express');
const path = require('path');
const requestIp = require('request-ip');
const checkToken = require('../oauth_token/checkTokens');
const router = express.Router();

router.use('/', express.static('../public/views'));
router.use(express.static('../public/css'));
router.use(express.static('../public/client'));
router.use(express.static('../public/favicon'));
router.use(function timeLog(req, res, next) {
    console.log(`서버 접속로그, 접속 시간 : ${Date.now()}, 접속 IP : ${requestIp.getClientIp(req)}`);
    next();
});

router.get('/:id', checkToken, function(req, res, next) {
    res.sendFile(path.join(__dirname, '..', '..', '/public/views/test.html'));
});

module.exports = router;