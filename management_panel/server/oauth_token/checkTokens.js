const jwt = require('jsonwebtoken');
const models = require('../database/connect');
const createTokens = require('./createToken');
const verify = require('./verify');

module.exports = async function(req, res, next) {
    // authorization 해더와 유저 해더가 있을시
    if (req.headers.authorization && req.headers.user) {
        try {
            const user_id = await req.headers.user;
            // authorization 해더 AccessToken 추출
            const AuthHeader = await req.headers.authorization.split('Bearer ')[1];
            // AccessToken 검증
            const accessToken = await verify(AuthHeader);
            // Tokendb에서 user_id 해더에 있는 정보와 일치한 rows 추출
            const Tokendb = await models.Token.findOne({ user_id: user_id });
            // RefreshToken 가져온 후 검증
            const refreshToken = await verify(Tokendb.refresh_token);
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
                    }).status(200);
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
                        }).status(200);
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
                    }).status(200);
                }
            }
        } catch (e) {
            // Tokendb에 해당 rows가 없을때
            if (e.message == "Cannot read property 'refresh_token' of null") {
                // RefreshToken 재생성
                const newRefreshToken = createTokens.createRefreshToken(req.headers.user);
                if (newRefreshToken == true) {
                    res.json({
                        status: true,
                    }).status(200);
                } else {
                    res.json({
                        status: false,
                    }).status(401);
                }
            }
        }
    }
    // 다음 요청 callback
    next();
} 