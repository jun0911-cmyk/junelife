const express = require('express');
const session = require('express-session');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const models = require('./database/connect');
const Router = require('./router/index/indexRouter');
const port = process.env.PORT || 8000;
const app = express();

require('dotenv').config();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

app.use('/', Router.mainRouter);
app.use('/user', Router.accountRouter);

require('./account/login/login_server')(app);

app.listen(port, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log(`server start success PORT : ${port}`);
    }
});