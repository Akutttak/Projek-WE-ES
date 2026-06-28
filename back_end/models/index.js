const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/config");

const User = sequelize.define(
  "User",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nik: {
      type: DataTypes.STRING(16),
      allowNull: false,
      unique: true,
    },
    full_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    birth_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "users",
    freezeTableName: true,
    timestamps: false,
    underscored: true,
  },
);

const Event = sequelize.define(
  "Event",
  {
    event_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    event_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    age_restriction: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    banner_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "events",
    freezeTableName: true,
    timestamps: false,
    underscored: true,
  },
);

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

const UserSession = sequelize.define(
  "UserSession",
  {
    session_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true,
    },
    user_agent: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    ip_address: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "user_sessions",
    freezeTableName: true,
    timestamps: false,
    underscored: true,
  },
);

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
