const models = require("../../database/connect");
const crypto_data = require("../oauth_token/crypto_data");
const jwt = require("jsonwebtoken");

function checkDiet(user_id) {
  models.Level.findOne({
    user_id: user_id,
  })
    .then((rows) => {
      if (!rows) {
        return false;
      } else if (rows.diet == null || rows.vegan_level == null) {
        return rows;
      }
    })
    .catch((err) => {
      return err;
    });
}

module.exports = async function (req, res, next) {
  new Promise((resolve, reject) => {
    if (req.headers.user == "" || req.headers.user == "null") {
      res
        .json({
          status: null,
        })
        .status(401);
    }
    if (req.headers.authorization && req.headers.user) {
      var header = {
        authorization: req.headers.authorization.split("Bearer ")[1],
        user_id: crypto_data.decoding(req.headers.user),
      };
      resolve(header);
    } else {
      next();
    }
  })
    .then((header) => {
      var decoded = jwt.decode(header.authorization, {
        complete: true,
      });
      if (decoded == null || decoded == undefined) {
        var status = null;
        var user_id = header.user_id;
        return {
          status,
          user_id,
        };
      } else {
        var status = true;
        var decodedToken = decoded.payload.id;
        return {
          status,
          decodedToken,
        };
      }
    })
    .then((decode) => {
      if (decode.status == false && decode.user_id) {
        var diet = checkDiet(decode.user_id);
        return diet;
      } else if (decode.user_id == undefined || decode.user_id == undefined) {
        return false;
      } else if (decode.status == true) {
        var diet = checkDiet(decode.decodedToken);
        return diet;
      }
    })
    .then((diet) => {
      if (diet == false) {
        res.json({ status: 1 }).status(403);
      } else if (diet == null) {
        res.json({ status: 0 }).status(401);
      } else {
        res.json({ status: 2 }).status(200);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
