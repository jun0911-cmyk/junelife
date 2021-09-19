// diet modules
import {
  investigation_message,
  investigation_error,
  yes_recipe_step,
  no_reicpe_step,
} from "../../diet_module/recipe_investigation.js";

// hide show options
$("#reference_input").hide();
$("#check_diet_btn").hide();

// assignment variable
let radio_change_status = false;
let reference_change_status = 3;
let user_id = null;

// constant variable
const socket = window.io();
const accessToken = localStorage.getItem("accessToken");
const accessUser = localStorage.getItem("accessUser");
const next_btn = document.getElementById("next_btn");
const success_btn = document.getElementById("check_diet_btn");
const radio_event = document.getElementById("radio_input");
const reference_input_event = document.getElementById("reference_input");

// function expression
const radio_status = (bool) => {
  if (bool == true || bool == false) {
    radio_change_status = bool;
  } else {
    return radio_change_status;
  }
};

const reference_data = (number) => {
  if (number) {
    reference_change_status = number;
  } else {
    return reference_change_status;
  }
};

const check_vegan = (user_id) => {
  socket.emit("check_veganStep", user_id);
  // socket event
  socket.on("check_veganStep", (status, rows) => {
    if (status == true) {
      location.href = `/recipe/graph/${accessUser}`;
    }
  });
};

// setting event
radio_event.addEventListener("change", (e) => {
  let target = e.target;
  switch (target.id) {
    case "yes":
      radio_status(true);
      break;
    case "no":
      radio_status(false);
      break;
  }
});

reference_input_event.addEventListener("change", (e) => {
  let target = e.target;
  switch (target.id) {
    case "vm":
      reference_data(1000);
      break;
    case "ma":
      reference_data(500);
      break;
    case "mi":
      reference_data(300);
      break;
    case "sm":
      reference_data(100);
      break;
    case "vm":
      reference_data(100);
      break;
    case "self":
  }
});

next_btn.addEventListener("click", (e) => {
  const status = radio_status();
  no_reicpe_step(status);
});

success_btn.addEventListener("click", (e) => {
  const data = reference_data();
  yes_recipe_step(data, user_id, socket);
});

// ajax communication
$(function () {
  $.ajax({
    type: "GET",
    url: "/recipe/diet",
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
        // call function
        check_vegan(result.user_id);
        investigation_message(result.user_id, socket);
        // token repush
        if (accessToken) {
          localStorage.setItem("accessToken", accessToken);
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
