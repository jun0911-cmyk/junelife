const passport = require('passport');
const LocalStorage = require('passport-local').Strategy;
const crypto = require('crypto');
const models = require('../../database/connect');

module.exports = function(app) {
    // 유저 직렬화
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // 유저 역직렬화
    passport.deserializeUser((id, done) => {
        // 아이디가 일치하는 row 찾음
        models.User.findById(id).then(userData => {
            if (userData) {
                done(null, userData);
            } else {
                done(userData.errors, null);
            }
        });
    });

    passport.use(new LocalStorage({
        usernameField: 'id',
        passwordField: 'password',
    }, (id, password, done) => {
        // 암호화 해제
        var decoding_pwd = crypto.createHash('sha512').update(password).digest('base64');
        models.User.findOne({
            user_id: id,
            password: decoding_pwd 
        }).then((userData) => {
            // 아이디가 일치하지 않을때
            if (!userData) {
                return done(null, false);
            }
            // 비밀번호 일치하지 않을때
            if(!userData.password == password) {
                return done(null, false);
            }
            // 로그인 성공
            return done(null, userData);
        }).catch(err => done(err));
    }));

    app.post('/user/login', function(req, res, next) {
        passport.authenticate('local', function(err, userData, info) {
            if (err) { 
                // 로그인 에러시 500 에러 발생
                return res.status(500).json({ error: err }).status(500); 
            } else if (!userData) {
                // 아이디 혹은 비밀번호 오류
                return res.json({ auth: 1 }).status(403);
            }
            // 세션 로그인
            req.logIn(userData, function(err) {
                if (err) { return next(err); }
                // 로그인 세션 등록
                req.session.login = 1;
                req.session.user = userData.user_id;
                req.session.save(function() {
                    // 로그인 성공
                    res.json({ auth: 0 }).status(200);
                });
            });
        })(req, res, next);
    });
}