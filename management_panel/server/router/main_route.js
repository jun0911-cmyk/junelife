const express = require('express');
const path = require('path');
const requestIp = require('request-ip');
const checkToken = require('../oauth_token/checkTokens');
const authCheck = require('../oauth_token/authCheck');
const models = require('../database/connect');
const router = express.Router();

var channel;

router.use(function timeLog(req, res, next) {
    console.log(`서버 접속로그, 접속 시간 : ${Date.now()}, 접속 IP : ${requestIp.getClientIp(req)}`);
    next();
});

router.get('/', checkToken, function(req, res, next) {
    if (req.query.setting == 'recode') {
        channel = false;
    } else if (req.query.setting == 'live') {
        channel = true;
    } else {
        channel = false;
    }
    res.sendFile(path.join(__dirname, '..', '..', '/public/views/index.html'));
});

router.post('/', function(req, res) {
    if (channel == false) {
        models.Recode.find().then((rows) => {
            res.json({
                channel: channel,
                recode_video: rows,
            });
        });
    } else if (channel == true) {
        models.Live.find().then((rows) => {
            res.json({
                channel: channel,
                live_video: rows,
            });
        });
    }
});

module.exports = router;