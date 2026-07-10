"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Users
    await queryInterface.createTable("users", {
      user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      nik: {
        type: Sequelize.STRING(16),
        allowNull: false,
        unique: true,
      },
      full_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      birth_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    // Events
    await queryInterface.createTable("events", {
      event_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      location: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      event_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      age_restriction: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      banner_url: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    // Ticket types
    await queryInterface.createTable("ticket_types", {
      ticket_type_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      event_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      category_name: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      price: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
      quota: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      sold_out: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    });

    // Queues
    await queryInterface.createTable("queues", {
      queue_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      event_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      queue_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("waiting", "completed", "expired"),
        defaultValue: "waiting",
      },
      estimated_time: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      joined_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // Transactions
    await queryInterface.createTable("transactions", {
      transaction_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      total_amount: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
      payment_method: {
        type: Sequelize.ENUM("gopay", "ovo", "qris"),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("in_queue", "pending", "success", "failed"),
        defaultValue: "in_queue",
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    // Transaction items
    await queryInterface.createTable("transaction_items", {
      transaction_item_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      transaction_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      ticket_type_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      price: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
    });

    // User sessions
    await queryInterface.createTable("user_sessions", {
      session_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      refresh_token: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("user_sessions");
    await queryInterface.dropTable("transaction_items");
    await queryInterface.dropTable("transactions");
    await queryInterface.dropTable("queues");
    await queryInterface.dropTable("ticket_types");
    await queryInterface.dropTable("events");
    await queryInterface.dropTable("users");

    // Drop enums created by Sequelize (MySQL leaves them attached to columns, so dropping tables is sufficient)
  },
};
