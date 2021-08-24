const jwt = require('jsonwebtoken');
const models = require('../database/connect');
const decoding = require('../oauth_token/decoding');
const createTokens = require('./createToken');
const verify = require('./verify');

module.exports = async function(req, res, next) {
    if (req.cookies.access == undefined) {
        res.json({ auth_err: "not access token.", status: 1 }).status(403);
        return;
    }
    const accessToken = await verify(req.cookies.access);
    const tokenDB = await models.Token.findOne({ user_id: req.cookies.user_id });
    const refreshToken = await verify(tokenDB.refresh_token);
    if (req.cookies.user_id == undefined || req.cookies.user_name == undefined) {
        res.json({ auth_err: "not user information", status: 1 }).status(403);
    } else {
        if (accessToken == null) {
            if (refreshToken == undefined) {
                res.json({ auth_err: "not login.", status: 1 }).status(403);
            } else {
                const newAccessToken = createTokens.createAccessToken(req.cookies.user_id, req.cookies.user_name);
                res.cookie('access', newAccessToken);
                req.cookies.access = newAccessToken;
                next();
            }
        } else {
            if (refreshToken == undefined) {
                createTokens.createRefreshToken(req.cookies.user_id);
                next();
            } else {
                next();
            }
        }
    }
} 