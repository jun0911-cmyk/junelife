class recipe_list {
  constructor() {
    this.veganStep_list = [
      "비건",
      "락토베지테리언",
      "락토오보베지테리언",
      "페스코베지테리언",
      "세미베지테리언",
      "플렉시테리언",
    ];
    this.recipeIngredient_object = {
      flexitarian: [
        "육류",
        "가금류(닭고기, 오리고기,등)",
        "생선(해산물)",
        "우유(가공식품류)",
        "계란(유제품)",
      ],
      semivegetarian: ["가금류(닭고기, 오리고기,등)", "생선", "우유", "계란"],
      pescovegetarian: ["생선(해산물)", "우유", "계란"],
      lactoovovegetarian: ["우유(가공식품류)", "계란"],
      lactovegetarian: ["계란(유제품)"],
    };
  }
  getReicpeList() {
    let recipe_object = {
      veganStep: this.veganStep_list,
      recipeIngredient: this.recipeIngredient_object,
    };
    return recipe_object;
  }
}

const recipeList = new recipe_list();

function vegan_step_prototype() {}

vegan_step_prototype.prototype.settingStep = (step_arr) => {
  const recipe_object = recipeList.getReicpeList();
  const get_veganStep = recipe_object.veganStep[step_arr.length];
  return get_veganStep;
};

vegan_step_prototype.prototype.save = async (vegan_step, g_data, user_id) => {
  if (user_id != null) {
    document.getElementById("title").innerText = `단계 저장중...`;
    const save = await $.post("/recipe/step/save", {
      user_id: user_id,
      vegan_step: vegan_step,
      g_data: g_data,
    });
    return save.status;
  } else {
    return null;
  }
};

export const settingStep = async (step_arr, g_data, user_id) => {
  const recipePrototype = new vegan_step_prototype();
  const getVeganStep = recipePrototype.settingStep(step_arr);
  const save_veganData = await recipePrototype.save(
    getVeganStep,
    g_data,
    user_id
  );
  // socket event call check
  if (save_veganData == true) {
    return getVeganStep;
  } else if (save_veganData == false) {
    return null;
  }
};

export const getVeganList = () => {
  const getList = recipeList.getReicpeList();
  return getList.recipeIngredient["flexitarian"];
};
