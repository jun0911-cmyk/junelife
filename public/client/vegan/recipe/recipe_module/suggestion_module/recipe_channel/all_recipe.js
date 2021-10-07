const appendRecipeCom = (view_recipeArr, recipeData) => {
  $("#write_content").append(`
    <div class="recipe_content" id="recipe_content">
        <div class="image">
          <a href="#">
            <img
              src="${view_recipeArr.image_src}"
              width="300px"
              style="border-radius: 10px 10px 0 0"
            />
          </a>
        </div>
        <div class="info">
          <a href="#">
            <h4 class="info_head">${view_recipeArr.title}</h4>
            <p class="info_sum">
              <span>레시피 사이트 : ${view_recipeArr.url}</span></br>
              <span>${view_recipeArr.views}</span></br>
              <span id="${view_recipeArr.url}#step">추천단계 : ${recipeData.step}</span></br>
              <span id="${view_recipeArr.url}#point">포인트 : 확인하는중</span></br>
              <span id="${view_recipeArr.url}#ingredients">분류 : 확인하는중</span></br>
              <span>출처 : ${view_recipeArr.crawling}</span>
            </p>
          </a>
        </div>
      </div>
    </div>
  `);
};

const allRecipe = (user_id, recipeList) => {
  recipeList.forEach((recipe) => {
    const parse = JSON.parse(recipe.content);
    appendRecipeCom(parse, recipe);
  });
};

export default allRecipe;
