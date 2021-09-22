const models = require("../../database/connect");

module.exports = (io, Server) => {
  io.on("connection", (socket) => {
    socket.on("check_veganStep", (user_id) => {
      models.Level.findOne({
        user_id: user_id,
      }).then((rows) => {
        if (!rows) {
          socket.emit("check_veganStep", false);
        } else {
          socket.emit("check_veganStep", true, rows);
        }
      });
    });

    socket.on("save_step", (vegan_step, g_data, user_id) => {
      models.Level.findOne({
        user_id: user_id,
      })
        .then((rows) => {
          if (!rows) {
            const setLevelRow = new models.Level({
              user_id: user_id,
              vegan_level: vegan_step,
              vegan_point: 0,
              diet: g_data,
              visite_recipe: 0,
            });
            try {
              setLevelRow.save();
              socket.emit("save_step", true);
            } catch (e) {
              console.log(e);
            }
          } else if (rows) {
            socket.emit("save_step", false);
          }
        })
        .catch((err) => {
          socket.emit("save_step", false, err);
        });
    });
  });
};
