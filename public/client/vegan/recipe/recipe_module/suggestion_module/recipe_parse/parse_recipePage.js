import keywords from "./keyword/keywords.js";

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

let arrayCnt = 0;
let checkCnt = 0;

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
  for (let key in keywords) {
    for (let i = 0; i < keywords[key].length; i++) {
      if (arrayCnt <= 182) {
        keywordsArray[arrayCnt++] = { key: key, value: keywords[key][i] };
      } else {
        return {
          status: true,
          array: keywordsArray,
        };
      }
    }
  }
};

const getIngredientsList = (data) => {
  for (let recipeIdx in data) {
    for (let ingIdx in data[recipeIdx].ingredients) {
      const result = getKeywordData();
      if (result && result.status == true && checkCnt <= 182) {
        const keywordsData = result.array[checkCnt++];
        console.log(keywordsData);
      }
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
