const urlList = () => {
  return ["https://www.10000recipe.com/recipe/list.html"];
};

const getReicpe = async () => {
  for (let i = 0; i < urlList().length; i++) {
    return await $.post("/recipe", { url: urlList()[i] });
  }
};

const getError = () => {
  alert("데이터를 가져오는중 에러가 발생하였습니다.");
};

export const Reicpe_views = () => {
  getReicpe().then((recipe_res) => {
    const status = recipe_res.status;
    const recipeList = recipe_res.recipeData;
    // Get Reicpe Data
    if (status == true) {
      Vue.component("recipe-list", {
        template: `
                <div class="recipe_content">
                    <div class="image">
                      <a href="https://www.10000recipe.com${recipeList[4].url}">
                        <img
                            src="${recipeList[4].image_src}"
                            width="300px"
                            style="border-radius: 10px 10px 0 0"
                        />
                      </a>
                    </div>
                    <div class="info">
                        <a href="https://www.10000recipe.com${recipeList[4].url}">
                            <h4 class="info_head">${recipeList[4].title}</h4>
                            <p class="info_sum">
                                레시피 사이트 : https://www.10000recipe.com${recipeList[4].url}</br>
                                ${recipeList[4].views}</br>
                                추천단계 : 락토오보베지테리언</br>
                                포인트 : 30점</br>
                                주요재료 : 고기</br>
                            </p>
                        </a>
                    </div>
                  </div>
                </div>
              `,
      });
      // Recipe Data setting
      new Vue({
        el: "#write_content",
      });
    } else {
      getError();
    }
  });
};
