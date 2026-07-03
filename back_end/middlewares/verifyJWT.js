const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const verifyJWT = (req, res, next) => {
  console.log("=== BACKEND: REQUEST MASUK KE MIDDLEWARE VERIFYJWT ===");
  console.log("Headers yang diterima:", req.headers);
  console.log("Cookies yang terdeteksi oleh cookie-parser:", req.cookies);

  const accessToken = req.cookies.token;

  console.log(
    "Token yang diekstrak dari cookie:",
    accessToken ? "Ada (Valid/Tidaknya akan dicek)" : "KOSONG/UNDEFINED",
  );

  if (!accessToken) {
    return res.status(401).json({
      message: "blm login (cookie not found)",
    });
  }

  jwt.verify(accessToken, JWT_SECRET, (err, decoded) => {
    // Kalau token expired atau dimanipulasi
    if (err) {
      return res.status(401).json({ message: "Token tidak valid atau sudah expired" });
    }

    // Kalau semua aman, teruskan data user ke controller
    console.log("✅ JWT VERIFY SUCCESS. User login:", decoded.email);
    req.yanglogin = decoded;
    req.user = decoded;

    // Lanjut ke program/controller berikutnya
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
