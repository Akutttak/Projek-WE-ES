const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/config");

const Transaction = sequelize.define(
  "Transaction",
  {
    transaction_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    payment_method: {
      type: DataTypes.ENUM("gopay", "ovo", "qris"),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "success", "failed"),
      defaultValue: "pending",
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "transactions",
    freezeTableName: true,
    timestamps: false,
    underscored: true,
  },
);

module.exports = Transaction;
