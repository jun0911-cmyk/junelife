const recipeComponent = (recipe) => {
  $("#content").append(`
    <div class="recipe_content" id="recipe_content">
        <div class="image">
            <img
            src="${recipe.image_src}"
            width="250px"
            style="border-radius: 10px 10px 0 0"
            />
        </div>
        <div class="info">
            <h4 class="info_head">${recipe.title}</h4>
            <p class="info_sub">
                레시피 등록하기 : <input type="checkbox" class="check_btn" id="checked-1" name="chkList"></br>
                레시피 평점남기기 : <button type="button" class="btn btn-primary btn-sm">평점남기기</button>
            </p>
        </div>
    </div>`);
};

const parseRecipe = (recipeList) => {
  recipeList.forEach((recipe) => {
    const parse = JSON.parse(recipe.content);
    recipeComponent(parse);
  });
};

const callRecipe = async (user_id) => {
  const getRecipe = await $.post("/recipe/visited/get", {
    user_id: user_id,
  });
  if (getRecipe.status == true) {
    if (getRecipe.content[0] == null) {
      alert("오늘 확인하신 레시피가 없습니다.");
      location.href = "/";
    } else {
      parseRecipe(getRecipe.content);
    }
  }
};

export default callRecipe;
