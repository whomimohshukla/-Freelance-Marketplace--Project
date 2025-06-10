const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = process.env.PORT || 3000;
const morganizer = require("morgan");
const database = require("../Server/config/database");
const userRoutes = require("../Server/routes/user.routes");
const projectRoutes = require("../Server/routes/projectCRUD.routes");
const skillsRoutes = require("../Server/routes/skills.routes");
const freelancersRoute = require("../Server/routes/freelancer.routes");
const clientRoute = require("../Server/routes/client.routes");
const industryRoutes = require("../Server/routes/industry.routes");
const teamRoutes = require("../Server/routes/team.routes");
const reviewRoutes = require("../Server/routes/reviewFreelancer.routes");
const ratingRoutes = require("../Server/routes/projectRating.routes");

app.use(express.json());
app.use(cookieParser());
app.use(morganizer("dev"));

// connect db
database.connectDB();

// mount route to server
app.use("/api/v1/users", userRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/freelancers", freelancersRoute);
app.use("/api/clients", clientRoute);
app.use("/api/industries", industryRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/rating", ratingRoutes);

app.use("/api/teams", teamRoutes);

app.get("/", (req, res) => {
	res.send("Welcome to freelancer project");
});

app.listen(PORT, () => {
	console.log(`server is running on ${PORT}`);
});
