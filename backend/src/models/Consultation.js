import mongoose from "mongoose";

const consultationSchema = new mongoose.Schema(
    {
        // Personal
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, lowercase: true },
        phone: { type: String, trim: true, default: "" },
        // Company
        company: { type: String, trim: true, default: "" },
        teamSize: { type: String, trim: true, default: "" },
        industry: { type: String, trim: true, default: "" },
        website: { type: String, trim: true, default: "" },
        // Project
        services: { type: [String], default: [] },
        urgency: { type: String, trim: true, default: "" },
        goals: { type: String, trim: true, default: "" },
        // Schedule
        days: { type: [String], default: [] },
        timeSlot: { type: String, trim: true, default: "" },
        timezone: { type: String, trim: true, default: "" },
        // Admin
        status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
    },
    { timestamps: true }
);

export const Consultation = mongoose.model("Consultation", consultationSchema);
