const LocalStorage = require('passport-local').Strategy;
const crypto = require('crypto');
const createToken = require('../../oauth_token/createToken');
const incodingCookie = require('../../oauth_token/incoding');
const models = require('../../database/connect');

module.exports = function(app, passport) {
    // 유저 직렬화
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // 유저 역직렬화
    passport.deserializeUser((id, done) => {
        // 아이디가 일치하는 row 찾음
        models.User.findById(id).then(user => {
            if (user) {
                done(null, user);
            } else {
                done(user.errors, null);
            }
        });
    });

    passport.use(new LocalStorage({
        usernameField: 'user_id',
        passwordField: 'password',
    }, (id, password, done) => {
        // 암호화 해제
        var decoding_pwd = crypto.createHash('sha512').update(password).digest('base64');
        models.User.findOne({
            user_id: id,
            password: decoding_pwd 
        }).then((user) => {
            // 아이디가 일치하지 않을때
            if (!user) {
                return done(null, false, { message : 'Incorrect username.' });
            }
            // 비밀번호 일치하지 않을때
            if(!user.password == password) {
                return done(null, false, { message : 'Incorrect password.' });
            }
            // 로그인 성공
            return done(null, user);
        }).catch(err => done(err));
    }));

    app.post('/user/login', function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
            if (err) { 
                // 로그인 에러시 500 에러 발생
                return res.status(500).json({ error: err }).status(500); 
            } else if (!user) {
                // 아이디 혹은 비밀번호 오류
                return res.json({ auth: 1 }).status(403);
            }
            // 세션 로그인
            req.logIn(user, function(err) {
                if (err) { return next(err); 
            }
                const AccessToken = createToken.createAccessToken(user.user_id, user.user_name);
                createToken.createRefreshToken(user.user_id);
                incodingCookie(res, user.user_id, user.user_name);
                // 로그인 세션 등록
                res.cookie('access', AccessToken);
                req.cookies.access = AccessToken;
                req.session.login = 1;
                req.session.user = user.email;
                req.session.save(function() {
                    // 로그인 성공
                    res.json({ auth: 0 }).status(200);
                });
            });
        })(req, res, next);
    });
}