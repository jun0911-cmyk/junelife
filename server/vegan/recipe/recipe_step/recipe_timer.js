const models = require("../../../database/connect");

const getDate = () => {
  const date = new Date();
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
};

const cleanDB = () => {
  let getTodayRecipe = 0;
  let date = getDate();
  models.Level.find().then((levelList) => {
    levelList.forEach((rows) => {
      if (rows.today_visite != "") {
        getTodayRecipe = rows.today_visite.trim().split(",  ");
      }
      // check
      if (rows.visite_recipe == "") {
        models.Level.updateOne(
          { user_id: rows.user_id },
          {
            $set: {
              register_today: 0,
              visite_recipe: date + ":" + getTodayRecipe.length,
              today_visite: "",
              register_recipe: "",
            },
          }
        )
          .then((result) => {
            console.log("changed today");
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        models.Level.aggregate([
          {
            $project: {
              visite_recipe: {
                $concat: [
                  `${rows.visite_recipe}`,
                  ", ",
                  `${date + ":" + getTodayRecipe.length}`,
                ],
              },
            },
          },
        ]).then((result) => {
          models.Level.updateOne(
            { user_id: rows.user_id },
            {
              $set: {
                register_today: 0,
                visite_recipe: result[0].visite_recipe,
                today_visite: "",
                register_recipe: "",
              },
            }
          )
            .then((result) => {
              console.log("changed today");
            })
            .catch((err) => {
              console.log(err);
            });
        });
      }
    });
  });
};

module.exports = () => {
  let nowDate = new Date();
  let end_time = new Date(
    `${nowDate.getMonth() + 1}/${
      nowDate.getDate() + 1
    }/${nowDate.getFullYear()}`
  );
  let second = 1000;
  let minute = second * 60;
  let hour = minute * 60;
  let day = hour * 24;
  // hoisting
  var timer;
  // show timer
  function showRemaining() {
    let now_time = new Date();
    let distance = end_time - now_time;
    if (distance < 0) {
      clearInterval(timer);
      cleanDB();
      return;
    }
  }

  timer = setInterval(showRemaining, 1000);
};
