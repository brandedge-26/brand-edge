import mongoose from "mongoose";

// Written by n8n directly — field names must match exactly, nothing renamed.
const messageSchema = new mongoose.Schema(
    {
        lead_email: { type: String, default: "" },
        thread_id: { type: String, default: "" },
        direction: { type: String, enum: ["outbound", "inbound"], default: "outbound" },
        type: { type: String, enum: ["reply_received", "reply_sent"], default: "reply_sent" },
        subject: { type: String, default: "" },
        body: { type: String, default: "" },
        category: { type: String, default: "" },
        summary: { type: String, default: "" },
        created_at: { type: Date, default: null },
    },
    { collection: "messages" }
);

messageSchema.index({ lead_email: 1 });
messageSchema.index({ thread_id: 1 });

export const Message = mongoose.model("Message", messageSchema);
