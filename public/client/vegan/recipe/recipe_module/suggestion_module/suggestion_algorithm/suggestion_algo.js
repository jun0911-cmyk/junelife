let rankRecipe = [];
let status = false;

const shuffleRecipe = (recipeList) => {
  return recipeList.sort(() => Math.random() - 0.5);
};

const getRanking = async (rankList, user) => {
  const res = await $.post("/recipe/rank/check", {
    recipeList: rankList,
  });
  // check
  if (res.status == true) {
    const shuffle = shuffleRecipe(res.newRecipe);
    for (let recipe in shuffle) {
      if (
        shuffle[recipe].recipe.step == user.vegan_level &&
        shuffle[recipe].rank >= 4.0
      ) {
        rankRecipe.push(shuffle[recipe]);
        if (status == true) {
          status = false;
          rankRecipe = [];
        }
        // status array check
        if (rankRecipe.length == 3) {
          status = true;
          return rankRecipe;
        }
      }
    }
  }
};

export default getRanking;
