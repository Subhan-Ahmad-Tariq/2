import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // ✅ Load environment variables

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smarttank'; // ✅ Use default if no env

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};
