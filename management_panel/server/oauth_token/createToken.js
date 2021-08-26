const jwt = require('jsonwebtoken');
const models = require('../database/connect');

module.exports.createAccessToken = function(user_id) {
    const payload = {
        id: user_id,
    };
    return accessToken = jwt.sign(payload, process.env.TOKENSECRET, {
        expiresIn: '1h',
        issuer: 'cotak',
    });
}

module.exports.createRefreshToken = function(user_id) {
    const refreshToken = jwt.sign({}, process.env.TOKENSECRET, {
        expiresIn: '14d',
        issuer: 'cotak',
    });
    // 토큰 모델 생성
    models.Token.findOne({ 
        user_id: user_id 
    }).then((rows) => {
        if (!rows) {
            const DBrefreshToken = new models.Token({
                user_id: user_id,
                refresh_token: refreshToken
            });
            DBrefreshToken.save().catch((err) => {
                console.log(err);
            });
        } else {
            models.Token.remove({
                user_id: user_id
            }).then(() => {
                const DBrefreshToken = new models.Token({
                    user_id: user_id,
                    refresh_token: refreshToken
                });
                DBrefreshToken.save().catch((err) => {
                    console.log(err);
                });
            }).catch((err) => console.log(err));
        }
    }).catch((err) => console.log(err));
    return true;
}