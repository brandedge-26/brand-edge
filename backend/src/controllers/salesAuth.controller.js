import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { ENV } from "../config/envs.js";
import { SalesRep } from "../models/SalesRep.js";

export const salesLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const rep = await SalesRep.findOne({ email: String(email).toLowerCase() });

        if (!rep) return res.status(401).json({ success: false, message: "Invalid credentials" });
        if (!rep.active) return res.status(401).json({ success: false, message: "Account deactivated — contact your admin" });

        const match = await bcrypt.compare(password, rep.passwordHash);
        if (!match) return res.status(401).json({ success: false, message: "Invalid credentials" });

        const token = jwt.sign(
            { salesRepId: rep._id, name: rep.name, email: rep.email, role: "sales" },
            ENV.ACCESS_TOKEN_SECRET,
            { expiresIn: "7d" }
        );
        res.json({ success: true, token });
    } catch (err) {
        next(err);
    }
};

export const salesLogout = (req, res) => {
    res.clearCookie("sales_token");
    res.json({ success: true });
};

export const getSalesMe = async (req, res, next) => {
    try {
        const rep = await SalesRep.findById(req.salesRep.salesRepId).select("name email active");
        if (!rep) return res.status(404).json({ success: false, message: "Not found" });
        res.json({ success: true, data: rep });
    } catch (err) {
        next(err);
    }
};
