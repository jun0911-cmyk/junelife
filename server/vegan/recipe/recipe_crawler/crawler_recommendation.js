const Crawler = require("./recipe_crawler");

module.exports = async (app) => {
  const get_data = await Crawler.getData(
    "https://www.10000recipe.com/recipe/list.html"
  );

  const getCrawler = Crawler.crawling(get_data);
  const log = Crawler.log();
  console.log(log, getCrawler);
};
