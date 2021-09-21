import { checkStep } from "../recipe_module/suggestion_module/check_step.js";

const accessToken = localStorage.getItem("accessToken");
const accessUser = localStorage.getItem("accessUser");
const socket = window.io();

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
      // call function
      checkStep(user_id, socket);
      // check vegan step
      if (status == false) {
        location.href = "/user/login";
      } else {
        // set account component
        Vue.component("account-component", {
          template: `
                        <div class="dropdown">
                            <a href="javascript:void(0)" class="singup">
                                <i class="fas fa-user-circle" style="font-size: 27px; margin-top: 10px"></i>
                            </a>
                            <div class="dropdown-content">
                                <a href="/student/check/class">내 비건정보</a>
                                <a href="#">내 정보</a>
                                <a href="#">정보 변경</a>
                                <a href="/user/logout">로그아웃<i class="fas fa-sign-out-alt"></i></a>
                            </div>
                        </div>
                    `,
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
