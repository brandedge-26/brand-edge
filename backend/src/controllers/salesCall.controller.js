import { CallEntry } from "../models/CallEntry.js";

export const logCallEntry = async (req, res, next) => {
    try {
        const { businessName } = req.body;
        if (!businessName || !businessName.trim()) {
            return res.status(400).json({ success: false, message: "Business name is required" });
        }
        const entry = await CallEntry.create({ salesRep: req.salesRep.salesRepId, businessName: businessName.trim() });
        res.status(201).json({ success: true, data: entry });
    } catch (err) {
        next(err);
    }
};

export const getMyCallEntries = async (req, res, next) => {
    try {
        const entries = await CallEntry.find({ salesRep: req.salesRep.salesRepId }).sort({ createdAt: -1 });
        res.json({ success: true, data: entries });
    } catch (err) {
        next(err);
    }
};
