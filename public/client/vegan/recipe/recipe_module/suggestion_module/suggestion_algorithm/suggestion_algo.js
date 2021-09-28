import getReicpePage from "../recipe_parse/parse_recipePage.js";

class Step {
  constructor() {
    this.veganStep_list = [
      "비건",
      "락토베지테리언",
      "락토오보베지테리언",
      "페스코베지테리언",
      "세미베지테리언",
      "플렉시테리언",
    ];
  }
  settingStep(veganData) {
    const mystep = veganData.vegan_level;
    const upCheckStep = this.veganStep_list.indexOf(mystep);
    if (upCheckStep != -1) {
      const upStep = this.veganStep_list[upCheckStep + 1];
      if (upStep) {
        return {
          mystep,
          upStep,
        };
      }
    }
  }
}

const ParseRecipe = [];
const recipeStepArray = [];

const appendRecipeCom = (view_recipeArr) => {
  $("#write_content").append(`
    <div class="recipe_content">
        <div class="image">
          <a href="https://${view_recipeArr.crawling + view_recipeArr.url}">
            <img
              src="${view_recipeArr.image_src}"
              width="300px"
              style="border-radius: 10px 10px 0 0"
            />
          </a>
        </div>
        <div class="info">
          <a href="https://${view_recipeArr.crawling + view_recipeArr.url}">
            <h4 class="info_head">${view_recipeArr.title}</h4>
            <p class="info_sum">
              레시피 사이트 : ${view_recipeArr.url}</br>
              ${view_recipeArr.views}</br>
              <span id="${view_recipeArr.url}">추천단계 : 확인하는중</span></br>
              포인트 : 확인하는중</br>
              주요재료 : 확인하는중</br>
              출처 : ${view_recipeArr.crawling}
            </p>
          </a>
        </div>
      </div>
    </div>
  `);
};

const settingCom = (recipeStep) => {
  recipeStepArray.push(recipeStep);
  document.getElementById(
    recipeStep.recipe_id
  ).innerText = `추천단계 : ${recipeStep.step}`;
  if (recipeStepArray.length >= 34) {
    document.getElementById(
      "cnt_recipe"
    ).innerText = `레시피추천횟수 : ${recipeStepArray.length}회`;
  }
};

const getRecipe = async (recipe_list, mystep, upStep) => {
  const getStep = await getReicpePage();
  for (let i = 0; i < getStep.length; i++) {
    if (getStep[i].step == mystep || getStep[i].step == upStep) {
      const findStepRecipe = recipe_list.find(
        (el) => el.url == getStep[i].recipe_id
      );
      appendRecipeCom(findStepRecipe);
      settingCom(getStep[i]);
    }
  }
};

const getVeganStep = async (user_id, recipeList) => {
  const veganData = await $.post("/recipe/step/check", { user_id: user_id });
  if (veganData.status == true) {
    const step = new Step();
    const setStep = step.settingStep(veganData.rows);
    if (setStep) {
      for (let i = 0; i < recipeList.length; i++) {
        ParseRecipe.push(JSON.parse(recipeList[i].content));
        if (ParseRecipe.length >= recipeList.length) {
          getRecipe(ParseRecipe, setStep.mystep, setStep.upStep);
        }
      }
    }
  }
};

export default getVeganStep;
