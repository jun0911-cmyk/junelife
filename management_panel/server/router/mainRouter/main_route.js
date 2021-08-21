const express = require('express');
const router = express.Router();

router.use(function timeLog(req, res, next) {
    console.log('main page connect Time : ', Date.now());
    next();
});

router.get('/', function(req, res) {
    res.send(`homepage`);
});

module.exports = router;