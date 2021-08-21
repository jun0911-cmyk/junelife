const express = require('express');
const session = require('express-session');
const path = require('path');
const passport = require('passport');
const LocalStorage = require('passport-local').Strategy;
const crypto = require('crypto');
const models = require('./database/connect');
const accountRouter = require('./router/accountRouter/account_route');
const indexRouter = require('./router/mainRouter/main_route');
const app = express();
const port = process.env.PORT || 8000;

app.use('/user', accountRouter);
app.use('/', indexRouter);

app.listen(port, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log(`server start success PORT : ${port}`);
    }
});