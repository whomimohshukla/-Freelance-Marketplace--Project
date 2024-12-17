import mongoose from "mongoose";
import { config } from "./env";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri);
    // console.log(conn);
    console.log(`MongoDB Connected: ${config.mongoUri}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
