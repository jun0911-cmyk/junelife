const cheerio = require("cheerio");
const axios = require("axios");

function PageCrawler() {}

PageCrawler.prototype.getData = async (url) => {
  try {
    return await axios.get(url);
  } catch (e) {
    console.log(e);
  }
};

PageCrawler.prototype.crawling10000RecipePage = (HTMLdata) => {
  const reicpe10000PageData = [];
  const re1ingredientsData = [];
  const regax = /\s/gi;
  const $ = cheerio.load(HTMLdata.data);
  const $bodyList = $("div.container").children("div.col-xs-9");
  const $ingredients = $("div.ready_ingre3 ul a li");

  $ingredients.each(function (i, elem) {
    const data = $(this).text().replace(regax, "");
    re1ingredientsData.push(data);
  });

  $bodyList.each(function (i, elem) {
    reicpe10000PageData[i] = {
      title: $(this).find("div.view2_summary h3").text(),
      ingredients: re1ingredientsData,
      crawling: `${HTMLdata.request.socket.servername}`,
      path: `${HTMLdata.request.path}`,
    };
  });

  return reicpe10000PageData.filter((n) => n.title);
};

PageCrawler.prototype.crawlingHaemukjaPage = (HTMLdata) => {
  const reicpeHaemukjaPageData = [];
  const HaeingredientsData = [];
  const regax = /\s/gi;
  const $ = cheerio.load(HTMLdata.data);
  const $bodyList = $("div.ly_recipe").children("div.view_recipe");
  const $ingredients = $("ul.lst_ingrd li span");

  $ingredients.each(function (i, elem) {
    const data = $(this).text().replace(regax, "");
    HaeingredientsData.push(data);
  });

  $bodyList.each(function (i, elem) {
    reicpeHaemukjaPageData[i] = {
      title: $(this).find("div.top h1 strong").text(),
      ingredients: HaeingredientsData,
      crawling: `${HTMLdata.request.socket.servername}`,
      path: `${HTMLdata.request.path}`,
    };
  });

  return reicpeHaemukjaPageData.filter((n) => n.title);
};

PageCrawler.prototype.crawlingCjTheKitchenPage = (HTMLdata) => {
  const reicpeCjPageData = [];
  const CjingredientsData = [];
  const regax = /\s/gi;
  const $ = cheerio.load(HTMLdata.data);
  const $bodyList = $("div.container").children("div.wrap");
  const $ingredients = $("div.ingredients-toggle p");

  $ingredients.each(function (i, elem) {
    const data = $(this).text().replace(regax, "");
    CjingredientsData.push(data.split(","));
  });

  $bodyList.each(function (i, elem) {
    reicpeCjPageData[i] = {
      title: $(this)
        .find("div.recipe-caption h3.title")
        .text()
        .replace(regax, ""),
      ingredients: CjingredientsData[0],
      crawling: `${HTMLdata.request.socket.servername}`,
      path: `${HTMLdata.request.path}`,
    };
  });

  return reicpeCjPageData.filter((n) => n.title);
};

PageCrawler.prototype.log = () => {
  return "testing";
};

module.exports = new PageCrawler();
