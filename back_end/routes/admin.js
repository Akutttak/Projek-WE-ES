const express = require("express");
const router = express.Router();
const adminAuth = require("../middlewares/adminAuth");
const { upload, validateBody, Joi } = require("../middlewares/validators");
const controller = require("../controllers/adminController");

// Joi schemas
const eventSchema = Joi.object({
  title: Joi.string().max(150).required(),
  description: Joi.string().allow(null, ""),
  location: Joi.string().max(150).required(),
  event_date: Joi.string().required(),
  age_restriction: Joi.number().integer().min(0).optional(),
});

const ticketTypeSchema = Joi.object({
  event_id: Joi.number().integer().required(),
  category_name: Joi.string().max(50).required(),
  price: Joi.number().required(),
  quota: Joi.number().integer().required(),
  sold_out: Joi.boolean().optional(),
});

// Events
router.post(
  "/api/admin/events",
  adminAuth,
  upload.single("banner"),
  validateBody(eventSchema),
  controller.createEvent,
);

router.get("/api/admin/events", adminAuth, controller.viewEvents);

router.put(
  "/api/admin/events/:id",
  adminAuth,
  upload.single("banner"),
  validateBody(eventSchema),
  controller.updateEvent,
);

router.delete("/api/admin/events/:id", adminAuth, controller.deleteEvent);

// Ticket types
router.post(
  "/api/admin/ticket-types",
  adminAuth,
  validateBody(ticketTypeSchema),
  controller.createTicketType,
);

router.get("/api/admin/ticket-types", adminAuth, controller.viewTicketTypes);

router.put(
  "/api/admin/ticket-types/:id",
  adminAuth,
  validateBody(ticketTypeSchema),
  controller.updateTicketType,
);

router.delete(
  "/api/admin/ticket-types/:id",
  adminAuth,
  controller.deleteTicketType,
);

module.exports = router;
