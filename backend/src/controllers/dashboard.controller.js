import { Consultation } from "../models/Consultation.js";
import { Contact } from "../models/Contact.js";
import { Application } from "../models/Application.js";
import { CallEntry } from "../models/CallEntry.js";
import { Client } from "../models/Client.js";

export const getDashboardStats = async (req, res, next) => {
    try {
        const [totalConsultations, totalContacts, totalApplications, pendingConsultations, completedConsultations, totalCalls, totalInterested] = await Promise.all([
            Consultation.countDocuments(),
            Contact.countDocuments(),
            Application.countDocuments(),
            Consultation.countDocuments({ status: "Pending" }),
            Consultation.countDocuments({ status: "Completed" }),
            CallEntry.countDocuments(),
            Client.countDocuments(),
        ]);

        const recentConsultations = await Consultation.find().sort({ createdAt: -1 }).limit(5).select("name services status createdAt");
        const recentContacts = await Contact.find().sort({ createdAt: -1 }).limit(5).select("name email phone createdAt");
        const recentCalls = await CallEntry.find().sort({ createdAt: -1 }).limit(5).populate("salesRep", "name");

        res.json({
            success: true,
            data: {
                stats: {
                    totalConsultations,
                    totalContacts,
                    totalApplications,
                    pendingConsultations,
                    completedConsultations,
                    totalCalls,
                    totalInterested,
                },
                recentConsultations,
                recentContacts,
                recentCalls,
            },
        });
    } catch (err) {
        next(err);
    }
};
