const accessToken = localStorage.getItem("accessToken");
const accessUser = localStorage.getItem("accessUser");

$(function () {
  $.ajax({
    type: "GET",
    url: "/recipe/suggestion",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
      xhr.setRequestHeader("User", accessUser);
    },
    datatype: "json",
    success: function (result) {
      if (result.status == false) {
        location.href = "/user/login";
      } else {
        if (result.status == 0) {
          location.href = "/";
        } else if (result.status == 1) {
          location.href = "/test";
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
