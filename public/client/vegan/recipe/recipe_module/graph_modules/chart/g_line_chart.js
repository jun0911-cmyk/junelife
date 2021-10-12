import getIngredients from "../../defult_modules/step.js";

const chartDataSet = [];
const chartLabels = [];

let cnt = 1;

const showChart = (data) => {
  new Chart(document.getElementById("vegan_chart").getContext("2d"), {
    type: "bar",
    data: data,
    options: {
      animation: true,
      layout: {
        padding: {
          top: 30,
          right: 900,
        },
      },
    },
  });
};

const setChart = (dataset, labels, ing) => {
  const data = {
    labels: labels,
    datasets: [
      {
        label: `하루 ${ing}섭취 g수`,
        backgroundColor: "green",
        borderColor: "greenyellow",
        data: dataset,
      },
    ],
  };
  showChart(data);
};

const createDataSet = (graphData, defaultData, user) => {
  graphData.forEach((data) => {
    const splitData = defaultData / 7;
    const getData = splitData - data;
    if (data == 0) {
      chartDataSet.push(0);
      chartLabels.push(`${cnt++}` + "일");
    } else {
      chartDataSet.push(getData);
      chartLabels.push(`${cnt++}` + "일");
    }
    // check
    if (chartDataSet.length == graphData.length) {
      const ingredients = getIngredients.getIngredients(user);
      setChart(chartDataSet, chartLabels, ingredients);
    }
  });
};

const firstGraph = () => {
  Swal.fire(
    "그래프를 불러올수 없습니다.",
    "아직 설정해진 데이터가 없으므로 그래프를 그릴수 없습니다. 레시피 페이지로 이동됩니다.",
    "error"
  ).then(() => {
    location.href = "/recipe";
  });
};

const getChartEL = (elem, user) => {
  const getData = user.graph_diet;
  const getDefaultDiet = user.diet;
  if (getData == "") {
    firstGraph();
  } else {
    const splitData = getData.split(", ");
    createDataSet(splitData, getDefaultDiet, user);
  }
};

export default getChartEL;
