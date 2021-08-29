const jwt = require('jsonwebtoken');
const models = require('../database/connect');
const createTokens = require('./createToken');
const verify = require('./verify');

module.exports = async function(req, res, next) {
    new Promise((resolve, reject) => {
        if (req.headers.authorization && req.headers.user) {
            if (req.headers.authorization == undefined) {
                reject(req.headers.authorization);
            } else {
                var header = {
                    "authorization": req.headers.authorization.split('Bearer ')[1],
                    "user_id": req.headers.user,
                };
                resolve(header);
            }
        } else {
            next();
        }
    })
    .then(async (header) => {
        const accessToken = await verify.access(header.authorization);
        if (accessToken == null) {
            const refreshToken = await verify.refresh(header.user_id);
            const user_id = await header.user_id;
            return {
                accessToken,
                refreshToken,
                user_id
            };
        } else {
            const refreshToken = await verify.refresh(accessToken.id);
            const user_id = await header.user_id;
            return {
                accessToken,
                refreshToken,
                user_id
            };
        }
    })
    .then((token) => {
        if (token.accessToken == null && token.refreshToken == null) {
            res.status(200).json({
                status: false
            });
            return null;
        } else if (token.accessToken == null && token.refreshToken) {
            const newAccessToken = createTokens.createAccessToken(token.user_id);
            res.status(200).json({
                status: true,
                newAccessToken: newAccessToken
            });
            return null;
        } else {
            return token;
        }
    })
    .then(async (token) => {
        if (token == null) {
            return false;
        } else if ((token != null) && token.accessToken) {
            if (token.refreshToken == null) {
                const newRefreshToken = await createTokens.createRefreshToken(token.accessToken.id);
                if (newRefreshToken) {
                    res.status(200).json({
                        status: true,
                    });
                } else {
                    res.status(401).json({
                        status: false,
                    });
                }
            } else {
                res.status(200).json({
                    status: true,
                });
            }
        }
    })
    .catch((err) => {
        console.log(err);
    });
}