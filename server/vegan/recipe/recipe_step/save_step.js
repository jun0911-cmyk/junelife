const models = require("../../../database/connect");

module.exports = (app) => {
  app.post("/recipe/step/save", (req, res) => {
    models.Level.findOne({
      user_id: req.body.user_id,
    })
      .then((rows) => {
        if (!rows) {
          const setLevelRow = new models.Level({
            user_id: req.body.user_id,
            vegan_level: req.body.vegan_step,
            vegan_point: 0,
            diet: req.body.g_data,
            graph_diet: "",
            visite_recipe: "",
            today_visite: "",
            register_today: 0,
            register_recipe: "",
          });
          try {
            setLevelRow.save();
            res
              .json({
                status: true,
              })
              .status(200);
          } catch (e) {
            console.log(e);
          }
        } else if (rows) {
          res
            .json({
              status: false,
            })
            .status(403);
        }
      })
      .catch((err) => {
        res
          .json({
            status: false,
            err: err,
          })
          .status(500);
      });
  });

  app.post("/recipe/gram/save", (req, res) => {
    models.Level.updateOne(
      {
        user_id: req.body.user_id,
      },
      {
        $set: {
          diet: req.body.diet,
        },
      }
    ).then(() => {
      res.status(200);
    });
  });
};
