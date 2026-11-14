import mongoose from "mongoose";

const callLogSchema = new mongoose.Schema(
    {
        leadType: { type: String, enum: ["Contact", "Consultation"], required: true },
        leadId: { type: mongoose.Schema.Types.ObjectId, required: true },
        calledBy: { type: mongoose.Schema.Types.ObjectId, ref: "SalesRep", required: true },
        outcome: { type: String, required: true },
        note: { type: String, default: "" },
        wasFollowUp: { type: Boolean, default: false },
        calledAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

callLogSchema.index({ calledBy: 1, calledAt: -1 });
callLogSchema.index({ leadType: 1, leadId: 1 });

export const CallLog = mongoose.model("CallLog", callLogSchema);
