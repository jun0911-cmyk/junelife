const elHide = () => {
  $("#error").hide();
  $("#recipe_name").hide();
  $("#diet_btn").hide();
  return true;
};

export function proccing(target) {
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
    } else {
      return undefined;
    }
  }
}
