import { checkStep } from "../recipe/recipe_module/suggestion_module/check_step.js";
import Mapapi from "../restaurant/api/create_map.js";

const accessToken = localStorage.getItem("accessToken");
const accessUser = localStorage.getItem("accessUser");
const checkLocalStorage = () => {
  const search_length = localStorage.getItem("search");
  if (search_length == null || search_length == undefined) {
    localStorage.setItem("search", 500);
  }
};

$(function () {
  $.ajax({
    type: "GET",
    url: "/restaurant",
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
        checkLocalStorage();
        checkStep(user_id);
        Mapapi();
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
