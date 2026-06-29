const { sequelize } = require("../config/config");
require("./associations");

async function syncModels() {
  await sequelize.sync({ alter: false }); 
  // kena too many key problem | true => false
  console.log("Database models synchronized.");
}

module.exports = syncModels;
