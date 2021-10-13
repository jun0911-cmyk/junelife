const gramList = [];
const animalName = document.getElementById("animal_name");
const animalData = document.getElementById("animal_data");
const animalToday = document.getElementById("animal_today");
const intakteData = document.getElementById("data_intake");

const veganStepList = [
  "플렉시테리언",
  "세미베지테리언",
  "페스코베지테리언",
  "락토오보베지테리언",
  "락토베지테리언",
  "비건",
];

const ingredientList = [
  "육류",
  "가금류",
  "해산물",
  "가공식품류",
  "유제품류",
  "채소류",
];

const animalList = [
  "돼지(고기 1인분)",
  "닭",
  "생선",
  "돼지(가공육)",
  "병아리",
  "보존성공",
];
const animalDataList = [150, 900, 159, 226.9, 56, 0];

let gramData = 0;

const getData = (user) => {
  const defaultData = user.diet / 7;
  const getAnimal = animalList[veganStepList.indexOf(user.vegan_level)];
  const getIngredients =
    ingredientList[veganStepList.indexOf(user.vegan_level)];
  const getData = animalDataList[veganStepList.indexOf(user.vegan_level)];
  return {
    default: defaultData,
    animalName: getAnimal,
    animalData: getData,
    ingredient: getIngredients,
  };
};

const setIntakeData = (user, data, datas) => {
  const averageData =
    data.reduce((p, c) => Number(p) + Number(c), 0) / data.length;
  const convertFloat = parseFloat(averageData).toFixed(2);
  intakteData.innerHTML = `${user.user_id}님의 하루 평균 감소한 ${datas.ingredient} 소비량은 ${convertFloat}g 입니다.`;
};

const getUser = (user) => {
  const graphData = user.graph_diet.split(", ");
  const datas = getData(user);
  graphData.forEach((data, index) => {
    gramData = Number(gramData) + Number(data);
    gramList.push(true);
    if (gramList.length == graphData.length) {
      if (datas.animalData <= gramData) {
        animalData.innerHTML = `보존한 마리수 : ${
          datas.animalName
        } 약 ${Math.round(
          gramData / datas.animalData
        )}마리를 환경파괴에서 구출하셨습니다!`;
      }
      animalName.innerHTML = `보존한 동물 분류 : ${datas.animalName}`;
      animalToday.innerHTML = `1일부터 ${gramList.length}일까지 ${datas.ingredient} 섭취를 총 ${gramData}g 만큼 줄이셨습니다!`;
      setIntakeData(user, graphData, datas);
    }
  });
};

export default getUser;
