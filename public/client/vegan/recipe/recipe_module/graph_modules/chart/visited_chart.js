const chartLabels = [];
const colorLabels = [];
const dataSets = [];
const cxt = document.getElementById("visite_chart");

const settingDateLabels = (data, visite) => {
  chartLabels.push(data.split(":")[0]);
  dataSets.push(data.split(":")[1]);
};

const settingColorLabels = (index) => {
  const r = () => (Math.random() * 256) >> 0;
  colorLabels.push(`rgb(${r()}, ${r()}, ${r()})`);
};

const showChart = (data) => {
  new Chart(cxt, {
    type: "pie",
    data: data,
    options: {
      responsive: false,
      animation: true,
      plugins: {
        title: {
          display: true,
          text: "하루 평균 레시피 방문율",
        },
      },
    },
  });
};

const createDataSet = (visite, user) => {
  visite.forEach((data, index) => {
    settingDateLabels(data, visite);
    settingColorLabels(index);
    if (chartLabels.length >= visite.length) {
      const dataset = {
        labels: chartLabels,
        datasets: [
          {
            label: `하루 평균 레시피 방문율`,
            backgroundColor: colorLabels,
            data: dataSets,
          },
        ],
      };
      showChart(dataset);
    }
  });
};

const getData = (user) => {
  const getVisiteData = user.visite_recipe;
  if (getVisiteData != "") {
    const splitVisite = getVisiteData.split(", ");
    createDataSet(splitVisite, user);
  }
};

export default getData;
