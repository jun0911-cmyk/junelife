const chartLabels = [];
const cxt = document.getElementById("consumption_chart").getContext("2d");

const showChart = (data) => {
  new Chart(cxt, {
    type: "line",
    data: data,
    options: {
      animation: true,
      layout: {
        padding: {
          top: 30,
          left: 1050,
        },
      },
    },
  });
};

const createChart = (data, user) => {
  data.forEach((graph_data, index) => {
    chartLabels.push(index + 1 + "일");
    if (chartLabels.length >= data.length) {
      const dataset = {
        labels: chartLabels,
        datasets: [
          {
            label: `평균 ${Math.round(user.diet / 7)}g 섭취 중 줄인 g수`,
            backgroundColor: "green",
            borderColor: "blue",
            data: data,
          },
        ],
      };
      showChart(dataset);
    }
  });
};

const getData = (user) => {
  const graphData = user.graph_diet.split(", ");
  createChart(graphData, user);
};

export default getData;
