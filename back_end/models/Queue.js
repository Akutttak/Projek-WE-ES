const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/config");

const Queue = sequelize.define(
  "Queue",
  {
    queue_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    queue_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("waiting", "completed", "expired"),
      defaultValue: "waiting",
    },
    estimated_time: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    joined_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "queues",
    freezeTableName: true,
    timestamps: false,
    underscored: true,
  },
);

module.exports = Queue;
