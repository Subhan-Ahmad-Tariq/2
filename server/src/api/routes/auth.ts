import express from "express";
import { login, register } from "../../services/authService";
import User from "../../models/User";
import { auth as authMiddleware, AuthRequest } from "../../api/middleware/auth";

const router = express.Router();

// ✅ Test Route - Check if Auth API is running
router.get("/", (req, res) => {
  res.json({ message: "✅ Auth API is working!" });
});

// 🔐 Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "❌ Email and password are required" });
    }

    const user = await login(email, password);
    res.json(user);
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(400).json({ message: "❌ Login failed" });
  }
});

// 📝 Register Route (🚀 Fixed: Now Returns Token)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "❌ Name, email, and password are required" });
    }

    const newUser = await register(name, email, password);
    res.status(201).json(newUser); // ✅ Now returns `{ token, user }`
  } catch (error) {
    console.error("❌ Registration error:", error);
    res.status(400).json({ message: "❌ Registration failed" });
  }
});

// 🔍 GET User Profile (Protected Route)
router.get("/profile", authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "❌ Unauthorized: Invalid Token" });
    }

    const user = await User.findById(req.user.id).select("-password"); // Exclude password
    if (!user) {
      return res.status(404).json({ message: "❌ User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("❌ Profile retrieval error:", error);
    res.status(500).json({ message: "❌ Server error" });
  }
});

// ❌ DELETE User Route (For Testing Purposes)
router.delete("/delete", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "❌ Email is required" });
    }

    const user = await User.findOneAndDelete({ email });
    if (!user) {
      return res.status(404).json({ message: "❌ User not found" });
    }

    res.json({ message: "✅ User deleted successfully" });
  } catch (error) {
    console.error("❌ Delete user error:", error);
    res.status(500).json({ message: "❌ Server error" });
  }
});

export default router;
