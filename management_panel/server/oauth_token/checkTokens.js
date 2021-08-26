const jwt = require('jsonwebtoken');
const models = require('../database/connect');
const createTokens = require('./createToken');
const verify = require('./verify');

module.exports = async function(req, res, next) {
    if (req.headers.authorization && req.headers.user) {
        try {
            const accessHeader = await req.headers.authorization.split('Bearer ')[1];
            const accessToken = await verify(accessHeader);
            const callRedreshToken = await models.Token.findOne({ user_id: req.headers.user });
            const refreshToken = await verify(callRedreshToken.refresh_token);
            if (accessToken == null) {
                if (refreshToken == undefined) {
                    res.json({
                        status: false,
                    }).status(401);
                } else {
                    const newAccessToken = createTokens.createAccessToken(req.headers.user);
                    res.json({
                        status: true,
                        newAccessToken: newAccessToken
                    }).status(200);
                }
            } else {
                if (refreshToken == undefined) {
                    const newRefreshToken = createTokens.createRefreshToken(req.headers.user);
                    if (newRefreshToken == true) {
                        res.json({
                            status: true,
                        }).status(200);
                    }
                } else {
                    res.json({
                        status: true,
                    }).status(200);
                }
            }
        } catch (e) {
            if (e == "TypeError: Cannot read property 'refresh_token' of null") {
                const newRefreshToken = createTokens.createRefreshToken(req.headers.user);
                if (newRefreshToken == true) {
                    res.json({
                        status: true,
                    }).status(200);
                }
            }
        }
    }
    next();
} 