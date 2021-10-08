const express = require("express");
const session = require("express-session");
const logger = require("morgan");
const passport = require("passport");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const Router = require("./router/index/indexRouter");
const port = process.env.PORT || 8000;
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

// database connect
require("./database/connect");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("views", __dirname + "/");
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);
require("dotenv").config();
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialize: true,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
    name: "management_panel_session-cookie",
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static("../public/css"));
app.use(express.static("../public/client"));
app.use(express.static("../public/favicon"));
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type, Authorization"
  );
  next();
});

// Router
app.use("/", Router.mainRouter);
app.use("/user", Router.accountRouter);
app.use("/recipe", Router.veganRecipeRouter);
app.use("/rest", Router.veganRestRouter);

// account Server
require("./account/login/login_server")(app, passport);
require("./account/singup/singup_server")(app);

// vegan Recipe Server
require("./vegan/recipe/recipe_step/check_step")(app);
require("./vegan/recipe/recipe_step/save_step")(app);
require("./vegan/recipe/recipe_crawler/send_crawlingData")(app);
require("./vegan/recipe/visited/visit_recipe")(app);
require("./vegan/recipe/visited/get_visite_recipe")(app);
require("./vegan/recipe/visited/enrollment_recipe")(app);
require("./vegan/recipe/recipe_step/rank")(app);

// 404 (Not found), 500 (ISE) Error handling
app.use(function (req, res, next) {
  var err = new Error("Page Not Found");
  // Error status setting 404
  err.status = 404;
  // next Error callback
  next(err);
});

// if express error development
if (app.get("env") === "development") {
  app.use(function (err, req, res, next) {
    // status 404 OR 500 send
    res.status(err.status || 500);
    // error.html File render
    res.render("../public/views/error.html");
  });
}

app.use(function (err, req, res, next) {
  // status 404 OR 500 send
  res.status(err.status || 500);
});

// PORT 8000
server.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`server start success PORT : ${port}`);
  }
});
