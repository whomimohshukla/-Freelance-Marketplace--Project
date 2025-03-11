const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = process.env.PORT || 3000;
const database = require("../Server/config/database");
const userRoutes = require("../Server/routes/user.routes");
const projectRoutes = require("../Server/routes/projectCRUD.routes");
const skillsRoutes=require("../Server/routes/skills.routes")

app.use(express.json());
app.use(cookieParser());

// connect db
database.connectDB();

// mount route to server
app.use("/api/v1/users", userRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/skills",skillsRoutes)

app.listen(PORT, () => {
	console.log(`server is running on ${PORT}`);
});
