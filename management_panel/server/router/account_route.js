const express = require('express');
const path = require('path');
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

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;