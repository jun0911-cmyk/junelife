const jwt = require('jsonwebtoken');
const models = require('../database/connect');

module.exports.access = function(token) {
    try { 
        // 함수 파라미터 token 검증 후 return
        return jwt.verify(token, process.env.TOKENSECRET); 
    } catch (e) {
        // 에러 발생시 null return
        return null; 
    }
}  

module.exports.refresh = async function(user_id) {
    const getToken = await models.Token.findOne({ user_id: user_id });
    try {
        return jwt.verify(getToken, process.env.TOKENSECRET);
    } catch (e) {
        return null;
    }
}