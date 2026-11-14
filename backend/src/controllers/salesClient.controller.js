import { Client } from "../models/Client.js";

export const createClient = async (req, res, next) => {
    try {
        const { businessName, phone, note, priority } = req.body;
        const client = await Client.create({
            businessName,
            phone,
            note: note || "",
            priority: priority || "Medium",
            createdBy: req.salesRep.salesRepId,
        });
        res.status(201).json({ success: true, data: client });
    } catch (err) {
        next(err);
    }
};

export const getMyClients = async (req, res, next) => {
    try {
        const clients = await Client.find({ createdBy: req.salesRep.salesRepId }).sort({ createdAt: -1 });
        res.json({ success: true, data: clients });
    } catch (err) {
        next(err);
    }
};

export const updateClient = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { businessName, phone, note, priority } = req.body;
        const client = await Client.findOneAndUpdate(
            { _id: id, createdBy: req.salesRep.salesRepId },
            { businessName, phone, note: note || "", priority: priority || "Medium" },
            { new: true }
        );
        if (!client) return res.status(404).json({ success: false, message: "Not found" });
        res.json({ success: true, data: client });
    } catch (err) {
        next(err);
    }
};

export const markFollowUp = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { followUpDate } = req.body;
        const client = await Client.findOneAndUpdate(
            { _id: id, createdBy: req.salesRep.salesRepId },
            { status: "Follow-up", followUpDate },
            { new: true }
        );
        if (!client) return res.status(404).json({ success: false, message: "Not found" });
        res.json({ success: true, data: client });
    } catch (err) {
        next(err);
    }
};

export const closeClient = async (req, res, next) => {
    try {
        const { id } = req.params;
        const client = await Client.findOneAndUpdate(
            { _id: id, createdBy: req.salesRep.salesRepId },
            { status: "Closed", followUpDate: null, closedAt: new Date() },
            { new: true }
        );
        if (!client) return res.status(404).json({ success: false, message: "Not found" });
        res.json({ success: true, data: client });
    } catch (err) {
        next(err);
    }
};
