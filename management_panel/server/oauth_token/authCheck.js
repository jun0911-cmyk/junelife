const jwt = require('jsonwebtoken');
const models = require('../database/connect');
const crypto_data = require('./crypto_data');
const verify = require('./verify');

module.exports = async function(req, res, next) {
    new Promise((resolve, reject) => {
        if (req.headers.authorization && req.headers.user) {
            if (req.headers.authorization == undefined) {
                reject(req.headers.authorization);
            } else {
                var header = {
                    "authorization": req.headers.authorization.split('Bearer ')[1],
                    "user_id": crypto_data.decoding(req.headers.user),
                };
                resolve(header);
            }
        } else {
            next();
        }
    })
    .then(async (header) => {
        if (header.user_id == null) {
            return null;
        } else {
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
        }
    })
    .then((token) => {
        if (token == null) {
            next();
        } else {
            if (token.accessToken != null || token.refreshToken != null) {
                res.json({ status: true });
            } else {
                next();
            }
        }
    })
    .catch((err) => {
        console.log(err);
    });
}