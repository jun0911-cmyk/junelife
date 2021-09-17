let recipe_name_list = [];
let vegan_step_list = [];
let recipe_ingredient_list = {};

function vegan_step_prototype(recipe_name) {
  this.recipe_name = recipe_name;
}

vegan_step_prototype.prototype.test = (x) => {
  return x + " test success";
};

export const step_settingAlgo = (recipe_name) => {
  document.getElementById("title").innerText = "비건 단계를 설정하는중 ...";
  getStart(recipe_name);
};
