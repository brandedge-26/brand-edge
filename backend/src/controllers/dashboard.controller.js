import { Consultation } from "../models/Consultation.js";
import { Contact } from "../models/Contact.js";
import { Application } from "../models/Application.js";

export const getDashboardStats = async (req, res, next) => {
    try {
        const [totalConsultations, totalContacts, totalApplications, pendingConsultations, completedConsultations] = await Promise.all([
            Consultation.countDocuments(),
            Contact.countDocuments(),
            Application.countDocuments(),
            Consultation.countDocuments({ status: "Pending" }),
            Consultation.countDocuments({ status: "Completed" }),
        ]);

        const recentConsultations = await Consultation.find().sort({ createdAt: -1 }).limit(5).select("name services status createdAt");
        const recentContacts = await Contact.find().sort({ createdAt: -1 }).limit(5).select("name email phone createdAt");

        res.json({
            success: true,
            data: {
                stats: {
                    totalConsultations,
                    totalContacts,
                    totalApplications,
                    pendingConsultations,
                    completedConsultations,
                },
                recentConsultations,
                recentContacts,
            },
        });
    } catch (err) {
        next(err);
    }
};
