import getIngredients from "../../defult_modules/step.js";

const chartDataSet = [];
const chartLabels = [];

let cnt = 1;

const showChart = (data) => {
  new Chart(document.getElementById("vegan_chart"), {
    type: "line",
    data: data,
    options: {
      animation: true,
      layout: {
        padding: {
          top: 30,
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
        backgroundColor: "greenyellow",
        borderColor: "green",
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

const getChartEL = (elem, user) => {
  const getData = user.graph_diet;
  const getDefaultDiet = user.diet;
  if (getData == "") {
    firstGraph(elem, getDefaultDiet, user);
  } else {
    const splitData = getData.split(", ");
    createDataSet(splitData, getDefaultDiet, user);
  }
};

export default getChartEL;
