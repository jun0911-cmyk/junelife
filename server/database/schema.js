const mongoose = require("mongoose");
const { Binary, ObjectID } = require("mongodb");

const UserSchema = new mongoose.Schema({
  user_name: { type: String },
  user_id: { type: String },
  password: { type: String },
  email: { type: String },
  created: { type: Date, default: Date.now },
});

const TokenSchema = new mongoose.Schema({
  user_id: { type: String },
  refresh_token: { type: String },
  created: { type: Date, default: Date.now },
});

module.exports.User = mongoose.model("user_db", UserSchema);
module.exports.Token = mongoose.model("token_db", TokenSchema);
