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
};
