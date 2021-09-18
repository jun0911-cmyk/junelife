const models = require("../../database/connect");

module.exports = (app) => {
  app.post("/recipe/diet", (req, res) => {
    const user_id = req.body.user_id;
    models.Level.findOne({
      user_id: user_id,
    }).then((rows) => {
      if (!rows) {
        res
          .json({
            status: false,
            message: "not setting vegan_levels",
          })
          .status(200);
      } else {
        res
          .json({
            status: true,
            message: rows,
          })
          .status(200);
      }
    });
  });
};
