const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Keep the original name
  },
});

const upload = multer({ storage }).single("media"); // Field name must match frontend

module.exports = upload;
