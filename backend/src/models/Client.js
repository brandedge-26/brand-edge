import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
    {
        businessName: { type: String, required: true, trim: true },
        phone: { type: String, required: true, trim: true },
        note: { type: String, trim: true, default: "" },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "SalesRep", required: true },
        status: { type: String, enum: ["New", "Follow-up", "Closed"], default: "New" },
        followUpDate: { type: Date, default: null },
        closedAt: { type: Date, default: null },
        priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    },
    { timestamps: true }
);

clientSchema.index({ createdBy: 1, createdAt: -1 });

export const Client = mongoose.model("Client", clientSchema);
