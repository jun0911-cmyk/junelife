const jwt = require('jsonwebtoken');
const models = require('../database/connect');
const createTokens = require('./createToken');
const verify = require('./verify');

module.exports = async function(req, res, next) {
    if (req.headers.authorization && req.headers.user) {
        try {
            const user_id = await req.headers.user;
            const AuthHeader = await req.headers.authorization.split('Bearer ')[1];
            const accessToken = await verify(AuthHeader);
            const Tokendb = await models.Token.findOne({ user_id: user_id });
            const refreshToken = await verify(Tokendb.refresh_token);
            if (accessToken == null) {
                if (refreshToken == undefined) {
                    res.json({
                        status: false,
                    }).status(401);
                } else {
                    const newAccessToken = createTokens.createAccessToken(user_id);
                    res.json({
                        status: true,
                        newAccessToken: newAccessToken
                    }).status(200);
                }
            } else {
                if (refreshToken == undefined) {
                    const newRefreshToken = createTokens.createRefreshToken(user_id);
                    if (newRefreshToken == true) {
                        res.json({
                            status: true,
                        }).status(200);
                    } else {
                        res.json({
                            status: false,
                        }).status(401);
                    }
                } else {
                    res.json({
                        status: true,
                    }).status(200);
                }
            }
        } catch (e) {
            if (e.message == "Cannot read property 'refresh_token' of null") {
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
    next();
} 