const jwt = require("jsonwebtoken");
const models = require("../../database/connect");
const crypto_data = require("./crypto_data");
const verify = require("./verify");

module.exports = async function (req, res, next) {
  new Promise((resolve, reject) => {
    // authorization, user 해더 존재 유무 확인
    if (req.headers.authorization && req.headers.user) {
      // authization 해더 데이터가 없을시
      if (req.headers.authorization == undefined) {
        reject(req.headers.authorization);
      } else {
        // header object
        var header = {
          authorization: req.headers.authorization.split("Bearer ")[1],
          user_id: crypto_data.decoding(req.headers.user),
        };
        // resolve로 header object 전송
        resolve(header);
      }
    } else {
      // 존재하지 않을때는 next로 다음 함수 실행
      next();
    }
  })
    .then(async (header) => {
      // descript user_id 결과가 에러시
      if (header.user_id == null) {
        // null return
        return null;
      } else {
        // 토큰 검증 하고 return
        const accessToken = await verify.access(header.authorization);
        if (accessToken == null) {
          const refreshToken = await verify.refresh(header.user_id);
          const user_id = await header.user_id;
          return {
            accessToken,
            refreshToken,
            user_id,
          };
        } else {
          const refreshToken = await verify.refresh(accessToken.id);
          const user_id = await header.user_id;
          return {
            accessToken,
            refreshToken,
            user_id,
          };
        }
      }
    })
    .then((token) => {
      // null return시 next callback
      if (token == null) {
        next();
      } else {
        // accessToken 검증결과가 존재하거나 refreshToken 검증결과가 존재할때
        if (token.accessToken != null || token.refreshToken != null) {
          // 페이지 접근 불가
          res.json({ status: true });
        } else {
          // next callback으로 접속 승인
          next();
        }
      }
    })
    .catch((err) => {
      // err 발생시 출력
      console.log(err);
    });
};
