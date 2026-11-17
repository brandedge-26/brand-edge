import mongoose from "mongoose";

const callEntrySchema = new mongoose.Schema(
    {
        salesRep: { type: mongoose.Schema.Types.ObjectId, ref: "SalesRep", required: true },
        businessName: { type: String, required: true, trim: true },
    },
    { timestamps: true }
);

callEntrySchema.index({ salesRep: 1, createdAt: -1 });

export const CallEntry = mongoose.model("CallEntry", callEntrySchema);
