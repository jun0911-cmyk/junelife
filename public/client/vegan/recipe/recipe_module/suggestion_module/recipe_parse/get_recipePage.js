import { getIngredients } from "./parse_page.js";

const getError = () => {
  alert("데이터를 가져오는중 에러가 발생하였습니다.");
};

export const getReicpePage = async () => {
  try {
    const recipePage = await $.post("/recipe/crawling/page");
    if (recipePage.status == true) {
      getIngredients(recipePage.data);
    } else {
      getError();
    }
  } catch (e) {
    console.log(e);
  }
};
