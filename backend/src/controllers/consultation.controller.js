import { Consultation } from "../models/Consultation.js";
import { Notification } from "../models/Notification.js";

export const submitConsultation = async (req, res, next) => {
    try {
        const {
            name, email, phone,
            company, teamSize, industry, website,
            services, urgency, goals,
            days, timeSlot, timezone,
        } = req.body;

        const servicesArr = Array.isArray(services) ? services : typeof services === "string" ? JSON.parse(services) : [];
        const daysArr = Array.isArray(days) ? days : typeof days === "string" ? JSON.parse(days) : [];

        const consultation = await Consultation.create({
            name, email, phone,
            company, teamSize, industry, website,
            services: servicesArr, urgency, goals,
            days: daysArr, timeSlot, timezone,
        });
        await Notification.create({
            type: "Consultation",
            title: "New Consultation Request",
            description: `${name} submitted a consultation${servicesArr.length > 0 ? ` for ${servicesArr[0]}` : ""}`,
            refId: String(consultation._id),
        });
        res.status(201).json({ success: true, data: consultation });
    } catch (err) {
        next(err);
    }
};

export const getConsultations = async (req, res, next) => {
    try {
        const consultations = await Consultation.find().sort({ createdAt: -1 });
        res.json({ success: true, data: consultations });
    } catch (err) {
        next(err);
    }
};

export const updateConsultationStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updated = await Consultation.findByIdAndUpdate(id, { status }, { new: true });
        if (!updated) return res.status(404).json({ success: false, message: "Not found" });
        res.json({ success: true, data: updated });
    } catch (err) {
        next(err);
    }
};

export const deleteConsultation = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await Consultation.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ success: false, message: "Not found" });
        res.json({ success: true });
    } catch (err) {
        next(err);
    }
};
