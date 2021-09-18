class recipe_list {
  constructor() {
    this.recipeName_list = ["test"];
    this.veganStep_list = ["test"];
    this.recipeIngredient_list = ["test"];
  }
  getReicpeList() {
    let recipe_object = {
      recipeName: this.recipeName_list,
      veganStep: this.veganStep_list,
      recipeIngredient: this.recipeIngredient_list,
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
