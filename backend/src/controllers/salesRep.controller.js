import bcrypt from "bcryptjs";
import { SalesRep } from "../models/SalesRep.js";
import { Contact } from "../models/Contact.js";
import { Consultation } from "../models/Consultation.js";
import { Client } from "../models/Client.js";
import { DailyReport } from "../models/DailyReport.js";
import { CallEntry } from "../models/CallEntry.js";
import { getStatsForRep } from "../utils/salesStats.js";

export const createSalesRep = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
        const rep = await SalesRep.create({ name, email: String(email).toLowerCase(), passwordHash });
        res.status(201).json({ success: true, data: { _id: rep._id, name: rep.name, email: rep.email, active: rep.active, createdAt: rep.createdAt } });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ success: false, message: "Email already in use" });
        }
        next(err);
    }
};

export const getSalesReps = async (req, res, next) => {
    try {
        const reps = await SalesRep.find().select("name email active createdAt").sort({ createdAt: -1 });
        res.json({ success: true, data: reps });
    } catch (err) {
        next(err);
    }
};

export const getSalesRep = async (req, res, next) => {
    try {
        const { id } = req.params;
        const rep = await SalesRep.findById(id).select("name email active createdAt");
        if (!rep) return res.status(404).json({ success: false, message: "Not found" });
        res.json({ success: true, data: rep });
    } catch (err) {
        next(err);
    }
};

export const toggleSalesRepActive = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { active } = req.body;
        const updated = await SalesRep.findByIdAndUpdate(id, { active }, { new: true }).select("name email active createdAt");
        if (!updated) return res.status(404).json({ success: false, message: "Not found" });
        res.json({ success: true, data: updated });
    } catch (err) {
        next(err);
    }
};

export const deleteSalesRep = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await SalesRep.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ success: false, message: "Not found" });
        res.json({ success: true });
    } catch (err) {
        next(err);
    }
};

export const getSalesRepStats = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { from, to } = req.query;
        const rep = await SalesRep.findById(id).select("name email active createdAt");
        if (!rep) return res.status(404).json({ success: false, message: "Not found" });
        const stats = await getStatsForRep(id, { from, to });
        res.json({ success: true, data: { rep, stats } });
    } catch (err) {
        next(err);
    }
};

export const getSalesRepLeads = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [contacts, consultations] = await Promise.all([
            Contact.find({ assignedTo: id }).sort({ createdAt: -1 }),
            Consultation.find({ assignedTo: id }).sort({ createdAt: -1 }),
        ]);
        const leads = [
            ...contacts.map((c) => ({ ...c.toObject(), _source: "contact" })),
            ...consultations.map((c) => ({ ...c.toObject(), _source: "consultation" })),
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        res.json({ success: true, data: leads });
    } catch (err) {
        next(err);
    }
};

export const getSalesRepCalls = async (req, res, next) => {
    try {
        const { id } = req.params;
        const calls = await CallEntry.find({ salesRep: id }).sort({ createdAt: -1 });
        res.json({ success: true, data: calls });
    } catch (err) {
        next(err);
    }
};

export const getSalesRepClients = async (req, res, next) => {
    try {
        const { id } = req.params;
        const clients = await Client.find({ createdBy: id }).sort({ createdAt: -1 });
        res.json({ success: true, data: clients });
    } catch (err) {
        next(err);
    }
};

export const getSalesRepReports = async (req, res, next) => {
    try {
        const { id } = req.params;
        const reports = await DailyReport.find({ salesRep: id }).sort({ date: -1 });
        res.json({ success: true, data: reports });
    } catch (err) {
        next(err);
    }
};

export const getClosedClients = async (req, res, next) => {
    try {
        const clients = await Client.find({ status: "Closed" })
            .sort({ closedAt: -1 })
            .populate("createdBy", "name");
        res.json({ success: true, data: clients });
    } catch (err) {
        next(err);
    }
};

export const getAllCalls = async (req, res, next) => {
    try {
        const calls = await CallEntry.find().sort({ createdAt: -1 }).populate("salesRep", "name");
        res.json({ success: true, data: calls });
    } catch (err) {
        next(err);
    }
};

export const deleteClient = async (req, res, next) => {
    try {
        const { clientId } = req.params;
        const deleted = await Client.findByIdAndDelete(clientId);
        if (!deleted) return res.status(404).json({ success: false, message: "Not found" });
        res.json({ success: true });
    } catch (err) {
        next(err);
    }
};

export const deleteReport = async (req, res, next) => {
    try {
        const { reportId } = req.params;
        const deleted = await DailyReport.findByIdAndDelete(reportId);
        if (!deleted) return res.status(404).json({ success: false, message: "Not found" });
        res.json({ success: true });
    } catch (err) {
        next(err);
    }
};

export const deleteCall = async (req, res, next) => {
    try {
        const { callId } = req.params;
        const deleted = await CallEntry.findByIdAndDelete(callId);
        if (!deleted) return res.status(404).json({ success: false, message: "Not found" });
        res.json({ success: true });
    } catch (err) {
        next(err);
    }
};
