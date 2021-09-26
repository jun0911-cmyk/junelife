import { getReicpePage } from "./recipe_parse/get_recipePage.js";

const getReicpe = async () => {
  getReicpePage();
  return await $.post("/recipe/crawling/list");
};

const getError = () => {
  alert("데이터를 가져오는중 에러가 발생하였습니다.");
};

const appendRecipeCom = (view_recipeArr) => {
  $("#write_content").append(`
    <div class="recipe_content" id="${view_recipeArr.url}">
        <div class="image">
          <a href="https://${view_recipeArr.crawling + view_recipeArr.url}">
            <img
              src="${view_recipeArr.image_src}"
              width="300px"
              style="border-radius: 10px 10px 0 0"
            />
          </a>
        </div>
        <div class="info">
          <a href="https://${view_recipeArr.crawling + view_recipeArr.url}">
            <h4 class="info_head">${view_recipeArr.title}</h4>
            <p class="info_sum">
              레시피 사이트 : ${view_recipeArr.url}</br>
              ${view_recipeArr.views}</br>
              추천단계 : 락토오보베지테리언</br>
              포인트 : 30점</br>
              주요재료 : 고기</br>
              출처 : ${view_recipeArr.crawling}
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
    const rows = recipe_res.data;
    // Get Reicpe Data
    if (status == true) {
      // reicpe chart setting text fix
      document.getElementById(
        "cnt_recipe"
      ).innerText = `레시피추천횟수 : ${rows.length}회`;
      // append component
      for (let i = 0; i < rows.length; i++) {
        appendRecipeCom(JSON.parse(rows[i].content));
      }
    } else {
      getError();
    }
  });
};
