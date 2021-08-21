const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    user_name: {type: String},
    user_id: {type: Number},
    password: {type: String},
    email: {type: String},
    created: {type: Date, default: Date.now},
});

module.exports.User = mongoose.model("user_db", UserSchema);