const models = require("../../database/connect");
const cryptoServer = require("../../middleware/oauth_token/crypto_data");

module.exports = (app) => {
  app.post("/recipe/visited/update", (req, res) => {
    models.Level.findOne({
      user_id: cryptoServer.decoding(req.body.user_id),
    })
      .then((rows) => {
        if (!rows) {
          res
            .json({
              status: false,
            })
            .status(403);
        } else {
          models.Level.updateOne(
            { user_id: cryptoServer.decoding(req.body.user_id) },
            { $set: { visite_recipe: rows.visite_recipe + 1 } }
          ).then((result) => {
            res.json({ status: true }).staus(200);
          });
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
};
