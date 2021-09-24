import { getReicpePage } from "./recipe_parse/crawling_page.js";

const urlList = () => {
  return [
    "https://www.cj.co.kr/kr/k-food-life/cj-the-kitchen/recipe",
    "https://haemukja.com/recipes?utf8=%E2%9C%93",
    "https://www.10000recipe.com/recipe/list.html",
  ];
};

const getReicpe = async () => {
  return await $.post("/recipe", { url: urlList() });
};

const getError = () => {
  alert("데이터를 가져오는중 에러가 발생하였습니다.");
};

const appendRecipeCom = (view_recipeArr, i) => {
  $("#write_content").append(`
    <div class="recipe_content">
        <div class="image">
          <a href="https://${
            view_recipeArr[i].crawling + view_recipeArr[i].url
          }">
            <img
              src="${view_recipeArr[i].image_src}"
              width="300px"
              style="border-radius: 10px 10px 0 0"
            />
          </a>
        </div>
        <div class="info">
          <a href="https://${
            view_recipeArr[i].crawling + view_recipeArr[i].url
          }">
            <h4 class="info_head">${view_recipeArr[i].title}</h4>
            <p class="info_sum">
              레시피 사이트 : ${view_recipeArr[i].url}</br>
              ${view_recipeArr[i].views}</br>
              추천단계 : 락토오보베지테리언</br>
              포인트 : 30점</br>
              주요재료 : 고기</br>
              출처 : ${view_recipeArr[i].crawling}
            </p>
          </a>
        </div>
      </div>
    </div>
  `);
};

export const Reicpe_views = () => {
  getReicpe().then((recipe_res) => {
    const status = recipe_res.status;
    const recipeList = recipe_res.recipeData;
    const recipe10000 = recipeList.Recipe10000;
    const haemukja = recipeList.Haemukja;
    const cjTheKitChen = recipeList.CjTheKitChen;
    const view_recipeArr = recipe10000.concat(haemukja, cjTheKitChen);
    // Get Reicpe Data
    if (status == true) {
      for (let i = 0; i < view_recipeArr.length; i++) {
        getReicpePage(view_recipeArr[i].crawling + view_recipeArr[i].url);
        appendRecipeCom(view_recipeArr, i);
      }
    } else {
      getError();
    }
  });
};
