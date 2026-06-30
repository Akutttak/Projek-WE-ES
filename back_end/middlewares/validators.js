const Joi = require("joi");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const safe = file.originalname.replace(/[^a-zA-Z0-9.\-]/g, "_");
    cb(null, `${unique}-${safe}`);
  },
});

const allowedExt = ["jpg", "jpeg", "gif", "webp", "jfif", "png"];
function fileFilter(_req, file, cb) {
  const ext = (file.originalname || "").split(".").pop().toLowerCase();
  if (allowedExt.includes(ext)) return cb(null, true);
  return cb(new Error("Invalid file type. Allowed: " + allowedExt.join(", ")));
}

const upload = multer({ storage, fileFilter });

function validateBody(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: false,
    });
    if (error) {
      return res
        .status(400)
        .json({
          message: "Validation failed.",
          details: error.details.map((d) => d.message),
        });
    }
    return next();
  };
}

module.exports = { upload, validateBody, Joi };
