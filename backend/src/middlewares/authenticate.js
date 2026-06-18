import jwt from "jsonwebtoken";
import { ENV } from "../config/envs.js";

export const authenticate = (req, res, next) => {
  const token = req.cookies?.admin_token;
  if (!token) return res.status(401).json({ success: false, message: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, ENV.ACCESS_TOKEN_SECRET);
    req.admin = decoded;
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};
