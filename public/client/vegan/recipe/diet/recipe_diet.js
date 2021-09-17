import { recipe_extraction } from "../../diet_module/recipe_extraction.js";
import { step_settingAlgo } from "../../diet_module/diet_algorithm/recipe_step_algo.js";

const accessToken = localStorage.getItem("accessToken");
const accessUser = localStorage.getItem("accessUser");
const next_btn = document.getElementById("next_btn");
const get_recipeName = (e) => {
  var recipe_data = recipe_extraction(next_btn);
  if (recipe_data) {
    step_settingAlgo(recipe_data);
  } else if (!recipe_data) {
    // setting to error-component
    Vue.component("error-component", {
      template: `
            <div id="error" style="color: red; font-size: 20px;">요리명을 입력받을수 없습니다. 페이지의 오류가 발생하였습니다.</div>
          `,
    });
    // recipe_extraction Error send to vue component
    new Vue({
      el: "#diet_input",
    });
  }
};

next_btn.addEventListener("click", get_recipeName);

$(function () {
  $.ajax({
    type: "GET",
    url: "/recipe/diet",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
      xhr.setRequestHeader("User", accessUser);
    },
    datatype: "json",
    success: function (result) {
      if (result.status == false) {
        location.href = "/user/login";
      } else if (result.status == true) {
        if (accessToken) {
          localStorage.setItem("accessToken", accessToken);
        }
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
