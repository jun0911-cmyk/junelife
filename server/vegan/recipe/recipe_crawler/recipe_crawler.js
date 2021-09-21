const cheerio = require("cheerio");
const axios = require("axios");
const options = {
  HTMLData: String,
  PerentUl: String,
  ChildrenLi: String,
  title: String,
  url: String,
  image: String,
  grade: String,
  views: String,
};

function crawler() {}

crawler.prototype.getData = async (url) => {
  try {
    return await axios.get(url);
  } catch (e) {
    console.log(e);
  }
};

crawler.prototype.crawling = (HTMLdata) => {
  let recipeList = [];

  const $ = cheerio.load(HTMLdata.data);
  const $bodyList = $("ul.common_sp_list_ul").children("li.common_sp_list_li");

  $bodyList.each(function (i, elem) {
    recipeList[i] = {
      title: $(this)
        .find("div.common_sp_caption .common_sp_caption_tit")
        .text(),
      url: $(this).find("div.common_sp_thumb a").attr("href"),
      image_src: $(this).find("a.common_sp_link img").attr("src"),
      grade: $(this).find("span.common_sp_caption_rv_star img").attr("src"),
      views: $(this)
        .find("div.common_sp_caption_rv .common_sp_caption_buyer")
        .text(),
    };
  });

  return recipeList.filter((n) => n.title);
};

crawler.prototype.log = () => {
  return "testing";
};

module.exports = new crawler();
