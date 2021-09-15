const express = require("express");
const path = require("path");
const requestIp = require("request-ip");
const dietCheck = require("../middleware/vegan_diet/dietCheck");
const checkToken = require("../middleware/oauth_token/checkTokens");
const models = require("../database/connect");
const router = express.Router();

router.use(express.static("../public/css"));
router.use(express.static("../public/client"));
router.use(express.static("../public/favicon"));
router.use(function timeLog(req, res, next) {
  console.log(
    `비건 레시피 관련 라우터 접속로그, 접속 시간 : ${Date.now()}, 접속 IP : ${requestIp.getClientIp(
      req
    )}`
  );
  next();
});

let recipeName = {
  get recipe() {
    if (this.name) {
      return this.name;
    } else {
      return "Null recipeName";
    }
  },
  set recipe(name) {
    this.name = name;
  },
};

// recipe router
router.get("/", checkToken, function (req, res, next) {
  res.sendFile(
    path.join(__dirname, "..", "..", "/public/views/recipe_list.html")
  );
});

router.get("/:recipeName", async function (req, res, next) {
  recipeName.recipe = await req.params.recipeName;
  res.sendFile(
    path.join(__dirname, "..", "..", "/public/views/recipe_page.html")
  );
});

router.get("/write/:userToken", function (req, res, next) {
  res.sendFile(
    path.join(__dirname, "..", "..", "/public/views/recipe_write.html")
  );
});

router.get("/suggestion", dietCheck, function (req, res, next) {
  res.sendFile(
    path.join(__dirname, "..", "..", "/public/views/recipe_suggestion.html")
  );
});

router.get("/diet", checkToken, function (req, res, next) {
  res.sendFile(
    path.join(__dirname, "..", "..", "/public/views/recipe_diet.html")
  );
});

module.exports = router;
