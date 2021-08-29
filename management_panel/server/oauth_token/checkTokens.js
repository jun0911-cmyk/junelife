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
    new Promise((resolve, reject) => {
        if (req.headers.authorization && req.headers.user) {
            if (req.headers.authorization == undefined) {
                reject(req.headers.authorization);
            } else {
                var header = {
                    "authorization": req.headers.authorization.split('Bearer ')[1],
                    "user_id": req.headers.user,
                };
            }
            resolve(header);
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
            res.status(401).json({
                status: false
            });
            return null;
        } else if (token.accessToken == null && token.refreshToken) {
            const newAccessToken = createTokens.createAccessToken(token.user_id);
            res.status(200).json({
                status: true,
                newAccessToken: newAccessToken
            });
            return token;
        } else {
            return token;
        }
    })
    .then(async (token) => {
        if (token != null && token.accessToken) {
            if (token.refreshToken == null) {
                const newRefreshToken = await createTokens.createRefreshToken(token.accessToken.id);
                if (newRefreshToken) {
                    res.status(200).json({
                        status: true,
                    });
                    return token;
                } else {
                    res.status(401).json({
                        status: false,
                    });
                    return null;
                }
            } else {
                res.status(200).json({
                    status: true,
                });
                return token;
            }
        } else if (token == null) {
            return null;
        }
    })
    .then((token) => {
        if (token) {
            console.log(1)
        }
    })
    .catch((err) => {
        res.status(500).json({
            status: false,
            err: err
        }).end();
    });
    next();
}