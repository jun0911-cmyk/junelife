const getProgress = document.getElementById("progressbar");
const progressLabel = document.getElementById("progresslabel");

const progressBar = (user) => {
  const graph_diet = user.graph_diet.split(", ");
  let value =
    (graph_diet[graph_diet.length - 1] / Math.round(user.diet / 7)) * 100;
  let checkValue = 0;
  const id = setInterval(frame, 10);
  function frame() {
    if (checkValue >= value) {
      clearInterval(id);
    } else {
      checkValue++;
      progressLabel.innerHTML = `평균 227g 소비중 ${checkValue}%를 줄이셨습니다.`;
      getProgress.value = checkValue;
      if (checkValue >= 100) {
        progressLabel.innerHTML = `평균 227g 소비중 ${checkValue}%를 줄이셨습니다.</br>축하합니다! 0g을 소비하셨으므로 특별포인트가 지급됩니다!`;
      }
    }
  }
};

export default progressBar;
