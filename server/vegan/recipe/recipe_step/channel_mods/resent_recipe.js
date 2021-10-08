const models = require("../../../../database/connect");

let recipeDateList = [];

module.exports = (app) => {
  app.post("/recipe/resent", (req, res) => {
    models.RecipeList.find().then((recipeList) => {
      recipeList.forEach((recipe) => {
        const nowDate = new Date();
        const recipeDate = new Date(recipe.created);
        if (
          nowDate.getMonth() + 1 >= recipeDate.getMonth() + 1 &&
          nowDate.getFullYear() == recipeDate.getFullYear()
        ) {
          const nowDay = nowDate.getDate();
          const recipeDay = recipeDate.getDate();
          const date = nowDay - recipeDay;
          if (date <= 3) {
            recipeDateList.push({
              date: true,
              recipe: recipe,
            });
          } else {
            recipeDateList.push({
              date: false,
              recipe: recipe,
            });
          }
        } else {
          recipeDateList.push({
            date: false,
            recipe: recipe,
          });
        }
        // check
        if (recipeDateList.length >= recipeList.length) {
          res
            .json({
              status: true,
              recipe: recipeDateList,
            })
            .status(200);
          recipeDateList = [];
        }
      });
    });
  });
};
