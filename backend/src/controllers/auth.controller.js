import jwt from "jsonwebtoken";
import { ENV } from "../config/envs.js";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@brandedge.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin-123";

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
    const token = jwt.sign({ email }, ENV.ACCESS_TOKEN_SECRET, { expiresIn: "7d" });
    res.json({ success: true, token });
  } catch (err) {
    next(err);
  }
};

export const logout = (req, res) => {
  res.clearCookie("admin_token");
  res.json({ success: true });
};

export const me = (req, res) => {
  res.json({ success: true, email: req.admin.email });
};
