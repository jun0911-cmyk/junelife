const rankRecipe = [];

const getRanking = (rankList, user) => {
  $.post("/recipe/rank/check", {
    recipeList: rankList,
  }).then((res) => {
    if (res.status == true) {
      res.newRecipe.forEach((recipe) => {
        if (recipe.recipe.step == user.vegan_level) {
          if (recipe.rank >= 4.0) {
            rankRecipe.push(recipe);
            console.log(rankRecipe);
          }
        }
      });
    }
  });
};

export default getRanking;
