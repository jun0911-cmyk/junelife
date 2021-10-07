const torrDate = () => {
  let nowDate = new Date();
  let end_time = new Date(
    `${nowDate.getMonth() + 1}/${
      nowDate.getDate() + 1
    }/${nowDate.getFullYear()}`
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
      return;
    }
    let days = Math.floor(distance / day);
    let hours = Math.floor((distance % day) / hour);
    let minutes = Math.floor((distance % hour) / minute);
    let seconds = Math.floor((distance % minute) / second);

    document.getElementById("timer").innerHTML = days + "일 ";
    document.getElementById("timer").innerHTML += hours + "시간 ";
    document.getElementById("timer").innerHTML += minutes + "분 ";
    document.getElementById("timer").innerHTML +=
      seconds + "초 후에 재등록 할수 있습니다.";
  }

  timer = setInterval(showRemaining, 1000);
};

export default torrDate;
