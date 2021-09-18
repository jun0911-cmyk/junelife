const mongoose = require("mongoose");

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

const veganLevelSchema = new mongoose.Schema({
  user_id: { type: String },
  vegan_level: { type: String },
  vegan_point: { type: Number },
  diet: { type: String },
});

const RestaurantSchema = new mongoose.Schema({
  restaurant_name: { type: String },
  restaurant_id: { type: Number },
  latitude: { type: Number },
  grade: { type: Number },
  owner: { type: String },
  created: { type: Date, default: Date.now },
});

module.exports.User = mongoose.model("user_db", UserSchema);
module.exports.Token = mongoose.model("token_db", TokenSchema);
module.exports.Level = mongoose.model("veganLevel_db", veganLevelSchema);
module.exports.Restaurant = mongoose.model("restaurant_db", RestaurantSchema);
