const faild_message = document.getElementById("faild_singup");
const singup_btn = document.getElementById("singup_btn");
const accessToken = localStorage.getItem("accessToken");
const accessUser = localStorage.getItem("accessUser");

$("#faild_singup").hide();

$(function () {
  $.ajax({
    type: "GET",
    url: "/user/singup",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.setRequestHeader("Authorization", "Bearer " + accessToken);
      xhr.setRequestHeader("User", accessUser);
    },
    datatype: "json",
    success: function (result) {
      if (result.status == true) {
        location.href = "/";
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

  $(document).on("click", "#singup_btn", function () {
    $.ajax({
      type: "POST",
      url: "/user/singup",
      data: {
        user_id: $("#id").val(),
        username: $("#username").val(),
        email: $("#email").val(),
        password: $("#password").val(),
        repassword: $("#re_password").val(),
      },
      datatype: "json",
      success: function (result) {
        var status = result.status_code;
        var singup_message = result.msg;

        if (status == 1) {
          faild_message.innerText = singup_message;
          singup_btn.disabled = true;
          $("#faild_singup").show();
          setTimeout(function () {
            singup_btn.disabled = false;
            $("#faild_singup").hide();
          }, 2000);
        } else if (status == 0) {
          location.href = "/user/login";
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

  $(document).on("keydown", function (event) {
    if (event.key == "Enter") {
      $.ajax({
        url: "/user/singup",
        datatype: "json",
        type: "POST",
        data: {
          user_id: $("#id").val(),
          username: $("#username").val(),
          email: $("#email").val(),
          password: $("#password").val(),
          repassword: $("#re_password").val(),
        },
        success: function (result) {
          var status = result.status_code;
          var singup_message = result.msg;

          if (status == 1) {
            faild_message.innerText = singup_message;
            singup_btn.disabled = true;
            $("#faild_singup").show();
            setTimeout(function () {
              singup_btn.disabled = false;
              $("#faild_singup").hide();
            }, 2000);
          } else if (status == 0) {
            location.href = "/user/login";
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
    }
  });
});
