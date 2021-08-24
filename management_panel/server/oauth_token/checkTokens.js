const jwt = require('jsonwebtoken');
const mongoose = require('../database/connect');
const createTokens = require('./createToken');
const verify = require('./verify');

module.exports = {
    async CheckTokens(req, res, next) {
        if (req.cookies.access == undefined) {
            throw Error('not accessToken');
        }
        const accessToken = verify(req.cookies.access);
        const refreshToken = verify(req.cookies.refreshToken); // DB 안에서 찾아오도록 구현
        if (accessToken == null) {
            if (refreshToken == undefined) {
                res.json({ auth: "로그인을 해주시기 바랍니다." }).status(403);
            } else {
                const newAccessToken = createTokens.createAccessToken(user_id, pwd);
                res.cookie('access', newAccessToken);
                req.cookies.access = newAccessToken;
                next();
            }
        } else {
            if (refreshToken == undefined) {
                const newRefreshToken = createTokens.createRefreshToken();
                res.cookie('refresh', newRefreshToken);
                req.cookies.refresh = newRefreshToken;
                next();
            } else {
                next();
            }
        }
    }
} 