const mongoose = require("mongoose");
require("dotenv").config();

async function dbConnect() {
  mongoose
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })
    .then((result) => {
      console.log("Conneted to database");
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
}

module.exports = dbConnect;
