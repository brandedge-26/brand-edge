import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
    {
        // Personal
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, lowercase: true },
        phone: { type: String, trim: true, default: "" },

        // Professional
        portfolio: { type: String, trim: true, default: "" },
        linkedin: { type: String, trim: true, default: "" },
        experience: { type: String, required: true },
        currentRole: { type: String, trim: true, default: "" },

        // Application
        whyJoin: { type: String, required: true },
        skills: { type: [String], default: [] },

        // Job reference
        jobId: { type: String, required: true },
        jobTitle: { type: String, required: true },

        // CV
        cvUrl: { type: String, default: "" },
        cvPublicId: { type: String, default: "" },
    },
    { timestamps: true }
);

export const Application = mongoose.model("Application", applicationSchema);
