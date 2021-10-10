let nowDate = new Date();
let end_time = new Date(
  `${nowDate.getMonth() + 1}/${nowDate.getDate() + 1}/${nowDate.getFullYear()}`
);
let second = 1000;
let minute = second * 60;
let hour = minute * 60;
let day = hour * 24;
// hoisting
var timer;
// show timer
function showRemaining() {
  let now_time = new Date();
  let distance = end_time - now_time;
  if (distance < 0) {
    clearInterval(timer);
    $.post("/user/cleaned", {
      accessToken: localStorage.getItem("accessToken"),
    });
    $.post("/user/today", {
      accessToken: localStorage.getItem("accessToken"),
      status: 0,
    });
    $.post("/user/g/clean", {
      accessToken: localStorage.getItem("accessToken"),
    });
    return;
  }
}

timer = setInterval(showRemaining, 1000);
