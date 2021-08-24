const jwt = require('jsonwebtoken');

module.exports = function(token) {
    try { 
        return jwt.verify(token, process.env.TOKENSECRET); 
    } catch(e) {
        return null; 
    }
}  