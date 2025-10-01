import mongoose from "mongoose";
import dotenv from "dotenv";
import "../models/index";
dotenv.config();

const connectURI = process.env.connectURI;
let isConnected = false;

const dbConnect = async () => {
  if (!connectURI) {
    throw new Error("ConnectURI undefined");
  }
  mongoose.set("strictQuery", true);
  if (isConnected) {
    console.log("Database already connected");
    return;
  }
  try {
    await mongoose.connect(connectURI);
    isConnected = true;

    console.log("Connected to Database");
  } catch (error) {
    console.error(
      "DB connection error :",
      error instanceof Error ? error.message : "Error experienced"
    );
  }
};

export { dbConnect };
