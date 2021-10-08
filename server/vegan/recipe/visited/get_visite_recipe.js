const models = require("../../../database/connect");
let recipeList = [];
let todayRecipe = [];

module.exports = (app) => {
  app.post("/recipe/visited/get", (req, res) => {
    models.Level.findOne({
      user_id: req.body.user_id,
    }).then((rows) => {
      if (!rows) {
        res.status(403);
      } else {
        const splitRows = rows.today_visite.trim().split(",  ");
        splitRows.forEach((url) => {
          models.RecipeList.findOne({
            recipe_url: url,
          }).then((recipe) => {
            recipeList.push(recipe);
            if (recipeList.length == splitRows.length) {
              res.json({
                status: true,
                content: recipeList,
              });
              recipeList = [];
            }
          });
        });
      }
    });
  });

  app.post("/recipe/visited/today/get", (req, res) => {
    models.Level.findOne({
      user_id: req.body.user_id,
    }).then((user) => {
      if (user.register_recipe == "") {
        res
          .json({
            status: false,
            content: null,
            user: user,
          })
          .status(200);
      } else {
        const splitTodayUrls = user.register_recipe.split(", ");
        splitTodayUrls.forEach((register) => {
          models.RecipeList.findOne({
            recipe_url: register,
          }).then((recipe) => {
            todayRecipe.push(recipe);
            if (todayRecipe.length == splitTodayUrls.length) {
              res
                .json({
                  status: true,
                  content: todayRecipe,
                  user: user,
                })
                .status(200);
              todayRecipe = [];
            }
          });
        });
      }
    });
  });
};
