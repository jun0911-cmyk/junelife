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
  0: "육류",
  1: "가금류",
  2: "해산물류",
  3: "가공식품류",
  4: "유제품류",
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
              <span>레시피 사이트 : ${view_recipeArr.url}</span></br>
              <span>${view_recipeArr.views}</span></br>
              <span id="${
                view_recipeArr.url
              }#step">추천단계 : 확인하는중</span></br>
              <span id="${
                view_recipeArr.url
              }#point">포인트 : 확인하는중</span></br>
              <span id="${
                view_recipeArr.url
              }#ingredients">분류 : 확인하는중</span></br>
              <span>출처 : ${view_recipeArr.crawling}</span>
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
      `${recipeStep.recipe_url}#point`
    ).innerText = `포인트: 5점`;
  } else if (recipeStep.step == upStep) {
    // setting point
    document.getElementById(
      `${recipeStep.recipe_url}#point`
    ).innerText = `포인트: 15점`;
  }
  // suggestion step
  document.getElementById(
    `${recipeStep.recipe_url}#step`
  ).innerText = `추천단계 : ${recipeStep.step}`;
  // importent ingredients
  document.getElementById(
    `${recipeStep.recipe_url}#ingredients`
  ).innerText = `분류 : ${
    ingredientsParse[veganStep_list.indexOf(recipeStep.step)]
  }`;
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
  for (let i = 0; i < recipe_list.length; i++) {
    if (
      recipe_list[i].data.step == mystep ||
      recipe_list[i].data.step == upStep
    ) {
      appendRecipeCom(recipe_list[i].recipe);
      settingCom(recipe_list[i].data, mystep, upStep);
    }
  }
};

const getVeganStep = async (user_id, recipeList) => {
  const veganData = await $.post("/recipe/step/check", { user_id: user_id });
  if (veganData.status == true) {
    const setStep = settingStep(veganData.rows);
    if (setStep) {
      for (let i = 0; i < recipeList.length; i++) {
        ParseRecipe.push({
          recipe: JSON.parse(recipeList[i].content),
          data: recipeList[i],
        });
        if (ParseRecipe.length >= recipeList.length) {
          getRecipe(ParseRecipe, setStep.mystep, setStep.upStep);
        }
      }
    }
  }
};

export default getVeganStep;
