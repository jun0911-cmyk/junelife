$("#search_recode_result").hide();
$("#search_live_result").hide();
$(function () {
  $.ajax({
    type: "GET",
    url: "/",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.setRequestHeader(
        "Authorization",
        "Bearer " + localStorage.getItem("accessToken")
      );
      xhr.setRequestHeader("User", localStorage.getItem("accessUser"));
    },
    datatype: "json",
    success: function (result) {
      const err = result.err;
      const status = result.status;
      const user_id = result.user_id;
      const accessToken = result.newAccessToken;
      if (status == false || err) {
        location.href = "/user/login";
      } else if (status == true) {
        if (accessToken) {
          localStorage.setItem("accessToken", accessToken);
        }
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
        // get VeganLevelDB
        const checkStep = $.post("/recipe/step/check", {
          user_id: user_id,
        });

        checkStep
          .then((data) => {
            if (data.status == true) {
              Vue.component("vegan-component", {
                template: `
                        <div class="vegan_info">
                          <span>포인트 : ${data.rows.vegan_point}점 <i class="fas fa-circle"></i> 단계 : ${data.rows.vegan_level}</span>
                        </div>
                    `,
              });

              new Vue({
                el: "#account",
              });
            } else {
              Vue.component("vegan-component", {
                template: `
                        <div class="vegan_info">
                          <span>포인트 : 없음 <i class="fas fa-circle"></i> 단계 : 설정되지않음</span>
                        </div>
                    `,
              });

              new Vue({
                el: "#account",
              });
            }
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
