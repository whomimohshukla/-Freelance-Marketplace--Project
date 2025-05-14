// const Project = require("../controllers/core-Project/Project-crud/projectCRUD.controller");
const Project=require("../controllers/projects/project.controller")
const express = require("express");
const auth = require("../middleware/auth.middleware");
const Router = express.Router();

// Router.post("/create", auth, Project.createProject);


Router.post("/create", auth, Project.createProject);

Router.get("/",auth,Project.getAllProjects)




module.exports = Router;
