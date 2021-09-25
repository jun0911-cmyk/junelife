const crawlingManagement = require("./crawling_manager/crawlingManagement");

module.exports = (app) => {
  app.post("/recipe/crawling/list", async (req, res) => {
    const getUrl = req.body.url;
    if (getUrl) {
      const recipeData = await crawlingManagement.RecipeList(getUrl);
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

  app.post("/recipe/crawling/page", async (req, res) => {
    const getPageUrl = req.body.url;
    if (getPageUrl) {
      const recipePageData = await crawlingManagement.RecipePage(getPageUrl);
      if (recipePageData) {
        res
          .json({
            recipePageData: recipePageData,
            status: true,
          })
          .status(200);
      } else {
        res
          .json({
            recipePageData: null,
            status: false,
          })
          .status(403);
      }
    } else {
      res
        .json({
          recipePageData: null,
          status: false,
        })
        .status(403);
    }
  });
};
