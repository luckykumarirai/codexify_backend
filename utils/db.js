const mongoose = require("mongoose");
let dotenv = require("dotenv").config();

module.exports = function () {
  const name = process.env.DBURL;
  mongoose.set("strictQuery", true);
  mongoose
    .connect(process.env.DBURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Database Connected Successfully");
    })
    .catch((err) => {
      console.error("Database Connection Failed!!");
    });
};
