const crawlingManagement = require("./crawlingManagement");

module.exports = (app) => {
  app.post("/recipe", async (req, res) => {
    const getUrl = req.body.url;
    if (getUrl) {
      const recipeData = await crawlingManagement(getUrl);
      if (recipeData) {
        res
          .json({
            recipeData: recipeData,
            status: true,
          })
          .status(200);
      } else {
        res
          .json({
            recipeData: null,
            status: false,
          })
          .status(403);
      }
    } else {
      res
        .json({
          recipeData: null,
          status: false,
        })
        .status(403);
    }
  });
};
