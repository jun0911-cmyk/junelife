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

const RecipeSchema = new mongoose.Schema({
  recipe_name: { type: String },
  recipe_image: { type: String },
  recipe_ingredient: { type: String },
  recipe_step: { type: String },
  crawling_url: { type: String },
  crawling_content: { type: String },
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
module.exports.Recipe = mongoose.model("recipe_db", RecipeSchema);
module.exports.Restaurant = mongoose.model("restaurant_db", RestaurantSchema);
