const models = require("../../../../database/connect");
const recipePage = require("./crawling_page");
const Crawler = require("../crawling_manager/crawlingManagement");

const getUrlList = () => {
  return [
    "https://haemukja.com/recipes?utf8=%E2%9C%93?page=2",
    "https://www.10000recipe.com/recipe/list.html?order=reco&page=2",
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
              content: JSON.stringify(data),
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
