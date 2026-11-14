import mongoose from "mongoose";

const salesRepSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, lowercase: true, unique: true },
        passwordHash: { type: String, required: true },
        active: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export const SalesRep = mongoose.model("SalesRep", salesRepSchema);
