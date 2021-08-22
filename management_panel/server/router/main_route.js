const express = require('express');
const requestIp = require('request-ip');
const router = express.Router();

router.use('/', express.static('../public/views'));
router.use(express.static('../public/css'));
router.use(express.static('../public/client'));
router.use(express.static('../public/favicon'));
router.use(function timeLog(req, res, next) {
    console.log(`서버 접속로그, 접속 시간 : ${Date.now()}, 접속 IP : ${requestIp.getClientIp(req)}`);
    next();
});

router.get('/', function(req, res) {
    res.send(`homepage`);
});

router.get('/:id', function(req, res, next) {
    res.send(`${req.params.id} profile`);
});

module.exports = router;