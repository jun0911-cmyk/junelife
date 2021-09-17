const elHide = () => {
  try {
    $("#error").hide();
    $("#recipe_name").hide();
    $("#diet_btn").hide();
    return true;
  } catch (e) {
    return false;
  }
};

export function recipe_extraction(target) {
  if ($("#recipe_name").val() == 0) {
    Vue.component("error-component", {
      template: `
            <div id="error" style="color: red; font-size: 20px;">요리명을 입력하지 않으셨습니다. 정확히 입력해주세요.</div>
          `,
    });

    new Vue({
      el: "#diet_input",
    });
  } else {
    var status = elHide();
    if (status == true) {
      document.getElementById("title").innerText = "요리명을 추출하는중 ...";
      var recipe_name = $("#recipe_name").val();
      var split_name = recipe_name.split(" ");
      return split_name;
    } else if (status == false) {
      Vue.component("error-component", {
        template: `
            <div id="error" style="color: red; font-size: 20px;">요리명을 입력받을수 없습니다. 페이지의 오류가 발생하였습니다.</div>
          `,
      });

      return undefined;
    } else {
      return undefined;
    }
  }
}
