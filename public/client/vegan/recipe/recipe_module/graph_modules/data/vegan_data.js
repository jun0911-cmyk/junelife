const gramList = [];

const veganStepList = [
  "플렉시테리언",
  "세미베지테리언",
  "페스코베지테리언",
  "락토오보베지테리언",
  "락토베지테리언",
  "비건",
];

const animalList = ["고기 1인분", "닭", "생선", "암소", "병아리", "보존성공"];

const getUser = (user) => {
  const graphData = user.graph_diet.split(", ");
  const defaultData = user.diet / 7;
  const getAnimal = animalList[veganStepList.indexOf(user.vegan_level)];
  graphData.forEach((data, index) => {
    gramList.push(defaultData - data);
    if (gramList.length >= graphData.length) {
      console.log(gramList);
    }
  });
};

export default getUser;
