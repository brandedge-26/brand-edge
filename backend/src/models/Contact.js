import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, lowercase: true },
        phone: { type: String, trim: true, default: "" },
        service: { type: String, trim: true, default: "" },
        message: { type: String, required: true },
    },
    { timestamps: true }
);

export const Contact = mongoose.model("Contact", contactSchema);
