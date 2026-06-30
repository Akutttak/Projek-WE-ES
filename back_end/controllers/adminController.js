const { Event, TicketType } = require("../models/associations");

async function createEvent(req, res) {
  try {
    const { title, description, location, event_date, age_restriction } =
      req.body;
    const banner = req.file ? `/uploads/${req.file.filename}` : null;
    const ev = await Event.create({
      title,
      description,
      location,
      event_date,
      age_restriction,
      banner_url: banner,
    });
    return res.status(201).json({ message: "Event created.", event: ev });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Create event failed.", details: err.message });
  }
}

async function viewEvents(req, res) {
  try {
    const { sort = "desc", title, location } = req.query;
    const where = {};
    if (title) where.title = { [Event.sequelize.Op.like]: `%${title}%` };
    if (location)
      where.location = { [Event.sequelize.Op.like]: `%${location}%` };

    const orderDir = String(sort).toLowerCase() === "asc" ? "ASC" : "DESC";
    const events = await Event.findAll({
      where,
      order: [["event_date", orderDir]],
    });
    return res.status(200).json({ events });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Fetch events failed.", details: err.message });
  }
}

async function updateEvent(req, res) {
  try {
    const id = req.params.id;
    const ev = await Event.findByPk(id);
    if (!ev) return res.status(404).json({ message: "Event not found." });
    const { title, description, location, event_date, age_restriction } =
      req.body;
    const banner = req.file ? `/uploads/${req.file.filename}` : ev.banner_url;
    await ev.update({
      title,
      description,
      location,
      event_date,
      age_restriction,
      banner_url: banner,
    });
    return res.status(200).json({ message: "Event updated.", event: ev });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Update event failed.", details: err.message });
  }
}

async function deleteEvent(req, res) {
  try {
    const id = req.params.id;
    const ev = await Event.findByPk(id);
    if (!ev) return res.status(404).json({ message: "Event not found." });
    await ev.destroy();
    return res.status(200).json({ message: "Event deleted." });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Delete event failed.", details: err.message });
  }
}

// Ticket Types
async function createTicketType(req, res) {
  try {
    const { event_id, category_name, price, quota, sold_out } = req.body;
    const tt = await TicketType.create({
      event_id,
      category_name,
      price,
      quota,
      sold_out,
    });
    return res
      .status(201)
      .json({ message: "Ticket type created.", ticket_type: tt });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Create ticket type failed.", details: err.message });
  }
}

async function viewTicketTypes(req, res) {
  try {
    const { category_name, sort = "asc", sold_out } = req.query;
    const where = {};
    if (category_name)
      where.category_name = {
        [TicketType.sequelize.Op.like]: `%${category_name}%`,
      };
    if (typeof sold_out !== "undefined") {
      if (sold_out === "true" || sold_out === "1") where.sold_out = true;
      else if (sold_out === "false" || sold_out === "0") where.sold_out = false;
    }
    const orderDir = String(sort).toLowerCase() === "desc" ? "DESC" : "ASC";
    const types = await TicketType.findAll({
      where,
      order: [["price", orderDir]],
    });
    return res.status(200).json({ ticket_types: types });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Fetch ticket types failed.", details: err.message });
  }
}

async function updateTicketType(req, res) {
  try {
    const id = req.params.id;
    const tt = await TicketType.findByPk(id);
    if (!tt) return res.status(404).json({ message: "Ticket type not found." });
    const { category_name, price, quota, sold_out } = req.body;
    await tt.update({ category_name, price, quota, sold_out });
    return res
      .status(200)
      .json({ message: "Ticket type updated.", ticket_type: tt });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Update ticket type failed.", details: err.message });
  }
}

async function deleteTicketType(req, res) {
  try {
    const id = req.params.id;
    const tt = await TicketType.findByPk(id);
    if (!tt) return res.status(404).json({ message: "Ticket type not found." });
    await tt.destroy();
    return res.status(200).json({ message: "Ticket type deleted." });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Delete ticket type failed.", details: err.message });
  }
}

module.exports = {
  createEvent,
  viewEvents,
  updateEvent,
  deleteEvent,
  createTicketType,
  viewTicketTypes,
  updateTicketType,
  deleteTicketType,
};
