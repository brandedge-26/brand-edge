import { Lead, LEAD_STATUS_VALUES } from "../models/Lead.js";
import { Message } from "../models/Message.js";

const PAGE_SIZE = 25;

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const getLeads = async (req, res, next) => {
    try {
        const { search = "", status = "", replied, page = "1" } = req.query;

        const filter = {};
        if (status && LEAD_STATUS_VALUES.includes(status)) filter.status = status;
        if (replied === "true") filter.last_reply_at = { $ne: null };
        if (search.trim()) {
            const re = new RegExp(escapeRegex(search.trim()), "i");
            filter.$or = [{ first_name: re }, { last_name: re }, { email: re }, { company: re }];
        }

        const pageNum = Math.max(1, parseInt(page, 10) || 1);

        const [leads, total] = await Promise.all([
            // Sort by _id (not sent_date) — it's always a valid, correctly-typed
            // ObjectId that encodes insertion time, so newest-added leads reliably
            // land first even if sent_date is ever missing or malformed.
            Lead.find(filter).sort({ _id: -1 }).skip((pageNum - 1) * PAGE_SIZE).limit(PAGE_SIZE).lean(),
            Lead.countDocuments(filter),
        ]);

        res.json({
            success: true,
            data: leads,
            pagination: {
                page: pageNum,
                pageSize: PAGE_SIZE,
                total,
                pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)),
            },
        });
    } catch (err) {
        next(err);
    }
};

export const getLeadStats = async (req, res, next) => {
    try {
        const counts = await Lead.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]);
        const map = Object.fromEntries(counts.map((c) => [c._id, c.count]));
        res.json({
            success: true,
            data: {
                sent: map.sent || 0,
                interested: map.interested || 0,
                follow_up: map.follow_up || 0,
                replied: map.replied || 0,
                do_not_contact: map.do_not_contact || 0,
                bounced: map.bounced || 0,
            },
        });
    } catch (err) {
        next(err);
    }
};

export const getLeadDetail = async (req, res, next) => {
    try {
        const lead = await Lead.findById(req.params.id).lean();
        if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });

        const or = [];
        if (lead.email) or.push({ lead_email: lead.email });
        if (lead.thread_id) or.push({ thread_id: lead.thread_id });

        const messages = or.length ? await Message.find({ $or: or }).sort({ created_at: 1 }).lean() : [];

        res.json({ success: true, data: { lead, messages } });
    } catch (err) {
        next(err);
    }
};

export const updateLeadStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        if (!LEAD_STATUS_VALUES.includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status" });
        }
        const lead = await Lead.findByIdAndUpdate(
            req.params.id,
            { status },
            { returnDocument: "after", runValidators: true }
        ).lean();
        if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });
        res.json({ success: true, data: lead });
    } catch (err) {
        next(err);
    }
};

export const deleteLead = async (req, res, next) => {
    try {
        const deleted = await Lead.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ success: false, message: "Lead not found" });
        res.json({ success: true });
    } catch (err) {
        next(err);
    }
};
