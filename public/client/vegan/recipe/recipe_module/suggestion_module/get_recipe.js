import getVeganStep from "./suggestion_algorithm/suggestion_algo.js";

const getReicpe = async () => {
  return await $.post("/recipe/crawling/list");
};

const getError = () => {
  alert("데이터를 가져오는중 에러가 발생하였습니다.");
};

export const Reicpe_views = (user_id) => {
  getReicpe().then((recipe_res) => {
    const status = recipe_res.status;
    const rows = recipe_res.data;
    // Get Reicpe Data
    if (status == true) {
      // append component
      getVeganStep(user_id, rows);
    } else {
      getError();
    }
  });
};
