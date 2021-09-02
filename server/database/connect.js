const mongoose = require('mongoose');
const models = require('./schema');
var mongodb;

mongoose.connect('mongodb://localhost:27017/control_panels', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology : true,
    poolSize: 100,
    writeConcern: 2500,
    connectTimeoutMS: 10000,
}).then((db) => {
    mongodb = db;
    console.log('database connecting successed');
}).catch((err) => {
    console.log(err);
});

function closedb() {
    mongodb.disconnect();
}

// model Schema Save
module.exports.User = models.User;
module.exports.Token = models.Token;
module.exports.Recode = models.Recode;
module.exports.Live = models.Live;
module.exports.close = closedb; 
