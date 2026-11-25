import mongoose from "mongoose";

export const LEAD_STATUS_VALUES = ["sent", "interested", "follow_up", "do_not_contact", "bounced", "replied"];

// Written by n8n directly — field names must match exactly, nothing renamed.
const leadSchema = new mongoose.Schema(
    {
        email: { type: String, default: "" },
        first_name: { type: String, default: "" },
        last_name: { type: String, default: "" },
        title: { type: String, default: "" },
        company: { type: String, default: "" },
        website: { type: String, default: "" },
        industry: { type: String, default: "" },
        employees: { type: String, default: "" },
        city: { type: String, default: "" },
        state: { type: String, default: "" },
        country: { type: String, default: "" },
        linkedin: { type: String, default: "" },
        keywords: { type: String, default: "" },
        company_phone: { type: String, default: "" },
        status: { type: String, enum: LEAD_STATUS_VALUES, default: "sent" },
        category: { type: String, default: "" },
        summary: { type: String, default: "" },
        thread_id: { type: String, default: "" },
        subject: { type: String, default: "" },
        body: { type: String, default: "" },
        sent_date: { type: Date, default: null },
        last_reply_at: { type: Date, default: null },
        follow_up_at: { type: Date, default: null },
    },
    { collection: "leads" }
);

leadSchema.index({ email: 1 });
leadSchema.index({ status: 1 });

export const Lead = mongoose.model("Lead", leadSchema);
