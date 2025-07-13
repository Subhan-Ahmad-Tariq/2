import mongoose, { Document } from "mongoose";

// Define an interface for User schema
interface IUser extends Document {
  name: string;
  email: string;
  password: string;
}

// Define the user schema
const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // ❌ NO HASHING!
  },
  { timestamps: true }
);

// Create and export the model
const User = mongoose.model<IUser>("User", userSchema);
export default User;
