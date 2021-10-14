const models = require("../../database/connect");

module.exports = (app) => {
  app.post("/rest/get", (req, res) => {
    models.Restaurant.find()
      .then((rowsData) => {
        res
          .json({
            status: true,
            data: rowsData,
          })
          .status(200);
      })
      .catch((err) => {
        console.log(err);
      });
  });
};
