const models = require("../../../database/connect");

module.exports = (app) => {
  app.post("/rank/save", (req, res) => {
    const recipe_url = req.body.url;
    const rank = req.body.rank;
    console.log(recipe_url, rank);
    models.RecipeList.findOne({
      recipe_url: recipe_url,
    }).then((rows) => {
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
    });
  });
};
