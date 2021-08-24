const crypto = require('crypto');

module.exports = function(req) {
    return req.cookies.user_id, req.cookies.user_name
}