const express = require('express');
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