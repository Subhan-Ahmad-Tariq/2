import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import User from "./models/User.js";


const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/smarttankDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("✅ Connected to MongoDB");
}).catch(err => {
  console.error("❌ MongoDB Connection Error:", err);
});

// API route to test DB connection
app.get("/test", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Use Auth Routes
app.use("/api/auth", authRoutes);

// Start Server
app.listen(5000, () => {
  console.log("✅ Server running on port 5000");
});
