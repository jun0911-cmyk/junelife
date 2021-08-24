const jwt = require('jsonwebtoken');
const models = require('../database/connect');

module.exports.createAccessToken = function(user_id, pwd) {
    return accessToken = jwt.sign({user_id, pwd},
        process.env.TOKENSECRET, {
        expiresIn: '1h',
        issuer: 'cotak'        
    });
}

module.exports.createRefreshToken = function(user_id) {
    const refreshToken = jwt.sign({},
        process.env.TOKENSECRET, {
        expiresIn: '14d',
        issuer: 'cotak'        
    });
    // 토큰 모델 생성
    const DBrefreshToken = new models.Token({
        user_id: user_id,
        refresh_token: refreshToken
    });
    // 토큰 모델 저장
    DBrefreshToken.save().then(() => {
        console.log('save Success');
    }).catch((err) => {
        console.log(err);s
    });
}