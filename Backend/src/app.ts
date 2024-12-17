import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { config } from "./config/env";
import { errorHandler } from "./middleware/error";

// // Route imports
// import authRoutes from './routes/auth.routes';
// import projectRoutes from './routes/project.routes';
import userRoutes from "./routes/userRoutes";

const app: Application = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
if (config.nodeEnv === "development") {
  app.use(morgan("dev"));
}

// // Mount routes
// app.use('/api/v1/auth', authRoutes);
// app.use('/api/v1/projects', projectRoutes);
app.use("/api/v1/users", userRoutes);

// Error handling
app.use(errorHandler);

export { app };
