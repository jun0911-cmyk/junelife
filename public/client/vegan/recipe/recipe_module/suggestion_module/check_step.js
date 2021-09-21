export const checkStep = (user_id, socket) => {
  socket.emit("check_veganStep", user_id);
  socket.on("check_veganStep", (status, rows) => {
    if (status == true) {
      localStorage.setItem("veganData", rows.vegan_level);
      Vue.component("vegan-component", {
        template: `
                        <div class="vegan_info">
                          <span>포인트 : ${rows.vegan_point}점 <i class="fas fa-circle"></i> 단계 : ${rows.vegan_level}</span>
                        </div>
                    `,
      });

      new Vue({
        el: "#account",
      });
    } else {
      location.href = "/recipe/diet";
    }
  });
};
