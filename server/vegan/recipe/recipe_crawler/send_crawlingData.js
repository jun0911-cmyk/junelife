const models = require("../../../database/connect");

module.exports = (app) => {
  app.post("/recipe/crawling/data", async (req, res) => {
    models.RecipeList.find().then((rows) => {
      if (rows) {
        res
          .json({
            status: true,
            data: rows,
          })
          .status(200);
      } else {
        res
          .json({
            status: false,
            data: null,
          })
          .status(403);
      }
    });
  });
};
