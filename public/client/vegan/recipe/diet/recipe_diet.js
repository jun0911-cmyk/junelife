import { proccing } from "../../diet_module/split_recipe.js";

const accessToken = localStorage.getItem("accessToken");
const accessUser = localStorage.getItem("accessUser");
const next_btn = document.getElementById("next_btn");

next_btn.addEventListener("click", (e) => {
  var recipe_data = proccing(next_btn);
  if (recipe_data) {
    // do
  } else if (!recipe_data) {
    // catch
  }
});

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
