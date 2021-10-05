const models = require("../../../database/connect");

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
};
