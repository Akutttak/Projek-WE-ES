const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/config");

const TicketType = sequelize.define(
  "TicketType",
  {
    ticket_type_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    category_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    quota: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sold_out: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "ticket_types",
    freezeTableName: true,
    timestamps: false,
    underscored: true,
  },
);

module.exports = TicketType;
