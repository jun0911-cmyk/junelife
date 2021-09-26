const models = require("../../../../database/connect");
const Crawler = require("../crawling_manager/crawlingManagement");
const pageUrl = [];

const saveRecipePage = (recipe) => {
  recipe.forEach((data) => {
    models.RecipePage.findOne({
      page_url: data[0].path,
    })
      .then((rows) => {
        if (!rows) {
          try {
            new models.RecipePage({
              page_url: data[0].path,
              content: JSON.stringify(data[0]),
            }).save();
          } catch (e) {
            throw Error("fail save reicpe Error");
          }
        } else if (!rows) {
          console.log("recipe data save Error");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

const getReicpePage = async (pageArr) => {
  const recipePage = await Crawler.RecipePage(pageArr);
  saveRecipePage(recipePage);
};

const getPageUrl = (url) => {
  pageUrl.push(url);
  if (pageUrl.length >= 60) {
    getReicpePage(pageUrl);
  }
};

module.exports = getPageUrl;
