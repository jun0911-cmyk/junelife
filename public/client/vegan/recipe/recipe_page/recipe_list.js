$("#search_recode_result").hide();
$("#search_live_result").hide();
$(function () {
  $.ajax({
    type: "GET",
    url: "/recipe",
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
      var err = result.err;
      var status = result.status;
      var accessToken = result.newAccessToken;
      if (status == false || err) {
        location.href = "/user/login";
      } else if (status == true) {
        if (accessToken) {
          localStorage.setItem("accessToken", accessToken);
        }

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

        Vue.component("vegan-component", {
          template: `
                        <div class="vegan_data">
                          <span>포인트 : 10점 <i class="fas fa-circle"></i> 단계 : 락토베지테리언</span>
                        </div>
                    `,
        });

        new Vue({
          el: "#account",
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

function write_button() {
  location.href = `/recipe/write/${localStorage.getItem("accessUser")}`;
}
