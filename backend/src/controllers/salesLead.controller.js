import { Contact } from "../models/Contact.js";
import { Consultation } from "../models/Consultation.js";
import { CallLog } from "../models/CallLog.js";

const SOURCE_MAP = {
    contact: { Model: Contact, leadType: "Contact" },
    consultation: { Model: Consultation, leadType: "Consultation" },
};

export const getMyLeads = async (req, res, next) => {
    try {
        const salesRepId = req.salesRep.salesRepId;
        const [contacts, consultations] = await Promise.all([
            Contact.find({ assignedTo: salesRepId }).sort({ createdAt: -1 }),
            Consultation.find({ assignedTo: salesRepId }).sort({ createdAt: -1 }),
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

export const getMyLeadDetail = async (req, res, next) => {
    try {
        const { source, id } = req.params;
        const entry = SOURCE_MAP[source];
        if (!entry) return res.status(400).json({ success: false, message: "Invalid lead source" });

        const lead = await entry.Model.findOne({ _id: id, assignedTo: req.salesRep.salesRepId });
        if (!lead) return res.status(404).json({ success: false, message: "Not found" });

        const callLogs = await CallLog.find({ leadType: entry.leadType, leadId: id }).sort({ calledAt: -1 });
        res.json({ success: true, data: { lead: { ...lead.toObject(), _source: source }, callLogs } });
    } catch (err) {
        next(err);
    }
};

export const logCall = async (req, res, next) => {
    try {
        const { source, id } = req.params;
        const entry = SOURCE_MAP[source];
        if (!entry) return res.status(400).json({ success: false, message: "Invalid lead source" });

        const { outcome, note, salesStatus, nextFollowUpDate } = req.body;
        const lead = await entry.Model.findOne({ _id: id, assignedTo: req.salesRep.salesRepId });
        if (!lead) return res.status(404).json({ success: false, message: "Not found" });

        const wasFollowUp = lead.salesStatus === "Follow-up";

        const callLog = await CallLog.create({
            leadType: entry.leadType,
            leadId: id,
            calledBy: req.salesRep.salesRepId,
            outcome,
            note: note || "",
            wasFollowUp,
        });

        const nextStatus = salesStatus || lead.salesStatus;
        lead.salesStatus = nextStatus;
        lead.nextFollowUpDate = nextStatus === "Follow-up" ? (nextFollowUpDate || lead.nextFollowUpDate) : null;
        await lead.save();

        res.status(201).json({ success: true, data: { lead: { ...lead.toObject(), _source: source }, callLog } });
    } catch (err) {
        next(err);
    }
};
