export const checkStep = async (user_id) => {
  const step = await $.post("/recipe/step/check", { user_id: user_id });
  if (step.status == true) {
    localStorage.setItem("veganData", step.rows.vegan_level);
    Vue.component("vegan-component", {
      template: `
                        <div class="vegan_info">
                          <span>포인트 : ${step.rows.vegan_point}점 <i class="fas fa-circle"></i> 단계 : ${step.rows.vegan_level}</span>
                        </div>
                    `,
    });

    Vue.component("account-component", {
      template: `
                        <div class="dropdown">
                            <a href="javascript:void(0)" class="singup">
                                <i class="fas fa-user-circle" style="font-size: 27px; margin-top: 10px"></i>
                            </a>
                            <div class="dropdown-content">
                                <a href="/student/check/class">내 비건정보</a>
                                <a href="#">내 정보</a>
                                <a href="#">정보 변경</a>
                                <a href="/user/logout">로그아웃<i class="fas fa-sign-out-alt"></i></a>
                            </div>
                        </div>
                    `,
    });

    new Vue({
      el: "#account",
    });
  } else if (step.diet == 0) {
    location.href = "/recipe/diet";
  } else {
    location.href = "/recipe/diet";
  }
};

export const subChart = async (user_id) => {
  const step = await $.post("/recipe/step/check", { user_id: user_id });
  const getTodayVisite = step.rows.visite_recipe.split(", ");
  Vue.component("vegan-information-component", {
    template: `
            <div class="vegan_information">
              <div class="content">
                <span>나의 비건포인트 : ${step.rows.vegan_point}점</span>
                <span>나의 비건레벨 : ${step.rows.vegan_level}</span>
                <span>어제 레시피 방문횟수 : ${
                  getTodayVisite[getTodayVisite.length - 1].split(":")[1]
                }회</span>
              </div>
              <div class="sub_content">
                <span id="cnt_recipe">레시피추천횟수 : 불러오는중</span>
                <span>마지막 접속날짜 : ${
                  getTodayVisite[getTodayVisite.length - 1].split(":")[0]
                }</span>
              </div>
              <p>더 많은 통계를 보실려면 <a href="/recipe/graph">여기</a>를 클릭해주세요.</p>
            </div>
          `,
  });

  new Vue({
    el: "#sub_chart",
  });
};
