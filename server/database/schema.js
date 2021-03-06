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
  diet: { type: Number },
  graph_diet: { type: String },
  visite_recipe: { type: String },
  today_visite: { type: String },
  register_today: { type: Number },
  register_recipe: { type: String },
});

const recipeListSchema = new mongoose.Schema({
  recipe_url: { type: String },
  step: { type: String },
  rank: { type: String },
  favorite_people: { type: Number },
  content: { type: String },
  today_g: { type: Number },
  created: { type: Date, default: Date.now },
});

const recipePageSchema = new mongoose.Schema({
  page_url: { type: String },
  content: { type: String },
});

const RestaurantSchema = new mongoose.Schema({
  restaurant_name: { type: String },
  restaurant_id: { type: Number },
  phone: { type: String },
  address: { type: String },
  menu: { type: String },
  created: { type: Date, default: Date.now },
});

module.exports.User = mongoose.model("user_db", UserSchema);
module.exports.Token = mongoose.model("token_db", TokenSchema);
module.exports.Level = mongoose.model("veganLevel_db", veganLevelSchema);
module.exports.RecipeList = mongoose.model("reicpeList_db", recipeListSchema);
module.exports.ReicpePage = mongoose.model("recipePage_db", recipePageSchema);
module.exports.Restaurant = mongoose.model("restaurant_db", RestaurantSchema);
