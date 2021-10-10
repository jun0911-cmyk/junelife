import rankBtnEvent from "../ranking/writeRanking.js";
import step from "../../defult_modules/step.js";

const recipeComponent = (recipe) => {
  $("#content").append(`
    <div class="recipe_content" id="recipe_content">
        <div class="image">
            <img
            src="${recipe.image_src}"
            width="250px"
            style="border-radius: 10px 10px 0 0"
            />
        </div>
        <div class="info">
            <h4 class="info_head">${recipe.title}</h4>
            <p class="info_sub">
                레시피 등록하기 : <input type="checkbox" class="check_btn" id="checked-1" name="chkList"></br>
                레시피 평점남기기 : <button type="button" class="btn btn-primary btn-sm" id="${recipe.url}">평점남기기</button>
            </p>
        </div>
    </div>`);
};

const TodayRecipeComponent = (recipe, recipeData, userStep) => {
  $("#today_content").append(`
    <div class="recipe_content" id="today_recipe_content">
        <div class="image">
            <img
            src="${recipe.image_src}"
            width="250px"
            style="border-radius: 10px 10px 0 0"
            />
        </div>
        <div class="info">
            <h4 class="info_head">${recipe.title}</h4>
            <p class="info_sub">
              지급받은 포인트 : ${step.findIndex(userStep, recipeData)}점</br>
              레시피 단계 : ${recipeData.step}</br>
              레시피 재료 g수 : ${recipeData.today_g}g</br>
              출처 : ${recipe.url}
            </p>
        </div>
    </div>`);
};

const parseRecipe = (recipeList) => {
  recipeList.forEach((recipe) => {
    const parse = JSON.parse(recipe.content);
    recipeComponent(parse);
    rankBtnEvent(parse);
  });
};

const todayRecipe = (recipe, user) => {
  recipe.forEach((recipeData) => {
    const parse = JSON.parse(recipeData.content);
    TodayRecipeComponent(parse, recipeData, user);
  });
};

const callRecipe = async (user_id) => {
  const getRecipe = await $.post("/recipe/visited/get", {
    user_id: user_id,
  });
  const getTodayRecipe = await $.post("/recipe/visited/today/get", {
    user_id: user_id,
  });
  if (getRecipe.status == true) {
    if (getRecipe.content[0] == null) {
      Swal.fire("오늘 확인하신 레시피가 없습니다.", "", "error").then(() => {
        location.href = "/";
      });
    } else {
      // filter overlep recipe
      const recipe = getRecipe.content.filter((item, index) => {
        return (
          getRecipe.content.findIndex(
            (re) => re.recipe_url == item.recipe_url
          ) === index
        );
      });
      // remove to overlep recipe
      parseRecipe(recipe);
      if (getTodayRecipe.status == true) {
        todayRecipe(getTodayRecipe.content, getTodayRecipe.user);
      }
    }
  }
};

export default callRecipe;
