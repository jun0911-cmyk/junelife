const jwt = require("jsonwebtoken");
const models = require("../../database/connect");

module.exports.access = function (token) {
  try {
    // 함수 파라미터 token 검증 후 return
    return jwt.verify(token, process.env.TOKENSECRET);
  } catch (e) {
    // 에러 발생시 null return
    return null;
  }
};

module.exports.refresh = async function (user_id) {
  try {
    // user_id 파라미터와 일치하는 row 가져옴
    const getToken = await models.Token.findOne({ user_id: user_id });
    // 가져온 row의 refresh_token을 검증한 결과를 return함
    return jwt.verify(getToken.refresh_token, process.env.TOKENSECRET);
  } catch (e) {
    // 에러 발생시 null return
    return null;
  }
};
