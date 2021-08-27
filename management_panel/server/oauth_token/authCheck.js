const jwt = require('jsonwebtoken');
const models = require('../database/connect');
const verify = require('./verify');

module.exports = async function(req, res, next) {
    if (req.headers.authorization && req.headers.user) {
        const user_id = await req.headers.user;
        const AuthHeader = await req.headers.authorization.split('Bearer ')[1];
        // AccessToken 검증
        const accessToken = await verify(AuthHeader);
        // Tokendb에서 user_id 해더에 있는 정보와 일치한 rows 추출
        const Tokendb = await models.Token.findOne({ user_id: user_id });
        // RefreshToken 가져온 후 검증
        const refreshToken = await verify(Tokendb.refresh_token);
        console.log(refreshToken, accessToken);
        if (accessToken != null || refreshToken != undefined) {
            try {
                res.json({ status: true });
            } catch (e) {
                next();
            }
        }
    }
    next();
}