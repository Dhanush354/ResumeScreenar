const multer = require("multer");

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Use memory storage since we only need the buffer for pdf-parse
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "Only PDF files are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
});

module.exports = upload;
