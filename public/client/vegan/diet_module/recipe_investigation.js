let test_arr = ["육류", "가금류", "생선", "계란", "우유"];

const elHide = () => {
  try {
    $("#error").hide();
    $("#radio_input").hide();
    $("#diet_btn").hide();
    return true;
  } catch (e) {
    return false;
  }
};

const elShow = () => {
  try {
    $("#reference_input").show();
    $("#check_diet_btn").show();
    return true;
  } catch (e) {
    return false;
  }
};

const result_message = () => {
  let hide_status = elHide();
  $("#check_diet_btn").hide();
  $("#reference_input").hide();
  if (hide_status == true) {
    document.getElementById(
      "title"
    ).innerText = `단계 설정중... 잠시만 기달려 주세요...`;
  } else if (hist_status == false) {
    document.getElementById("title").innerText = `Error`;
  }
};

const referenceInput_message = (step_arr) => {
  let reference_hide_status = elHide();
  let reference_show_status = elShow();

  if (reference_hide_status == true && reference_show_status == true) {
    document.getElementById(
      "title"
    ).innerText = `최근에 ${step_arr[0]}를(을) 얼마나 드셨나요?`;
  } else {
    document.getElementById("title").innerText = `Error`;
  }
};

export const investigation_message = (message) => {
  // title setting to message
  document.getElementById(
    "title"
  ).innerText = `최근에 ${message}관련 요리를 드신적이 있나요?`;
};

export const yes_recipe_step = (g_data, setStep) => {
  result_message();
  setStep(test_arr);
  console.log(test_arr, g_data);
};

export const no_reicpe_step = (bool) => {
  if (bool == true) {
    referenceInput_message(test_arr);
  } else if (bool == false) {
    if (test_arr.length == 1) {
      result_message();
    } else {
      test_arr.shift();
      investigation_message(test_arr[0]);
    }
  }
};

export const investigation_error = () => {
  // Error message template
  Vue.component("error-component", {
    template: `
      <div style="color: red; font-size: 23px; margin-top: 3%">데이터를 입력받을 수 없습니다. 페이지의 오류가 발생하였습니다.</div>
    `,
  });
  // render to error component template
  new Vue({
    el: "#error",
  });
};
