import vegan_components from "../recipe_module/enrollment_module/recipe_components.js";
import recipe_list from "../recipe_module/enrollment_module/call_visite_recipe.js";
import check_recipe from "../recipe_module/enrollment_module/checkRecipe.js";

const accessToken = localStorage.getItem("accessToken");
const accessUser = localStorage.getItem("accessUser");
const enrollment = document.getElementById("enrollment");

enrollment.addEventListener("click", (e) => {
  const recipe_len = $("input:checkbox[name=chkList]:checked").length;
  if (recipe_len < 3) {
    alert("등록하실 레시피 3개를 선택해주세요.");
  } else if (recipe_len > 3) {
    alert("레시피는 최대 3개까지만 등록할수 있습니다.");
  } else if (recipe_len == 3) {
    check_recipe($("input:checkbox[name=chkList]:checked"));
  }
});

$(function () {
  $.ajax({
    type: "GET",
    url: "/recipe/enrollment",
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
        const user_id = result.user_id;
        vegan_components(user_id);
        recipe_list(user_id);
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
