const keywords = require("./keyword/keywords.json");
const models = require("../../../database/connect");

const pageArray = [];
const StepArray = [];
const ingredientsObject = {
  meat: 150,
  poultry: 85,
  fish: 85,
  milk: 266.9,
  egg: 56,
};
const stepObject = {
  meat: "플렉시테리언",
  poultry: "세미베지테리언",
  fish: "페스코베지테리언",
  milk: "락토오보베지테리언",
  egg: "락토베지테리언",
};

const checkStep = (recipe_object) => {
  const getStep = stepObject[recipe_object.keyword];
  const setIngredients = ingredientsObject[recipe_object.keyword];
  return {
    recipe_id: recipe_object.recipe.path,
    keywords: recipe_object.keyword,
    step: getStep,
    ingredient: setIngredients,
  };
};

const getKeywordData = (data) => {
  for (let key in keywords) {
    for (let i = 0; i < keywords[key].length; i++) {
      for (let ingredients in data.ingredients) {
        const getIng = data.ingredients[ingredients].indexOf(keywords[key][i]);
        if (getIng != -1) {
          return {
            status: true,
            keyword: key,
            recipe: data,
          };
        }
      }
    }
  }
};

const getIngredientsList = (data) => {
  for (let recipeIdx in data) {
    const result = getKeywordData(data[recipeIdx]);
    if (result) {
      const getStep = checkStep(result);
      models.RecipeList.updateMany(
        { recipe_url: getStep.recipe_id },
        { $set: { today_g: getStep.ingredient, step: getStep.step } }
      ).then(() => {
        models.RecipeList.find().then((recipe) => {
          recipe.forEach((recipeData) => {
            if (recipeData.step == "") {
              models.RecipeList.updateOne(
                { recipe_url: recipeData.recipe_url },
                {
                  $set: { step: "비건" },
                }
              ).then((result) => {
                console.log("done", getStep.recipe_id);
              });
            } else {
              console.log("done", getStep.recipe_id);
            }
          });
        });
      });
    }
  }
};

const getIngredients = (recipe_arr) => {
  const parseJSON = JSON.parse(recipe_arr.content);
  pageArray.push(parseJSON);
  if (pageArray.length >= 60) {
    getIngredientsList(pageArray);
  }
};

const getReicpePage = () => {
  models.RecipePage.find().then((rows) => {
    rows.forEach((recipe) => {
      getIngredients(recipe);
    });
  });
  /*try {
    getIngredients(recipePage);
    return StepArray;
  } catch (e) {
    console.log(e);
  }*/
};

getReicpePage();

// module.exports = getReicpePage;
