import vegan_components from "../recipe_module/enrollment_module/components/recipe_components.js";
import recipe_list from "../recipe_module/enrollment_module/components/call_visite_recipe.js";
import check_recipe from "../recipe_module/enrollment_module/checkRecipe.js";
import timer from "../recipe_module/enrollment_module/recipe_timer.js";

const accessToken = localStorage.getItem("accessToken");
const accessUser = localStorage.getItem("accessUser");
const enrollment = document.getElementById("enrollment");

let user_id = null;

const checkBtn = async () => {
  const getData = await $.post("/user/today/get", {
    accessToken: accessToken,
  });
  if (getData.status == true) {
    if (getData.rows.register_today == 1) {
      $("#timer").show();
      $("#message").hide();
      document.getElementById("timer").innerText =
        "레시피를 이미 등록하셨습니다.";
      document.getElementById("enrollment").disabled = true;
    } else {
      $("#timer").hide();
      document.getElementById("message").innerText =
        "레시피를 등록할 수 있습니다!";
      document.getElementById("message").style.color = "blue";
      document.getElementById("enrollment").disabled = false;
    }
  }
};

enrollment.addEventListener("click", (e) => {
  const recipe_len = $("input:checkbox[name=chkList]:checked").length;
  if (recipe_len > 3) {
    Swal.fire("레시피는 최대 3개까지만 등록할수 있습니다.", "", "error");
  } else if (recipe_len <= 3) {
    check_recipe(
      $("input:checkbox[name=chkList]:checked"),
      user_id,
      recipe_len
    );
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
        user_id = result.user_id;
        timer();
        checkBtn();
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
