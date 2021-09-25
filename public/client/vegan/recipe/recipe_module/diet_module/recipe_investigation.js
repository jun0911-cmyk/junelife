import {
  settingStep,
  getVeganList,
} from "./diet_algorithm/recipe_step_algo.js";

const elHide = () => {
  try {
    $("#error").hide();
    $("#radio_input").hide();
    $("#diet_btn").hide();
    $("#self_input").hide();
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

const success_message = (veganStep) => {
  document.getElementById(
    "title"
  ).innerText = `단계 설정이 완료되었습니다. 현재 단계는 ${veganStep}입니다 3초뒤 결과페이지로 이동합니다.`;
  // 3 secound after hyper link
  setTimeout(() => {
    location.href = `/recipe/graph`;
  }, 3000);
};

const failure_message = () => {
  document.getElementById(
    "title"
  ).innerText = `단계 설정을 실패하였습니다. 다음에 다시 시도해주세요.`;
  // 3 secound after hyper link
  setTimeout(() => {
    location.href = `/`;
  }, 1000);
};

const error_message = () => {
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
  const reference_hide_status = elHide();
  const reference_show_status = elShow();

  if (reference_hide_status == true && reference_show_status == true) {
    document.getElementById(
      "title"
    ).innerText = `최근에 ${step_arr[0]}를(을) 얼마나 드셨나요?`;
  } else {
    document.getElementById("title").innerText = `Error`;
  }
};

const checkSave = async (veganStep) => {
  if (veganStep) {
    success_message(await veganStep);
  } else if (veganStep == null) {
    console.log(2);
  }
};

export const yes_recipe_step = (g_data, user_id) => {
  const checkList = checkVeganList();
  const getStep = settingStep(checkList, g_data, user_id);
  result_message();
  checkSave(getStep);
};

export const investigation_message = (user_id) => {
  // title setting to message
  const checkList = getVeganList();
  if (checkList.length == 0) {
    yes_recipe_step(300, user_id);
  } else {
    document.getElementById(
      "title"
    ).innerText = `최근에 ${checkList[0]}관련 요리를 드신적이 있나요?`;
  }
};

export const no_reicpe_step = (bool, user_id) => {
  const checkList = checkVeganList();
  if (bool == true) {
    referenceInput_message(checkList);
  } else if (bool == false) {
    checkList.shift();
    investigation_message(user_id);
  }
};
