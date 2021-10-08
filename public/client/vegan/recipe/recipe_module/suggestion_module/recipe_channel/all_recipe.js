const stepList = [
  "플렉시테리언",
  "세미베지테리언",
  "페스코베지테리언",
  "락토오보베지테리언",
  "락도베지테리언",
  "비건",
];

const idList = [
  "flex_content",
  "sami_content",
  "pasco_content",
  "loctoovo_content",
  "locto_content",
  "vegan_content",
];

const ingredientsParse = {
  0: "육류",
  1: "가금류",
  2: "해산물류",
  3: "가공식품류",
  4: "유제품류",
};

const point = (step, myStep) => {
  if (step > myStep) {
    step = step + 1;
    const getMathPoint = step - myStep;
    const getPoint = getMathPoint * 5;
    return getPoint;
  } else if (step <= myStep) {
    return 5;
  }
};

const getUser = async (user_id) => {
  const user = await $.post("/recipe/step/check", {
    user_id: user_id,
  });
  if (user.status == true) {
    const stepIndex = stepList.indexOf(user.rows.vegan_level);
    return {
      step: stepIndex,
      user: user.rows,
    };
  }
};

const appendRecipeCom = (view_recipeArr, recipeData, id, point) => {
  $(`#${id}`).append(`
    <div class="recipe_content" id="recipe_content">
        <div class="image">
          <a href="#">
            <img
              src="${view_recipeArr.image_src}"
              width="300px"
              style="border-radius: 10px 10px 0 0"
            />
          </a>
        </div>
        <div class="info">
          <a href="#">
            <h4 class="info_head">${view_recipeArr.title}</h4>
            <p class="info_sum">
              <span>레시피 사이트 : ${view_recipeArr.url}</span></br>
              <span>${view_recipeArr.views}</span></br>
              <span id="${view_recipeArr.url}#step">추천단계 : ${
    recipeData.step
  }</span></br>
                          <span id="${
                            view_recipeArr.url
                          }#point">포인트 : ${point}점</span></br>
                          <span id="${view_recipeArr.url}#ingredients">분류 : ${
    ingredientsParse[stepList.indexOf(recipeData.step)]
  }</span></br>
              <span>출처 : ${view_recipeArr.crawling}</span>
            </p>
          </a>
        </div>
      </div>
    </div>
  `);
};

const allRecipe = async (user_id, recipeList) => {
  const userData = await getUser(user_id);
  recipeList.forEach((recipe) => {
    const parse = JSON.parse(recipe.content);
    const indexStep = stepList.indexOf(recipe.step);
    if (indexStep != -1) {
      const recipePoint = point(indexStep, userData.step);
      appendRecipeCom(parse, recipe, idList[indexStep], recipePoint);
    }
  });
};

export default allRecipe;
