import recipeChannel from "../management/channel_manage.js";

const firstLoadRecipe = async (user_id) => {
  const recipeList = await $.post("/recipe/crawling/data");
  if (recipeList.status == true) {
    document.getElementById("all").disabled = true;
    document.getElementById("sugg").disabled = false;
    document.getElementById("now").disabled = false;
    recipeChannel.allRecipe(user_id, recipeList.data);
  }
};

const sendRecipe = (user_id) => {
  // now recipe
  document.getElementById("now").addEventListener("click", (e) => {
    document.getElementById("all").disabled = false;
    document.getElementById("sugg").disabled = false;
    document.getElementById("now").disabled = true;
    recipeChannel.resentRecipe(user_id);
  });
  // all recipe
  document.getElementById("all").addEventListener("click", async (e) => {
    const recipeList = await $.post("/recipe/crawling/data");
    if (recipeList.status == true) {
      document.getElementById("all").disabled = true;
      document.getElementById("sugg").disabled = false;
      document.getElementById("now").disabled = false;
      recipeChannel.allRecipe(user_id, recipeList.data);
    }
  });
  // sugg recipe
  document.getElementById("sugg").addEventListener("click", (e) => {
    document.getElementById("sugg").disabled = true;
    document.getElementById("all").disabled = false;
    document.getElementById("now").disabled = false;
    recipeChannel.suggRecipe(user_id);
  });
};

export default { sendRecipe, firstLoadRecipe };
