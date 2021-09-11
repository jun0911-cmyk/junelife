const jwt = require("jsonwebtoken");
const models = require("../../database/connect");

module.exports.createAccessToken = function (user_id) {
  // JSON AccessToken payload 저장
  const payload = {
    id: user_id,
  };
  // 1시간 AccessToken 생성
  return (accessToken = jwt.sign(payload, process.env.TOKENSECRET, {
    expiresIn: "1h",
    issuer: "cotak",
  }));
};

module.exports.createRefreshToken = function (user_id) {
  // RefreshToken은 payload없이 14일 발급
  const refreshToken = jwt.sign({}, process.env.TOKENSECRET, {
    expiresIn: "14d",
    issuer: "cotak",
  });
  // 토큰 모델 생성
  models.Token.findOne({
    user_id: user_id,
  })
    .then((rows) => {
      // 일치하는 rows가 없을시
      if (!rows) {
        // RefreshToken Tokendb에 저장
        const DBrefreshToken = new models.Token({
          user_id: user_id,
          refresh_token: refreshToken,
        });
        // 에러 발생시 console.log
        DBrefreshToken.save().catch((err) => {
          console.log(err);
        });
      } else {
        // 이미 해당 rows가 존재할시 원래 rows 삭제하고 재생성
        models.Token.remove({
          user_id: user_id,
        })
          .then(() => {
            const DBrefreshToken = new models.Token({
              user_id: user_id,
              refresh_token: refreshToken,
            });
            // 에러 발생시 console.log
            DBrefreshToken.save().catch((err) => {
              console.log(err);
            });
          })
          .catch((err) => console.log(err));
      }
    })
    .catch((err) => console.log(err));
  // 생성 status true로 설정하고 return
  return true;
};
