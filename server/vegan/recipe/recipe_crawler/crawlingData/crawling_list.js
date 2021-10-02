const models = require("../../../../database/connect");
const recipePage = require("./crawling_page");
const Crawler = require("../crawling_manager/crawlingManagement");

const getUrlList = () => {
  return [
    "https://www.cj.co.kr/kr/k-food-life/cj-the-kitchen/recipe",
    "https://haemukja.com/recipes",
    "https://www.10000recipe.com/recipe/list.html",
  ];
};

const saveRecipe = (recipe) => {
  recipe.forEach((data) => {
    models.RecipeList.findOne({
      recipe_url: data.url,
    })
      .then((rows) => {
        if (!rows) {
          try {
            recipePage(`https://${data.crawling + data.url}`);
            new models.RecipeList({
              recipe_url: data.url,
              step: "",
              rank: 0,
              main_ingredients: "",
              favorite_people: 0,
              content: JSON.stringify(data),
            }).save();
          } catch (e) {
            throw Error("fail save reicpe Error");
          }
        } else if (rows) {
          recipePage(`https://${data.crawling + data.url}`);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

const getRecipe = async () => {
  console.log("get Url List Success");
  const urlList = getUrlList();
  const recipeList = await Crawler.RecipeList(urlList);
  if (recipeList) {
    console.log("get Recipe List Crawling Success");
    const pushReicpe = recipeList.Recipe10000.concat(
      recipeList.Haemukja,
      recipeList.CjTheKitChen
    );
    if (pushReicpe.length >= 60) {
      console.log("call saveRecipe function success");
      saveRecipe(pushReicpe);
    }
  }
};

getRecipe();
