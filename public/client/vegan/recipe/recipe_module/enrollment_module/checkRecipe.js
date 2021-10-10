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
let ingredient = 0;

const recipePoint = (step, myStep) => {
  if (step > myStep) {
    step = step + 1;
    const getMathPoint = step - myStep;
    const getPoint = getMathPoint * 5;
    return getPoint;
  } else if (step <= myStep) {
    return 5;
  }
};

const findIndex = (user, recipe) => {
  const stepIndex = veganStep_list.indexOf(user.vegan_level);
  const indexStep = veganStep_list.indexOf(recipe.step);
  if (stepIndex != -1 && indexStep != -1) {
    return recipePoint(indexStep, stepIndex);
  }
};

const updateIngredIents = (ing) => {
  $.post("/user/g/update", {
    user_id: localStorage.getItem("accessToken"),
    update_g: ing,
  });
};

const getPoint = (recipe, user, len) => {
  const pointData = findIndex(user, recipe);
  if (pointData) {
    if (recipe.step == user.vegan_level) {
      ingredient = ingredient + recipe.today_g;
    }
    urlList.push(recipe.recipe_url);
    point = point + pointData;
    cnt++;
  }
  // add vegan point
  if (cnt >= len && urlList.length >= len) {
    updateIngredIents(ingredient);
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
        for (let i = 0; i < getRecipe.content.length; i++) {
          const parseRecipe = JSON.parse(getRecipe.content[i].content);
          parseRecipeList.push(parseRecipe);
          if (parseRecipeList.length >= getRecipe.content.length) {
            for (let j = 0; j < selectRecipe.length; j++) {
              const findRecipe = parseRecipeList.findIndex(
                (re) => re.title == selectRecipe[j]
              );
              if (findRecipe != -1) {
                getPoint(getRecipe.content[findRecipe], getUser.rows, len);
              }
            }
          }
        }
      }
    }
  }
};

export default checkRecipe;
