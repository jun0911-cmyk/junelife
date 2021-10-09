const veganStep = [
  "비건",
  "락토베지테리언",
  "락토오보베지테리언",
  "페스코베지테리언",
  "세미베지테리언",
  "플렉시테리언",
];

const recipeIngredient = {
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

const ingredientsList = [
  "채소",
  "유제품류",
  "가공식품류",
  "해산물",
  "가금류",
  "육류",
];

function vegan_step_prototype() {}

vegan_step_prototype.prototype.settingStep = (step_arr) => {
  const get_veganStep = veganStep[step_arr.length];
  return get_veganStep;
};

vegan_step_prototype.prototype.setIngredIents = (vegan_step, g_data) => {
  let ingredients = ingredientsList[veganStep.indexOf(vegan_step)];
  if (ingredients) {
    if (ingredients == "육류") {
      return g_data * 150;
    } else if (ingredients == "가금류") {
      return g_data * 700;
    } else if (ingredients == "해산물") {
      return g_data * 159;
    } else if (ingredients == "가공식품류") {
      return g_data * 5279;
    } else if (ingredients == "유제품류") {
      return g_data * 56;
    }
  }
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
  const getGdata = recipePrototype.setIngredIents(getVeganStep, g_data);
  const save_veganData = await recipePrototype.save(
    getVeganStep,
    getGdata,
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
  return recipeIngredient["flexitarian"];
};
