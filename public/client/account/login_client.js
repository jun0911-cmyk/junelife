const login_btn = document.getElementById("login_btn");
const accessToken = localStorage.getItem("accessToken");
const accessUser = localStorage.getItem("accessUser");

$("#faild_login").hide();

$(function () {
  $.ajax({
    type: "GET",
    url: "/user/login",
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

  $(document).on("click", "#login_btn", function () {
    $.ajax({
      url: "/user/login",
      datatype: "json",
      type: "POST",
      data: {
        user_id: $("#id").val(),
        password: $("#password").val(),
      },
      success: function (result) {
        var err = result.err;
        var auth = result.auth;
        var token = result.token;
        if (err) {
          console.log(err);
        } else if (!err) {
          if (auth == 1) {
            login_btn.disabled = true;
            $("#faild_login").show();
            setTimeout(function () {
              login_btn.disabled = false;
              $("#faild_login").hide();
            }, 2000);
          } else if (auth == 0) {
            if (token.status == true) {
              localStorage.setItem("accessToken", token.access);
              localStorage.setItem("accessUser", token.user_id);
            }
            location.href = "/";
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

  $(document).on("keydown", function (event) {
    if (event.key == "Enter") {
      $.ajax({
        url: "/user/login",
        datatype: "json",
        type: "POST",
        data: {
          user_id: $("#id").val(),
          password: $("#password").val(),
        },
        success: function (result) {
          var err = result.err;
          var auth = result.auth;
          var token = result.token;
          if (err) {
            console.log(err);
          } else if (!err) {
            if (auth == 1) {
              login_btn.disabled = true;
              $("#faild_login").show();
              setTimeout(function () {
                login_btn.disabled = false;
                $("#faild_login").hide();
              }, 2000);
            } else if (auth == 0) {
              if (token.status == true) {
                localStorage.setItem("accessToken", token.access);
                localStorage.setItem("accessUser", token.user_id);
              }
              location.href = "/";
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
    }
  });
});
