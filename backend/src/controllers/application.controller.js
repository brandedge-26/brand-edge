import { Application } from "../models/Application.js";
import { Notification } from "../models/Notification.js";

export const submitApplication = async (req, res, next) => {
    try {
        const {
            name, email, phone,
            portfolio, linkedin, experience, currentRole,
            whyJoin, skills,
            jobId, jobTitle,
        } = req.body;

        const cvUrl = req.file?.path ?? "";
        const cvPublicId = req.file?.filename ?? "";

        const skillsArray = Array.isArray(skills)
            ? skills
            : typeof skills === "string"
                ? JSON.parse(skills)
                : [];

        const application = await Application.create({
            name, email, phone,
            portfolio, linkedin, experience, currentRole,
            whyJoin, skills: skillsArray,
            jobId, jobTitle,
            cvUrl, cvPublicId,
        });

        await Notification.create({
            type: "Application",
            title: "New Job Application",
            description: `${name} applied for ${jobTitle}`,
            refId: String(application._id),
        });
        res.status(201).json({ success: true, data: application });
    } catch (err) {
        next(err);
    }
};

export const getApplications = async (req, res, next) => {
    try {
        const applications = await Application.find().sort({ createdAt: -1 });
        res.json({ success: true, data: applications });
    } catch (err) {
        next(err);
    }
};

export const deleteApplication = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await Application.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ success: false, message: "Not found" });
        res.json({ success: true });
    } catch (err) {
        next(err);
    }
};