const models = require("../../../../database/connect");

let recipeRankList = [];

module.exports = (app) => {
  app.post("/rank/get", (req, res) => {
    models.RecipeList.find().then((recipeList) => {
      recipeList.forEach((recipe) => {
        if (recipe.rank != 0 || recipe.rank != "") {
          const splitRank = recipe.rank.split(", ").map(Number);
          if (splitRank.length > 1) {
            const recipeRank =
              splitRank.reduce((p, c) => p + c) / splitRank.length;
            recipeRankList.push({
              recipe: recipe.recipe_url,
              rank: parseFloat(recipeRank).toFixed(1),
              favorite: recipe.favorite_people,
            });
          } else {
            if (recipe.rank == 0 || recipe.rank != "") {
              recipeRankList.push({
                recipe: recipe.recipe_url,
                rank: null,
                favorite: recipe.favorite_people,
              });
            }
          }
        }
        // arr push state
        if (recipeRankList.length == recipeList.length) {
          res
            .json({
              status: true,
              ranking: recipeRankList,
            })
            .status(200);
          recipeRankList = [];
        }
      });
    });
  });

  app.post("/rank/save", (req, res) => {
    const recipe_url = req.body.url;
    const rank = req.body.rank;
    console.log(recipe_url, rank);
    models.RecipeList.findOne({
      recipe_url: recipe_url,
    }).then((rows) => {
      if (rows.rank == "" || rows.rank == 0) {
        if (rank >= 4) {
          models.RecipeList.updateMany(
            { recipe_url: recipe_url },
            {
              $set: {
                rank: rank,
                favorite_people: rows.favorite_people + 1,
              },
            }
          ).then((end) => {
            res
              .json({
                status: true,
              })
              .status(200);
          });
        } else if (rank < 4) {
          models.RecipeList.updateOne(
            { recipe_url: recipe_url },
            {
              $set: {
                rank: rank,
              },
            }
          ).then((end) => {
            res
              .json({
                status: true,
              })
              .status(200);
          });
        }
      } else {
        models.RecipeList.aggregate([
          {
            $project: {
              rank: {
                $concat: [`${rows.rank}`, ", ", `${rank}`],
              },
            },
          },
        ])
          .then((result) => {
            if (rank >= 4) {
              models.RecipeList.updateMany(
                { recipe_url: recipe_url },
                {
                  $set: {
                    rank: result[0].rank,
                    favorite_people: rows.favorite_people + 1,
                  },
                }
              ).then((end) => {
                res
                  .json({
                    status: true,
                  })
                  .status(200);
              });
            } else if (rank < 4) {
              models.RecipeList.updateOne(
                { recipe_url: recipe_url },
                {
                  $set: {
                    rank: result[0].rank,
                  },
                }
              ).then((end) => {
                res
                  .json({
                    status: true,
                  })
                  .status(200);
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  });
};
