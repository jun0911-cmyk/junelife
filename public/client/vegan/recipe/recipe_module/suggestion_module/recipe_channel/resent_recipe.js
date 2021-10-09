import setRecipe from "./recipe_component/recipe_component.js";

const stepList = [
  "플렉시테리언",
  "세미베지테리언",
  "페스코베지테리언",
  "락토오보베지테리언",
  "락토베지테리언",
  "비건",
];

const createComponent = () => {
  document.getElementById("com_recipe").innerHTML = `
    <div class="main_recipe">
        <div class="now">
            <div class="recipe_text">
                <h2 class="recipe_title">최근 레시피 목록</h2>
                <hr />
            </div>
            <div class="recipe_container" id="now_content"></div>
            <hr />
        </div>
        <div class="old">
            <div class="recipe_text">
                <h2 class="recipe_title">예전 레시피 목록</h2>
                <hr />
            </div>
            <div class="recipe_container" id="old_content"></div>
            <hr />
        </div>
    </div>`;
};

const resentRecipe = async (user_id) => {
  createComponent();
  const userData = await setRecipe.getUser(user_id);
  const rankData = await setRecipe.getRanking();
  const resentRecipe = await $.post("/recipe/resent");
  if (resentRecipe.status == true) {
    resentRecipe.recipe.forEach((recipeData) => {
      const parse = JSON.parse(recipeData.recipe.content);
      const indexStep = stepList.indexOf(recipeData.recipe.step);
      if (indexStep != -1) {
        const recipePoint = setRecipe.point(indexStep, userData.step);
        if (recipeData.date == true) {
          setRecipe.appendRecipeCom(
            parse,
            recipeData.recipe,
            "now_content",
            recipePoint
          );
          setRecipe.settingComponent(resentRecipe.recipe.length, rankData);
        } else if (recipeData.date == false) {
          setRecipe.appendRecipeCom(
            parse,
            recipeData.recipe,
            "old_content",
            recipePoint
          );
          setRecipe.settingComponent(resentRecipe.recipe.length, rankData);
        }
      }
    });
  }
};

export default resentRecipe;
