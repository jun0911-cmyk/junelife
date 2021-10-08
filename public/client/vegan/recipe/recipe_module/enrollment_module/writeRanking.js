let rank = 3;

const changeRanking = (rankData) => {
  if (rankData) {
    rank = Number(rankData);
  } else {
    return rank;
  }
};

const rankComponent = (title, url) => {
  document.querySelector("body").style.backgroundColor = "rgba(0, 0, 0, 0.1)";
  $("#recipe_rank").html(`
    <div class="rank-content" id="${url}">
      <span id="rank_title">"${title}" 레시피에 대한 평점을 남겨주세요! (평점은 레시피 추천에 반영됩니다.)</span>
      <div class="standard">
        <hr>
      </div>
      <div class="rank-radio" id="rank-radio">
        <input type="radio" name="radio-group" class="vb_ranking" id="0"/>
        <input type="radio" name="radio-group" class="b_ranking" id="1"/>
        <input type="radio" name="radio-group" class="sb_ranking" id="2"/>
        <input type="radio" name="radio-group" class="m_ranking" id="3" checked />
        <input type="radio" name="radio-group" class="g_ranking" id="4"/>
        <input type="radio" name="radio-group" class="vg_ranking" id="5"/>
      </div>
      <div class="radio-label">
        <p class="vb">매우별로</p>
        <p class="b">별로</p>
        <p class="sb">조금별로</p>
        <p class="m">보통</p>
        <p class="g">좋음</p>
        <p class="vg">매우좋음</p>
      </div>
      <div class="btn">
        <button type="button" id="clean_btn" class="btn btn-danger">취소</button>
        <button type="button" id="rank_btn" class="btn btn-info">평점남기기</button>
      </div>
    </div>`);
};

const writeRankBtnEvent = (url) => {
  document.getElementById("rank-radio").addEventListener("change", (e) => {
    changeRanking(e.target.id);
  });
  // comfirm btn
  document.getElementById("rank_btn").addEventListener("click", (e) => {
    const getRank = changeRanking();
    if (getRank > 3) {
      Swal.fire(
        "높게 평점을 남겨주셔서 감사합니다!",
        "이 결과는 다른 레시피 이용자분께 추천용도로 사용됩니다.",
        "success"
      );
    } else if (getRank <= 3) {
      Swal.fire(
        "평점을 남겨주셔서 감사합니다!",
        "이 결과는 다른 레시피 이용자분께 추천용도로 사용됩니다.",
        "success"
      );
    }
    $.post("/rank/save", {
      url: url,
      rank: getRank,
    });
    location.reload();
  });
  // clean btn
  document.getElementById("clean_btn").addEventListener("click", (e) => {
    location.reload();
  });
};

const rankBtnEventCall = (recipe) => {
  document.getElementById(recipe.url).addEventListener("click", (e) => {
    const recipeTitle = e.path[2].children[0].innerHTML;
    const recipeUrl = e.target.id;
    rankComponent(recipeTitle, recipeUrl);
    writeRankBtnEvent(recipeUrl);
  });
};

export default rankBtnEventCall;
