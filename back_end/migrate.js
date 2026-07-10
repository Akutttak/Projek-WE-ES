const { sequelize } = require("./config/config");
const Sequelize = require("sequelize");
const migration = require("./migrations/20260710-initial-create-tables");

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected.");
    const queryInterface = sequelize.getQueryInterface();
    await migration.up(queryInterface, Sequelize);
    console.log("Migration applied successfully.");
  } catch (err) {
    console.error("Migration failed:", err);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
})();
