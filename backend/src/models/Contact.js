import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, lowercase: true },
        phone: { type: String, trim: true, default: "" },
        service: { type: String, trim: true, default: "" },
        message: { type: String, required: true },
        // Sales
        assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "SalesRep", default: null },
        salesStatus: { type: String, enum: ["New", "Interested", "Follow-up", "Not Interested", "Converted"], default: "New" },
        nextFollowUpDate: { type: Date, default: null },
    },
    { timestamps: true }
);

contactSchema.index({ assignedTo: 1, salesStatus: 1 });

export const Contact = mongoose.model("Contact", contactSchema);
