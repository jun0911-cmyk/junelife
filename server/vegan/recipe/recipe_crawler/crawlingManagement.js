const RecipeCrawler = require("./recipe_crawler");

const startCrawling = (url) => {
  return (recipeCrawlingData = {
    CjTheKitChen: RecipeCrawler.crawlingCjTheKitchen(url[0]),
    Haemukja: RecipeCrawler.crawlingHaemukja(url[1]),
    Recipe10000: RecipeCrawler.crawling10000Recipe(url[2]),
  });
};

const setUrlData = async (urlArray) => {
  const urlDataArray = [];
  for (let i = 0; i < urlArray.length; i++) {
    const urlData = await RecipeCrawler.getData(urlArray[i]);
    await urlDataArray.push(urlData);
    if (urlDataArray.length < 3) {
      setUrlData(urlArray[i] - 1);
    } else {
      return startCrawling(urlDataArray);
    }
  }
};

const crawlingManagement = async (urlArray) => {
  const recipeData = setUrlData(urlArray);
  return recipeData;
};

module.exports = crawlingManagement;
