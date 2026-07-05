const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const JWT_SECRET = process.env.JWT_SECRET || "JasonLowkeyGay";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "2h";
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";

// --- HELPER FUNCTIONS ---
function getUserRole(user) {
  const admins = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  return admins.includes(String(user.email || "").toLowerCase())
    ? "admin"
    : "user";
}

function signAccessToken(user) {
  return jwt.sign(
    {
      user_id: user.user_id,
      email: user.email,
      full_name: user.full_name,
      role: getUserRole(user),
      type: "access",
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN },
  );
}

function signRefreshToken(user) {
  return jwt.sign(
    {
      user_id: user.user_id,
      email: user.email,
      role: getUserRole(user),
      type: "refresh",
    },
    JWT_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN },
  );
}

function setAuthCookies(res, accessToken, refreshToken) {
  res.cookie("token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 2 * 60 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

function sendAuthResponse(res, user, statusCode = 200) {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  setAuthCookies(res, accessToken, refreshToken);

  return res.status(statusCode).json({
    message: "Authentication successful.",
    accessToken,
    token: accessToken,
    user: {
      user_id: user.user_id,
      nik: user.nik,
      full_name: user.full_name,
      email: user.email,
      birth_date: user.birth_date,
      role: getUserRole(user),
    },
  });
}

// --- CONTROLLER FUNCTIONS ---
async function register(req, res) {
  const { nik, full_name, email, password, birth_date } = req.body;
  let user;
  try {
    if (!nik || !full_name || !email || !password || !birth_date) {
      throw new CustomError(
        "nik, full_name, email, password, and birth_date are required.",
        400,
      );
    }

    user = await User.findOne({ where: { nik: nik } });
    if (user) {
      throw new CustomError("NIK already in use.", 409);
    }
    user = await User.findOne({ where: { email: email } });
    if (user) {
      throw new CustomError("Email already in use.", 409);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({
      nik,
      full_name,
      email,
      password: hashedPassword,
      birth_date,
    });
  } catch (error) {
    console.log(error.statusCode);
    if (error.statusCode == undefined) {
      console.log(error.errors);
      return res
        .status(500)
        .json({ message: "Registration failed", details: error.message });
    }
    return res.status(error.statusCode).json({ message: error.message });
  }
  return sendAuthResponse(res, user, 201);
}

async function login(req, res) {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      throw new CustomError("email and password are required.", 400);
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new CustomError("Invalid email or password.", 401);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new CustomError("Invalid email or password.", 401);
    }

    return sendAuthResponse(res, user, 200);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res
      .status(statusCode)
      .json({ message: error.message || "Login failed." });
  }
}

async function refresh(req, res) {
  const refreshToken = req.cookies?.refreshToken || req.cookies?.token;

  if (!refreshToken) {
    return res.status(401).json({ message: "Missing refresh token." });
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET);

    if (decoded.type !== "refresh") {
      throw new Error("Invalid token type");
    }

    const user = await User.findByPk(decoded.user_id);
    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    const accessToken = signAccessToken(user);
    const nextRefreshToken = signRefreshToken(user);
    setAuthCookies(res, accessToken, nextRefreshToken);

    return res.status(200).json({
      message: "Token refreshed.",
      accessToken,
      token: accessToken,
      user: {
        user_id: user.user_id,
        email: user.email,
        full_name: user.full_name,
        role: getUserRole(user),
      },
    });
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Invalid or expired refresh token." });
  }
}

async function logout(_req, res) {
  res.clearCookie("refreshToken");
  res.clearCookie("token");
  res.clearCookie("accessToken");
  return res
    .status(200)
    .json({ message: "Logout successful. Cookies removed." });
}

module.exports = {
  register,
  login,
  refresh,
  logout,
};
