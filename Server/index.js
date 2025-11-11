const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = process.env.PORT || 3000;
const morganizer = require("morgan");
const statusMonitor = require("express-status-monitor");
const database = require("../Server/config/database");
const http = require("http");
const { initSocket } = require("../Server/socket/index");
const userRoutes = require("../Server/routes/user.routes");
const projectRoutes = require("../Server/routes/projectCRUD.routes");
const skillsRoutes = require("../Server/routes/skills.routes");
const freelancersRoute = require("../Server/routes/freelancer.routes");
const clientRoute = require("../Server/routes/client.routes");
const industryRoutes = require("../Server/routes/industry.routes");
const paymentsRoutes = require("../Server/routes/payments.routes");
const teamRoutes = require("../Server/routes/team.routes");
const reviewRoutes = require("../Server/routes/reviewFreelancer.routes");
const ratingRoutes = require("../Server/routes/projectRating.routes");
const socialAuthRoutes = require("../Server/routes/socialAuth.routes");
const uploadsRoutes = require("../Server/routes/uploads.routes");
const messagesRoutes = require("../Server/routes/messages.routes");
const cors = require("cors");

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(morganizer("dev"));
app.use(statusMonitor());

// connect db
database.connectDB();

//cors
app.use(
	cors({
		origin: "http://localhost:5173", // React dev server
		methods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
		credentials: true, // allow cookies / auth headers
	})
);

// mount route to server
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/project", projectRoutes);
app.use("/api/v1/skills", skillsRoutes);
app.use("/api/v1/freelancers", freelancersRoute);
app.use("/api/v1/clients", clientRoute);
app.use("/api/v1/industries", industryRoutes);
app.use("/api/v1/review", reviewRoutes);
app.use("/api/v1/payments", paymentsRoutes);
app.use("/api/v1/rating", ratingRoutes);
app.use("/api/v1/auth", socialAuthRoutes);
app.use("/api/v1/uploads", uploadsRoutes);
app.use("/api/v1/messages", messagesRoutes);

app.use("/api/v1/teams", teamRoutes);

app.get("/", (req, res) => {
	res.send("Welcome to freelancer project");
});

const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
});
