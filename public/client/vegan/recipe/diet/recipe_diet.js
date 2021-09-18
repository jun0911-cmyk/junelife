import { recipe_extraction } from "../../diet_module/recipe_extraction.js";
import { step_settingAlgo } from "../../diet_module/diet_algorithm/recipe_step_algo.js";
import {
  error_message,
  first_title_message,
} from "../../diet_module/recipe_investigation.js";

const accessToken = localStorage.getItem("accessToken");
const accessUser = localStorage.getItem("accessUser");
const next_btn = document.getElementById("next_btn");
const get_recipeName = (e) => {
  var recipe_data = recipe_extraction(next_btn);
  if (recipe_data) {
    step_settingAlgo(recipe_data);
  } else if (!recipe_data) {
    error_message();
  }
};

const call_postAjax = (user_id) => {
  $.ajax({
    type: "POST",
    url: "/recipe/diet",
    datatype: "json",
    data: {
      user_id: user_id,
    },
    success: function (result) {
      let status = result.status;
      let message = result.message;
      console.log(status, message);
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
        call_postAjax(result.user_id);
        first_title_message("육류");
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
