const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const app = express();
const dbConnect = require("./db/dbconnect");
const authRoutes = require("./routes/auth");
const feedRoutes = require("./routes/feed");
const goalRoutes = require("./routes/goal");
const userRoutes = require("./routes/user");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");
const categoryRoutes = require("./routes/category");

dbConnect();

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     return cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     return cb(
//       null,
//       file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });

// const fileFilter = function (req, file, cb) {
//   const allowedFileTypes = ["image/png", "image/jpg", "image/jpeg"];
//   if (allowedFileTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error("Invalid file type. Only image files are allowed."));
//   }
// };

// const upload = multer({ storage: storage, fileFilter: fileFilter }).single(
//   "image"
// );
// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
// }).single("image");

app.use(bodyParser.json());

// Middleware to handle file upload
// const handleFileUpload = (req, res, next) => {
//   upload(req, res, (err) => {
//     if (err instanceof multer.MulterError) {
//       // A Multer error occurred during file upload
//       res.status(400).json({ error: "Multer error: " + err.message });
//     } else if (err) {
//       // An unknown error occurred
//       res.status(500).json({ error: "An error occurred: " + err.message });
//     } else {
//       // File upload successful, continue to the next middleware/route
//       next();
//     }
//   });
// };

// Use the handleFileUpload middleware for all routes
// app.use(handleFileUpload);

const crossOrigin = require("./utils/crossOrigin");
const errorMiddleware = require("./middleware/errorMiddleware");

//to view the file as static file
app.use(express.static(path.resolve(__dirname, "./uploads")));

app.use(crossOrigin);
app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/goal", goalRoutes);
app.use("/cart", cartRoutes);
app.use("/order", orderRoutes);
app.use("/category", categoryRoutes);

app.use(errorMiddleware);

app.listen(8080, () => {
  console.log("Server is running on http://localhost:8080");
});
