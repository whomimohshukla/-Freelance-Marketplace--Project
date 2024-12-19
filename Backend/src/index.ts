import { app } from "./app";
import { config } from "./config/env";
import { connectDB } from "./config/database";

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(config.port, () => {
      console.log(
        `Server running in ${config.nodeEnv} mode on port ${config.port}`
      );
    });

    app.get("/", (req, res) => {
      res.send("Welcome");
    });

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (err: Error) => {
      console.log(`Error: ${err.message}`);
      server.close(() => process.exit(1));
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();
