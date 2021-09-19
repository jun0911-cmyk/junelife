import {
  settingStep,
  getVeganList,
} from "./diet_algorithm/recipe_step_algo.js";

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

const checkVeganList = () => {
  const checkVeganList = getVeganList();
  return checkVeganList;
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

const success_message = (status) => {
  document.getElementById(
    "title"
  ).innerText = `단계 설정이 완료되었습니다. 현재 단계는 ${status}입니다 3초뒤 결과페이지로 이동합니다.`;
  setTimeout(() => {
    location.href = `/recipe/graph/${accessUser}`;
  }, 3000);
};

export const error_message = () => {
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

export const investigation_message = (user_id, socket) => {
  // title setting to message
  const checkList = getVeganList();
  if (checkList.length == 0) {
    yes_recipe_step(300, user_id, socket);
  } else {
    document.getElementById(
      "title"
    ).innerText = `최근에 ${checkList[0]}관련 요리를 드신적이 있나요?`;
  }
};

export const yes_recipe_step = (g_data, user_id, socket) => {
  const checkList = checkVeganList();
  const status = settingStep(checkList, g_data, user_id, socket);
  result_message();
  // check status
  if (status) {
    success_message(status);
  } else if (status == false) {
    failure_message();
  } else if (status == null) {
    investigation_error();
  }
};

export const no_reicpe_step = (bool) => {
  const checkList = checkVeganList();
  if (bool == true) {
    referenceInput_message(checkList);
  } else if (bool == false) {
    checkList.shift();
    investigation_message(checkList[0]);
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
