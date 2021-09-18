const jwt = require("jsonwebtoken");
const models = require("../../database/connect");
const crypto_data = require("./crypto_data");
const createTokens = require("./createToken");
const verify = require("./verify");

// TokenCheck module
module.exports = async function (req, res, next) {
  // Promise Chaining
  new Promise((resolve, reject) => {
    // user 해더 안의 데이터가 없을때
    if (req.headers.user == "" || req.headers.user == "null") {
      // 401(권한에러) 응답
      res
        .json({
          status: false,
        })
        .status(401);
    }
    // Authorization 해더와 user 해더의 존재유무 확인
    else if (req.headers.authorization && req.headers.user) {
      // header object에 정보 저장
      var header = {
        authorization: req.headers.authorization.split("Bearer ")[1],
        user_id: crypto_data.decoding(req.headers.user),
      };
      // resolve로 header return
      resolve(header);
    } else {
      // 존재하지 않을시 다음 funection next
      next();
    }
  })
    .then(async (header) => {
      if (header.user_id != null) {
        // accessToken 검증
        const accessToken = await verify.access(header.authorization);
        if (accessToken == null) {
          // 검증 애러시 refreshToken user 해더로 검증
          const refreshToken = await verify.refresh(header.user_id);
          const user_id = await header.user_id;
          // 3가지 인수 return
          return {
            accessToken,
            refreshToken,
            user_id,
          };
        } else {
          // accessToken이 존재할시 디코딩 결과 id로 refreshToken 검증
          const refreshToken = await verify.refresh(accessToken.id);
          const user_id = await header.user_id;
          // 3가지 인수 return
          return {
            accessToken,
            refreshToken,
            user_id,
          };
        }
      } else if (header.user_id == null) {
        // descript 한 결과가 에러발생시 401에러 응답
        res
          .json({
            status: false,
          })
          .status(401);
        // null return
        return null;
      }
    })
    .then((token) => {
      // token 결과가 null일때
      if (token == null) {
        // null return
        return null;
      } else {
        // 검증결과 accessToken, refreshToken이 전부 만료시
        if (token.accessToken == null && token.refreshToken == null) {
          // status false response
          res
            .json({
              status: false,
            })
            .status(401);
          // null return
          return null;
        } else if (token.accessToken == null && token.refreshToken) {
          // 검증결과 accessToeen만 만료시 user 해더 데이터로 accessToken 재생성
          const newAccessToken = createTokens.createAccessToken(token.user_id);
          // newAccessToken과 true 응답
          res
            .json({
              status: true,
              newAccessToken: newAccessToken,
              user_id: token.user_id,
            })
            .status(200);
          // 처리가 완료되었으며 reponse를 중복되어 호출되면 안되기 때문에 null retrun
          return null;
        } else {
          // 전부다 존재할시 token object return
          return token;
        }
      }
    })
    .then(async (token) => {
      // 이미 애러가 나서 reponse 됬거나 새로운 accessToken이 발급되서 reponse가 완료되었을경우
      if (token == null) {
        // false return
        return false;
      } else if (token != null && token.accessToken) {
        // retreshToken만 만료시
        if (token.refreshToken == null) {
          // accessToken 디코딩된 id로 refreshToken 재생성
          const newRefreshToken = await createTokens.createRefreshToken(
            token.accessToken.id
          );
          // 발급 완료시 status true 응답
          if (newRefreshToken == true) {
            // refreshToken이 생성되었을시 200 reponse 응답
            res
              .json({
                status: true,
                user_id: token.user_id,
              })
              .status(200);
          } else {
            // 발급 애러시 status false 응답
            res
              .json({
                status: false,
              })
              .status(401);
          }
        } else {
          // accessToken과 refreshToken 모두 유효할시 true 전송
          res
            .json({
              status: true,
              user_id: token.user_id,
            })
            .status(200);
        }
      }
    })
    .catch((err) => {
      // err 발생시 err 출력
      console.log(err);
    });
};
