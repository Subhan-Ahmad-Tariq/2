import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export interface AuthRequest extends Request {
  user?: {
    id: string;
    isAdmin?: boolean;
  };
}

// 🔐 General Authentication Middleware
export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    console.log("🟡 Received Token:", token); // ✅ Debugging Token

    if (!token) {
      return res.status(401).json({ message: "❌ No token, authorization denied" });
    }

    const JWT_SECRET = process.env.JWT_SECRET!;
    console.log("🟡 Token Verification Using Secret:", JWT_SECRET);  // ✅ Debugging
    
    if (!JWT_SECRET) {
      console.error("❌ JWT_SECRET is missing. Check your .env file.");
      return res.status(500).json({ message: "❌ Server error: Missing JWT secret" });
    }

    // 🔍 Verify Token
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload; // ✅ Explicitly cast
    console.log("🟢 Decoded User:", decoded); // ✅ Debugging Decoded Token

    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: "❌ Invalid token payload" });
    }

    req.user = { id: decoded.id, isAdmin: decoded.isAdmin }; // ✅ Assign correct type

    next(); // ✅ Proceed to the next middleware
  } catch (error) {
    const err = error as Error; // ✅ Type assertion
    console.error("❌ Token verification failed:", err.message);
    res.status(401).json({ message: "❌ Invalid token" });
}

};

// 🔐 Admin Authentication Middleware
export const adminAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: "❌ Unauthorized: No user found" });
  }

  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "❌ Admin access required" });
  }

  next(); // ✅ Proceed to the next middleware
};
