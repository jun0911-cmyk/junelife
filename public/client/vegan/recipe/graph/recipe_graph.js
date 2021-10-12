import { checkStep } from "../recipe_module/suggestion_module/check_step.js";
import graph from "../recipe_module/graph_modules/chart/manage/graph_manage.js";
import veganData from "../recipe_module/graph_modules/data/vegan_data.js";

const accessToken = localStorage.getItem("accessToken");
const accessUser = localStorage.getItem("accessUser");
const gram_Chart = document.getElementById("vegan_chart");

const getUserData = async (user_id) => {
  const user = await $.post("/recipe/step/check", { user_id: user_id });
  if (user.status == true) {
    return user.rows;
  }
};

const sendMessage = (user) => {
  document.getElementById(
    "title_msg"
  ).innerText = `${user.user_id}님의 현재 ${user.vegan_level} 그래프`;
};

$(function () {
  $.ajax({
    type: "GET",
    url: "/recipe/graph",
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
        getUserData(user_id)
          .then((user) => {
            checkStep(user_id);
            sendMessage(user);
            veganData(user);
            graph.gramGraph(gram_Chart, user);
            graph.consumptionGraph(user);
            graph.progressBar(user);
            graph.veganData(user)
          })
          .catch((err) => {
            console.log(err);
          });
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
