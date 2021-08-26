const jwt = require('jsonwebtoken');

module.exports = function(token) {
    try { 
        // 함수 파라미터 token 검증 후 return
        return jwt.verify(token, process.env.TOKENSECRET); 
    } catch(e) {
        // 에러 발생시 null return
        return null; 
    }
}  