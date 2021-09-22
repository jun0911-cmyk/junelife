const RecipeCrawler = require("./recipe_crawler");

module.exports = (app) => {
  app.post("/recipe", async (req, res) => {
    const getUrl = req.body.url;
    const urlData = await RecipeCrawler.getData(getUrl);
    if (urlData) {
      const crawlingData = RecipeCrawler.crawling(urlData);
      if (crawlingData.length != 0) {
        res
          .json({
            recipeData: crawlingData,
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
