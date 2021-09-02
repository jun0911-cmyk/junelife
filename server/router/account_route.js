const express = require('express');
const path = require('path');
const models = require('../database/connect');
const authCheck = require('../oauth_token/authCheck');
const crypto_data = require('../oauth_token/crypto_data');
const verify = require('../oauth_token/verify');
const router = express.Router();

router.use(express.static('../public/css'));
router.use(express.static('../public/client'));
router.use(express.static('../public/favicon'));
router.use(function timeLog(req, res, next) {
    console.log('account connect Time : ', Date.now());
    next();
});

router.get('/login', authCheck, function(req, res) {
    res.sendFile(path.join(__dirname, '..', '..', '/public/views/login.html'));
});

router.get('/singup', authCheck, function(req, res) {
    res.sendFile(path.join(__dirname, '..', '..', '/public/views/singup.html'));
});

router.get('/logout', function(req, res) {
    res.sendFile(path.join(__dirname, '..', '..', '/public/views/logout.html'));
});

router.post('/logout', function(req, res) {
    models.Token.remove({ user_id: crypto_data.decoding(req.body.user) }).then(() => {
        req.logout();
        res.json({ status: true });
    }).catch((e) => {
        req.logout();
        res.json({ status: false });
    });
});

module.exports = router;