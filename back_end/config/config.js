const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME || "ticketing_system",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false,
    define: {
      timestamps: false,
    },
  },
);

async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully.");
    return sequelize;
  } catch (error) {
    console.error("Unable to connect to the database:", error.message);
    throw error;
  }
}

module.exports = { sequelize, connectDB };
