# TixQueue Studio API Documentation

## Overview
TixQueue Studio is a premium ticketing and queueing system with a virtual queue engine for high-demand ticket sales. This document provides complete API reference for all endpoints.

**Base URL:** `http://localhost:3010`

## Table of Contents
1. [Authentication](#authentication)
2. [Admin - Events Management](#admin---events-management)
3. [Admin - Ticket Types Management](#admin---ticket-types-management)
4. [Events Search](#events-search)
5. [Transactions](#transactions)
6. [Payment - Midtrans](#payment---midtrans)
7. [Public Endpoints](#public-endpoints)
8. [Authentication & Headers](#authentication--headers)
9. [Error Handling](#error-handling)

---

## Authentication

### Register User
Create a new user account.

**Endpoint:**
```
POST /api/user/register
```

**Request Body:**
```json
{
  "nik": "1234567890123456",
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "birth_date": "1990-01-15"
}
```

**Response (201 Created):**
```json
{
  "message": "Authentication successful.",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "user_id": 1,
    "nik": "1234567890123456",
    "full_name": "John Doe",
    "email": "john@example.com",
    "birth_date": "1990-01-15",
    "role": "user"
  }
}
```

**Status Codes:**
- `201`: User created successfully
- `400`: Missing required fields
- `409`: NIK or email already in use
- `500`: Server error

---

### Login User
Authenticate and get access tokens.

**Endpoint:**
```
POST /api/user/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200 OK):**
```json
{
  "message": "Authentication successful.",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "user_id": 1,
    "nik": "1234567890123456",
    "full_name": "John Doe",
    "email": "john@example.com",
    "birth_date": "1990-01-15",
    "role": "user"
  }
}
```

**Status Codes:**
- `200`: Login successful
- `400`: Email and password required
- `401`: Invalid email or password
- `500`: Server error

---

### Refresh Token
Get a new access token using the refresh token.

**Endpoint:**
```
GET /api/user/refresh
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
{
  "message": "Token refreshed.",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "user_id": 1,
    "email": "john@example.com",
    "full_name": "John Doe",
    "role": "user"
  }
}
```

---

### Logout User
Logout the current user.

**Endpoint:**
```
POST /api/user/logout
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
{
  "message": "Logout successful."
}
```

---

## Admin - Events Management

### Create Event
Create a new event. **Admin only**.

**Endpoint:**
```
POST /api/admin/events
```

**Headers:**
```
Authorization: Bearer {admin_access_token}
Content-Type: multipart/form-data
```

**Form Data:**
- `title` (string, required, max 150): Event title
- `description` (string, optional): Event description
- `location` (string, required, max 150): Event location
- `event_date` (string, required): Event date (ISO 8601 format)
- `age_restriction` (number, optional): Minimum age requirement
- `banner` (file, optional): Banner image

**Example Form Data:**
```
title: Summer Concert 2026
description: An amazing summer concert featuring top artists
location: Jakarta Convention Center
event_date: 2026-08-15T19:00:00Z
age_restriction: 18
banner: [image file]
```

**Response (201 Created):**
```json
{
  "message": "Event created.",
  "event": {
    "event_id": 1,
    "title": "Summer Concert 2026",
    "description": "An amazing summer concert featuring top artists",
    "location": "Jakarta Convention Center",
    "event_date": "2026-08-15T19:00:00Z",
    "age_restriction": 18,
    "banner_url": "/uploads/banner_1234567890.jpg",
    "created_at": "2026-07-10T12:00:00Z"
  }
}
```

---

### Get All Events
Retrieve all events with filtering and sorting. **Admin only**.

**Endpoint:**
```
GET /api/admin/events?sort=desc&title=&location=
```

**Query Parameters:**
- `sort` (string, optional): Sort order - `asc` or `desc` (default: desc)
- `title` (string, optional): Filter by event title (partial match)
- `location` (string, optional): Filter by location (partial match)

**Headers:**
```
Authorization: Bearer {admin_access_token}
```

**Response (200 OK):**
```json
{
  "events": [
    {
      "event_id": 1,
      "title": "Summer Concert 2026",
      "description": "An amazing summer concert",
      "location": "Jakarta Convention Center",
      "event_date": "2026-08-15T19:00:00Z",
      "age_restriction": 18,
      "banner_url": "/uploads/banner_1234567890.jpg"
    }
  ]
}
```

---

### Update Event
Update an existing event. **Admin only**.

**Endpoint:**
```
PUT /api/admin/events/:id
```

**Headers:**
```
Authorization: Bearer {admin_access_token}
Content-Type: multipart/form-data
```

**Form Data:** (same as Create Event)

**Response (200 OK):**
```json
{
  "message": "Event updated.",
  "event": {
    "event_id": 1,
    "title": "Summer Concert 2026 - Updated",
    ...
  }
}
```

---

### Delete Event
Delete an event. **Admin only**.

**Endpoint:**
```
DELETE /api/admin/events/:id
```

**Headers:**
```
Authorization: Bearer {admin_access_token}
```

**Response (200 OK):**
```json
{
  "message": "Event deleted."
}
```

---

## Admin - Ticket Types Management

### Create Ticket Type
Create a new ticket type for an event. **Admin only**.

**Endpoint:**
```
POST /api/admin/ticket-types
```

**Headers:**
```
Authorization: Bearer {admin_access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "event_id": 1,
  "category_name": "VIP Seat",
  "price": 500000,
  "quota": 100,
  "sold_out": false
}
```

**Response (201 Created):**
```json
{
  "message": "Ticket type created.",
  "ticket_type": {
    "ticket_type_id": 1,
    "event_id": 1,
    "category_name": "VIP Seat",
    "price": "500000.00",
    "quota": 100,
    "sold_out": false
  }
}
```

---

### Get All Ticket Types
Retrieve all ticket types with filtering and sorting. **Admin only**.

**Endpoint:**
```
GET /api/admin/ticket-types?category_name=&sort=asc&sold_out=
```

**Query Parameters:**
- `category_name` (string, optional): Filter by category name
- `sort` (string, optional): Sort by price - `asc` or `desc` (default: asc)
- `sold_out` (boolean, optional): Filter by sold out status

**Headers:**
```
Authorization: Bearer {admin_access_token}
```

**Response (200 OK):**
```json
{
  "ticket_types": [
    {
      "ticket_type_id": 1,
      "event_id": 1,
      "category_name": "VIP Seat",
      "price": "500000.00",
      "quota": 100,
      "sold_out": false
    }
  ]
}
```

---

### Update Ticket Type
Update a ticket type. **Admin only**.

**Endpoint:**
```
PUT /api/admin/ticket-types/:id
```

**Headers:**
```
Authorization: Bearer {admin_access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "category_name": "VIP Seat - Premium",
  "price": 600000,
  "quota": 80,
  "sold_out": false
}
```

**Response (200 OK):**
```json
{
  "message": "Ticket type updated.",
  "ticket_type": {
    "ticket_type_id": 1,
    "event_id": 1,
    "category_name": "VIP Seat - Premium",
    "price": "600000.00",
    "quota": 80,
    "sold_out": false
  }
}
```

---

### Delete Ticket Type
Delete a ticket type. **Admin only**.

**Endpoint:**
```
DELETE /api/admin/ticket-types/:id
```

**Headers:**
```
Authorization: Bearer {admin_access_token}
```

**Response (200 OK):**
```json
{
  "message": "Ticket type deleted."
}
```

---

## Events Search

### Search Events (GET)
Search for events from PredictHQ API.

**Endpoint:**
```
GET /api/events/search?country=ID&limit=10&category=concerts
```

**Query Parameters:**
- All PredictHQ API parameters are supported
- Common: `country`, `limit`, `category`, `q`

**Note:** Requires `PREDICTHQ_API_KEY` to be set in `.env`

**Response (200 OK):**
```json
{
  "results": [
    {
      "id": "...",
      "title": "Concert",
      "location": "Jakarta",
      ...
    }
  ]
}
```

---

### Search Events (POST)
Search for events from PredictHQ API using POST.

**Endpoint:**
```
POST /api/events/search
```

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "country": "ID",
  "limit": 10,
  "category": "concerts"
}
```

**Response:** Same as GET

---

## Transactions

### Create Transaction (Queue)
Create a new transaction and enter the queue. Uses Redis BullMQ for queue management.

**Endpoint:**
```
POST /api/transactions
```

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "payment_method": "gopay",
  "items": [
    {
      "ticket_type_id": 1,
      "quantity": 2
    },
    {
      "ticket_type_id": 2,
      "quantity": 1
    }
  ]
}
```

**Parameters:**
- `payment_method` (string, required): `gopay`, `ovo`, or `qris`
- `items` (array, required): List of ticket items
  - `ticket_type_id` (number, required): Ticket type ID
  - `quantity` (number, required): 1-10 per item

**Response (202 Accepted):**
```json
{
  "message": "Anda telah masuk dalam antrean pembelian tiket.",
  "transaction_id": 1,
  "status": "in_queue",
  "queue_position": 5,
  "estimated_wait_seconds": 75,
  "estimated_wait_text": "Perkiraan menunggu 75 detik",
  "eta_ready_at": "2026-07-10T12:05:15Z"
}
```

**Status Codes:**
- `202`: Successfully queued
- `400`: Invalid request
- `403`: Admin accounts cannot buy tickets
- `503`: Queue service unavailable

---

### List Transactions
Get list of transactions.

**Endpoint:**
```
GET /api/transactions
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
{
  "transactions": [
    {
      "transaction_id": 1,
      "user_id": 1,
      "total_amount": "900000.00",
      "payment_method": "gopay",
      "status": "pending",
      "created_at": "2026-07-10T12:00:00Z",
      "items": [
        {
          "transaction_item_id": 1,
          "ticket_type_id": 1,
          "quantity": 2,
          "subtotal": "500000.00"
        }
      ]
    }
  ]
}
```

**Note:** 
- Regular users see only their own transactions
- Admin users see all transactions

---

### Check Queue Status
Check the current status of a transaction in the queue. **Public endpoint**.

**Endpoint:**
```
GET /api/transactions/queue/:id
```

**Response (200 OK - In Queue):**
```json
{
  "status": "in_queue",
  "message": "Harap menunggu. Antrean Anda sedang diproses.",
  "queue_position": 5,
  "estimated_wait_seconds": 300,
  "estimated_wait_text": "Perkiraan menunggu 300 detik",
  "eta_ready_at": "2026-07-10T12:05:15Z"
}
```

**Response (200 OK - Ready for Payment):**
```json
{
  "status": "ready",
  "message": "Giliran Anda telah tiba! Silakan lakukan pembayaran.",
  "transaction_data": {
    "transaction_id": 1,
    "user_id": 1,
    "total_amount": "900000.00",
    "payment_method": "gopay",
    "status": "pending",
    "created_at": "2026-07-10T12:00:00Z"
  }
}
```

**Response (200 OK - Failed):**
```json
{
  "status": "failed",
  "message": "Mohon maaf, tiket sudah habis saat giliran Anda tiba."
}
```

---

### Get Transaction Details
Get detailed information about a transaction.

**Endpoint:**
```
GET /api/transactions/:id
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
{
  "transaction": {
    "transaction_id": 1,
    "user_id": 1,
    "total_amount": "900000.00",
    "payment_method": "gopay",
    "status": "pending",
    "created_at": "2026-07-10T12:00:00Z",
    "items": [
      {
        "transaction_item_id": 1,
        "ticket_type_id": 1,
        "quantity": 2,
        "subtotal": "500000.00"
      }
    ]
  }
}
```

---

### Update Transaction Status
Update the status of a transaction. **Admin only**.

**Endpoint:**
```
PUT /api/transactions/:id/status
```

**Headers:**
```
Authorization: Bearer {admin_access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "success"
}
```

**Valid Statuses:** `pending`, `success`, `failed`

**Response (200 OK):**
```json
{
  "message": "Transaction updated.",
  "transaction": {
    "transaction_id": 1,
    "status": "success",
    ...
  }
}
```

---

### Delete Transaction
Delete a transaction. **Admin only**.

**Endpoint:**
```
DELETE /api/transactions/:id
```

**Headers:**
```
Authorization: Bearer {admin_access_token}
```

**Response (200 OK):**
```json
{
  "message": "Transaction deleted."
}
```

---

## Payment - Midtrans

### Get Midtrans Payment Token
Get Midtrans payment token and redirect URL for a transaction.

**Endpoint:**
```
POST /api/transactions/midtrans/:id
```

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Response (200 OK):**
```json
{
  "token": "...",
  "redirect_url": "https://app.sandbox.midtrans.com/snap/v1/...",
  "payment_url": "https://app.sandbox.midtrans.com/snap/v1/..."
}
```

---

### Check Midtrans Payment Status
Check the payment status from Midtrans.

**Endpoint:**
```
GET /api/transactions/midtrans/:id
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
{
  "transaction_status": "settlement",
  "order_id": 1,
  "gross_amount": "900000.00",
  ...
}
```

**Note:** If payment is settled (successful), the transaction status is automatically updated to `success`.

---

## Public Endpoints

### Get Homepage Data
Get homepage data including branding, toolbar, steps, hero section, and popular events.

**Endpoint:**
```
GET /api/homepage
```

**Response (200 OK):**
```json
{
  "brand": {
    "title": "TixQueue Studio",
    "subtitle": "Premium Ticketing and Queueing Concept"
  },
  "toolbar": [
    { "label": "Live Design Concept", "active": true },
    { "label": "Technical Docs", "active": false }
  ],
  "steps": [
    { "label": "Konser Terbuka", "active": true },
    { "label": "Antrean Server", "active": false }
  ],
  "hero": {
    "tag": "Live Smart Queue Enabled",
    "title": "Dapatkan Tiket Konser Impian Anda Tanpa Server Down",
    "description": "Menggunakan teknologi alokasi antrean virtual berbasis antrean pintar.",
    "searchPlaceholder": "Cari artis, band, atau festival...",
    "searchButton": "Cari"
  },
  "popular": {
    "title": "Penjualan Tiket Terpopuler",
    "cards": [...]
  },
  "footer": {
    "text": "TixQueue Studio - Virtual Queue Engine for High-Demand Ticket Sales",
    "meta": "Status: All systems operational"
  }
}
```

---

## Authentication & Headers

### JWT Token
- Access tokens expire in 2 hours
- Refresh tokens expire in 7 days
- Stored in httpOnly cookies for security
- Also returned in response body

### Required Headers
Most endpoints require authentication:
```
Authorization: Bearer {access_token}
```

Or alternatively, tokens can be sent via cookies:
```
Cookie: token={access_token}
```

### Content-Type
- JSON endpoints: `Content-Type: application/json`
- Form/file upload: `Content-Type: multipart/form-data`

---

## Error Handling

### Common Error Responses

**400 Bad Request:**
```json
{
  "message": "Missing required fields or invalid input."
}
```

**401 Unauthorized:**
```json
{
  "message": "Please login first." 
}
```

**403 Forbidden:**
```json
{
  "message": "Access forbidden."
}
```

**404 Not Found:**
```json
{
  "message": "Resource not found."
}
```

**409 Conflict:**
```json
{
  "message": "NIK already in use."
}
```

**500 Internal Server Error:**
```json
{
  "message": "Operation failed.",
  "details": "Error details here"
}
```

---

## Environment Variables

Required in `.env`:
```
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=2h
REFRESH_TOKEN_EXPIRES_IN=7d
ADMIN_EMAILS=admin@example.com,admin2@example.com
PREDICTHQ_API_KEY=your_predicthq_api_key
MIDTRANS_SERVER_KEY=your_midtrans_server_key
DATABASE_URL=your_database_url
REDIS_URL=redis://localhost:6379
```

---

## Installation & Running

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Redis (for queue):
   ```bash
   # Download from https://github.com/microsoftarchive/redis/releases
   # Or use Docker: docker run -d -p 6379:6379 redis
   ```

3. Run database seeder:
   ```bash
   node back_end/seeders/userSeeder.js
   ```

4. Start the server:
   ```bash
   npx nodemon back_end/index.js
   ```

The API will be available at `http://localhost:3010`

---

## Postman Collection

A complete Postman collection is provided in `TixQueue_API_Collection.postman_collection.json`. 

To import:
1. Open Postman
2. Click "Import" 
3. Select the JSON file
4. Set the `base_url` variable to your API endpoint
5. Use the collection to test all endpoints

---

## Support

For issues or questions, please refer to the README.md or contact the development team.
