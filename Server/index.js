const express = require("express");
const app = express();
const database = require("./src/config/database");
const { config } = require("./src/config/env");

// Connect to MongoDB
database.connectDb();

// port activation  


app.listen(config.port, () => {
  console.log(`Server running on port: ${config.port}`);
});
