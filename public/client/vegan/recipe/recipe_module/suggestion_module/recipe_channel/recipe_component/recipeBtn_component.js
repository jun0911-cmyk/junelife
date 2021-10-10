import recipeChannel from "../management/channel_manage.js";

const firstLoadRecipe = async (user_id) => {
  const recipeList = await $.post("/recipe/crawling/data");
  if (recipeList.status == true) {
    document.getElementById("all").disabled = true;
    document.getElementById("all").style.color = "green";
    recipeChannel.allRecipe(user_id, recipeList.data);
  }
};

const ManageMentColor = (choose, hidec, hidec2) => {
  document.getElementById(choose).style.color = "green";
  document.getElementById(hidec).style.color = "black";
  document.getElementById(hidec2).style.color = "black";
};

const sendRecipe = (user_id) => {
  // now recipe
  document.getElementById("now").addEventListener("click", (e) => {
    document.getElementById("all").disabled = false;
    document.getElementById("sugg").disabled = false;
    document.getElementById("now").disabled = true;
    ManageMentColor("now", "all", "sugg");
    recipeChannel.resentRecipe(user_id);
  });
  // all recipe
  document.getElementById("all").addEventListener("click", async (e) => {
    const recipeList = await $.post("/recipe/crawling/data");
    if (recipeList.status == true) {
      document.getElementById("all").disabled = true;
      document.getElementById("sugg").disabled = false;
      document.getElementById("now").disabled = false;
      ManageMentColor("all", "now", "sugg");
      recipeChannel.allRecipe(user_id, recipeList.data);
    }
  });
  // sugg recipe
  document.getElementById("sugg").addEventListener("click", (e) => {
    document.getElementById("sugg").disabled = true;
    document.getElementById("all").disabled = false;
    document.getElementById("now").disabled = false;
    ManageMentColor("sugg", "all", "now");
    recipeChannel.suggRecipe(user_id);
  });
};

export default { sendRecipe, firstLoadRecipe };
