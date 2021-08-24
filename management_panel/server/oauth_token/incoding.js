const crypto = require('crypto');

module.exports = function(res, user_id, user_name) {
    res.cookie('user_id', `${user_id}`);
    res.cookie('user_name', `${user_name}`);
    res.cookie('logged_in', `yes`); 
}