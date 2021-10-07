const veganStep_list = [
  "플렉시테리언",
  "세미베지테리언",
  "페스코베지테리언",
  "락토오보베지테리언",
  "락토베지테리언",
  "비건",
];

const getStep = (user) => {
  const mystep = user.vegan_level;
  const upCheckStep = veganStep_list.indexOf(mystep);
  if (upCheckStep != -1) {
    const upStep = veganStep_list[upCheckStep + 1];
    if (upStep) {
      return {
        mystep,
        upStep,
      };
    }
  }
};

const getPoint = (recipe, step) => {
  if (recipe.step == step.mystep) {
    return 5;
  } else if (recipe.step == step.upStep) {
    return 15;
  }
};

export default { getPoint, getStep };
