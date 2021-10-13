const models = require("../../../database/connect");
const jwt = require("jsonwebtoken");

module.exports = (app) => {
  app.post("/recipe/visited/update", (req, res) => {
    const decodingToken = jwt.decode(req.body.user_id, { complete: true });
    const user_id = decodingToken.payload.id;
    models.Level.findOne({
      user_id: user_id,
    }).then((rows) => {
      if (!rows) {
        res
          .json({
            status: false,
          })
          .status(403);
      } else {
        if (rows.today_visite == "") {
          models.Level.updateMany(
            { user_id: user_id },
            {
              $set: {
                today_visite: req.body.choose_url,
              },
            }
          ).then((end) => {
            res
              .json({
                status: true,
              })
              .status(200);
          });
        } else {
          models.Level.aggregate([
            {
              $project: {
                today_visite: {
                  $concat: [
                    `${rows.today_visite}`,
                    ", ",
                    `${req.body.choose_url}`,
                  ],
                },
              },
            },
          ])
            .then((result) => {
              models.Level.updateMany(
                { user_id: user_id },
                {
                  $set: {
                    today_visite: result[0].today_visite,
                  },
                }
              ).then((end) => {
                res
                  .json({
                    status: true,
                  })
                  .status(200);
              });
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    });
  });
};
