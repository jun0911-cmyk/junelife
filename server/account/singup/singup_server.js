const crypto = require("crypto");
const models = require("../../database/connect");

module.exports = function (app) {
  app.post("/user/singup", (req, res) => {
    // Ajax 데이터 response
    var user_id = req.body.user_id;
    var username = req.body.username;
    var email = req.body.email;
    var pwd = req.body.password;
    var repwd = req.body.repassword;

    // 이메일 정규 표현식
    var exptext = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
    // 비밀번호 정규 표현식
    var regex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{6,16}/;

    // 페스워드 확인
    if (pwd != repwd) {
      res
        .json({
          status_code: 1,
          msg: "비밀번호와 재입력한 비밀번호가 일치하지 않습니다.",
        })
        .status(403);
      return;
    }

    // 비어있는 칸 확인
    else if (user_id == "" || username == "" || pwd == "" || repwd == "") {
      res.json({ status_code: 1, msg: "비어있는 칸이 있습니다." }).status(403);
      return;
    }

    // 정규 표현식 확인 (비밀번호)
    else if (regex.test(pwd) == false) {
      res
        .json({
          status_code: 1,
          msg: "비밀번호는 특수문자, 숫자, 영문을 포함해야합니다.",
        })
        .status(403);
      return;
    }

    // 정규 표현식 확인 (이메일)
    else if (exptext.test(email) == false) {
      res
        .json({ status_code: 1, msg: "이메일 형식에 맞지 않습니다." })
        .status(403);
      return;
    }

    // User_db에 회원가입 유저 정보 등록
    else {
      // crypto 암호화
      var incoding_pwd = crypto
        .createHash("sha512")
        .update(pwd)
        .digest("base64");
      models.User.findOne({
        user_id: user_id,
      })
        .then(async (rows) => {
          if (!rows) {
            const newUser = await new models.User({
              user_name: username,
              user_id: user_id,
              password: incoding_pwd,
              email: email,
            });
            newUser
              .save()
              .then(() => {
                res.status(200).json({ status_code: 0 });
              })
              .catch((err) => {
                res.status(500).json({ error: err });
              });
          } else {
            res
              .json({ status_code: 1, msg: "이미 가입하신 아이디가 있습니다." })
              .status(403);
          }
        })
        .catch((err) => {
          console.log(err);
          res.status(500).end();
        });
    }
  });
};
