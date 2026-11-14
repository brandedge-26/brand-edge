import mongoose from "mongoose";

const dailyReportSchema = new mongoose.Schema(
    {
        salesRep: { type: mongoose.Schema.Types.ObjectId, ref: "SalesRep", required: true },
        date: { type: String, required: true }, // YYYY-MM-DD
        callsMade: { type: Number, default: 0 },
        interestedCount: { type: Number, default: 0 },
        notes: { type: String, trim: true, default: "" },
    },
    { timestamps: true }
);

dailyReportSchema.index({ salesRep: 1, date: 1 }, { unique: true });

export const DailyReport = mongoose.model("DailyReport", dailyReportSchema);
