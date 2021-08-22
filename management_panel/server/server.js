const express = require('express');
const session = require('express-session');
const logger = require('morgan');
const passport = require('passport');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const Router = require('./router/index/indexRouter');
const port = process.env.PORT || 8000;
const app = express();

// database connect
require('./database/connect');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require('dotenv').config();
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
	resave: false,
	saveUninitialize: true,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
    name: 'management_panel_session-cookie',
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Router
app.use('/', Router.mainRouter);
app.use('/user', Router.accountRouter);

// account Server
require('./account/login/login_server')(app, passport);
require('./account/singup/singup_server')(app);

// PORT 8000
app.listen(port, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log(`server start success PORT : ${port}`);
    }
});