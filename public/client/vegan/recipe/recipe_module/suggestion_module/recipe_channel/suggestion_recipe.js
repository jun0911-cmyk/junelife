import setRecipe from "./recipe_component/recipe_component.js";
import suggAlgo from "../suggestion_algorithm/suggestion_algo.js";

const stepList = [
  "플렉시테리언",
  "세미베지테리언",
  "페스코베지테리언",
  "락토오보베지테리언",
  "락토베지테리언",
  "비건",
];

const createComponent = (user) => {
  new Vue({
    el: "#sugg_recipe",
    template: `
    <div class="main_recipe">
        <div class="sugg">
            <div class="recipe_text">
                <h2 class="recipe_title">${user.user.vegan_level} 단계를 위한 추천레시피!</h2>
                <hr />
            </div>
            <div class="recipe_container" id="sugg_content"></div>
            <hr />
        </div>
    </div>
    `,
  });
};

const suggRecipe = async (user_id) => {
  const userData = await setRecipe.getUser(user_id);
  const rankData = await setRecipe.getRanking();
  await createComponent(userData);
  suggAlgo(rankData, userData.user);
};

export default suggRecipe;
