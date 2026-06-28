const User = require("./User");
const Event = require("./Event");
const TicketType = require("./TicketType");
const Queue = require("./Queue");
const Transaction = require("./Transaction");
const TransactionItem = require("./TransactionItem");
const UserSession = require("./UserSession");

User.hasMany(Queue, { foreignKey: "user_id", as: "queues" });
User.hasMany(Transaction, { foreignKey: "user_id", as: "transactions" });
User.hasMany(UserSession, { foreignKey: "user_id", as: "sessions" });

Event.hasMany(TicketType, { foreignKey: "event_id", as: "ticket_types" });
Event.hasMany(Queue, { foreignKey: "event_id", as: "queues" });

TicketType.belongsTo(Event, { foreignKey: "event_id", as: "event" });
TicketType.hasMany(TransactionItem, {
  foreignKey: "ticket_type_id",
  as: "transaction_items",
});

Queue.belongsTo(User, { foreignKey: "user_id", as: "user" });
Queue.belongsTo(Event, { foreignKey: "event_id", as: "event" });

Transaction.belongsTo(User, { foreignKey: "user_id", as: "user" });
Transaction.hasMany(TransactionItem, {
  foreignKey: "transaction_id",
  as: "items",
});

TransactionItem.belongsTo(Transaction, {
  foreignKey: "transaction_id",
  as: "transaction",
});
TransactionItem.belongsTo(TicketType, {
  foreignKey: "ticket_type_id",
  as: "ticket_type",
});

UserSession.belongsTo(User, { foreignKey: "user_id", as: "user" });

module.exports = {
  User,
  Event,
  TicketType,
  Queue,
  Transaction,
  TransactionItem,
  UserSession,
};
