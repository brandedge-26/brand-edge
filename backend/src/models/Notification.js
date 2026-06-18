import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        type: { type: String, enum: ["Consultation", "Contact", "Application"], required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        read: { type: Boolean, default: false },
        refId: { type: String, default: "" }, // _id of the related document
    },
    { timestamps: true }
);

export const Notification = mongoose.model("Notification", notificationSchema);
