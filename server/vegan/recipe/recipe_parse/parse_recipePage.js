const keywords = require("./keyword/keywords.json");
const models = require("../../../database/connect");

const pageArray = [];
const StepArray = [];
const stepObject = {
  meat: "플렉시테리언",
  poultry: "세미베지테리언",
  fish: "페스코베지테리언",
  milk: "락토오보베지테리언",
  egg: "락토베지테리언",
};

const checkStep = (recipe_object) => {
  const getStep = stepObject[recipe_object.keyword];
  return {
    recipe_id: recipe_object.recipe.path,
    keywords: recipe_object.keyword,
    step: getStep,
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
      models.RecipeList.updateOne(
        { recipe_url: getStep.recipe_id },
        { $set: { step: getStep.step } }
      ).then(() => {
        console.log("done", getStep.recipe_id);
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

const getReicpePage = (recipePage) => {
  try {
    getIngredients(recipePage);
    return StepArray;
  } catch (e) {
    console.log(e);
  }
};

module.exports = getReicpePage;
