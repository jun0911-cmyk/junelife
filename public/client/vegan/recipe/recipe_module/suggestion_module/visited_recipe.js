$(document).on("click", "#recipe_content", function () {
  const getElement = $(this);
  const getChildren = getElement.children();
  const information = getChildren.eq(1);
  const infoChildren = information.children();
  const changeAteg = infoChildren.children();
  const getRecipeTitle = changeAteg.eq(0).text();
  const recipeTitleChild = changeAteg.eq(1).children();
  const getRecipeUrl = recipeTitleChild.eq(0).text();
  const splitURl = getRecipeUrl.split(":");
  // check mesasge (test)
  alert(
    `확인하시려는 레시피는 "${getRecipeTitle}" 레시피입니다. 정말로 해당 레시피를 확인하시겠습니까?`
  );
  $.post("/recipe/visited/update", {
    user_id: localStorage.getItem("accessToken"),
    choose_url: splitURl[1],
  });
});
