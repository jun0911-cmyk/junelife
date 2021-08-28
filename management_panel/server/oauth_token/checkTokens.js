const jwt = require('jsonwebtoken');
const models = require('../database/connect');
const createTokens = require('./createToken');
const verify = require('./verify');

module.exports = async function(req, res, next) {
    // next callback 안되는 이유
    /*
    next 콜백이 안되는 이유는
    if (req.headers.authorization && req.headers.user)
    이 구문 때문이다
    무슨이유에서인지 요청이 3번되는데 왜 undefind가 나오는지를 모르겠다.
    하지만 이 확인구문을 안쓸 경우에는 아래의 코드가 동작이 되지않는다.
    내가 해결할수 있는 경우의 수는 2가지가 있다.
    1. 페이지 렌더링 후에 토큰을 검사한다. (실패 가능성이 큼)
    2. 3번 페이지가 요청되는 이유를 막거나 undefind가 출력되는 경우를 막으면 된다.
    */
    // authorization 해더와 유저 해더가 있을시
    console.log(req.headers.authorization);
    if (req.headers.authorization && req.headers.user) {
        try {
            const user_id = await req.headers.user;
            // authorization 해더 AccessToken 추출
            const AuthHeader = await req.headers.authorization.split('Bearer ')[1];
            // AccessToken 검증
            const accessToken = await verify.access(AuthHeader);
            // Tokendb에서 user_id 해더에 있는 정보와 일치한 rows 추출
            const Tokendb = await models.Token.findOne({ user_id: user_id });
            // RefreshToken 가져온 후 검증
            const refreshToken = await verify.refresh(Tokendb.refresh_token);
            // AccessToken 만료
            if (accessToken == null) {
                // RefreashToken도 만료
                if (refreshToken == undefined) {
                    // 401 json 응답
                    res.json({
                        status: false,
                    }).status(401);
                } else {
                    // Refresh 토큰은 존재하지만 Access 토큰은 없을시 AccessToken 재생성
                    const newAccessToken = createTokens.createAccessToken(user_id);
                    // newAccessToken client로 200 response 
                    res.json({
                        status: true,
                        newAccessToken: newAccessToken
                    }).status(100);
                }
            } else {
                // Access 토큰은 존재하지만 Refresh 토큰은 없을시
                if (refreshToken == undefined) {
                    // RefreshToken 재생성
                    const newRefreshToken = createTokens.createRefreshToken(user_id);
                    // 재생성 완료시 200 response
                    if (newRefreshToken == true) {
                        res.json({
                            status: true,
                        }).status(100);
                    } else {
                        // 재생성 실패시 401 response
                        res.json({
                            status: false,
                        }).status(401);
                    }
                } else {
                    // 모든 토큰이 전부 검증된 토큰이면 200 reponse
                    res.json({
                        status: true,
                    }).status(100);
                }
            }
        } catch (e) {
            res.json({
                status: false,
            }).status(403);
        }
    }
    // 다음 요청 callback
    next();
}