import keywords from "./keyword/keywords.js";

const checkString = (data) => {
  for (let i = 0; i < data.ingredients.length; i++) {
    const getData = data.ingredients[i].indexOf(keywords.meat[0]);
    if (getData != -1) {
      console.log(data);
    }
  }
};

export const getIngredients = (recipe_arr) => {
  recipe_arr.forEach((list) => {
    const parseJSON = JSON.parse(list.content);
    checkString(parseJSON);
  });
};
