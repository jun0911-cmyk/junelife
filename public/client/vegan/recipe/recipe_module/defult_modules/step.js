const veganStep_list = [
  "플렉시테리언",
  "세미베지테리언",
  "페스코베지테리언",
  "락토오보베지테리언",
  "락토베지테리언",
  "비건",
];

const recipePoint = (step, myStep) => {
  if (step > myStep) {
    step = step + 1;
    const getMathPoint = step - myStep;
    const getPoint = getMathPoint * 5;
    return getPoint;
  } else if (step <= myStep) {
    return 5;
  }
};

const findIndex = (user, recipe) => {
  const stepIndex = veganStep_list.indexOf(user.vegan_level);
  const indexStep = veganStep_list.indexOf(recipe.step);
  if (stepIndex != -1 && indexStep != -1) {
    return recipePoint(indexStep, stepIndex);
  }
};

export default { findIndex };
