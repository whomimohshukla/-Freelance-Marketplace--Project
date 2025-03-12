const Project = require("../controllers/core-Project/Project-crud/projectCRUD.controller");
const express = require("express");
const auth = require("../middleware/auth.middleware");
const Router = express.Router();

Router.post("/create", auth, Project.createProject);


module.exports = Router;
