import { Contact } from "../models/Contact.js";
import { Notification } from "../models/Notification.js";

export const submitContact = async (req, res, next) => {
    try {
        const { name, email, phone, service, message } = req.body;
        const contact = await Contact.create({ name, email, phone, service, message });
        await Notification.create({
            type: "Contact",
            title: "New Contact Message",
            description: `${name} sent a message${service ? ` about ${service}` : ""}`,
            refId: String(contact._id),
        });
        res.status(201).json({ success: true, data: contact });
    } catch (err) {
        next(err);
    }
};

export const getContacts = async (req, res, next) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json({ success: true, data: contacts });
    } catch (err) {
        next(err);
    }
};

export const deleteContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deleted = await Contact.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ success: false, message: "Not found" });
        res.json({ success: true });
    } catch (err) {
        next(err);
    }
};
