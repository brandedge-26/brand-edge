import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        department: { type: String, required: true, trim: true },
        location: { type: String, required: true, trim: true },
        type: { type: String, required: true, trim: true },
        level: { type: String, required: true, trim: true },
        deadline: { type: String, trim: true, default: "" },
        description: { type: String, required: true },
        requirements: { type: String, default: "" },
        status: { type: String, enum: ["Active", "Closed"], default: "Active" },
    },
    { timestamps: true }
);

export const Job = mongoose.model("Job", jobSchema);
