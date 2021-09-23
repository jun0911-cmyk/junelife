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

crawler.prototype.crawling10000Recipe = (HTMLdata) => {
  const reicpe10000List = [];
  const $ = cheerio.load(HTMLdata.data);
  const $bodyList = $("ul.common_sp_list_ul").children("li.common_sp_list_li");
  $bodyList.each(function (i, elem) {
    reicpe10000List[i] = {
      title: $(this)
        .find("div.common_sp_caption .common_sp_caption_tit")
        .text(),
      url: $(this).find("div.common_sp_thumb a").attr("href"),
      image_src: $(this).find("a.common_sp_link img").attr("src"),
      views: $(this)
        .find("div.common_sp_caption_rv .common_sp_caption_buyer")
        .text(),
      crawling: `${HTMLdata.request.socket.servername}`,
    };
  });

  return reicpe10000List.filter((n) => n.title);
};

crawler.prototype.crawlingHaemukja = (HTMLdata) => {
  const HaemukjsReicpeList = [];
  const $ = cheerio.load(HTMLdata.data);
  const $bodyList = $("ul.lst_recipe").children("li");

  $bodyList.each(function (i, elem) {
    HaemukjsReicpeList[i] = {
      title: $(this).find("a.call_recipe strong").text(),
      url: $(this).find("a.call_recipe").attr("href"),
      image_src: $(this).find("a.call_recipe img").attr("src"),
      views: $(this).find("span.judge strong").text(),
      crawling: `${HTMLdata.request.socket.servername}`,
    };
  });

  return HaemukjsReicpeList.filter((n) => n.title);
};

crawler.prototype.crawlingCjTheKitchen = (HTMLdata) => {
  const CjReicpeList = [];
  const $ = cheerio.load(HTMLdata.data);
  const $bodyList = $("div.grid").children("div.col");

  $bodyList.each(function (i, elem) {
    CjReicpeList[i] = {
      title: $(this).find("div.recipe-kind h3").text(),
      url: $(this).find("a.anchor-focus").attr("href"),
      image_src: $(this).find("div.pic img").attr("src"),
      views: "불러올수없음",
      crawling: `${HTMLdata.request.socket.servername}`,
    };
  });

  return CjReicpeList.filter((n) => n.title);
};

crawler.prototype.log = () => {
  return "testing";
};

module.exports = new crawler();
