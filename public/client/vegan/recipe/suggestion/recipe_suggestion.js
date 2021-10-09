import { checkStep } from "../recipe_module/suggestion_module/check_step.js";
import recipeBtnLoad from "../recipe_module/suggestion_module/recipe_channel/recipe_component/recipeBtn_component.js";

const accessToken = localStorage.getItem("accessToken");
const accessUser = localStorage.getItem("accessUser");

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
        recipeBtnLoad.firstLoadRecipe(user_id);
        recipeBtnLoad.sendRecipe(user_id);
        // resent recipe check
        $.post("/recipe/resent/check");
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
