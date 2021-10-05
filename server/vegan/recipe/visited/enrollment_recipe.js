const models = require("../../../database/connect");
const jwt = require("jsonwebtoken");

const decodingToken = (accessToken) => {
  const decodingToken = jwt.decode(accessToken, { complete: true });
  return decodingToken.payload.id;
};

module.exports = (app) => {
  app.post("/user/cleaned", (req, res) => {
    const user_id = decodingToken(req.body.accessToken);
    models.Level.updateOne(
      { user_id: user_id },
      {
        $set: {
          today_visite: "",
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

  app.post("/user/today/append", (req, res) => {
    const user_id = decodingToken(req.body.accessToken);
    models.Level.updateOne(
      { user_id: user_id },
      {
        $set: {
          register_today: 1,
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

  app.post("/user/today/clean", (req, res) => {
    const user_id = decodingToken(req.body.accessToken);
    models.Level.updateOne(
      { user_id: user_id },
      {
        $set: {
          register_today: 0,
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
    models.Level.updateOne(
      { user_id: user_id },
      {
        $set: {
          vegan_point: Number(req.body.nowPoint) + Number(req.body.newPoint),
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
