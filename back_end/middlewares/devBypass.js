/**
 * Dev-only bypass middleware for simulating queue load without JWT.
 *
 * Usage in EchoAPI / Postman:
 *   Add header:  x-dev-user-id: <user_id>
 *   (optional)   x-dev-user-role: user  (defaults to "user")
 *
 * If the header is NOT present, falls back to normal JWT verification.
 * This file should NEVER be used in production.
 */

const User = require("../models/User");
const { verifyJWT } = require("./verifyJWT");

const devBypass = async (req, res, next) => {
  const devUserId = req.headers["x-dev-user-id"];

  // No bypass header → fall back to JWT
  if (!devUserId) {
    return verifyJWT(req, res, next);
  }

  const userId = parseInt(devUserId, 10);
  if (!userId || isNaN(userId)) {
    return res.status(400).json({ message: "x-dev-user-id must be a valid integer." });
  }

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: `No user found with user_id ${userId}.` });
    }

    const role = req.headers["x-dev-user-role"] || "user";

    req.user = {
      user_id: user.user_id,
      email: user.email,
      full_name: user.full_name,
      role,
      type: "access",
    };
    req.yanglogin = req.user;

    return next();
  } catch (err) {
    return res.status(500).json({ message: "devBypass lookup failed.", details: err.message });
  }
};

module.exports = { devBypass };
