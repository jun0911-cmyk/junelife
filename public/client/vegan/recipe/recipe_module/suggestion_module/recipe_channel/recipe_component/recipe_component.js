const stepList = [
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

const point = (step, myStep) => {
  if (step > myStep) {
    step = step + 1;
    const getMathPoint = step - myStep;
    const getPoint = getMathPoint * 5;
    return getPoint;
  } else if (step <= myStep) {
    return 5;
  }
};

const getUser = async (user_id) => {
  const user = await $.post("/recipe/step/check", {
    user_id: user_id,
  });
  if (user.status == true) {
    const stepIndex = stepList.indexOf(user.rows.vegan_level);
    return {
      step: stepIndex,
      user: user.rows,
    };
  }
};

const appendRecipeCom = (view_recipeArr, recipeData, id, point) => {
  if (point <= 5) {
    $(`#${id}`).append(`
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
              <span style="color: red; font-weight: bold;">추천단계 : ${
                recipeData.step
              } (낮은 단계)</span></br>
              <span style="font-weight: bold;">포인트 : ${point}점</span></br>
              <span>${view_recipeArr.views}</span></br>
              <span>분류 : ${
                ingredientsParse[stepList.indexOf(recipeData.step)]
              }</span></br>
              <span>출처 : ${view_recipeArr.crawling}</span></br>
              <span id="${view_recipeArr.url}#ranking">평점 불러오는중</span>
            </p>
          </a>
        </div>
      </div>
    </div>
  `);
  } else if (point > 5) {
    $(`#${id}`).append(`
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
              <span style="color: blue; font-weight: bold;">추천단계 : ${
                recipeData.step
              } (높은 단계)</span></br>
              <span style="font-weight: bold;">포인트 : ${point}점</span></br>
              <span>${view_recipeArr.views}</span></br>
              <span>분류 : ${
                ingredientsParse[stepList.indexOf(recipeData.step)]
              }</span></br>
              <span>출처 : ${view_recipeArr.crawling}</span></br>
              <span id="${view_recipeArr.url}#ranking">평점 불러오는중</span>
            </p>
          </a>
        </div>
      </div>
    </div>
  `);
  }
};

const getRanking = async () => {
  const rank = await $.post("/rank/get");
  if (rank.status == true) {
    return rank.ranking;
  }
};

const settingComponent = async (recipeLen, rank) => {
  for (let i = 0; i < rank.length; i++) {
    document.getElementById(
      "cnt_recipe"
    ).innerText = `레시피추천횟수 : ${recipeLen}회`;
    const recipeRank = document.getElementById(`${rank[i].recipe}#ranking`);
    if (recipeRank != null) {
      if (rank[i].rank == null) {
        document.getElementById(
          `${rank[i].recipe}#ranking`
        ).innerText = `평점이 등록되어있지 않습니다.`;
      } else {
        document.getElementById(
          `${rank[i].recipe}#ranking`
        ).innerText = `${rank[i].favorite}명의 사람들이 이 레시피를 ${rank[i].rank}점으로 좋아합니다!`;
      }
    }
  }
};

export default {
  settingComponent,
  getRanking,
  appendRecipeCom,
  point,
  getUser,
};
