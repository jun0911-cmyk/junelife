const models = require("../../../../database/connect");
const jwt = require("jsonwebtoken");

const decodingToken = (accessToken) => {
  const decodingToken = jwt.decode(accessToken, { complete: true });
  return decodingToken.payload.id;
};

module.exports = (app) => {
  app.post("/user/cleaned", (req, res) => {
    const user_id = decodingToken(req.body.accessToken);
    models.Level.updateMany(
      { user_id: user_id },
      {
        $set: {
          today_visite: "",
          register_recipe: "",
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

  app.post("/user/today", (req, res) => {
    const user_id = decodingToken(req.body.accessToken);
    models.Level.updateOne(
      { user_id: user_id },
      {
        $set: {
          register_today: req.body.status,
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

  app.post("/user/today/get", (req, res) => {
    const user_id = decodingToken(req.body.accessToken);
    models.Level.findOne({
      user_id: user_id,
    })
      .then((rows) => {
        if (rows) {
          res
            .json({
              status: true,
              rows: rows,
            })
            .status(200);
        } else {
          res.status(403);
        }
      })
      .catch((err) => {
        res.status(500);
      });
  });

  app.post("/user/point", (req, res) => {
    const user_id = req.body.user_id;
    models.Level.updateMany(
      { user_id: user_id },
      {
        $set: {
          vegan_point: req.body.point,
          register_recipe: req.body.recipe,
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

  app.post("/user/g/update", (req, res) => {
    const user_id = decodingToken(req.body.user_id);
    const update_g = req.body.update_g;
    models.Level.findOne({
      user_id: user_id,
    }).then((user) => {
      models.Level.updateOne(
        { user_id: user.user_id },
        {
          $set: {
            new_diet: Number(user.new_diet) + Number(update_g),
          },
        }
      ).then((result) => {
        res
          .json({
            status: true,
          })
          .status(200);
      });
    });
  });

  app.post("/user/g/clean", (req, res) => {
    const user_id = decodingToken(req.body.user_id);
    models.Level.updateOne(
      { user_id: user_id },
      {
        $set: {
          new_diet: 0,
        },
      }
    ).then((result) => {
      res.status(200);
    });
  });
};
