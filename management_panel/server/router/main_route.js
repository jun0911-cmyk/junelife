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

router.get('/', function(req, res, next) {
    next();
});

router.post('/', function(req, res) {
    // 로그인 세션 유저 쿠키 암호화
    function auth_cookie(user_id, email) {
        var hash_id = crypto.createHash('sha512').update(user_id).digest('base64');
        var hash_email = crypto.createHash('sha512').update(email).digest('base64');
        res.cookie('user_id', `${hash_id}`, {
            httpOnly: true,
            singed: true
        });
        res.cookie('user_email', `${hash_email}`, {
            httpOnly: true,
            singed: true
        });
        res.cookie('logged_in', `yes`, {
            httpOnly: true,
            singed: true
        }); 
    }
    // 로그인 유무가 True면 쿠키 등록
    if(req.isAuthenticated()) {
        const User = req.user.dataValues;
        auth_cookie(User.user_id, User.email);
        res.json({ auth: true, user: req.user });
    } else {
        res.json({ auth: false });
    }
});

router.get('/:id', function(req, res, next) {
    res.send(`${req.params.id} profile`);
});

module.exports = router;