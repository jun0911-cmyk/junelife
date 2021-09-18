export const first_title_message = (message) => {
  document.getElementById(
    "title"
  ).innerText = `최근에 ${message}관련 요리를 드신적이 있나요?`;
};

export const error_message = () => {
  // setting to error-component
  Vue.component("error-component", {
    template: `
            <div id="error" style="color: red; font-size: 20px;">데이터를 입력받을수 없습니다. 페이지의 오류가 발생하였습니다.</div>
          `,
  });
  // recipe_extraction Error send to vue component
  new Vue({
    el: "#diet_input",
  });
};
