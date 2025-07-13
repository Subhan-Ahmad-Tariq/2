import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./api/routes/auth";
import deviceRoutes from "./api/routes/devices";
import syncRoutes from "./api/routes/sync";

dotenv.config(); // ✅ Load environment variables

const app = express();
const PORT = Number(process.env.PORT) || 5000; // ✅ Ensure PORT is a number
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/smarttank";

// ✅ Middleware
app.use(
  cors({
    origin: "*", // or specify frontend origin "http://172.20.10.9:19000"
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json()); // ✅ Parses JSON request bodies

// ✅ Connect to Database
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    process.exit(1);
  }
};

// ✅ Initialize Database Connection
connectDB();

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/sync", syncRoutes);

// ✅ Test Route - To check if API is running
app.get("/", (req, res) => {
  res.send("🚀 SmartTank Server is Running!");
});

// ✅ Test Route for Sync API
app.get("/api/sync", (req, res) => {
  res.json({ message: "✅ Sync API is working!" });
});

const HOST = "0.0.0.0"; // ✅ Listen on all network interfaces

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server is running on http://${HOST}:${PORT}`);
});

// ✅ API Route to Receive Data from ESP32
app.post("/api/data", (req, res) => {
  console.log("📡 Received data from ESP32:", req.body);
  res.status(200).json({ message: "Data received successfully" });
});

export default app;
