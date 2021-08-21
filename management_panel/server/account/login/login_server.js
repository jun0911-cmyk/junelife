const express = require('express');
const session = require('express-session');
const path = require('path');
const passport = require('passport');
const LocalStorage = require('passport-local').Strategy;
const crypto = require('crypto');
const mongoose = require('mongoose');
const app = express();

module.exports = function() {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/user/login', express.static('../public/css'));
    app.use('/user/login', express.static('../public/client'));
    app.use('/user/login', express.static('../public/favicon'));

    app.get('/user/login', function(req, res) {
        if(req.isAuthenticated()) {
            res.redirect('/');
        }
        else {
            res.sendFile(path.join(__dirname, '..', '..', '/public/views/login.html'));
        }
    });

    // 유저 직렬화
    passport.serializeUser((user, done) => {
        done(null, user.id);
        console.log("Serialize");
    });

    // 유저 역직렬화
    passport.deserializeUser((id, done) => {
        console.log("DeSerialize");
        // 아이디가 일치하는 row 찾음
        models.User.findByPk(id).then(user => {
            if (user) {
                done(null, user);
            } else {
                done(user.errors, null);
            }
        });
    });

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
    }, (username, password, done) => {
        // 암호화 해제
        var hashpwd = crypto.createHash('sha512').update(password).digest('base64');
        models.User.findOne({ 
            where: { 
                email: username,
                password: hashpwd
            }
        }).then(function(user) {
            // 아이디가 일치하지 않을때
            if (!user) {
                return done(null, false, { message : 'Incorrect username.' });
            }
            // 비밀번호 일치하지 않을때
            if(!user.password == password) {
                return done(null, false, { message : 'Incorrect password.' });
            }
            return done(null, user);
        })
        .catch(err => done(err));
    }));

    app.post('/user/login', function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
            if (err) { 
                // 로그인 에러시 500 에러 발생
                return res.status(500).json({ result: err }).status(500); 
            }
            if (!user) {
                return res.json({ result: 1 }).status(403);
            }
            req.logIn(user, function(err) {
                if (err) { return next(err); 
            }
                // 로그인 세션 등록
                req.session.login = 1;
                req.session.user = user.email;
                req.session.save(function() {
                    res.json({ result: 0 });
                });
            });
        })(req, res, next);
    });

    // 로그아웃시 세션 파괴
    app.get('/user/logout', function(req, res) {
        req.logout();
        req.session.destroy();
        res.clearCookie('logged_in');
        res.clearCookie('service_group');
        res.clearCookie('service_user');
        res.clearCookie('service_platform');
        res.redirect('/s-class');
    });
}