import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const secret = process.env.JWT_SECRET || "default_jwt_secret";
      const decoded = jwt.verify(token, secret);

      const userId = decoded.id || decoded._id;
      req.user = await User.findById(userId).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "Not authorized, user not found" });
      }

      return next();
    } catch (error) {
      console.error("Auth middleware error:", error.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  return res.status(401).json({ message: "Not authorized, no token provided" });
};