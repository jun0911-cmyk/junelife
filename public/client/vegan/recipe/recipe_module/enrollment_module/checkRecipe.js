const selectRecipe = [];

const checkRecipe = (el) => {
  for (let i = 0; i < 3; i++) {
    const getEl = el.eq(i);
    const elParent = getEl.parent();
    const changeInfo = elParent.parent();
    const infoChild = changeInfo.children();
    const getTitle = infoChild.eq(0).text();
    selectRecipe.push(getTitle);
    if (selectRecipe.length >= 3) {
      console.log(selectRecipe);
    }
  }
};

export default checkRecipe;
