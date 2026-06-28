const { sequelize } = require("../config/config");
require("./associations");

async function syncModels() {
  await sequelize.sync({ alter: true });
  console.log("Database models synchronized.");
}

module.exports = syncModels;
