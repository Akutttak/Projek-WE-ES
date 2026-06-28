const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/config");

const TransactionItem = sequelize.define(
  "TransactionItem",
  {
    item_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    transaction_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ticket_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    subtotal: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
  },
  {
    tableName: "transaction_items",
    freezeTableName: true,
    timestamps: false,
    underscored: true,
  },
);

module.exports = TransactionItem;
