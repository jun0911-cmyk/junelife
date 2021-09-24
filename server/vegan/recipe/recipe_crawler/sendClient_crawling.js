const crawlingManagement = require("./crawling_manager/crawlingManagement");

module.exports = (app) => {
  app.post("/recipe", async (req, res) => {
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
    if (req.body.url) {
      const getUrl = req.body.url;
      console.log(getUrl);
      if (getUrl) {
        console.log(getUrl);
        const recipePageData = await crawlingManagement.RecipePage(getUrl);
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
    }
  });
};
