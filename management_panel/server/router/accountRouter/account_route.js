const express = require('express');
const router = express.Router();

router.use(function timeLog(req, res, next) {
    console.log('account connect Time : ', Date.now());
    next();
});

router.get('/search/:id', function(req, res) {
    res.send(`${req.params.id} profile`);
});

router.get('/login', function(req, res) {
    res.send('test login');
});

router.get('/singup', function(req, res) {
    res.send('test singup');
});

module.exports = router;