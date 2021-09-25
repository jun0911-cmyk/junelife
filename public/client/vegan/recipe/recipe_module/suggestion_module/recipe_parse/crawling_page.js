export const getReicpePage = async (url) => {
  try {
    return await $.post(`/recipe/crawling/page`, {
      url: url,
    });
  } catch (e) {
    console.log(e);
  }
};
