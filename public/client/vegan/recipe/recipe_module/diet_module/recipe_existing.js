const stepList = [
  "플렉시테리언",
  "세미베지테리언",
  "페스코베지테리언",
  "락토오보베지테리언",
  "락토베지테리언",
  "비건",
];
const ingredientsList = [
  "육류",
  "가금류(닭고기, 오리고기,등)",
  "생선(해산물)",
  "우유(가공식품류)",
  "계란(유제품)",
];

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

export const existing_message = (user) => {
  console.log(user);
  const getIngredients = ingredientsList[stepList.indexOf(user)];
  if (getIngredients) {
    elHide();
    elShow();
    document.getElementById(
      "title"
    ).innerText = `최근(일주일)에 ${getIngredients}를(을) 몇번 드셨나요?`;
  }
};
