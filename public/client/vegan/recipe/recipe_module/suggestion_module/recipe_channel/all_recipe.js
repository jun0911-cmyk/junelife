import setRecipe from "./recipe_component/recipe_component.js";

const stepList = [
  "플렉시테리언",
  "세미베지테리언",
  "페스코베지테리언",
  "락토오보베지테리언",
  "락토베지테리언",
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

const createComponent = () => {
  new Vue({
    el: "#all_recipe",
    template: `
    <div class="main_recipe">
          <div class="flex">
            <div class="recipe_text">
              <h2 class="recipe_title">플렉시테리언 레시피 목록</h2>
              <hr />
            </div>
            <div class="recipe_container" id="flex_content"></div>
            <hr />
          </div>
          <div class="sami">
            <div class="recipe_text">
              <h2 class="recipe_title">세미베지테리언 레시피 목록</h2>
              <hr />
            </div>
            <div class="recipe_container" id="sami_content"></div>
            <hr />
          </div>
          <div class="pasco">
            <div class="recipe_text">
              <h2 class="recipe_title">페스코베지테리언 레시피 목록</h2>
              <hr />
            </div>
            <div class="recipe_container" id="pasco_content"></div>
            <hr />
          </div>
          <div class="loctoovo">
            <div class="recipe_text">
              <h2 class="recipe_title">락토오보베지테리언 레시피 목록</h2>
              <hr />
            </div>
            <div class="recipe_container" id="loctoovo_content"></div>
            <hr />
          </div>
          <div class="locto">
            <div class="recipe_text">
              <h2 class="recipe_title">락토베지테리언 레시피 목록</h2>
              <hr />
            </div>
            <div class="recipe_container" id="locto_content"></div>
            <hr />
          </div>
          <div class="vegan">
            <div class="recipe_text">
              <h2 class="recipe_title">비건 레시피 목록</h2>
              <hr />
            </div>
            <div class="recipe_container" id="vegan_content"></div>
            <hr />
          </div>
        </div>
    `,
  });
};

const allRecipe = async (user_id, recipeList) => {
  createComponent();
  const userData = await setRecipe.getUser(user_id);
  const rankData = await setRecipe.getRanking();
  recipeList.forEach((recipe) => {
    const parse = JSON.parse(recipe.content);
    const indexStep = stepList.indexOf(recipe.step);
    if (indexStep != -1) {
      const recipePoint = setRecipe.point(indexStep, userData.step);
      setRecipe.appendRecipeCom(parse, recipe, idList[indexStep], recipePoint);
      setRecipe.settingComponent(recipeList.length, rankData);
    }
  });
};

export default allRecipe;
