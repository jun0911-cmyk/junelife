const selectRecipe = [];
const parseRecipeList = [];
const pointList = [];
const veganStep_list = [
  "플렉시테리언",
  "세미베지테리언",
  "페스코베지테리언",
  "락토오보베지테리언",
  "락토베지테리언",
  "비건",
];

const getPoint = (recipeStep, step, user) => {
  if (recipeStep.step == step.mystep) {
    pointList.push(5);
  } else if (recipeStep.step == step.upStep) {
    pointList.push(15);
  }
  // add vegan point
  if (pointList.length >= 3) {
    const veganPoint = pointList[0] + pointList[1] + pointList[2];
    alert(`축하합니다! ${veganPoint}점이 추가로 지급되었습니다!`);
    $.post("/user/point", {
      accessToken: localStorage.getItem("accessToken"),
      nowPoint: user.vegan_point,
      newPoint: veganPoint,
    });
    $.post("/user/today/append", {
      accessToken: localStorage.getItem("accessToken"),
    });
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

const checkRecipe = async (el, user_id) => {
  for (let i = 0; i < 3; i++) {
    const getEl = el.eq(i);
    const elParent = getEl.parent();
    const changeInfo = elParent.parent();
    const infoChild = changeInfo.children();
    const getTitle = infoChild.eq(0).text();
    selectRecipe.push(getTitle);
    if (selectRecipe.length >= 3) {
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
                getPoint(getRecipe.content[findRecipe], stepList, getUser.rows);
              }
            }
          }
        }
      }
    }
  }
};

export default checkRecipe;
