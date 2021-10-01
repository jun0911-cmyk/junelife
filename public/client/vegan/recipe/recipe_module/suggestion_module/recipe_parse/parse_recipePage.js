import keywords from "./keyword/keywords.js";

const keywordSetArray = ["meat", "poultry", "fish", "milk", "egg"];
const pageArray = [];
const keywordsArray = [];
const StepArray = [];
const stepObject = {
  meat: "플렉시테리언",
  poultry: "세미베지테리언",
  fish: "페스코베지테리언",
  milk: "락토오보베지테리언",
  egg: "락토베지테리언",
};

const getError = () => {
  alert("데이터를 가져오는중 에러가 발생하였습니다.");
};

const checkStep = (recipe_object) => {
  for (let i = 0; i < recipe_object.length; i++) {
    const getStep = stepObject[recipe_object[i].keyword];
    StepArray.push({
      recipe_id: recipe_object[i].recipe.path,
      keywords: recipe_object[i].keyword,
      step: getStep,
    });
    if (StepArray.length >= recipe_object.length) {
      return StepArray;
    }
  }
};

const getKeywordData = () => {
  const getKeys = Object.keys(keywords);
  for (let i = 0; i < getKeys.length; i++) {
    for (let j = 0; j < keywords[getKeys[i]].length; j++) {
      keywordsArray[getKeys[i]] = keywords[getKeys[i]][j];
      console.log(keywordsArray);
    }
  }
};

const getIngredientsList = (data) => {
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].ingredients.length; j++) {
      const keywordData = getKeywordData();
    }
  }
};

const getIngredients = (recipe_arr) => {
  recipe_arr.forEach((list) => {
    const parseJSON = JSON.parse(list.content);
    pageArray.push(parseJSON);
    if (pageArray.length >= 60) {
      getIngredientsList(pageArray);
    }
  });
};

const getReicpePage = async () => {
  try {
    const recipePage = await $.post("/recipe/crawling/page");
    if (recipePage.status == true) {
      getIngredients(recipePage.data);
      return StepArray;
    } else {
      getError();
    }
  } catch (e) {
    console.log(e);
  }
};

export default getReicpePage;
