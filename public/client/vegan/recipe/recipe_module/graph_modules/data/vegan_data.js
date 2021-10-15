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

const animalList = ["돼지", "닭", "생선", "돼지(가공육)", "병아리", "보존성공"];

const animalImage = [
  "https://us.123rf.com/450wm/zhenyakot/zhenyakot2003/zhenyakot200300024/144133785-.jpg?ver=6",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcUSabn94TzN-2LHS-GKAPFEirNTaUUpHcpQ&usqp=CAU",
  "https://www.newsjeju.net/news/photo/202010/352162_435491_5127.jpg",
];

const animalDataList = [1500, 900, 159, 226.9, 56, 0];
const co2List = [2100, 1016];

let gramData = 0;

$("#down").show();
$("#up").hide();

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

const convertFarm = (datas, notGram) => {
  $("#down").hide();
  $("#up").show();
  const farm = notGram / 20;
  console.log(notGram);
  const newImage = document.getElementById("image");
  const cnt = document.getElementById("count");
  const co2 = document.getElementById("co2");
  newImage.innerHTML = `<img src=${animalImage[2]} width="320px" height="240px" />`;
  cnt.innerHTML = `농장 ${Math.floor(farm)}개를 제거하셨습니다!<br>나무 ${
    Math.floor(farm) + 5
  }ha(${Math.floor(farm) * 15000}그루)를 보호하셨습니다.`;
  co2.style.color = "blue";
  co2.style.marginLeft = "35%";
  co2.style.marginTop = "-10%";
  co2.innerHTML = `탄산가스 ${Math.floor(farm) * 80}톤획득!<br>이산화탄소 ${
    Math.floor(farm) * 15000 * 2.5
  }톤 획득!`;
};

const convertData = (datas, gramData) => {
  const src = animalImage[animalList.indexOf(datas.animalName)];
  const co2Data = co2List[animalList.indexOf(datas.animalName)];
  const notGram = Math.round(gramData / datas.animalData);
  if (notGram >= 20) {
    convertFarm(datas, notGram);
  } else {
    const newImage = document.getElementById("image");
    const cnt = document.getElementById("count");
    const co2 = document.getElementById("co2");
    newImage.innerHTML = `<img src=${src} width="320px" height="240px" />`;
    cnt.innerHTML = `${datas.animalName} ${notGram}마리를 보호하셨습니다.`;
    co2.innerHTML = `${co2Data * notGram}Co2 감소`;
  }
};

const getUser = (user) => {
  const graphData = user.graph_diet.split(", ");
  const datas = getData(user);
  graphData.forEach((data, index) => {
    gramData = Number(gramData) + Number(data);
    gramList.push(true);
    if (gramList.length == graphData.length) {
      if (datas.animalData <= gramData) {
        if (datas.animalName == "돼지" || datas.animalName == "닭") {
          convertData(datas, gramData);
        }
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
