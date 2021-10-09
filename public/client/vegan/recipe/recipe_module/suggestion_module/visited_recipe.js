const veganStep_list = [
  "플렉시테리언",
  "세미베지테리언",
  "페스코베지테리언",
  "락토오보베지테리언",
  "락토베지테리언",
  "비건",
];

const ingredientsParse = {
  0: "육류",
  1: "가금류",
  2: "해산물류",
  3: "가공식품류",
  4: "유제품류",
};

const recipepageComponent = (user, recipe, point) => {
  const parseRecipe = JSON.parse(recipe.content);
  Vue.component("page-component", {
    template: `
      <div class="sub_page">
        <span>"${parseRecipe.title}" 레시피 상세정보</span></br>
        <img src="${
          parseRecipe.image_src
        }" style="margin-top: 2%; border-radius: 5px;" />
        <div class="page_content">
          <div class="now_page">
            <p>현재 포인트 : ${user.vegan_point}점 + ${point}</p>
            <p>연결사이트 : ${parseRecipe.url}</p>
            <p>주요재료 : ${
              ingredientsParse[veganStep_list.indexOf(recipe.step)]
            } / ${600}g</p>
            <p>레시피 단계 : ${recipe.step}</p>
            <p>레시피 방문횟수 : ${user.visite_recipe}회 + 1</p>
          </div>
          <div class="btn">
            <button type="button" class="btn btn-primary btn-sm" id="recipe_rander">이동하기</button>
            <button type="button" class="btn btn-primary btn-sm" id="rank">평점남기기</button>
            <button type="button" class="btn btn-secondary btn-sm" id="recipe_clean">취소하기</button>
          </div>
        </div>
      </div>
    `,
  });

  new Vue({
    el: "#sub_page",
  });

  return true;
};

const getRecipeData = (recipeUrl) => {
  return $.post("/recipe/get", {
    req_url: recipeUrl,
    user_id: localStorage.getItem("accessToken"),
  });
};
// recipe clean btn
const btnEvent = (recipe, reqUrl) => {
  document.getElementById("recipe_rander").addEventListener("click", (e) => {
    $.post("/recipe/visited/update", {
      user_id: localStorage.getItem("accessToken"),
      choose_url: reqUrl,
    }).then((res) => {
      const status = res.status;
      if (status == true) {
        location.href = `https://${recipe.crawling + recipe.url}`;
      }
    });
  });

  document.getElementById("recipe_clean").addEventListener("click", (e) => {
    location.reload();
  });
};

$(document).on("click", "#recipe_content", async function () {
  const getElement = $(this);
  const getChildren = getElement.children();
  const information = getChildren.eq(1);
  const infoChildren = information.children();
  const changeAteg = infoChildren.children();
  const recipeTitleChild = changeAteg.eq(1).children();
  const getPoints = recipeTitleChild.eq(4).text();
  const getRecipeUrl = recipeTitleChild.eq(0).text();
  const splitURl = getRecipeUrl.split(":");
  // check mesasge (test)
  const recipeData = await getRecipeData(splitURl[1]);
  if (recipeData) {
    const status = recipepageComponent(
      recipeData.user,
      recipeData.recipe,
      getPoints.split(":")[1]
    );
    if (status == true) {
      btnEvent(JSON.parse(recipeData.recipe.content), splitURl[1]);
    }
  }
});
