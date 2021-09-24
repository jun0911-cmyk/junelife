const pageArr = [];

export const getReicpePage = async (url) => {
  history.pushState({}, "", `/recipe/crawling/page`);
  try {
    const data = await $.post(`/recipe/crawling/page`, {
      url: `https://${url}`,
    });
    pageArr.push(data);
    if (pageArr.length > 59) {
      console.log(pageArr);
      history.pushState({}, "", `/recipe`);
    }
  } catch (e) {
    console.log(e);
  }
};
