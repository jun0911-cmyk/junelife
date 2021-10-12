import {
  settingStep,
  getVeganList,
  exitSettingGram,
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

const success_exit_message = () => {
  location.href = `/recipe`;
};

const referenceInput_message = (step_arr) => {
  const reference_hide_status = elHide();
  const reference_show_status = elShow();

  if (reference_hide_status == true && reference_show_status == true) {
    document.getElementById(
      "title"
    ).innerText = `최근(일주일)에 ${step_arr[0]}를(을) 몇번 드셨나요?`;
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

export const existing_recipe_step = (g_data, step, user_id) => {
  exitSettingGram(g_data, step, user_id);
  success_exit_message();
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
