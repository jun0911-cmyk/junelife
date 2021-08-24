const jwt = require('jsonwebtoken');

module.exports.tokenVerify = function(token) {
    const verify = new Promise((resolve, reject) => {
        jwt.verify(token, process.env.TOKENSECRET, function(err, decoded) {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
    // 토큰 검증 return
    verify.then((tokenDecoded) => {
        return tokenDecoded;
    }).catch((err) => {
        return err;
    });
}  