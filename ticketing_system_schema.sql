-- =============================================================================
-- SYSTEM TICKETING & QUEUE MANAGEMENT DATABASE SCHEMA
-- Target Database: PostgreSQL / MySQL Compatible (Standard ANSI SQL)
-- =============================================================================

-- Create a new database for the ticketing system. If it already exists, drop it first to ensure a clean slate.
DROP DATABASE IF EXISTS ticketing_system;
CREATE DATABASE ticketing_system;

USE ticketing_system;

-- DROP TABLES IF THEY EXIST TO ENSURE CLEAN FRESH RESET (ORDER MATTERS DUE TO FK CONSTRAINTS)
DROP TABLE IF EXISTS transaction_items;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS queues;
DROP TABLE IF EXISTS ticket_types;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS users;

-- =============================================================================
-- 1. MODUL USER MANAGEMENT
-- =============================================================================
CREATE TABLE users (
    user_id INT NOT NULL AUTO_INCREMENT,
    nik VARCHAR(16) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL, -- Recommended: bcrypt/argon2 hashed string
    birth_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id),
    CONSTRAINT uq_user_nik UNIQUE (nik),
    CONSTRAINT uq_user_email UNIQUE (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 2. MODUL EVENT & TICKETS CATALOG
-- =============================================================================
CREATE TABLE events (
    event_id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(150) NOT NULL,
    description TEXT NULL,
    location VARCHAR(150) NOT NULL,
    event_date DATETIME NOT NULL,
    age_restriction INT DEFAULT 0, -- Age limits (e.g., 0 for All Ages, 13, 17, 18+)
    banner_url VARCHAR(255) NULL,   -- Direct path to static asset or cloud bucket
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (event_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE ticket_types (
    ticket_type_id INT NOT NULL AUTO_INCREMENT,
    event_id INT NOT NULL,
    category_name VARCHAR(50) NOT NULL, -- e.g., 'VIP', 'CAT 1', 'Festival'
    price DECIMAL(12, 2) NOT NULL,
    quota INT NOT NULL,
    sold_out BOOLEAN DEFAULT FALSE,     -- UI Quick Flag
    PRIMARY KEY (ticket_type_id),
    CONSTRAINT fk_tickets_event FOREIGN KEY (event_id) 
        REFERENCES events(event_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 3. MODUL WAITING ROOM / QUEUE SYSTEM
-- =============================================================================
CREATE TABLE queues (
    queue_id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    event_id INT NOT NULL,
    queue_number INT NOT NULL,
    status ENUM('waiting', 'completed', 'expired') DEFAULT 'waiting',
    estimated_time INT NOT NULL, -- Queue time estimation in minutes
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,    -- Session window expiration time to complete buy
    PRIMARY KEY (queue_id),
    CONSTRAINT fk_queues_user FOREIGN KEY (user_id) 
        REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_queues_event FOREIGN KEY (event_id) 
        REFERENCES events(event_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 4. MODUL TRANSACTION & CHECKOUT LOGS
-- =============================================================================
CREATE TABLE transactions (
    transaction_id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    total_amount DECIMAL(12, 2) NOT NULL,
    payment_method ENUM('gopay', 'ovo', 'qris') NOT NULL,
    status ENUM('pending', 'success', 'failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (transaction_id),
    CONSTRAINT fk_transactions_user FOREIGN KEY (user_id) 
        REFERENCES users(user_id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE transaction_items (
    item_id INT NOT NULL AUTO_INCREMENT,
    transaction_id INT NOT NULL,
    ticket_type_id INT NOT NULL,
    quantity INT NOT NULL,
    subtotal DECIMAL(12, 2) NOT NULL,
    PRIMARY KEY (item_id),
    CONSTRAINT fk_items_transaction FOREIGN KEY (transaction_id) 
        REFERENCES transactions(transaction_id) ON DELETE CASCADE,
    CONSTRAINT fk_items_ticket_type FOREIGN KEY (ticket_type_id) 
        REFERENCES ticket_types(ticket_type_id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 5. MODUL SESSION & REMEMBER ME MANAGEMENT
-- =============================================================================
CREATE TABLE user_sessions (
    session_id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    token VARCHAR(64) NOT NULL,        -- Token unik (bisa menggunakan SHA-256 hash) yang disimpan di Cookie user
    user_agent VARCHAR(255) NULL,      -- Menyimpan info browser/perangkat (opsional, untuk security log)
    ip_address VARCHAR(45) NULL,       -- Menyimpan IP Address user (opsional)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,     -- Waktu kadaluarsa cookie (misal: +30 hari jika "Remember Me" dicentang)
    PRIMARY KEY (session_id),
    CONSTRAINT uq_session_token UNIQUE (token),
    CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) 
        REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- MOCK DATA / SEEDERS FOR INITIAL TESTING (FORMALITAS & TESTING)
-- =============================================================================

-- Mock Event 1: Music Concert (Age restricted 18+)
INSERT INTO events (title, description, location, event_date, age_restriction, banner_url)
VALUES ('Surabaya Soundwave 2026', 'The biggest annual indie rock festival in East Java.', 'Grand City Convention Hall, Surabaya', '2026-08-15 19:00:00', 18, 'assets/banners/soundwave2026.png');

-- Mock Event 2: General Animation Expo (All Ages)
INSERT INTO events (title, description, location, event_date, age_restriction, banner_url)
VALUES ('Bunkasai Culture Fest 2026', 'Japanese traditional and modern pop culture gathering.', 'ISTTS Campus Courtyard, Surabaya', '2026-09-05 10:00:00', 0, 'assets/banners/bunkasai2026.png');

-- Ticket Types for Soundwave
INSERT INTO ticket_types (event_id, category_name, price, quota, sold_out) VALUES 
(1, 'VIP Lounge', 1250000.00, 50, FALSE),
(1, 'Festival Ground', 450000.00, 500, FALSE);

-- Ticket Types for Bunkasai
INSERT INTO ticket_types (event_id, category_name, price, quota, sold_out) VALUES 
(2, 'Regular One-Day Pass', 35000.00, 1500, FALSE),
(2, 'Cosplayer Special Package', 60000.00, 200, FALSE);
