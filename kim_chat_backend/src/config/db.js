import mongoose from "mongoose";
import logger from "../utils/logger.js";

const connectDataBase = async () => {
  try {
    const uri =
      process.env.NODE_ENV === "test" ? process.env.MONGO_TEST_URI : process.env.MONGO_URI;
    await mongoose.connect(uri);
    console.log("MongoDB Connected");
  } catch (err) {
    logger.error("MongoDB connection error: %s", err.message);
    process.exit(1);
  }
};

export default connectDataBase;
