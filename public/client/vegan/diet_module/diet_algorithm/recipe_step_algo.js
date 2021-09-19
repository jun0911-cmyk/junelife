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
      flexitarian: ["육류", "가금류", "생선", "우유", "계란"],
      semivegetarian: ["가금류", "생선", "우유", "계란"],
      pescovegetarian: ["생선", "우유", "계란"],
      lactoovovegetarian: ["우유", "계란"],
      lactovegetarian: ["계란"],
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

vegan_step_prototype.prototype.save = (vegan_step, g_data, user_id, socket) => {
  socket.emit("save_step", vegan_step, g_data, user_id);
  // socket event
  socket.on("save_step", (status, err) => {
    if (status == true) {
      return true;
    } else {
      return false;
    }
  });
};

export const settingStep = (step_arr, g_data, user_id, socket) => {
  new Promise(async (resolve, reject) => {
    const recipePrototype = await new vegan_step_prototype();
    const getVeganStep = await recipePrototype.settingStep(step_arr);
    const save_veganData = await recipePrototype.save(
      getVeganStep,
      g_data,
      user_id,
      socket
    );
    resolve(save_veganData);
  })
    .then((save_veganData) => {
      if (save_veganData == true) {
        return getVeganStep;
      } else if (save_veganData == false) {
        return false;
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getVeganList = () => {
  const getList = recipeList.getReicpeList();
  return getList.recipeIngredient["flexitarian"];
};
