const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "JasonLowkeyGay";

function extractAccessToken(req) {
  const authHeader = req.headers.authorization || "";
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (match) {
    return match[1];
  }

  return req.cookies?.accessToken || req.cookies?.token || null;
}

const verifyJWT = (req, res, next) => {
  const accessToken = extractAccessToken(req);

  if (!accessToken) {
    return res.status(401).json({
      message: "Please login first.",
    });
  }

  jwt.verify(accessToken, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ message: "Token tidak valid atau sudah expired" });
    }

    if (decoded.type !== "access") {
      return res.status(401).json({ message: "Invalid token type." });
    }

    req.yanglogin = decoded;
    req.user = decoded;
    next();
  });
};

function allowRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access forbidden." });
    }
    return next();
  };
}

module.exports = { verifyJWT, allowRoles };
