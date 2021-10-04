const models = require("../../../database/connect");
let recipeList = [];

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
};
