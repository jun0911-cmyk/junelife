const models = require("../../database/connect");

module.exports = (app) => {
  app.post("/rest/save", (req, res) => {
    const name = req.body.name;
    const phone = req.body.phone;
    const address = req.body.address;
    models.Restaurant.find().then((rowsList) => {
      const lastRest = rowsList[rowsList.length - 1];
      const restDB = new models.Restaurant({
        restaurant_id: lastRest.restaurant_id + 1,
        restaurant_name: name,
        phone: phone,
        address: address,
      });
      restDB.save();
      res
        .json({
          status: true,
        })
        .status(200);
    });
  });
};
