import mongoose from "mongoose";

const connectDB = async () => {
  const MONGODB_URL: string = process.env.DATABASE_URL || "";

  if (mongoose.connections?.[0]?.readyState) {
    console.log("Already connected.");
    return;
  }

  if (MONGODB_URL === "") {
    return console.log("No database URL");
  }

  try {
    await mongoose.connect(MONGODB_URL, {});
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    // throw new Error("Failed to connect to MongoDB");
  }
};

export default connectDB;
