const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "JasonLowkeyGay";
const ADMIN_EMAIL = (
  process.env.SEED_USER_EMAIL || "seed.admin@tixqueue.local"
).toLowerCase();

function adminAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!token) {
    return res.status(401).json({ message: "Missing token." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const email = String(decoded?.email || "").toLowerCase();
    if (!decoded || email !== ADMIN_EMAIL) {
      return res.status(403).json({ message: "Admin access required." });
    }
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}

module.exports = adminAuth;
