const mongoose = require("mongoose");
const { config } = require("./env");

exports.connectDb = () => {
  mongoose
    .connect(config.mongoUri)
    .then(() => {
      console.log(`MongoDB Connected: ${config.mongoUri}`);
    })
    .catch((err) => {
      console.error("Connection error", err.message);
      process.exit(1);
    });
};
