import User from "../models/User";
import bcrypt from "bcryptjs";  // ✅ Added bcrypt for password hashing
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key"; // ✅ Ensure JWT_SECRET is set

// 🔹 LOGIN FUNCTION (Uses bcrypt)
export const login = async (email: string, password: string) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.error("❌ User not found:", email);
      throw new Error("❌ Invalid credentials");
    }

    // ✅ Compare hashed passwords
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("✅ Password Match Result:", isMatch);

    if (!isMatch) {
      console.error("❌ Incorrect password for:", email);
      throw new Error("❌ Invalid credentials");
    }

    // ✅ Generate a JWT token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    return { token, user: { _id: user._id, name: user.name, email: user.email } };

  } catch (error: any) {  
    console.error("❌ Login error:", error?.message || error);
    throw new Error(error?.message || "Something went wrong");
  }
};

// 🔹 REGISTER FUNCTION (Fix: Returns { token, user } & Hashes Password)
export const register = async (name: string, email: string, password: string) => {
  try {
    console.log("🔹 Registering User:", email);

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.error("❌ User already exists:", email);
      throw new Error("❌ User already exists");
    }

    // ✅ Password validation
    if (!password || password.length < 6) {
      console.error("❌ Weak password:", email);
      throw new Error("❌ Password must be at least 6 characters long");
    }

    // ✅ Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Save user with hashed password
    const newUser = await User.create({ name, email, password: hashedPassword });

    // ✅ Generate token
    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: "7d" });

    console.log("✅ User registered successfully:", email);
    return { token, user: { _id: newUser._id, name, email } };

  } catch (error: any) {  
    console.error("❌ Registration error:", error?.message || error);
    throw new Error(error?.message || "Something went wrong");
  }
};

