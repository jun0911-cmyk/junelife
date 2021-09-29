import getReicpePage from "../recipe_parse/parse_recipePage.js";

const ParseRecipe = [];
const recipeStepArray = [];
const veganStep_list = [
  "플렉시테리언",
  "세미베지테리언",
  "페스코베지테리언",
  "락토오보베지테리언",
  "락토베지테리언",
  "비건",
];

const ingredientsParse = {
  meat: "육류",
  poultry: "가금류",
  fish: "해산물류",
  milk: "가공식품류",
  egg: "유제품류",
};

const settingStep = (veganData) => {
  const mystep = veganData.vegan_level;
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

const appendRecipeCom = (view_recipeArr) => {
  $("#write_content").append(`
    <div class="recipe_content" id="recipe_content">
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
              <span id="${
                view_recipeArr.url
              }#step">추천단계 : 확인하는중</span></br>
              <span id="${
                view_recipeArr.url
              }#point">포인트 : 확인하는중</span></br>
              <span id="${
                view_recipeArr.url
              }#ingredients">주요재료 : 확인하는중</span></br>
              출처 : ${view_recipeArr.crawling}
            </p>
          </a>
        </div>
      </div>
    </div>
  `);
};

const recipeViewData = (recipeStep, mystep, upStep) => {
  if (recipeStep.step == mystep) {
    // setting point
    document.getElementById(
      `${recipeStep.recipe_id}#point`
    ).innerText = `포인트: 5점`;
  } else if (recipeStep.step == upStep) {
    // setting point
    document.getElementById(
      `${recipeStep.recipe_id}#point`
    ).innerText = `포인트: 15점`;
  }
  // suggestion step
  document.getElementById(
    `${recipeStep.recipe_id}#step`
  ).innerText = `추천단계 : ${recipeStep.step}`;
  // importent ingredients
  document.getElementById(
    `${recipeStep.recipe_id}#ingredients`
  ).innerText = `주요재료 : ${ingredientsParse[recipeStep.keywords]}`;
};

const settingCom = (recipeStep, mystep, upStep) => {
  recipeStepArray.push(recipeStep);
  recipeViewData(recipeStep, mystep, upStep);
  if (recipeStepArray.length >= recipeStepArray.length) {
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
      settingCom(getStep[i], mystep, upStep);
    }
  }
};

const getVeganStep = async (user_id, recipeList) => {
  const veganData = await $.post("/recipe/step/check", { user_id: user_id });
  if (veganData.status == true) {
    const setStep = settingStep(veganData.rows);
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
