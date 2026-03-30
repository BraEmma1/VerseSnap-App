import mongoose from 'mongoose';
import { MONGO_URI } from './env.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB Connected Successfully`);
  } catch (error) {
    console.log("Database not connected")
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
