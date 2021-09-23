const cheerio = require("cheerio");
const axios = require("axios");
function crawler() {}

crawler.prototype.getData = async (url) => {
  try {
    return await axios.get(url);
  } catch (e) {
    console.log(e);
  }
};

crawler.prototype.crawling10000RecipePage = () => {};

crawler.prototype.crawlingHaemukjaPage = () => {};

crawler.prototype.crawlingCjTheKitchenPage = () => {};

crawler.prototype.log = () => {
  return "testing";
};

module.exports = new crawler();
