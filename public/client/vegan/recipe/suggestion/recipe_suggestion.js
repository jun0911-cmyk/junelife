import { checkStep } from "../recipe_module/suggestion_module/check_step.js";
import recipeChannel from "../recipe_module/suggestion_module/recipe_channel/management/channel_manage.js";

const accessToken = localStorage.getItem("accessToken");
const accessUser = localStorage.getItem("accessUser");

const sendRecipe = (user_id) => {
  document.getElementById("now").addEventListener("click", (e) => {
    document.getElementById("all").disabled = false;
    document.getElementById("now").disabled = true;
    recipeChannel.resentRecipe(user_id);
  });

  document.getElementById("all").addEventListener("click", async (e) => {
    const recipeList = await $.post("/recipe/crawling/data");
    if (recipeList.status == true) {
      document.getElementById("all").disabled = true;
      document.getElementById("now").disabled = false;
      recipeChannel.allRecipe(user_id, recipeList.data);
    }
  });
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
        recipeChannel.suggRecipe(user_id);
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
