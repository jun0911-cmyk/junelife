const selectRecipe = [];
const parseRecipeList = [];
const urlList = [];
const veganStep_list = [
  "플렉시테리언",
  "세미베지테리언",
  "페스코베지테리언",
  "락토오보베지테리언",
  "락토베지테리언",
  "비건",
];

let point = 0;
let cnt = 0;

const getPoint = (recipe, step, user, len) => {
  urlList.push(recipe.recipe_url);
  if (recipe.step == step.mystep) {
    point = point + 5;
    cnt++;
  } else if (recipe.step == step.upStep) {
    point = point + 15;
    cnt++;
  }
  // add vegan point
  if (cnt >= len && urlList.length >= len) {
    const setVeganPoint = user.vegan_point + point;
    if (setVeganPoint >= 500) {
      alert(`축하합니다! ${step.upStep}단계로 올라가셨습니다!`);
      $.post("/recipe/step/update", {
        user_id: user.user_id,
        step: step.upStep,
        recipe: urlList.join(", "),
      });
      $.post("/user/today", {
        accessToken: localStorage.getItem("accessToken"),
        status: 1,
      });
    } else if (setVeganPoint < 500) {
      alert(`축하합니다! ${point}점이 추가로 지급되었습니다!`);
      $.post("/user/point", {
        user_id: user.user_id,
        point: setVeganPoint,
        recipe: urlList.join(", "),
      });
      $.post("/user/today", {
        accessToken: localStorage.getItem("accessToken"),
        status: 1,
      });
    }
    location.reload();
  }
};

const getStep = (user) => {
  const mystep = user.vegan_level;
  const upCheckStep = veganStep_list.indexOf(mystep);
  if (upCheckStep != -1) {
    const upStep = veganStep_list[upCheckStep + 1];
    if (upStep) {
      return {
        mystep,
        upStep,
      };
    }
  }
};

const checkRecipe = async (el, user_id, len) => {
  for (let i = 0; i < len; i++) {
    const getEl = el.eq(i);
    const elParent = getEl.parent();
    const changeInfo = elParent.parent();
    const infoChild = changeInfo.children();
    const getTitle = infoChild.eq(0).text();
    selectRecipe.push(getTitle);
    if (selectRecipe.length >= len) {
      const getRecipe = await $.post("/recipe/visited/get", {
        user_id: user_id,
      });
      const getUser = await $.post("/recipe/step/check", {
        user_id: user_id,
      });
      if (getRecipe.status == true && getUser.status == true) {
        const stepList = getStep(getUser.rows);
        for (let i = 0; i < getRecipe.content.length; i++) {
          const parseRecipe = JSON.parse(getRecipe.content[i].content);
          parseRecipeList.push(parseRecipe);
          if (parseRecipeList.length >= getRecipe.content.length) {
            for (let j = 0; j < selectRecipe.length; j++) {
              const findRecipe = parseRecipeList.findIndex(
                (re) => re.title == selectRecipe[j]
              );
              if (findRecipe != -1) {
                getPoint(
                  getRecipe.content[findRecipe],
                  stepList,
                  getUser.rows,
                  len
                );
              }
            }
          }
        }
      }
    }
  }
};

export default checkRecipe;
