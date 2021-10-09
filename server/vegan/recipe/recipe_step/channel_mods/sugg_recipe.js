const models = require("../../../../database/connect");

let newRecipeList = [];

module.exports = (app) => {
  app.post("/recipe/rank/check", (req, res) => {
    const recipeList = req.body.recipeList;
    recipeList.forEach((recipe) => {
      models.RecipeList.findOne({
        recipe_url: recipe.recipe,
      }).then((recipeData) => {
        if (recipeData) {
          newRecipeList.push({
            recipe: recipeData,
            rank: recipe.rank,
            favorite: recipe.favorite,
          });
        }
        // check
        if (newRecipeList.length == recipeList.length) {
          res
            .json({
              status: true,
              newRecipe: newRecipeList,
            })
            .status(200);
          newRecipeList = [];
        }
      });
    });
  });
};
