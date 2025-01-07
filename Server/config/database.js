const mongoose = require("mongoose");
require("dotenv").config();

exports.connectDB = () => {
  mongoose
    .connect(process.env.MONGO_DB_URL)
    .then(() => {
      console.log("connected to database");
    })
    .catch((error) => {
      console.log(" failed to connect to database", error);
    });
};
