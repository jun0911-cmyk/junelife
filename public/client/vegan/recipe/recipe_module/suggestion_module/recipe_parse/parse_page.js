import keywords from "./keyword/keywords.js";

const stepArray = [
  "비건",
  "락토베지테리언",
  "락토오보베지테리언",
  "페스코베지테리언",
  "세미베지테리언",
  "플렉시테리언",
];

const checkString = (ingredients) => {
  ingredients.forEach((ing_list) => {
    const parseStep = ing_list.indexOf(keywords.meat) !== -1;
    if (parseStep != -1) {
      const getIngredents = ingredients[parseStep];
    }
  });
};

export const getIngredents = (recipe_arr) => {
  if (recipe_arr.status == true) {
    recipe_arr.recipePageData.forEach((list) => {
      checkString(list[0].ingredients);
    });
  } else {
    // throw Error
  }
};
