const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    return cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const fileFilter = function (req, file, cb) {
  const allowedFileTypes = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/avif",
  ];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Allowed image types are png, jpg, jpeg."));
  }
};

module.exports = multer({
  storage: storage,
  fileFilter: fileFilter,
});
