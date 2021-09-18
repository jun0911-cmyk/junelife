class recipe_list {
  constructor(recipe_name) {
    this.recipeName_list = recipe_name;
    this.veganStep_list = [
      "플렉시테리언",
      "세미베지테리언",
      "페스코베지테리언",
      "락토오보베지테리언",
      "락토베지테리언",
      "비건",
    ];
    this.recipeIngredient_object = {
      flexitarian: ["육류", "가금류", "생선", "계란", "우유"],
      semivegetarian: ["가금류", "생선", "계란", "우유"],
      pescovegetarian: ["생선", "우유", "계란"],
      lactoovovegetarian: ["우유", "계란"],
      lactovegetarian: ["계란"],
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

function vegan_step_prototype() {}

vegan_step_prototype.prototype.settingStep = (step_arr) => {
  console.log(step_arr);
  const recipe_object = recipeList.getReicpeList();
  console.log(recipe_object);
};

export const settingStep = (step_arr) => {
  let recipePrototype = new vegan_step_prototype();
  recipePrototype.settingStep(step_arr);
};
