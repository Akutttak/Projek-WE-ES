const { sequelize } = require("../config/config");
require("./associations");

async function syncModels() {
  await sequelize.sync({ alter: true });
  // NOTE: In development, alter:true allows Sequelize to update the DB schema
  // to match model changes like new enum values for Transaction.status.
  console.log("Database models synchronized.");
}

module.exports = syncModels;
