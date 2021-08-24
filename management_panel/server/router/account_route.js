const express = require('express');
const path = require('path');
const models = require('../database/connect');
const verify = require('../oauth_token/verify');
const router = express.Router();

router.use(express.static('../public/css'));
router.use(express.static('../public/client'));
router.use(express.static('../public/favicon'));
router.use(function timeLog(req, res, next) {
    console.log('account connect Time : ', Date.now());
    next();
});

router.get('/login', function(req, res) {
    if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        res.sendFile(path.join(__dirname, '..', '..', '/public/views/login.html'));
    }
});

router.get('/singup', function(req, res) {
    res.sendFile(path.join(__dirname, '..', '..', '/public/views/singup.html'));
});

router.get('/logout', async function(req, res) {
    if (req.cookies.access == undefined) {
        res.redirect('/');
    } else {
        const accessToken = await verify(req.cookies.access);
        models.Token.remove({ user_id: accessToken.user_id }).then(() => {
            req.logout();
            res.clearCookie('access');
            res.redirect('/');
        });
    }
});

module.exports = router;