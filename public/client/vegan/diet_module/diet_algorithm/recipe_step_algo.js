class recipe_list {
  constructor(recipe_name) {
    this.recipeName_list = recipe_name;
    this.veganStep_list = [
      "플렉시테리언",
      "폴로베지테리언",
      "페스코베지테리언",
      "락토오보베지테리언",
      "오보베지테리언",
      "락토베지테리언",
      "비건",
    ];
    this.recipeIngredient_object = {
      flexitarian: ["소고기", "닭고기", "생선", "단백질", "칼슘", "야채"],
      pollovegetarian: ["닭고기", "생선", "단백질", "칼슘", "야채"],
      pescovegetarian: ["생선", "단백질", "칼슘", "야채"],
      lactoovovegetarian: ["단백질", "칼슘", "야채"],
      ovovegetarian: ["칼슘", "단백질"],
      lactovegetarian: ["칼슘", "야채"],
      vegan: ["야채"],
    };
  }
  getReicpeList() {
    let recipe_object = {
      recipeName: this.recipeName_list,
      veganStep: this.veganStep_list,
      recipeIngredient: this.recipeIngredient_object,
    };
    return recipe_object;
  }
}

const recipeList = new recipe_list();

console.log(recipeList.getReicpeList());

function vegan_step_prototype(recipe_name) {
  return recipe_name;
}

vegan_step_prototype.prototype.test = (x) => {
  return x + " test success";
};

export const step_settingAlgo = (recipe_name) => {
  document.getElementById("title").innerText = "비건 단계를 설정하는중 ...";
  let recipe = new vegan_step_prototype(recipe_name);
  console.log(recipe);
};
