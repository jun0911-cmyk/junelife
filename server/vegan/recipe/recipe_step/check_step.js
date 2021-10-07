const models = require("../../../database/connect");
const jwt = require("jsonwebtoken");

const decodingToken = (accessToken) => {
  const decodingToken = jwt.decode(accessToken, { complete: true });
  return decodingToken.payload.id;
};

module.exports = (app) => {
  app.post("/recipe/step/check", (req, res) => {
    models.Level.findOne({
      user_id: req.body.user_id,
    }).then((rows) => {
      if (!rows) {
        res
          .json({
            status: false,
            rows: null,
          })
          .status(403);
      } else {
        res
          .json({
            status: true,
            rows: rows,
          })
          .status(200);
      }
    });
  });

  app.post("/recipe/step/update", (req, res) => {
    const step = req.body.step;
    const user_id = req.body.user_id;
    models.Level.updateMany(
      { user_id: user_id },
      {
        $set: {
          vegan_level: step,
          vegan_point: 0,
        },
      }
    )
      .then((result) => {
        res.status(200);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  app.post("/recipe/get", (req, res) => {
    const user_id = decodingToken(req.body.user_id);
    models.Level.findOne({
      user_id: user_id,
    })
      .then((user) => {
        models.RecipeList.findOne({
          recipe_url: req.body.req_url.trim(),
        })
          .then((recipe) => {
            res
              .json({
                user: user,
                recipe: recipe,
              })
              .status(200);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};
