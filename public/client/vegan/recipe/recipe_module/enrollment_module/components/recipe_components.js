const components = async (user_id) => {
  const step = await $.post("/recipe/step/check", { user_id: user_id });
  if (step.status == true) {
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
  }
};

export default components;
