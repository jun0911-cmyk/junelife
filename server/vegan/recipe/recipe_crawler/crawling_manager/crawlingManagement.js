const RecipeCrawler = require("../crawler/recipe_crawler");
const PageCrawler = require("../crawler/page_crawler");

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

const setPageUrlData = async (url) => {
  const urlData = await PageCrawler.getData(url);
  const serverHostname = urlData.request.socket.servername;
  if (serverHostname == "www.10000recipe.com") {
    return PageCrawler.crawling10000RecipePage(urlData);
  } else if (serverHostname == "haemukja.com") {
    return PageCrawler.crawlingHaemukjaPage(urlData);
  } else if (serverHostname == "www.cj.co.kr") {
    return PageCrawler.crawlingCjTheKitchenPage(urlData);
  } else {
    return null;
  }
};

const pageCrawlingManagement = async (url) => {
  const recipePageData = setPageUrlData(url);
  return recipePageData;
};

const crawlingManagement = async (urlArray) => {
  const recipeData = setUrlData(urlArray);
  return recipeData;
};

module.exports.RecipeList = crawlingManagement;
module.exports.RecipePage = pageCrawlingManagement;
