import { checkStep } from "../recipe_module/suggestion_module/check_step.js";
import RecipeViews from "../recipe_module/suggestion_module/suggestion_algorithm/suggestion_algo.js";
import recipeChannel from "../recipe_module/suggestion_module/recipe_channel/all_recipe.js";

const accessToken = localStorage.getItem("accessToken");
const accessUser = localStorage.getItem("accessUser");

const sendRecipe = async (user_id) => {
  const recipeList = await $.post("/recipe/crawling/data");
  if (recipeList.status == true) {
    recipeChannel(user_id, recipeList.data);
  } else {
    alert("데이터를 가져올수 없습니다");
  }
};

$(function () {
  $.ajax({
    type: "GET",
    url: "/recipe",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
      xhr.setRequestHeader("User", accessUser);
    },
    datatype: "json",
    success: function (result) {
      const status = result.status;
      const user_id = result.user_id;
      const accessToken = result.newAccessToken;
      // check vegan step
      if (status == false) {
        location.href = "/user/login";
      } else if (status == true) {
        if (accessToken) {
          localStorage.setItem("accessToken", accessToken);
        }
        // call function setting component
        checkStep(user_id);
        sendRecipe(user_id);
      }
    },
    error: function (request, status, error) {
      console.log("서버 통신중 오류가 발생하였습니다.");
      console.log(
        "code:" +
          request.status +
          "\n" +
          "message:" +
          request.responseText +
          "\n" +
          "error:" +
          error
      );
    },
  });
});
